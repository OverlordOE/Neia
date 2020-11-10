module.exports = {
	name: 'update',
	description: '',
	category: 'debug',
	aliases: [],
	args: false,
	usage: '',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		try {
			profile.map(async (u) => {
				const user = await profile.getUser(u.user_id);
				user.firstCommand = true;
				user.save();
			});
		} catch (error) {
			return logger.error(error.stack);
		}
	},
};

