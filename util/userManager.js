/* eslint-disable no-multiple-empty-lines */
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const moment = require('moment');
const { Collection, MessageEmbed } = require('discord.js');
const { util } = require('./util');
const UserItems = require('../models/UserItems')(sequelize, Sequelize);
const UserAchievements = require('../models/UserAchievements')(sequelize, Sequelize);
const achievementHunter = new Collection();
const itemHandler = new Collection();
const userManager = new Collection();
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


Reflect.defineProperty(userManager, 'addBalance', {
	value: function addBalance(user, amount, gambling = false) {
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



//* ITEMHANDLER
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
		const inventory = await itemHandler.getInventory(user);
		achievementHunter.hunt(user, 'itemAdded', inventory);

		UserItems.create({
			user_id: user.user_id,
			name: item.name,
			amount: parseInt(amount),
		});
		return inventory;
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



//* ACHIEVEMENTHUNTER
Reflect.defineProperty(achievementHunter, 'hunt', {
	value: async function hunt(user, event, stats = null) {

		switch (event) {
			case 'timesGambled':
				if (stats['timesGambled'] >= 1000) unlock(user, 'Gambling is my Job');
				else if (stats['timesGambled'] >= 500) unlock(user, 'Casino Regular');
				else if (stats['timesGambled'] >= 200) unlock(user, 'Is this Healthy?');
				else if (stats['timesGambled'] >= 50) unlock(user, 'The Start of an Addiction');
				else if (stats['timesGambled'] >= 5) unlock(user, 'Welcome to the Casino');
				break;

			case 'itemAdded':
				// eslint-disable-next-line no-case-declarations
				if (stats.length >= 60) unlock(user, 'Hoarder');
				else if (stats.length >= 40) unlock(user, 'Trophy Hunter');
				else if (stats.length >= 25) unlock(user, 'The Collector');
				else if (stats.length >= 10) unlock(user, 'Oeh Shiny!');
				else if (stats.length >= 1) unlock(user, 'The First Piece');
				break;

			case 'gamblingMoneyGainedSingle':
				if (stats >= 1000000) unlock(user, 'A Small Loan of a Million Dollars');
				else if (stats >= 300000) unlock(user, 'You Can Buy a House With This');
				else if (stats >= 120000) unlock(user, 'Its Raining Money');
				else if (stats >= 50000) unlock(user, 'Big Stacks');
				else if (stats >= 10000) unlock(user, 'Pure Luck');
				else if (stats >= 1000) unlock(user, 'Big Stacks');
				break;

			case 'gamblingMoneyGained':
				if (stats['gamblingMoneyGained'] >= 5000000) unlock(user, 'Still no Jeff Bezos');
				else if (stats['gamblingMoneyGained'] >= 1000000) unlock(user, 'Millionaire!');
				else if (stats['gamblingMoneyGained'] >= 500000) unlock(user, 'Half Person Half Millionaire');
				else if (stats['gamblingMoneyGained'] >= 100000) unlock(user, 'A Small Fortune');
				else if (stats['gamblingMoneyGained'] >= 10000) unlock(user, 'Starting Capital');
				break;

			case 'numbersCounted':
				if (stats['numbersCounted'] >= 1000) unlock(user, 'Pretending to be Smart');
				else if (stats['numbersCounted'] >= 500) unlock(user, 'Count Dracula');
				else if (stats['numbersCounted'] >= 200) unlock(user, '200 Problems');
				else if (stats['numbersCounted'] >= 50) unlock(user, 'Numberphile');
				else if (stats['numbersCounted'] >= 1) unlock(user, 'Babys First Numbers');
				break;

		}
	},
});

async function unlock(user, achievementName) {
	const achievement = util.getAchievement(achievementName);
	const hasAchievement = await achievementHunter.hasAchievement(user, achievement);
	if (hasAchievement) return;
	await addAchievement(user, achievement);

	const reward = util.getItem(achievement.reward);
	itemHandler.addItem(user, reward);

	const embed = new MessageEmbed()
		.setTitle('Achievement Unlocked!')
		.setDescription(`You have unlocked **${achievement.emoji}${achievementName}**\n__${achievement.unlockMessage}__\n
		Your reward for this is the reaction emoji: _**${reward.emoji}${achievement.reward}!**_`);
	util.setEmbedRarity(embed, achievement.rarity);

	user.author.send({ embeds: [embed] });
}


async function addAchievement(user, achievement) {
	return await UserAchievements.create({
		user_id: user.user_id,
		name: achievement.name,
	});
}


async function removeAchievement(user, achievement) {
	const oldAchievement = await achievementHunter.hasAchievement(achievement);

	if (oldAchievement) return oldAchievement.destroy();
	else throw Error(`User doesn't have achievement: ${achievement.name}`);
}


Reflect.defineProperty(achievementHunter, 'hasAchievement', {
	value: async function hasAchievement(user, achievement) {
		const userAchievement = await UserAchievements.findOne({
			where: { user_id: user.user_id, name: achievement.name },
		});

		if (userAchievement) return userAchievement;
		else return false;
	},
});

Reflect.defineProperty(achievementHunter, 'getAchievements', {
	value: async function getAchievements(user) {
		return await UserAchievements.findAll({
			where: { user_id: user.user_id },
		});
	},
});

module.exports = { Users, userManager, itemHandler, achievementHunter };