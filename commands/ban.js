module.exports = {
	name: 'ban',
	description: 'Bans mentioned user from the server',
	admin: true,
	aliases: [],
	args: true,
	usage: '{user} [reason]',
	async execute(msg, args) {
		const user = msg.mentions.users.first();
		const reason = msg.args[1];
		const guildId = msg.guild;
		try {
			guildId.ban(user);
		} catch (error) {
			return msg.channel.send(`Ban failed because of: ${error}`)
		}
		return msg.channel.send(`Banned ${user} for: ${reason}`);
	},
};