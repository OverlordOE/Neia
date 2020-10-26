module.exports = {
	name: 'edituser',
	description: 'Edits target user.',
	category: 'debug',
	args: true,
	aliases: ['eu', 'edit'],
	usage: '<user> <field> <value>',
	cooldown: 0,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const target = await profile.getUser(message.mentions.users.first().id);
		try {

			if (args[1] == 'reset') {
				const user = await profile.getUser(message.author.id);
				user.destroy();
				return message.reply('Reset succesfull');
			}
			target[args[1]] = Number(args[2]);
			target.save();
		}
		catch (e) {
			message.reply('something went wrong');
			return logger.error(e.stack);
		}
		message.reply('Edit succesfull');
	},
};