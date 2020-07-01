module.exports = {
	name: 'opt',
	summary: 'Opt in to the pvp elements of the bot',
	description: 'Opt in to the pvp elements of the bot.',
	category: 'misc',
	aliases: ['pvp'],
	args: false,
	cooldown: 86400,
	usage: '',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const opt = args[0];


		if (opt == 'out') {
			profile.setOpt(msg.author.id, false);
			msg.reply('You are now opted out of pvp');
		}
		else if (opt == 'in') {
			profile.setOpt(msg.author.id, true);
			msg.reply('You are now opted in to pvp');
		}
		else msg.reply('Please use `opt in` to opt in or `opt out` to opt out');
	},
};