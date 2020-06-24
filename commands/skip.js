module.exports = {
	name: 'skip',
	description: 'Skip a song.',
	admin: false,
	aliases: ['next'],
	args: false,
	usage: '',
	owner: false,
	music: true,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}

		try {
			const guildIDData = options.active.get(msg.guild.id);
			guildIDData.dispatcher.emit('finish');
		}
		catch (error) {
			logger.log('error', error);
		}
	},
};
