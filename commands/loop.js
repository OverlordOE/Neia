module.exports = {
	name: 'loop',
	description: 'Loops the current song.',
	admin: false,
	aliases: ['repeat'],
	args: false,
	usage: '',
	owner: false,
	music: true,

	async execute(msg, args, profile, bot, ops, ytAPI, logger, cooldowns) {
		if (!msg.member.voice.channel) {
			return msg.reply('You are not in a voice channel!');
		}
		const guildIDData = ops.active.get(msg.guild.id);
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
