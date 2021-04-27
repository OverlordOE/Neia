module.exports = {
	name: 'add',
	description: 'Adds money too the mentioned user.',
	category: 'debug',
	args: true,
	usage: '<money> <target>',


	async execute(message, args, msgUser, msgGuild, client, logger) {
		const amount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const target = message.mentions.users.first() || message.author;
		const targetUser = await client.userCommands.getUser(target.id);

		if (args[0] == 'all') {
			client.userCommands.map((user) => client.userCommands.addBalance(user, args[1]));
			return message.channel.send(`Added ${client.util.formatNumber(amount)} to every available user`);
		}
		else if (args[0] == 'item') {
			const item = client.util.getItem(args[1]);
			client.userCommands.addItem(targetUser, item, args[2]);
			return message.channel.send(`Added ${args[2]} __${args[1]}__ to ${target}`);
		}


		if (!amount || isNaN(amount)) return message.channel.send(`Sorry *${message.author}*, that's an invalid amount.`);

		client.userCommands.addBalance(targetUser, amount);
		const balance = client.util.formatNumber(targetUser.balance);

		if (amount <= 0) return message.channel.send(`Successfully removed ${client.util.formatNumber(amount * -1)}💰 from *${target}*. Their current balance is ${balance}💰`);
		return message.channel.send(`Successfully added ${client.util.formatNumber(amount)}💰 to *${target}*. Their current balance is ${balance}💰`);

	},
};