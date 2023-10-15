module.exports = {
	async interaction(interaction, client) {
		if (
			!interaction.isCommand() ||
			interaction.isMessageComponent() ||
			interaction.isButton() ||
			interaction.channel.type == "DM"
		) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		const guild = await client.guildOverseer.getGuild(interaction.guildId);
		const id = interaction.user.id;
		const user = await client.userManager.getUser(id);
		user.author = interaction.user;


		// Execute Command
		client.logger.info(
			`${interaction.user.tag} called "${interaction.commandName}" in "${interaction.guild.name}#${interaction.channel.name}".`
		);

		try {
			await command.execute(interaction, user, guild, client);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
};