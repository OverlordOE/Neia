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
	usage: 'search criteria',
	async execute(msg, args, currency, bot, songQueue) {
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
		songQueue.push(video);
		playNext();


		async function playNext() {
			var song = songQueue[0];
			const dispatcher = connection.play(await ytdl(song.url), { type: 'opus' });

			dispatcher.on('start', () => {
				console.log(`Now playing: ${song.title}`);
				msg.channel.send(`Now playing: ${song.title}`)
			});

			dispatcher.on('finish', () => {
				console.log(`${song.title} has finished playing!`);
				msg.channel.send(`${song.title} has finished playing!`);
				songQueue.shift();
				if (songQueue.length) {playNext();}
			});
			dispatcher.on('error', console.error);
		}
	},
};