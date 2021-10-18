const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the music queue.'),


	execute(interaction, msgUser, msgGuild, client, logger) {
		const data = client.music.active.get(interaction.guildId);

		if (!data) return interaction.reply({ content: 'There are no songs in the queue.', ephemeral: true });
		if (!interaction.member.voice.channel) return interaction.reply({ content: 'You are not in a voice channel.', ephemeral: true });


		if (data) {
			data.queue = [];
			data.player.stop();
			interaction.reply('Queue has been cleared.');
		}
		else interaction.reply('There is no queue to cleared.');
	},
};
