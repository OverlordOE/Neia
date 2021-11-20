const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See the current queue of music.'),


	execute(interaction, msgUser, msgGuild, client) {
		const data = client.music.active.get(interaction.guildId);
		if (!data) return interaction.reply({ content: 'There are no songs in the queue.', ephemeral: true });

		const embed = new MessageEmbed()
			.setTitle('Neia Queue')
			.setColor('#f3ab16');

		const q = data.queue;

		for (let i = 0; i < q.length; i++) {
			if (data.paused) embed.addField('PAUSED', 'Use the `resume` command to unpause');
			if (i == 0) embed.addField(`Now playing: **${q[i].title}**`, `Channel: **${q[i].channel}**\nDuration: **${q[i].duration}**\nRequested by: ${q[i].requester}`);
			else embed.addField(`${i}: **${q[i].title}**`, `Channel: **${q[i].channel}**\nDuration: **${q[i].duration}**\nRequested by: ${q[i].requester}`);
		}
		interaction.reply({ embeds: [embed.setThumbnail(q[0].thumbnail)] });
	},
};