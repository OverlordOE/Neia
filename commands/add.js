module.exports = {
	name: 'add',
	description: 'Adds money too the mentioned user.',
	category: 'debug',
	args: true,
	usage: '<money> <target>',

	cooldown: 0,

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const amount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const target = msg.mentions.users.first() || msg.author;

		if (args[0] == 'all') {
			profile.map((user) => profile.addMoney(user.user_id, args[1]));
			return msg.channel.send(`Added **${amount}** to every available user`);
		}
		if (args[0] == 'char') {
			try {
				const char = await profile.getCharacter(args[1]);
				profile.addCharacter(target.id, char);
			} catch (e) {
				return logger.error(e.stack);
			}
			return msg.channel.send(`Added **${args[1]}** to ${target}`);
		}
		if (!amount || isNaN(amount)) return msg.channel.send(`Sorry *${msg.author}*, that's an invalid amount.`);

		profile.addMoney(target.id, amount);
		const balance = await profile.getBalance(target.id);

		if (amount <= 0) return msg.channel.send(`Successfully removed **${amount * -1}💰** from *${target}*. Their current balance is **${balance}💰**`);
		return msg.channel.send(`Successfully added **${amount}💰** to *${target}*. Their current balance is** ${balance}💰**`);

	},
};