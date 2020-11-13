module.exports = {
	name: 'clear',
	summary: 'Clears the song queue',
	description: 'Clears the song queue and makes the bot leave the voice channel.',
	category: 'music',
	aliases: ['stop'],
	args: false,
	usage: '',
	cooldown: 5,

	execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns, options) {
		if (!message.member.voice.channel)return message.reply('you are not in a voice channel.');
		
		try {
			const guildIDData = options.active.get(message.guild.id);
			guildIDData.queue = [];
			guildIDData.dispatcher.emit('finish');
			message.reply('cleared the queue.');
		}
		catch (error) {
			message.reply('there is no queue to clear.');
			return logger.error(error.stack);
		}
	},
};
