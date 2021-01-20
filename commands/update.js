module.exports = {
	name: 'update',
	description: '',
	category: 'debug',
	aliases: [],
	args: false,
	usage: '',

	async execute(message, args, msgUser, client, logger) {
		try {
			client.userCommands.map(async (u) => {
				const user = await client.userCommands.getUser(u.user_id);
				user.firstCommand = true;
				user.save();
			});
		} catch (error) {
			return logger.error(error.stack);
		}
	},
};

