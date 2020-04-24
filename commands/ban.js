module.exports = {
	name: 'ban',
	description: 'Bans mentioned user from the server',
	admin: true,
	args: true,
	usage: 'user reason',
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		
		
		const user = msg.mentions.users.first();
		const reason = msg.args[1];
		const guildId = msg.guild;
		try {
			guildId.members.ban(user);
		}
		catch (error) {
			logger.log('error', error);
			return msg.channel.send(`Ban failed because of: ${error}`);		
		}
		return msg.channel.send(`Banned ${user} for: ${reason}`);
	},
};