module.exports = {
	name: 'add',
	description: 'Adds money too the mentioned user.',
	owner: true,
	args: true,
	usage: 'money user',
	aliases: [],
	admin: false,
	music: false,
	cooldown: 0,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const transferTarget = msg.mentions.users.first() || msg.author;

		if (args[0] == 'all') {
			return profile.map( (user) => {
				profile.addMoney(user.user_id, args[1]);
			});
		}
		if (!transferAmount || isNaN(transferAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);

		profile.addMoney(transferTarget.id, transferAmount);
		const balance = await profile.getBalance(transferTarget.id);

		if (transferAmount <= 0) return msg.channel.send(`Successfully removed ${transferAmount * -1}💰 from ${transferTarget.tag}. Their current balance is ${balance}💰`);
		return msg.channel.send(`Successfully added ${transferAmount}💰 to ${transferTarget.tag}. Their current balance is ${balance}💰`);

	},
};