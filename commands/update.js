module.exports = {
	name: 'update',
	description: '',
	category: 'debug',
	aliases: [],
	args: false,
	usage: '',


	async execute(message, args, msgUser, character, guildProfile, client, logger) {
		try {
			character.map(async (u) => {
				const user = await character.getUser(u.user_id);
				user.firstCommand = true;
				user.save();
			});
		} catch (error) {
			return logger.error(error.stack);
		}
	},
};

