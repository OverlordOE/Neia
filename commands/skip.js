module.exports = {
	name: 'skip',
	summary: 'Skip a song',
	description: 'Skip a song.',
	category: 'music',
	aliases: ['next'],
	args: false,
	usage: '',

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}

		try {
			const guildIDData = options.active.get(msg.guild.id);
			guildIDData.dispatcher.emit('finish');
		}
		catch (e) {
			logger.error(e.stack);
		}
	},
};
