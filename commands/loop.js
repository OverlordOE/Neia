module.exports = {
	name: 'loop',
	summary: 'Loops the current song',
	description: 'Loops the current song.',
	aliases: ['repeat'],
	category: 'music',
	usage: '',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns, options) {
		if (!message.member.voice.channel) return message.reply('you are not in a voice channel.');

		const guildIDData = options.active.get(message.guild.id);
		if (!guildIDData) message.reply('you need to queue a song before looping.');

		if (guildIDData.loop) {
			message.channel.send('Stopped looping music');
			guildIDData.loop = false;
		}
		else if (!guildIDData.loop) {
			message.channel.send('Looping music');
			guildIDData.loop = true;
		}

	},
};
