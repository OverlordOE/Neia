const { SlashCommandBuilder } = require('discord.js');
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
						.setDescription('BOT OWNER DEBUG COMMAND')
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
						.setDescription('BOT OWNER DEBUG COMMAND')
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
						.setDescription('BOT OWNER DEBUG COMMAND')),
		)


		// ? USER EDITS
		.addSubcommandGroup((group) =>
			group
				.setName('user')
				.setDescription('BOT OWNER DEBUG COMMAND')
				.addSubcommand(subcommand =>
					subcommand
						.setName('data')
						.setDescription('BOT OWNER DEBUG COMMAND')
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
						.setDescription('BOT OWNER DEBUG COMMAND')
						.addUserOption(option =>
							option
								.setName('target')
								.setDescription('The user')
								.setRequired(true),
						),
				),

		),

	async execute(interaction, msgUser, msgGuild, client) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });
		const command = interaction.options;

		try {
			// ? GUILD EDITS
			if (command.getSubcommandGroup() === 'guild') {
				const property = command.getString('property');
				const value = command.getInteger('value');

				if (command.getSubcommand() === 'reset') {
					client.guildOverseer.delete(msgGuild.guild_id);
					msgGuild.destroy();
					return interaction.reply('Guild reset succesfull');
				}
				else if (command.getSubcommand() === 'numbergame') {
					const numberGame = client.guildOverseer.getNumberGame(msgGuild);
					numberGame[property] = value;
					numberGame.lastUserId = null;
					client.guildOverseer.saveNumberGame(msgGuild, numberGame);
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
				const targetUser = await client.userManager.getUser(target.id);

				if (command.getSubcommand() === 'reset') {
					targetUser.destroy();
					client.userManager.delete(target.id);
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
			return client.logger.error(e.stack);
		}

	},
};