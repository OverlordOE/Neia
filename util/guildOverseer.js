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
Reflect.defineProperty(guildOverseer, 'saveNumberGame', {
	value: function saveNumberGame(guild, numberGameInfo) {
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

Reflect.defineProperty(guildOverseer, 'setNumberGameChannel', {
	value: function setNumberGameChannel(guild, newChannelId) {
		const numberGuessingInfo = JSON.parse(guild.numberGuessing);
		if (newChannelId == numberGuessingInfo.channelId) return null;

		const numberGameInfo = JSON.parse(guild.numberGame);
		numberGameInfo.channelId = newChannelId;

		guild.numberGame = JSON.stringify(numberGameInfo);
		guild.save();

		return numberGameInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'removeNumberGameChannel', {
	value: function removeNumberGameChannel(guild) {

		const numberGameInfo = JSON.parse(guild.numberGame);
		numberGameInfo.channelId = null;

		guild.numberGame = JSON.stringify(numberGameInfo);
		guild.save();

		return numberGameInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'getNumberGuessing', {
	value: function getNumberGuessing(guild) {
		if (!guild.numberGuessing) return null;
		return JSON.parse(guild.numberGuessing);
	},
});
Reflect.defineProperty(guildOverseer, 'saveNumberGuessing', {
	value: function saveNumberGuessing(guild, numberGuessingInfo) {
		guild.numberGuessing = JSON.stringify(numberGuessingInfo);
		guild.save();
		return numberGuessingInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'getNumberGuessingEvent', {
	value: function getNumberGuessingEvent(guild) {
		if (!guild.numberGuessing) return null;
		const numberGuessingInfo = JSON.parse(guild.numberGuessing);

		if (numberGuessingInfo.currentEvent) return numberGuessingInfo.currentEvent;
		else return null;
	},
});
Reflect.defineProperty(guildOverseer, 'setnumberGuessingEvent', {
	value: function setnumberGuessingEvent(guild, newEvent) {
		const numberGuessingInfo = JSON.parse(guild.numberGuessing);
		numberGuessingInfo.currentEvent = newEvent;

		guild.numberGuessing = JSON.stringify(numberGuessingInfo);
		guild.save();

		return numberGuessingInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'setNumberGuessingChannel', {
	value: function setNumberGuessingChannel(guild, newChannelId) {
		const numberGameInfo = JSON.parse(guild.numberGame);
		if (numberGameInfo.channelId == newChannelId) return null;

		const numberGuessingInfo = JSON.parse(guild.numberGuessing);
		numberGuessingInfo.channelId = newChannelId;

		guild.numberGuessing = JSON.stringify(numberGuessingInfo);
		guild.save();

		return numberGuessingInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'removeNumberGuessingChannel', {
	value: function removeNumberGuessingChannel(guild) {

		const numberGuessingInfo = JSON.parse(guild.numberGuessing);
		numberGuessingInfo.channelId = null;

		guild.numberGame = JSON.stringify(numberGuessingInfo);
		guild.save();

		return numberGuessingInfo;
	},
});

module.exports = { Guilds, guildOverseer };