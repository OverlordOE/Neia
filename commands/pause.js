const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause or unpause the current playing song in your voice channel.'),

	execute(interaction, msgUser, msgGuild, client) {
		const data = client.music.active.get(interaction.guildId);

		if (!interaction.member.voice.channel) return interaction.reply({ content: 'You are not in a voice channel.', ephemeral: true });
		if (!data) return interaction.reply({ content: 'There are no songs to pause.', ephemeral: true });


		if (data.paused) {
			data.player.unpause();
			interaction.reply('Unpaused the current song.');
			data.paused = false;
		}
		else {
			data.player.pause();
			interaction.reply('Paused the current song.');
			data.paused = true;
		}
	},
};