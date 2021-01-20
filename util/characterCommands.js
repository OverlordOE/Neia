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
const characterCommands = new Discord.Collection();
const Users = sequelize.import('../models/Users');


Reflect.defineProperty(characterCommands, 'newUser', {
	value: async function newUser(id) {
		const now = moment();
		const user = await Users.create({
			user_id: id,
			balance: 0,
			totalEarned: 0,
			networth: 0,
			level: 1,
			exp: 0,
			equipment: JSON.stringify({ weapon: null, offhand: null }),
			lastDaily: now.subtract(2, 'days').toString(),
			lastHourly: now.subtract(1, 'days').toString(),
			lastVote: now.subtract(1, 'days').toString(),
			firstCommand: true,
		});
		characterCommands.set(id, user);
		return user;
	},
});


// Misc
Reflect.defineProperty(characterCommands, 'getUser', {
	value: async function getUser(id) {
		let user = characterCommands.get(id);
		if (!user) user = await characterCommands.newUser(id);
		return user;
	},
});


Reflect.defineProperty(characterCommands, 'setVote', {
	value: function setVote(user) {
		user.lastVote = moment().toString();
		return user.save();
	},
});
Reflect.defineProperty(characterCommands, 'getVote', {
	value: function getVote(user) {
		const now = moment();
		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(characterCommands, 'getColour', {
	value: function getColour(user) {
		if (user.class) {
			const userClass = characterCommands.getClass(user.class);
			return userClass.colour;
		}
		return '#fcfcfc';
	},
});

module.exports = { Users, characterCommands };