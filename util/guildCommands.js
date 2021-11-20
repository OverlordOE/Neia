const Sequelize = require('sequelize');
const Discord = require('discord.js');
const guildCommands = new Discord.Collection();
require('dotenv').config();

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Guilds = require('../models/Guilds')(sequelize, Sequelize);


// GUILDS
Reflect.defineProperty(guildCommands, 'newGuild', {
	value: async function newGuild(id) {
		const guild = await Guilds.create({
			guild_id: id,
		});
		guildCommands.set(id, guild);
		return guild;
	},
});


Reflect.defineProperty(guildCommands, 'getGuild', {
	value: async function getGuild(id) {
		let guild = guildCommands.get(id);
		if (!guild) guild = await guildCommands.newGuild(id);
		return guild;
	},
});


Reflect.defineProperty(guildCommands, 'getNumberGame', {
	value: function getNumberGameInfo(guild) {
		if (!guild.numberGame) return null;
		return JSON.parse(guild.numberGame);
	},
});
Reflect.defineProperty(guildCommands, 'setNumberChannel', {
	value: function setNumberChannel(guild, newChannelId) {

		const numberGameInfo = JSON.parse(guild.numberGame);
		numberGameInfo.channelId = newChannelId;

		guild.numberGame = JSON.stringify(numberGameInfo);
		guild.save();

		return numberGameInfo;
	},
});
Reflect.defineProperty(guildCommands, 'saveNumberGameInfo', {
	value: function saveNumberGameInfo(guild, numberGameInfo) {
		guild.numberGame = JSON.stringify(numberGameInfo);
		guild.save();
		return numberGameInfo;
	},
});

module.exports = { Guilds, guildCommands };