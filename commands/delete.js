module.exports = {
	name: 'delete',
	description: 'Delete messages in bulk',
	admin: true,
	aliases: ['remove'],
	args: false,
	usage: '(amount of messaged to delete)',
	execute(msg, args, profile, bot, options, ytAPI, logger) {

		try {
			msg.delete();
			msg.channel.bulkDelete(args[0]);
			logger.log('info', `${msg.author.tag} deleted ${args[0]} messages in channel ${msg.channel.name}`);
		} 
		catch (e) {
			msg.channel.send('Something went wrong');
			logger.log('error', e);
		}
	},
};
