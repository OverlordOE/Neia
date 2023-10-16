const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setguessinggame')
		.setDescription('Set a channel for the Guessing Game. REQUIRES MANAGE_CHANNELS PERMISSION!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

	async execute(interaction, msgUser, msgGuild, client) {

		const numberGameInfo = client.guildOverseer.getNumberGame(msgGuild);
		if (numberGameInfo.channelId) {
			client.guildOverseer.removeNumberGameChannel(msgGuild);
			return interaction.reply('Removed Numbergame from this server. All your progress is still saved');
		}

		if (client.guildOverseer.setNumberGameChannel(msgGuild, interaction.channel.id) == null) {
			interaction.reply('There is already a Number Game active in this channel. Remove the Number Game or make a new channel for the Guessing Game');
		}
		return interaction.reply(`set
		`).replace(/\t+/g, '');
	},
};