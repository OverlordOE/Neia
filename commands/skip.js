const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current playing song in your voice channel.'),

	execute(interaction, msgUser, msgGuild, client) {
		if (!interaction.member.voice.channel) return interaction.reply({ content: 'You are not in a voice channel.', ephemeral: true });
		if (!client.music.active.get(interaction.guildId)) return interaction.reply({ content: 'There are no songs to skip.', ephemeral: true });

		client.music.active.get(interaction.guildId).player.stop();
		return interaction.reply('Song skipped!');
	},
};
