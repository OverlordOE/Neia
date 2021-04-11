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
const userCommands = new Discord.Collection();
const Users = require('../models/Users')(sequelize, Sequelize);


Reflect.defineProperty(userCommands, 'newUser', {
	value: async function newUser(id) {
		const now = moment();
		const user = await Users.create({
			user_id: id,
			lastVote: now.subtract(1, 'days').toString(),
			firstCommand: true,
		});
		userCommands.set(id, user);
		return user;
	},
});
Reflect.defineProperty(userCommands, 'getUser', {
	value: async function getUser(id) {
		let user = userCommands.get(id);
		if (!user) user = await userCommands.newUser(id);
		return user;
	},
});






// Misc
Reflect.defineProperty(userCommands, 'addBalance', {
	value: function addBalance(user, amount) {
		if (isNaN(amount)) throw Error(`${amount} is not a valid number.`);
		user.balance += Number(amount);
		if (amount > 0) user.totalEarned += Number(amount);

		user.save();
		return Math.floor(user.balance);
	},
});


Reflect.defineProperty(userCommands, 'setVote', {
	value: function setVote(user) {
		user.lastVote = moment().toString();
		return user.save();
	},
});
Reflect.defineProperty(userCommands, 'getVote', {
	value: function getVote(user) {
		const now = moment();
		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(userCommands, 'getColour', {
	value: function getColour(user) {
		return '#fcfcfc';
	},
});

module.exports = { Users, userCommands };