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
	value: function getNumberGame(guild) {
		if (!guild.numberGame) {
			return guildOverseer.saveNumberGame(guild, {
				lastUserId: null,
				channelId: null,
				currentEvent: null,
				currentNumber: 0,
				lastCheckpoint: 0,
				nextCheckpoint: 50,
				totalCounted: 0,
				streaksRuined: 0,
				highestStreak: 0,
			});
		}
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
		const guessingGameInfo = guildOverseer.getGuessingGame(guild);
		if (newChannelId == guessingGameInfo.channelId) return null;

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


Reflect.defineProperty(guildOverseer, 'getGuessingGame', {
	value: function getGuessingGame(guild) {
		if (!guild.guessingGame) {
			return guildOverseer.saveGuessingGame(guild, {
				lastUserId: null,
				channelId: null,
				prizePool: 0,
				targetNumber: 0,
				totalGuessed: 0,
				currentGuessed: 0,
				fastestGuess: 0,
				roundsCompleted: 0,
			});
		}
		return JSON.parse(guild.guessingGame);
	},
});
Reflect.defineProperty(guildOverseer, 'saveGuessingGame', {
	value: function saveGuessingGame(guild, guessingGameInfo) {
		guild.guessingGame = JSON.stringify(guessingGameInfo);
		guild.save();
		return guessingGameInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'getGuessingGameEvent', {
	value: function getGuessingGameEvent(guild) {
		if (!guild.guessingGame) return null;
		const guessingGameInfo = JSON.parse(guild.guessingGame);

		if (guessingGameInfo.currentEvent) return guessingGameInfo.currentEvent;
		else return null;
	},
});
Reflect.defineProperty(guildOverseer, 'setguessingGameEvent', {
	value: function setguessingGameEvent(guild, newEvent) {
		const guessingGameInfo = JSON.parse(guild.guessingGame);
		guessingGameInfo.currentEvent = newEvent;

		guild.guessingGame = JSON.stringify(guessingGameInfo);
		guild.save();

		return guessingGameInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'setGuessingGameChannel', {
	value: function setGuessingGameChannel(guild, newChannelId) {
		const numberGameInfo = guildOverseer.getNumberGame(guild);
		if (numberGameInfo.channelId == newChannelId) return null;

		const guessingGameInfo = guildOverseer.getGuessingGame(guild);
		guessingGameInfo.channelId = newChannelId;
		guessingGameInfo.targetNumber = Math.ceil(Math.random() * 1000);
		console.log(guessingGameInfo.targetNumber);

		guild.guessingGame = JSON.stringify(guessingGameInfo);
		guild.save();

		return guessingGameInfo;
	},
});

Reflect.defineProperty(guildOverseer, 'removeGuessingGameChannel', {
	value: function removeGuessingGameChannel(guild) {

		const guessingGameInfo = JSON.parse(guild.guessingGame);
		guessingGameInfo.channelId = null;

		guild.guessingGame = JSON.stringify(guessingGameInfo);
		guild.save();

		return guessingGameInfo;
	},
});

module.exports = { Guilds, guildOverseer };