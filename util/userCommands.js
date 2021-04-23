/* eslint-disable no-multiple-empty-lines */
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const moment = require('moment');
const Discord = require('discord.js');
const userCommands = new Discord.Collection();
const Users = require('../models/Users')(sequelize, Sequelize);
const UserItems = require('../models/UserItems')(sequelize, Sequelize);



Reflect.defineProperty(userCommands, 'newUser', {
	value: async function newUser(id) {
		const now = moment();
		const user = await Users.create({
			user_id: id,
			lastVote: now.subtract(1, 'days').toString(),
			firstCommand: true,
			streaksRuined: 0,
			numbersCounted: 0,
			gamblingDone: 0,
			gamblingMoneyGained: 0,
			gamblingMoneyLost: 0,
		});
		userCommands.set(id, user);
		return user;
	},
});
Reflect.defineProperty(userCommands, 'getUser', {
	value: async function getUser(id) {
		let user = userCommands.get(id);
		if (!user) user = await userCommands.newUser(id);
		return user;
	},
});







// ITEMS
Reflect.defineProperty(userCommands, 'addItem', {
	value: async function addItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});

		// user.networth += item.value * parseInt(amount);
		// user.save();
		if (parseInt(amount) < 1) throw Error('Can\'t add a negative amount of items!');

		if (userItem) {
			userItem.amount += parseInt(amount);
			return userItem.save();
		}

		return UserItems.create({
			user_id: user.user_id,
			name: item.name,
			amount: parseInt(amount),
		});
	},
});
Reflect.defineProperty(userCommands, 'removeItem', {
	value: async function removeItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});

		const removeAmount = parseInt(amount);

		if (userItem.amount >= removeAmount) {
			// user.networth -= item.value * removeAmount;

			if (userItem.amount == removeAmount) userItem.destroy();
			else userItem.amount -= removeAmount;
			return userItem.save();
		}

		throw Error(`User doesn't have enough: ${item.name}`);
	},
});

Reflect.defineProperty(userCommands, 'hasItem', {
	value: async function hasItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});
		const check = parseInt(amount);
		if (userItem && userItem.amount >= check && check >= 1) return true;
		return false;
	},
});

Reflect.defineProperty(userCommands, 'getInventory', {
	value: async function getInventory(user) {
		return UserItems.findAll({
			where: { user_id: user.user_id },
		});
	},
});
















// Misc
Reflect.defineProperty(userCommands, 'addBalance', {
	value: function addBalance(user, amount, gambling = false) {
		if (isNaN(amount)) throw Error(`${amount} is not a valid number.`);
		user.balance += Number(amount);

		if (amount > 0 && gambling) user.gamblingMoneyGained += Number(amount);
		else if (amount < 0 && gambling) {
			user.gamblingMoneyLost -= Number(amount);
			user.gamblingDone++;
		}
		user.save();
		return Math.floor(user.balance);
	},
});


Reflect.defineProperty(userCommands, 'setVote', {
	value: function setVote(user) {
		user.lastVote = moment().toString();
		return user.save();
	},
});
Reflect.defineProperty(userCommands, 'getVote', {
	value: function getVote(user) {
		const now = moment();
		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(userCommands, 'getColour', {
	value: function getColour() {
		return '#fcfcfc';
	},
});


Reflect.defineProperty(userCommands, 'getReaction', {
	value: function getReaction(user) {
		return JSON.parse(user.reaction);
	},
});
Reflect.defineProperty(userCommands, 'saveReaction', {
	value: function saveReaction(user, reactionInfo) {
		user.reaction = JSON.stringify(reactionInfo);
		return user.save();
	},
});

module.exports = { Users, userCommands };