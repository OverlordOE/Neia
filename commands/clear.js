module.exports = {
	name: 'clear',
	description: 'clears the song queue.',
	category: 'music',
	aliases: ['stop'],
	args: false,
	usage: '',
	cooldown: 5,

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}

		try {
			const guildIDData = options.active.get(msg.guild.id);
			guildIDData.queue = [];
			guildIDData.dispatcher.emit('finish');
		}
		catch (error) {
			return logger.error(error.stack);
		}
	},
};
