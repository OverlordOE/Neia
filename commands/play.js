const ytdl = require('ytdl-core-discord');
const YouTube = require('discord-youtube-api');

module.exports = {
	name: 'play',
	description: 'Play a song.',
	admin: false,
	aliases: ['song'],
	args: true,
	usage: 'search criteria',
	owner: false,
	music: true,


	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {

		const youtube = new YouTube(ytAPI);
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}
		const search = args.join(' ');

		logger.log('info', search);

		const data = options.active.get(msg.guild.id) || {};

		if (!data.connection) { data.connection = await msg.member.voice.channel.join(); }
		else if (data.connection.status == 4) {
			data.connection = await msg.member.voice.channel.join();
			const guildIDData = options.active.get(msg.guild.id);
			guildIDData.dispatcher.emit('finish');
		}

		if (!data.queue) data.queue = [];
		data.guildID = msg.guild.id;

		const validate = await ytdl.validateURL(search);

		if (!validate) {
			var video = await youtube.searchVideos(search);

			data.queue.push({
				songTitle: video.title,
				requester: msg.author.tag,
				url: video.url,
				announceChannel: msg.channel.id,
				duration: video.length,
			});
		}
		else if (validate) {
			var video = await ytdl.getInfo(search);

			data.queue.push({
				songTitle: video.title,
				requester: msg.author.tag,
				url: search,
				announceChannel: msg.channel.id,
				duration: video.lengthSeconds,
			});

		}
		else { return msg.reply('Cannot play this query'); }


		if (!data.dispatcher) {
			Play(bot, options, data, logger);
		}
		else {
			msg.channel.send(`Added ${video.title} to the queue - Requested by ${msg.author.tag}`);
		}

		options.active.set(msg.guild.id, data);

		data.dispatcher.on('disconnect', e => {
			data.dispatcher = null;
			logger.log('info', `left voice channel for reason: ${e.info}`);
		});
	},
};


async function Play(bot, options, data, logger) {

	const message = bot.channels.cache.get(data.queue[0].announceChannel);
	message.send(`Now playing ${data.queue[0].songTitle}\nRequested by ${data.queue[0].requester}`);
	try {
		logger.log('info', `Now playing ${data.queue[0].songTitle} - Requested by ${data.queue[0].requester}`);
	}
	catch (e) {
		return logger.error(e.stack);
	}


	data.dispatcher = data.connection.play(await ytdl(data.queue[0].url, {
		filter: 'audioonly',
		highWaterMark: 1 << 25,
	}), { type: 'opus' });
	data.dispatcher.guildID = data.guildID;

	data.dispatcher.on('finish', () => {
		logger.log('info', 'finish');
		Finish(bot, options, data.dispatcher, message, logger);
	});

	data.dispatcher.on('error', e => {
		message.send(`error:  ${e.info}`);
		logger.error(e.stack);
	});

	data.dispatcher.on('failed', e => {
		message.send('error:  failed to join voice channel');
		logger.log('error', `failed to join voice channel for reason: ${e.info}`);
	});

}


function Finish(bot, options, dispatcher, message, logger) {

	const fetchedData = options.active.get(dispatcher.guildID);
	if (fetchedData.loop) {

		options.active.set(dispatcher.guildID, fetchedData);
		return Play(bot, options, fetchedData, logger);
	}
	else { fetchedData.queue.shift(); }

	if (fetchedData.queue.length > 0) {

		options.active.set(dispatcher.guildID, fetchedData);
		Play(bot, options, fetchedData, logger);
	}
	else {

		options.active.delete(dispatcher.guildID);
		message.send('Queue has finished playing');
		const voiceChannel = bot.guilds.cache.get(dispatcher.guildID).me.voice.channel;
		if (voiceChannel) voiceChannel.leave();

	}
}
