const { SlashCommandBuilder } = require('discord.js');
const numberEvent = require('../numberGame/numberevent');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('startevent')
		.setDescription('BOT OWNER DEBUG COMMAND'),

	execute(interaction, msgUser, msgGuild, client) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });

		numberEvent(client);
		return interaction.reply('New event started');
	},
};

