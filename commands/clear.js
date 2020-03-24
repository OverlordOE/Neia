const ytdl = require('ytdl-core-discord');

module.exports = {
	name: 'stop',
	description: 'Makes the bot leave the voice channel.',
	admin: false,
	aliases: ["leave"],
	args: false,
	usage: '',
	async execute(msg, args) {
		var data = ops.active.get(msg.guild.id) || {};
		if (!data.queue) data.queue = [];
		data.guildID = msg.guild.id;

		
	},
};