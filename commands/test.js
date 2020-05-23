const emojiCharacters = require('../emojiCharacters');
const Discord = require('discord.js');
module.exports = {
	name: 'test',
	description: 'Test command for new commands.',
	owner: true,
	aliases: ['t'],
	args: false,
	usage: '',
	admin: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		msg.channel.send('uhhhh test');
	},
};