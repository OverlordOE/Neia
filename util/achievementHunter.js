const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const { Collection, MessageEmbed } = require('discord.js');
const { util } = require('./util');

const UserAchievements = require('../models/UserAchievements')(sequelize, Sequelize);
const UserItems = require('../models/UserItems')(sequelize, Sequelize);
const achievementHunter = new Collection();


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
	const achievement = await util.getAchievement(achievementName);
	const hasAchievement = await achievementHunter.hasAchievement(user, achievement);
	if (hasAchievement.name) return;
	await addAchievement(user, achievement);

	const reward = util.getItem(achievement.reward);
	addItem(user, reward);

	const embed = new MessageEmbed()
		.setTitle('Achievement Unlocked!')
		.setDescription(`You have unlocked **${achievement.emoji}${achievementName}**\n__${achievement.unlockMessage}__\n\nYour reward for this is the reaction emoji: _**${reward.emoji}${achievement.reward}!**_`);

	user.author.send({ embeds: [embed] });
}

async function addItem(user, item) {
	const userItem = await UserItems.findOne({
		where: { user_id: user.user_id, name: item.name },
	});

	if (userItem) {
		userItem.amount += 1;
		return userItem.save();
	}

	return UserItems.create({
		user_id: user.user_id,
		name: item.name,
		amount: 1,
	});
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

module.exports = { achievementHunter };