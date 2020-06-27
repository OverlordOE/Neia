module.exports = {
	name: 'optin',
	description: 'Opt in to the pvp elements of the bot.',
	admin: false,
	aliases: ['pvp'],
	args: false,
	cooldown: 3600,
	owner: false,
	usage: '',
	music: false,

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