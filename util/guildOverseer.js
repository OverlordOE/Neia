const Sequelize = require('sequelize');
const Discord = require('discord.js');
const guildOverseer = new Discord.Collection();
require('dotenv').config();

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Guilds = require('../models/Guilds')(sequelize, Sequelize);


// GUILDS
Reflect.defineProperty(guildOverseer, 'newGuild', {
	value: async function newGuild(id) {
		const guild = await Guilds.create({
			guild_id: id,
		});
		guildOverseer.set(id, guild);
		return guild;
	},
});


Reflect.defineProperty(guildOverseer, 'getGuild', {
	value: async function getGuild(id) {
		let guild = guildOverseer.get(id);
		if (!guild) guild = await guildOverseer.newGuild(id);
		return guild;
	},
});


Reflect.defineProperty(guildOverseer, 'getNumberGame', {
	value: function getNumberGameInfo(guild) {
		if (!guild.numberGame) return null;
		return JSON.parse(guild.numberGame);
	},
});
Reflect.defineProperty(guildOverseer, 'saveNumberGameInfo', {
	value: function saveNumberGameInfo(guild, numberGameInfo) {
		guild.numberGame = JSON.stringify(numberGameInfo);
		guild.save();
		return numberGameInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'getNumberGameEvent', {
	value: function getNumberGameEvent(guild) {
		if (!guild.numberGame) return null;
		const numberGameInfo = JSON.parse(guild.numberGame);
		
		if (numberGameInfo.currentEvent) return numberGameInfo.currentEvent;
		else return null;
	},
});
Reflect.defineProperty(guildOverseer, 'setNumberGameEvent', {
	value: function setNumberGameEvent(guild, newEvent) {
		const numberGameInfo = JSON.parse(guild.numberGame);
		numberGameInfo.currentEvent = newEvent;

		guild.numberGame = JSON.stringify(numberGameInfo);
		guild.save();

		return numberGameInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'setNumberChannel', {
	value: function setNumberChannel(guild, newChannelId) {

		const numberGameInfo = JSON.parse(guild.numberGame);
		numberGameInfo.channelId = newChannelId;

		guild.numberGame = JSON.stringify(numberGameInfo);
		guild.save();

		return numberGameInfo;
	},
});

module.exports = { Guilds, guildOverseer };