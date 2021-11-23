const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Discord = require('discord.js');
const { util } = require('./util');
const { userManager } = require('./userManager');

const UserAchievements = require('../models/UserAchievements')(sequelize, Sequelize);
const achievementHunter = new Discord.Collection();


Reflect.defineProperty(achievementHunter, 'hunt', {
	value: async function hunt(user, event) {



	},
});

async function unlock() {


}

// Achievements

async function addAchievement(user, achievement) {
	if (achievementHunter.hasAchievement(achievement)) return;

	return UserAchievements.create({
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
		const userAchievement = await UserAchievements.findOne({
			where: { user_id: user.user_id, name: achievement.name },
		});

		if (userAchievement) return userAchievement;
		else return false;
	},
});

Reflect.defineProperty(achievementHunter, 'getAchievements', {
	value: async function getAchievements(user) {
		return UserAchievements.findAll({
			where: { user_id: user.user_id },
		});
	},
});

module.exports = { achievementHunter };