module.exports = {
	name: 'ping',
	description: 'Summon the mentioned user or just get a pong.',
	aliases: ['summon'],
	owner: false,
	admin: false,
	args: false,
	usage: 'user',
	music: false,

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
