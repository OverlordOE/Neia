const fs = require('fs');
const ytdl = require('ytdl-core-discord');
module.exports = {
	name: 'play',
	description: 'Play a song.',
	admin: false,
	aliases: [""],
	args: true,
	usage: 'song',
	async execute(msg, args) {
		if (!msg.member.voice.channel) {
			msg.reply("You are not in a voice channel!")
		}

		const url = args[0];
		const connection = await msg.member.voice.channel.join();
		const dispatcher = connection.play(await ytdl(url), { type: 'opus' });

		dispatcher.on('start', () => {
			console.log('audio is now playing!');
		});

		dispatcher.on('finish', () => {
			console.log('audio has finished playing!');
			connection.disconnect();
		});
		dispatcher.on('error', console.error);
	},
};