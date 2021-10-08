const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setnumbergame')
		.setDescription('Set a channel for the Numbergame. REQUIRES MANAGE_CHANNELS PERMISSION!'),

	permissions: 'MANAGE_CHANNELS',

	async execute(interaction, msgUser, msgGuild, client, logger) {

		client.guildCommands.setNumberChannel(msgGuild, interaction.channel.id);
		return interaction.reply(`This channel has been set for the numbergame
		**Rules:**
		__- The same person can't count twice in a row.__
		__- Every number needs to be 1 higher then the last.__
		__- If you make a mistake after reaching a checkpoint you will be reverted to the checkpoint, after that the checkpoint is removed.__
		`);
	},
};