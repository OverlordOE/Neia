const ytdl = require('discord-ytdl-core');
const YouTube = require('youtube-sr');
const Discord = require('discord.js');

module.exports = {
	name: 'play',
	summary: 'Play a song',
	description: 'Play a song, supports youtube videos.',
	category: 'music',
	aliases: ['song', 'p'],
	args: true,
	usage: '<search criteria>',


	async execute(message, args, msgUser, character, guildProfile, client, logger, options) {

		if (!message.member.voice.channel) return message.channel.send(embed.setDescription('you are not in a voice channel.'));

		const embed = new Discord.MessageEmbed()
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(character.getColour(msgUser));

		const search = args.join(' ');
		const data = options.active.get(message.guild.id) || {};

		try {
			if (!data.connection) {data.connection = await message.member.voice.channel.join();}
			else if (data.connection.status == 4) {
				data.connection = await message.member.voice.channel.join();
				const guildIDData = options.active.get(message.guild.id);
				guildIDData.dispatcher.emit('finish');
			}
		}
		catch (error) {
			logger.warn('Neia couldnt join the voice channel');
			return message.channel.send(embed.setDescription('Neia probably does not have permission to join the channel or something else went wrong'));
		}


		if (!data.queue) data.queue = [];
		if (data.queue.length >= 4) return message.channel.send(embed.setDescription('You have reached the maximum queue size for free users.\nIf you want to upgrade your queue size contact OverlordOE#0717.'));
		data.guildID = message.guild.id;

		const tempMessage = await message.channel.send('Finding youtube video...');
		const info = await YouTube.search(search, { limit: 1 });
		const video = info[0];
		if (video) {
			data.queue.push({
				songTitle: video.title,
				requester: message.author,
				url: video.url,
				announceChannel: message.channel.id,
				duration: video.durationFormatted,
				thumbnail: video.thumbnail.url,
			});
			embed.setThumbnail(video.thumbnail.url);
		}
		else {
			logger.warn(`Could not find youtube video with search terms ${search}`);
			tempMessage.delete();
			return message.channel.send(embed.setDescription(`Neia could not find any video connected to the search terms of \`${search}\``));
		}

		tempMessage.delete();
		if (!data.dispatcher) Play(client, options, data, logger, msgUser, message);
		else message.channel.send(embed.setDescription(`Added **${video.title}** to the queue.\n\nRequested by ${message.author}`));

		options.active.set(message.guild.id, data);
	},
};


async function Play(client, options, data, logger, msgUser, message) {

	const channel = client.channels.cache.get(data.queue[0].announceChannel);
	const embed = new Discord.MessageEmbed()
		.setColor(character.getColour(msgUser))
		.setThumbnail(data.queue[0].thumbnail);

	channel.send(embed.setDescription(`Now playing **${data.queue[0].songTitle}**\nRequested by ${data.queue[0].requester}`));

	data.dispatcher = data.connection.play(await ytdl(data.queue[0].url, {
		filter: 'audioonly',
		highWaterMark: 1 << 25,
		opusEncoded: true,
	}), { type: 'opus' });
	data.dispatcher.guildID = data.guildID;


	data.dispatcher.on('finish', () => Finish(client, options, data.dispatcher, logger, msgUser, message));
	data.dispatcher.on('error', e => {
		channel.send(embed.setDescription(`error:  ${e.info}`));
		logger.error(e.stack);
	});
	data.dispatcher.on('failed', e => {
		channel.send(embed.setDescription('error:  failed to join voice channel'));
		logger.log('error', `failed to join voice channel for reason: ${e.info}`);
	});
	data.dispatcher.on('disconnect', e => {
		data.dispatcher = null;
		logger.log('info', `left voice channel for reason: ${e.info}`);
	});
}


function Finish(client, options, dispatcher, logger, msgUser, message) {

	const fetchedData = options.active.get(dispatcher.guildID);
	if (fetchedData.loop) {
		options.active.set(dispatcher.guildID, fetchedData);
		return Play(client, options, fetchedData, logger, msgUser, message);
	}
	else {fetchedData.queue.shift();}

	if (fetchedData.queue.length > 0) {
		options.active.set(dispatcher.guildID, fetchedData);
		Play(client, options, fetchedData, logger, msgUser, message);
	}

	else {
		options.active.delete(dispatcher.guildID);
		const voiceChannel = client.guilds.cache.get(dispatcher.guildID).me.voice.channel;
		if (voiceChannel) voiceChannel.leave();
	}
}
