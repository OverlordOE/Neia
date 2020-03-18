module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'picture'],
	admin: false,
	description: 'Gets avatar of mentioned users, if there are no mentions it shows the senders avatar',
	args: false,
	usage: 'user',
	execute(msg, args) {
		const target = msg.mentions.users.first() || msg.author;

		msg.channel.send(`${target.tag}'s avatar: <${target.displayAvatarURL}>`);
	},
};
