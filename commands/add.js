module.exports = {
	name: 'add',
	description: 'Adds money too the mentioned user.',
	category: 'debug',
	args: true,
	usage: '<money> <target>',

	cooldown: 0,

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = msg.mentions.users.first() || msg.author;

		if (args[0] == 'all') {
			profile.map((user) => profile.addMoney(user.user_id, args[1]));
			return msg.channel.send(`Added **${transferAmount}** to every available user`);
		}
		if (!transferAmount || isNaN(transferAmount)) return msg.channel.send(`Sorry *${msg.author}*, that's an invalid amount.`);

		profile.addMoney(transferTarget.id, transferAmount);
		const balance = await profile.getBalance(transferTarget.id);

		if (transferAmount <= 0) return msg.channel.send(`Successfully removed **${transferAmount * -1}💰** from *${transferTarget}*. Their current balance is **${balance}💰**`);
		return msg.channel.send(`Successfully added **${transferAmount}💰** to *${transferTarget}*. Their current balance is** ${balance}💰**`);

	},
};