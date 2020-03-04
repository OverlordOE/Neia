module.exports = {
	name: 'ping',
	description: 'Ping!',
	aliases: ["PING"],
	args: false,
	usage: '<user>',
	execute(msg, args) {
		if (!msg.mentions.users.size) {
			return msg.channel.send('pong');
		}

		const summon = msg.mentions.users.map(user => {
			return `${user.username}, you have been summoned by ${msg.author}`;
		});

		msg.channel.send(summon);
	},
};
