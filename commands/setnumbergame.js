const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setnumbergame')
		.setDescription('Set a channel for the Numbergame. REQUIRES MANAGE_CHANNELS PERMISSION!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

	async execute(interaction, msgUser, msgGuild, client) {

		const numberGameInfo = client.guildOverseer.getNumberGame(msgGuild);
		if (numberGameInfo.channelId) {
			client.guildOverseer.removeNumberGameChannel(msgGuild);
			return interaction.reply('Removed Numbergame from this server. All your progress is still saved');
		}

		if (client.guildOverseer.setNumberGameChannel(msgGuild, interaction.channel.id) == null) {
			return interaction.reply('There is already Guessing Game active in this channel. Remove the Guessing Game or make a new channel for the Numbergame');
		}
		return interaction.reply(`This channel has been set for the Numbergame
		**Rules:**
		__- The same person can't count twice in a row.__
		__- Every number needs to be 1 higher then the last.__
		__- If you make a mistake after reaching a checkpoint you will be reverted to the checkpoint, after that the checkpoint is removed.__
		__- Once every 2 hours an event randomly happens, the first person to claim this will make Neia count between 5 and 9 times for them.__
		

		**Rewards:**
		__- You get 💰 for every number you count.__
		__- The first time you count every hour gives a small bonus and once a day a big bonus.__
		__- You can get more 💰 by buying count multipliers.__
		`.replace(/\t+/g, ''));
	},
};