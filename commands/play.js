const ytdl = require('ytdl-core');
const YouTube = require('youtube-sr').default;
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');
const cookie = process.env.YT_COOKIE;
const youtubeId = process.env.YT_Id;
let hasSearched = false;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Search for a song to play on Youtube.')
		.addStringOption(option =>
			option
				.setName('searchquery')
				.setDescription('The link or song you want to play.')
				.setRequired(true)),


	async execute(interaction, msgUser, msgGuild, client) {

		let embed = new MessageEmbed()
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [embed.setDescription('you are not in a voice channel.')], ephemeral: true });

		const search = interaction.options.getString('searchquery');
		const data = client.music.active.get(interaction.guildId) || {};

		try {
			data.connection = joinVoiceChannel({
				channelId: interaction.member.voice.channelId,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});
		}
		catch (error) {
			client.logger.warn('Neia couldnt join the voice channel');
			return interaction.reply({ content: 'Neia can\'t join the voice channel', ephemeral: true });
		}


		if (!data.queue) data.queue = [];
		if (data.queue.length >= 5) return interaction.reply({ embeds: [embed.setDescription('You have reached the maximum queue size for free users.\nIf you want to upgrade your queue size contact OverlordOE#0717.')], ephemeral: true });
		data.guildId = interaction.guildId;

		interaction.reply({ content: 'Finding youtube video...', ephemeral: true });
		const video = await SearchVideo();

		if (!video) {
			client.logger.warn(`Could not find youtube video with search terms "${search}"`);
			return interaction.editReply({ embeds: [embed.setDescription(`Neia could not find any video with the search terms \`${search}\``)], ephemeral: true });
		}

		interaction.followUp({ embeds: [embed.setDescription(`**${video.title}**\nBy **${video.channel}**\n Has been added to the queue.\n\nRequested by ${interaction.user}`)] });
		client.music.active.set(interaction.guildId, data);
		if (!data.player) Play(client, data, client.logger, msgUser, interaction);


		async function SearchVideo() {
			let videoData;
			let searchData;

			if (ytdl.validateURL(search)) {
				const info = await ytdl.getBasicInfo(search, {
					requestOptions: {
						headers: {
							Cookie: cookie,
							'x-youtube-identity-token': youtubeId,
						},
					},
				});
				searchData = info.videoDetails;
				let duration = 0;

				const minutes = Math.floor(searchData.lengthSeconds / 60);
				const seconds = searchData.lengthSeconds - (minutes * 60);
				if (seconds < 10) duration = `${minutes}:0${seconds}`;
				else duration = `${minutes}:${seconds}`;

				videoData = {
					title: searchData.title,
					channel: searchData.author.name,
					requester: interaction.user,
					url: searchData.video_url,
					announceChannel: interaction.channel.id,
					duration: duration,
					thumbnail: searchData.thumbnails[0].url,
				};
				data.queue.push(videoData);
				embed.setThumbnail(videoData.thumbnail);
			}
			else {
				searchData = await YouTube.search(search);

				if (searchData) {
					videoData = {
						title: searchData[0].title,
						channel: searchData[0].channel.name,
						requester: interaction.user,
						url: `https://youtu.be/${searchData[0].id}`,
						announceChannel: interaction.channel.id,
						duration: searchData[0].durationFormatted,
						thumbnail: searchData[0].thumbnail.url,
					};
					data.queue.push(videoData);
					embed.setThumbnail(videoData.thumbnail);
				}

				else if (hasSearched) return null;
				else {
					client.logger.warn('Search 1 has failed');
					hasSearched = true;
					await SearchVideo();
				}
			}
			return videoData;
		}


		async function Play() {
			data.paused = false;
			const channel = client.channels.cache.get(data.queue[0].announceChannel);

			embed = new MessageEmbed()
				.setDescription(`Now playing **${data.queue[0].title}**\nBy **${data.queue[0].channel}**\n\nRequested by ${data.queue[0].requester}`)
				.setThumbnail(data.queue[0].thumbnail);
			channel.send({ embeds: [embed] });


			const stream = ytdl(data.queue[0].url, { filter: 'audioonly' });
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
			const player = createAudioPlayer();
			data.player = player;

			player.play(resource);
			data.connection.subscribe(player);

			player.on(AudioPlayerStatus.Idle, () => Finish());
		}


		function Finish() {
			data.queue.shift();

			if (data.queue.length > 0) {
				client.music.active.set(data.guildId, data);
				Play();
			}
			else {
				client.music.active.delete(data.guildId);
				data.connection.destroy();
			}
		}
	},
};