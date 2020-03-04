module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'picture'],
	admin: false,
	description: 'Gets avatar of mentioned users, if there are no mentions it shows the senders avatar',
	args: false,
	usage: '<user>',
	execute(msg, args) {
		if (!msg.mentions.users.size) {
			return msg.channel.send(`Your avatar: <${msg.author.displayAvatarURL}>`);
		}

		const avatarList = msg.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL}>`;
		});

		msg.channel.send(avatarList);
	},
};
