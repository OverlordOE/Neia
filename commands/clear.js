module.exports = {
	name: 'clear',
	summary: 'Clears the song queue',
	description: 'Clears the song queue and makes the bot leave the voice channel.',
	category: 'music',
	aliases: ['stop'],
	args: false,
	usage: '',
	cooldown: 5,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns, options) {
		if (!message.member.voice.channel) {
			return message.reply('You are not in a voice channel!');
		}

		try {
			const guildIDData = options.active.get(message.guild.id);
			guildIDData.queue = [];
			guildIDData.dispatcher.emit('finish');
		}
		catch (error) {
			return logger.error(error.stack);
		}
	},
};
