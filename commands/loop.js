module.exports = {
	name: 'loop',
	summary: 'Loops the current song',
	description: 'Loops the current song.',
	admin: false,
	aliases: ['repeat'],
	category: 'music',
	usage: '',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		if (!message.member.voice.channel) {
			return message.reply('You are not in a voice channel!');
		}
		const guildIDData = options.active.get(message.guild.id);
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
