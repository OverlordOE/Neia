const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const { Collection, MessageEmbed } = require('discord.js');
const { itemHandler } = require('./itemHandler');
const { util } = require('./util');
const { client } = require('../index.js');

const UserAchievements = require('../models/UserAchievements')(sequelize, Sequelize);
const achievementHunter = new Collection();


Reflect.defineProperty(achievementHunter, 'hunt', {
	value: function hunt(user, stats, event) {

		console.log(event);
		console.log(stats['timesGambled']);
		switch (event) {
			case 'timesGambled':
				console.log('in the case');
				if (stats['timesGambled'] >= 1000) unlock(user, 'Gambling is my job');
				else if (stats['timesGambled'] >= 10) unlock(user, 'Is this healthy?');
				else if (stats['timesGambled'] >= 5) unlock(user, 'The start of an addiction');
				else if (stats['timesGambled'] >= 1) unlock(user, 'This is a test i guess');
				break;

		}
	},
});

async function unlock(user, achievementName) {
	const achievement = await util.getAchievement(achievementName);
	const hasAchievement = await achievementHunter.hasAchievement(user, achievement);
	if (hasAchievement) return;
	
	await addAchievement(user, achievement);

	const reward = util.getItem(achievement.reward);
	itemHandler.addItem(user, reward);

	console.log(client);
	const discordUser = await client.users.cache.get(user.user_id);
	const embed = new MessageEmbed()
		.setTitle('Achievement Unlocked!')
		.setDescription(`You have unlocked **${achievement.emoji}${achievementName}**\n__${achievement.unlockMessage}__\n\nYour reward for this is the reaction emoji: __**${reward.emoji}${achievement.reward}!**__`);

	discordUser.send({ embeds: [embed] });
}

// Achievements

async function addAchievement(user, achievement) {
	if (achievementHunter.hasAchievement(achievement)) return;

	return await UserAchievements.create({
		user_id: user.user_id,
		name: achievement.name,
	});
}


async function removeAchievement(user, achievement) {
	const oldAchievement = achievementHunter.hasAchievement(achievement);

	if (oldAchievement) return oldAchievement.destroy();
	else throw Error(`User doesn't have achievement: ${achievement.name}`);
}


Reflect.defineProperty(achievementHunter, 'hasAchievement', {
	value: async function hasAchievement(user, achievement) {
		console.log(achievement);
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