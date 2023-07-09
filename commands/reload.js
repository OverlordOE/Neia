const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('BOT OWNER DEBUG COMMAND.')
		.addStringOption(option =>
			option
				.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),

	execute(interaction, msgUser, msgGuild, client) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });
		const commandName = interaction.options.getString('command');

		try {
			const command = client.commands.get(commandName);
			let newCommand;

			if (command) {
				delete require.cache[require.resolve(`./${command.data.name}.js`)];
				newCommand = require(`./${command.data.name}.js`);
			}
			else newCommand = require(`./${commandName}.js`);

			if (newCommand) client.commands.set(newCommand.data.name.toLowerCase(), newCommand);
			else return interaction.reply({ content: `There is no command with name \`${commandName}\`!`, ephemeral: true });
		}
		catch (e) {
			client.logger.error(e.stack);
			return interaction.reply({ content: `There was an error while reloading a command \`${commandName}\`:\n\`${e.message}\``, ephemeral: true });
		}
		interaction.reply(`Command \`${commandName}\` was reloaded!`);
	},
};