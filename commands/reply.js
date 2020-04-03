module.exports = {
	name: 'reply',
	description: 'test command',
	admin: false,
	args: false,
	usage: 'reply',
	async execute(msg, args, profile) {
		const filter = m => m.author.id === msg.author.id

		msg.channel.send("Send something").then(() => {
			msg.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
				.then(collected => {
					msg.channel.send(`${collected.first()} is what you send!`);
				})
				.catch(collected => {
					msg.channel.send('Looks like nobody answered in time.');
				});
		})
	},
};