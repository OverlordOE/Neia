const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setguessinggame')
		.setDescription('Set a channel for the Guessing Game. REQUIRES MANAGE_CHANNELS PERMISSION!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

	async execute(interaction, msgUser, msgGuild, client) {

		const guessingGameInfo = client.guildOverseer.getGuessingGame(msgGuild);
		
		const channelId = guessingGameInfo.channelId || null;
		if (channelId) {
			client.guildOverseer.removeGuessingGameChannel(msgGuild);
			return interaction.reply('Removed Guessing Game from this server. All your progress is still saved');
		}

		const succes = client.guildOverseer.setGuessingGameChannel(msgGuild, interaction.channel.id);
		if (succes == null) {
			return interaction.reply('There is already a Number Game active in this channel. Remove the Number Game or make a new channel for the Guessing Game');
		}

		return interaction.reply(`It has been done`.replace(/\t+/g, ''));
	},
};