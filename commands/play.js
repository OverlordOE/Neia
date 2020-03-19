const fs = require('fs');
const ytdl = require('ytdl-core-discord');
const YouTube = require("discord-youtube-api");
const youtube = new YouTube("AIzaSyDALIKqq8SLibcRS5RotqVu4sd_SktS4eU");



module.exports = {
	name: 'play',
	description: 'Play a song.',
	admin: false,
	aliases: [""],
	args: true,
	usage: 'url',
	async execute(msg, args) {
		if (!msg.member.voice.channel) {
			msg.reply("You are not in a voice channel!")
		}
		var search = "";

		for (var i = 0; i < args.length; i++) {
			search += args[i];
			search += " ";
		}

		const video = await youtube.searchVideos(search);

		const connection = await msg.member.voice.channel.join();
		const dispatcher = connection.play(await ytdl(video.url), { type: 'opus' });

		dispatcher.on('start', () => {
			console.log(`Now playing: ${video.title}`);
			msg.channel.send(`Now playing: ${video.title}`)
		});

		dispatcher.on('finish', () => {
			console.log('audio has finished playing!');
			msg.channel.send(`${video.title} has finished playing!`);
		});
		dispatcher.on('error', console.error);
	},
};