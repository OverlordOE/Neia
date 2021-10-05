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
const { util } = require('./util');
const userCommands = new Discord.Collection();
const Users = require('../models/Users')(sequelize, Sequelize);
const UserItems = require('../models/UserItems')(sequelize, Sequelize);



Reflect.defineProperty(userCommands, 'newUser', {
	value: async function newUser(id) {
		const user = await Users.create({
			user_id: id,
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

		if (amount > 0 && gambling) userCommands.addStats(user, 'gamblingMoneyGained', Number(amount));
		else if (amount < 0 && gambling) {
			userCommands.addStats(user, 'gamblingMoneyLost', -Number(amount));
			userCommands.addStats(user, 'gamblingDone', 1);
		}
		user.save();
		return Math.floor(user.balance);
	},
});


Reflect.defineProperty(userCommands, 'getStats', {
	value: function getStats(user) {
		return JSON.parse(user.stats);
	},
});
Reflect.defineProperty(userCommands, 'addStats', {
	value: function addStats(user, statName, amount) {
		const userStats = JSON.parse(user.stats);
		if (userStats[statName]) userStats[statName] += amount;
		else userStats[statName] = amount;

		user.stats = JSON.stringify(userStats);
		user.save();

		return userStats;
	},
});


Reflect.defineProperty(userCommands, 'setVote', {
	value: function setVote(user) {
		user.lastVote = moment().toDate();
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


Reflect.defineProperty(userCommands, 'getProtection', {
	value: function getProtection(user) {
		const now = moment();
		const dCheck = moment(user.lastProtection).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userCommands, 'setProtection', {
	value: function setProtection(user) {
		user.lastProtection = moment().toDate();
		return user.save();
	},
});
Reflect.defineProperty(userCommands, 'protectionAllowed', {
	value: async function protectionAllowed(user) {
		const protectionItem = util.getItem('streak protection');
		const hasProtection = await userCommands.hasItem(user, protectionItem, 1);
		const noCooldown = userCommands.getProtection(user);
		if (hasProtection && noCooldown === true) return true;
		return false;
	},
});
Reflect.defineProperty(userCommands, 'newProtectionAllowed', {
	value: async function newProtectionAllowed(user) {
		const protectionItem = util.getItem('streak protection');
		const hasProtection = await userCommands.hasItem(user, protectionItem, 1);
		const noCooldown = userCommands.getProtection(user);
		if (hasProtection || noCooldown !== true) return false;
		return true;
	},
});


Reflect.defineProperty(userCommands, 'getPowerCount', {
	value: function getPowerCount(user) {
		const now = moment();
		const dCheck = moment(user.lastPowerCounting).add(3, 'h');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userCommands, 'setPowerCount', {
	value: function setPowerCount(user) {
		user.lastPowerCounting = moment().toDate();
		return user.save();
	},
});


Reflect.defineProperty(userCommands, 'getCountBoost', {
	value: function getCountBoost(user) {
		const now = moment();
		const dCheck = moment(user.lastCountBoost).add(3, 'h');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userCommands, 'setCountBoost', {
	value: function setCountBoost(user) {
		user.lastCountBoost = moment().toDate();
		return user.save();
	},
});


Reflect.defineProperty(userCommands, 'getDailyCount', {
	value: function getDailyCount(user) {
		const now = moment();
		const dCheck = moment(user.lastDailyCount).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userCommands, 'setDailyCount', {
	value: function setDailyCount(user) {
		user.lastDailyCount = moment().toDate();
		return user.save();
	},
});


Reflect.defineProperty(userCommands, 'getHourlyCount', {
	value: function getHourlyCount(user) {
		const now = moment();
		const dCheck = moment(user.lastHourlyCount).add(1, 'h');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userCommands, 'setHourlyCount', {
	value: function setHourlyCount(user) {
		user.lastHourlyCount = moment().toDate();
		return user.save();
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


Reflect.defineProperty(userCommands, 'getColour', {
	value: function getColour() {
		return '#fcfcfc';
	},
});



module.exports = { Users, userCommands };