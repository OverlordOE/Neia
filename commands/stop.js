const ytdl = require('ytdl-core-discord');

module.exports = {
	name: 'stop',
	description: 'Makes the bot leave the voice channel.',
	admin: false,
	aliases: ["leave"],
	args: false,
	usage: '',
	async execute(msg, args) {
		if (!msg.member.voiceChannel) return msg.channel.send("Connect to a voice channel.");

		if (!msg.guild.me.voiceChannel) return msg.channel.send("The bot is not connected to a voice channel.");

		if (msg.guild.me.voiceChannelID != msg.member.voiceChannelID) return msg.channel.send("The bot is not in your voice channel.");

		msg.guild.me.voiceChannel.leave();
	},
};