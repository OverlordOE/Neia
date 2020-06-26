module.exports = {
	name: 'delete',
	description: 'Delete messages in bulk.',
	admin: true,
	aliases: ['remove'],
	args: false,
	usage: '<amount>',
	owner: false,
	cooldown: 4,
	music: false,

	execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {

		const amount = args[0];
		if (isNaN(amount)) return msg.channel.send(`${amount} is not a valid number`);
		if (amount < 1 || amount > 100) return msg.channel.send('Input a number between 1 and 100');


		try {
			msg.delete();
			msg.channel.bulkDelete(amount);
			logger.log('info', `${msg.author.tag} deleted ${amount} messages in channel ${msg.channel.name}`);
		}
		catch (error) {
			msg.channel.send('Something went wrong');
			return logger.error(error.stack);
		}
	},
};
