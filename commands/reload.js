const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Play blackjack against Neia.')
		.addStringOption(option =>
			option
				.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),

	execute(interaction, msgUser, msgGuild, client, logger) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });


		const commandName = interaction.options.getString('command');
		const command = client.commands.get(commandName);
		if (!command) return interaction.reply(`There is no command with name \`${commandName}\`!`);

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			client.commands.set(newCommand.name.toLowerCase(), newCommand);
		}
		catch (e) {
			logger.error(e.stack);
			return interaction.reply(`There was an error while reloading a command \`${commandName}\`:\n\`${e.message}\``);
		}
		interaction.reply(`Command \`${command.name}\` was reloaded!`);
	},
};