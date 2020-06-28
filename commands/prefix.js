module.exports = {
	name: 'prefix',
	description: 'Change the prefix of the bot for this server.',
	category: 'admin',
	args: false,
	usage: '',
	aliases: [],
	cooldown: 3,

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		const id = msg.guild.id;

		if (args[0]) {
			const newPrefix = args[0];
			guildProfile.setPrefix(id, newPrefix);
			return msg.channel.send(`Changed the prefix for this server too: ${newPrefix}`);
		}
		const prefix = await guildProfile.getPrefix(id);
		return msg.channel.send(`The prefix for this server is: ${prefix}`);
	},
};