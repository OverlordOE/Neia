module.exports = {
	name: 'clear',
	description: 'clears the song queue.',
	admin: false,
	aliases: ['stop'],
	args: false,
	async execute(msg, args, profile, bot, ops, ytAPI, logger) {
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}

		try {
			const guildIDData = ops.active.get(msg.guild.id);
			guildIDData.queue = [];
			guildIDData.dispatcher.emit('finish');
		}
		catch (error) {
			logger.log('error', error);
		}
	},
};
