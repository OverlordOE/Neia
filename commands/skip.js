module.exports = {
	name: 'skip',
	summary: 'Skip a song',
	description: 'Skip a song.',
	category: 'music',
	aliases: ['next'],
	args: false,
	usage: '',

	execute(message, args, msgUser, character, guildProfile, client, logger, options) {
		if (!message.member.voice.channel) return message.reply('you are not in a voice channel.');
		if (!options.active.get(message.guild.id)) message.reply('there are no songs to skip.');
		return options.active.get(message.guild.id).dispatcher.emit('finish');
	},
};
