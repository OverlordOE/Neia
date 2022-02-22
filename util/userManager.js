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
const { itemHandler } = require('./itemHandler');
const { achievementHunter } = require('./achievementHunter');
const userManager = new Discord.Collection();
const Users = require('../models/Users')(sequelize, Sequelize);





Reflect.defineProperty(userManager, 'newUser', {
	value: async function newUser(id) {
		const user = await Users.create({
			user_id: id,
		});
		userManager.set(id, user);
		return user;
	},
});
Reflect.defineProperty(userManager, 'getUser', {
	value: async function getUser(id) {
		let user = userManager.get(id);
		if (!user) user = await userManager.newUser(id);
		return user;
	},
});


Reflect.defineProperty(userManager, 'changeBalance', {
	value: function changeBalance(user, amount, gambling = false) {
		if (isNaN(amount)) throw Error(`${amount} is not a valid number.`);
		user.balance += Number(amount);

		if (amount > 0 && gambling) {
			userManager.addStats(user, 'gamblingMoneyGained', Number(amount));
			achievementHunter.hunt(user, 'gamblingMoneyGainedSingle', Number(amount));
		}
		else if (amount < 0 && gambling) {
			userManager.addStats(user, 'gamblingMoneyLost', -Number(amount));
			userManager.addStats(user, 'timesGambled', 1);
		}
		user.save();
		return Math.floor(user.balance);
	},
});


Reflect.defineProperty(userManager, 'getStats', {
	value: function getStats(user) {
		return JSON.parse(user.stats);
	},
});
Reflect.defineProperty(userManager, 'addStats', {
	value: function addStats(user, statName, amount) {
		const userStats = JSON.parse(user.stats);
		if (userStats[statName]) userStats[statName] += amount;
		else userStats[statName] = amount;

		achievementHunter.hunt(user, statName, userStats);

		user.stats = JSON.stringify(userStats);
		user.save();

		return userStats;
	},
});


Reflect.defineProperty(userManager, 'setVote', {
	value: function setVote(user) {
		user.lastVote = moment().toDate();
		return user.save();
	},
});
Reflect.defineProperty(userManager, 'getVote', {
	value: function getVote(user) {
		const now = moment();
		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(userManager, 'getProtection', {
	value: function getProtection(user) {
		const now = moment();
		const dCheck = moment(user.lastProtection).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userManager, 'setProtection', {
	value: function setProtection(user) {
		user.lastProtection = moment().toDate();
		return user.save();
	},
});
Reflect.defineProperty(userManager, 'protectionAllowed', {
	value: async function protectionAllowed(user) {
		const protectionItem = util.getItem('streak protection');
		const hasProtection = await itemHandler.hasItem(user, protectionItem, 1);
		const noCooldown = userManager.getProtection(user);
		if (hasProtection && noCooldown === true) return true;
		return false;
	},
});
Reflect.defineProperty(userManager, 'newProtectionAllowed', {
	value: async function newProtectionAllowed(user) {
		const protectionItem = util.getItem('streak protection');
		const hasProtection = await itemHandler.hasItem(user, protectionItem, 1);
		const noCooldown = userManager.getProtection(user);
		if (hasProtection || noCooldown !== true) return false;
		return true;
	},
});


Reflect.defineProperty(userManager, 'getPowerCount', {
	value: function getPowerCount(user) {
		const now = moment();
		const dCheck = moment(user.lastPowerCounting).add(3, 'h');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userManager, 'setPowerCount', {
	value: function setPowerCount(user) {
		user.lastPowerCounting = moment().toDate();
		return user.save();
	},
});


Reflect.defineProperty(userManager, 'getCountBoost', {
	value: function getCountBoost(user) {
		const now = moment();
		const dCheck = moment(user.lastCountBoost).add(3, 'h');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userManager, 'setCountBoost', {
	value: function setCountBoost(user) {
		user.lastCountBoost = moment().toDate();
		return user.save();
	},
});


Reflect.defineProperty(userManager, 'getDailyCount', {
	value: function getDailyCount(user) {
		const now = moment();
		const dCheck = moment(user.lastDailyCount).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userManager, 'setDailyCount', {
	value: function setDailyCount(user) {
		user.lastDailyCount = moment().toDate();
		return user.save();
	},
});


Reflect.defineProperty(userManager, 'getHourlyCount', {
	value: function getHourlyCount(user) {
		const now = moment();
		const dCheck = moment(user.lastHourlyCount).add(1, 'h');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(userManager, 'setHourlyCount', {
	value: function setHourlyCount(user) {
		user.lastHourlyCount = moment().toDate();
		return user.save();
	},
});


Reflect.defineProperty(userManager, 'getReaction', {
	value: function getReaction(user) {
		return JSON.parse(user.reaction);
	},
});
Reflect.defineProperty(userManager, 'saveReaction', {
	value: function saveReaction(user, reactionInfo) {
		user.reaction = JSON.stringify(reactionInfo);
		return user.save();
	},
});


Reflect.defineProperty(userManager, 'getColour', {
	value: function getColour() {
		return '#fcfcfc';
	},
});



module.exports = { Users, userManager };