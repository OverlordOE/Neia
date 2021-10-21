const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const items = require('../data/items');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Shows all the items you can buy.'),

	execute(interaction, msgUser, msgGuild, client) {

		let reactions = '__**Reactions:**__\n';
		let powerups = '__**Powerups:**__\n';
		let chests = '__**Chests:**__\n';
		let equipment = '__**Equipment:**__\n';

		Object.values(items).sort((a, b) => a.value - b.value).map((i) => {
			if (i.buyable) {
				if (i.ctg == 'reaction') reactions += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
				else if (i.ctg == 'powerup') powerups += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
				// else if (i.ctg == 'equipment') equipment += `${i.emoji}${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
			}
		});

		const description = `${powerups}\n${reactions}\n`;

		const embed = new MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(description)
			.setColor('#f3ab16')
			.setFooter('Use the items command to see the full item list.', client.user.displayAvatarURL({ dynamic: true }));

		return interaction.reply({ embeds: [embed] });
	},
};