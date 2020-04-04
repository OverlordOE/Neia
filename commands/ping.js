module.exports = {
	name: 'ping',
	description: 'Summon the mentioned user or just get a pong.',
	admin: false,
	aliases: ['summon'],
	args: false,
	usage: 'user',
	execute(msg, args) {
		if (!msg.mentions.users.size) {
			return msg.channel.send('pong');
		}

		const summon = msg.mentions.users.map(user => {
			return `${user.username}, you have been summoned by ${msg.author}`;
		});

		msg.delete();
		msg.channel.send(summon);
	},
};
