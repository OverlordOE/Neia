module.exports = {
	name: 'queue',
	description: 'Shows the song queue',
	summary: 'Shows the song queue.',
	category: 'music',
	aliases: ['list'],
	args: false,
	usage: '',


	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		const guildIDData = options.active.get(msg.guild.id);

		if (!guildIDData) return msg.channel.send('No music queued at the moment.');

		const queue = guildIDData.queue;
		const nowPlaying = queue[0];
		let response = '';

		if (guildIDData.loop) { response = `Now looping: **${nowPlaying.songTitle}**\nDuration: ${nowPlaying.duration}\nRequested by ${nowPlaying.requester}\n\nType -loop to stop the looping \n`; }

		else {
			response = `Now playing: **${nowPlaying.songTitle}**\nDuration: ${nowPlaying.duration}\nRequested by ${nowPlaying.requester}\n\nQueue: \n`;

			for (let i = 1; i < queue.length; i++) {
				response += `${i}: **${queue[i].songTitle}**\nDuration: ${queue[i].duration}\nRequested by: ${queue[i].requester}\n\n`;
			}
		}

		msg.channel.send(response, { code: true });


	},
};