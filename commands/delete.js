module.exports = {
	name: 'delete',
	summary: 'Delete messages in bulk',
	description: 'Delete up too 100 messages in bulk.',
	category: 'admin',
	aliases: ['remove'],
	args: false,
	usage: '<amount>',
	cooldown: 4,

	execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {

		const amount = args[0];
		if (isNaN(amount)) return msg.channel.send(`**${amount}** is not a valid number`);
		if (amount < 1 || amount > 100) return msg.channel.send('Input a number between 1 and 100');


		try {
			msg.delete();
			msg.channel.bulkDelete(amount);
			logger.log('info', `*${msg.author.tag}* deleted **${amount}** messages in channel ${msg.channel.name}`);
		}
		catch (error) {
			msg.channel.send('Something went wrong');
			return logger.error(error.stack);
		}
	},
};
