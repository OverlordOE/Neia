module.exports = {
	name: 'optin',
	summary: 'Opt in to the pvp elements of the bot',
	description: 'Opt in to the pvp elements of the bot.',
	category: 'misc',
	aliases: ['pvp'],
	args: false,
	cooldown: 3600,
	usage: '',

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		const opt = await profile.getOptIn(msg.author.id);

		if (opt) {
			profile.setOptIn(msg.author.id, false);
			msg.reply('You are now opted out of pvp');
		}
		else {
			profile.setOptIn(msg.author.id, true);
			msg.reply('You are now opted in to pvp');
		}
	},
};