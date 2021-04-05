module.exports = {
	name: 'Setchannel',
	summary: 'Set a channel for a specific purpose',
	description: 'Set a channel for a specific purpose, like the numbergame',
	category: 'admin',
	args: false,
	usage: '',
	aliases: ['sc'],
	permissions: 'MANAGE_GUILD',
	example: '',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		client.guildCommands.setNumberChannel(msgGuild, message.channel.id);
		return message.channel.send(`This channel has been set for the numbergame
		Rules:
		- The same person can't count twice in a row.
		- Every number needs to be 1 higher then the last.`);
	},
};