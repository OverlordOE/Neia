module.exports = {
	name: 'loop',
	summary: 'Loops the current song',
	description: 'Loops the current song.',
	admin: false,
	aliases: ['repeat'],
	category: 'music',
	usage: '',


	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}
		const guildIDData = options.active.get(msg.guild.id);
		if (guildIDData.loop) {
			msg.channel.send('Stopped looping music');
			guildIDData.loop = false;
		}
		else if (!guildIDData.loop) {
			msg.channel.send('Looping music');
			guildIDData.loop = true;
		}

	},
};
