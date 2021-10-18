const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('edit')
		.setDescription('BOT OWNER DEBUG COMMAND')

		// ? GUILD EDITS
		.addSubcommandGroup((group) =>
			group
				.setName('guild')
				.setDescription('Edit the current guild')
				.addSubcommand(subcommand =>
					subcommand
						.setName('data')
						.setDescription('Change the data of the guild')
						.addStringOption(option =>
							option
								.setName('property')
								.setDescription('The property to edit')
								.setRequired(true),
						)
						.addIntegerOption(option =>
							option
								.setName('value')
								.setDescription('The value to set')
								.setRequired(true),
						))
				.addSubcommand(subcommand =>
					subcommand
						.setName('numbergame')
						.setDescription('Change the numbergame in the guild')
						.addStringOption(option =>
							option
								.setName('property')
								.setDescription('The property to edit')
								.setRequired(true),
						)
						.addIntegerOption(option =>
							option
								.setName('value')
								.setDescription('The value to set')
								.setRequired(true),
						))
				.addSubcommand(subcommand =>
					subcommand
						.setName('reset')
						.setDescription('Resets the guild')),
		)


		// ? USER EDITS
		.addSubcommandGroup((group) =>
			group
				.setName('user')
				.setDescription('Edit the mentioned user')
				.addSubcommand(subcommand =>
					subcommand
						.setName('data')
						.setDescription('Change the data of the user')
						.addUserOption(option =>
							option
								.setName('target')
								.setDescription('The user')
								.setRequired(true),
						)
						.addStringOption(option =>
							option
								.setName('property')
								.setDescription('The property to edit')
								.setRequired(true),
						)
						.addIntegerOption(option =>
							option
								.setName('value')
								.setDescription('The value to set')
								.setRequired(true),
						))
				.addSubcommand(subcommand =>
					subcommand
						.setName('reset')
						.setDescription('Resets the user')
						.addUserOption(option =>
							option
								.setName('target')
								.setDescription('The user')
								.setRequired(true),
						),
				),

		),

	async execute(interaction, msgUser, msgGuild, client, logger) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });
		const command = interaction.options;

		try {
			// ? GUILD EDITS
			if (command.getSubcommandGroup() === 'guild') {
				const property = command.getString('property');
				const value = command.getInteger('value');

				if (command.getSubcommand() === 'reset') {
					client.guildCommands.delete(msgGuild.guild_id);
					msgGuild.destroy();
					return interaction.reply('Guild reset succesfull');
				}
				else if (command.getSubcommand() === 'numbergame') {
					const numberGame = client.guildCommands.getNumberGame(msgGuild);
					numberGame[property] = value;
					numberGame.lastUserId = null;
					client.guildCommands.saveNumberGameInfo(msgGuild, numberGame);
					return interaction.reply('Numbergame edit succesfull');
				}
				else if (command.getSubcommand() === 'data') {
					msgGuild[property] = value;
					msgGuild.save();
					interaction.reply('Guild data edit succesfull');
				}
			}
			else if (command.getSubcommandGroup() === 'user') {
				const target = interaction.options.getUser('target');
				const targetUser = await client.userCommands.getUser(target.id);

				if (command.getSubcommand() === 'reset') {
					targetUser.destroy();
					client.userCommands.delete(target.id);
					return interaction.reply('User reset succesfull');
				}
				else if (command.getSubcommand() === 'data') {
					const property = command.getString('property');
					const value = command.getInteger('value');
					targetUser[property] = value;
					targetUser.save();
					interaction.reply('User data edit succesfull');
				}
			}
		}
		catch (e) {
			interaction.reply({ content: 'something went wrong', ephemeral: true });
			return logger.error(e.stack);
		}

	},
};