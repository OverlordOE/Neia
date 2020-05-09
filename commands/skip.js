module.exports = {
	name: 'skip',
	description: 'Skip a song.',
	admin: false,
	aliases: ['next'],
	args: false,
	usage: '',
	owner: false,
	music: true,
	
	async execute(msg, args, profile, bot, ops, ytAPI, logger, cooldowns) {
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}

		try {
			const guildIDData = ops.active.get(msg.guild.id);
			guildIDData.dispatcher.emit('finish');
		}
		catch (error) {
			logger.log('error', error);
		}
	},
};
