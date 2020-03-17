module.exports = {
	name: 'ban',
	description: 'test command',
	admin: true,
	aliases: [],
	args: false,
	usage: '',
	async execute(msg, args, apSheet) {
		const user = msg.mentions.users.first();
		// const target = msg.guild.members.get(user);
		const guildId = msg.guild;
		guildId.ban(user);
		return msg.channel.send(`Banned ${user}.`);
	},
};