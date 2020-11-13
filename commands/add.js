module.exports = {
	name: 'add',
	description: 'Adds money too the mentioned user.',
	category: 'debug',
	args: true,
	usage: '<money> <target>',
	cooldown: 0,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const amount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const target = message.mentions.users.first() || message.author;
		const targetUser = await profile.getUser(target.id);

		if (args[0] == 'all') {
			profile.map((user) => profile.addMoney(user, args[1]));
			return message.channel.send(`Added ${profile.formatNumber(amount)} to every available user`);
		}
		else if (args[0] == 'item') {
			const item = profile.getItem(args[1]);
			profile.addItem(targetUser, item, args[2]);
			return message.channel.send(`Added ${args[2]} __${args[1]}__ to ${target}`);
		}


		if (!amount || isNaN(amount)) return message.channel.send(`Sorry *${message.author}*, that's an invalid amount.`);

		profile.addMoney(targetUser, amount);
		const balance = profile.formatNumber(targetUser.balance);

		if (amount <= 0) return message.channel.send(`Successfully removed ${profile.formatNumber(amount * -1)}💰 from *${target}*. Their current balance is ${balance}💰`);
		return message.channel.send(`Successfully added ${profile.formatNumber(amount)}💰 to *${target}*. Their current balance is ${balance}💰`);

	},
};