module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'picture'],
	admin: false,
	description: 'Gets avatar of mentioned users, if there are no mentions it shows the senders avatar.',
	args: false,
	usage: 'user',
	owner: false,
	music: false,
	
	execute(msg, args) {
		const target = msg.mentions.users.first() || msg.author;
		const avatar = target.displayAvatarURL();
		msg.channel.send(`${target.tag}'s avatar: <${avatar}>`);
	},
};
