const fs = require('fs');
const ytdl = require('ytdl-core-discord');
const YouTube = require("discord-youtube-api");
const youtube = new YouTube("AIzaSyDALIKqq8SLibcRS5RotqVu4sd_SktS4eU");


module.exports = {
	name: 'skip',
	description: 'Skip a song.',
	admin: false,
	aliases: ["next"],
	args: false,
	usage: 'search criteria',
	async execute(msg, args, profile, bot, ops, ytAPI, logger) {
		if (!msg.member.voice.channel) {
			return msg.reply("You are not in a voice channel!")
		}
		
		var guildIDData = ops.active.get(msg.guild.id);
		return guildIDData.dispatcher.emit('finish');
	},
}
