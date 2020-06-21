module.exports = {
	name: 'loop',
	description: 'Loops the current song.',
	admin: false,
	aliases: ['repeat'],
	args: false,
	usage: '',
	owner: false,
	music: true,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns, dbl) {
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
