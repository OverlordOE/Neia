const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Discord = require('discord.js');
const { achievementHunter } = require('./achievementHunter');

const UserItems = require('../models/UserItems')(sequelize, Sequelize);
const itemHandler = new Discord.Collection();


// ITEMS
Reflect.defineProperty(itemHandler, 'addItem', {
	value: async function addItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});

		if (parseInt(amount) < 1) throw Error('Can\'t add a negative amount of items!');

		if (userItem) {
			userItem.amount += parseInt(amount);
			return userItem.save();
		}

		achievementHunter.hunt(user, 'itemAdded', null);

		return UserItems.create({
			user_id: user.user_id,
			name: item.name,
			amount: parseInt(amount),
		});
	},
});
Reflect.defineProperty(itemHandler, 'removeItem', {
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

Reflect.defineProperty(itemHandler, 'hasItem', {
	value: async function hasItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});
		const check = parseInt(amount);
		if (userItem && userItem.amount >= check && check >= 1) return true;
		return false;
	},
});

Reflect.defineProperty(itemHandler, 'getInventory', {
	value: async function getInventory(user) {
		return UserItems.findAll({
			where: { user_id: user.user_id },
		});
	},
});

module.exports = { itemHandler };