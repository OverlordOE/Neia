const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('BOT OWNER DEBUG COMMAND'),

	execute(interaction, msgUser, msgGuild, client, logger) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });

		try {
			client.userCommands.map(async (u) => {
				const user = await client.userCommands.getUser(u.user_id);
				user.firstCommand = true;
				user.save();
			});
		}
		catch (error) {
			return logger.error(error.stack);
		}
	},
};

