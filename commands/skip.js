module.exports = {
	name: 'skip',
	summary: 'Skip a song',
	description: 'Skip a song.',
	category: 'music',
	aliases: ['next'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		if (!message.member.voice.channel) {
			return message.reply('You are not in a voice channel!');
		}

		try {
			const guildIDData = options.active.get(message.guild.id);
			guildIDData.dispatcher.emit('finish');
		}
		catch (e) {
			logger.error(e.stack);
		}
	},
};
