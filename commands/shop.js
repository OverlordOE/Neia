const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
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
			if (i.exchangeble) {
				if (i.ctg == 'reaction') reactions += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
				else if (i.ctg == 'powerup') powerups += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
				// else if (i.ctg == 'equipment') equipment += `${i.emoji}${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
			}
		});

		const embed = new MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`${reactions}`)
			.setColor('#f3ab16')
			.setFooter('Use the items command to see the full item list.', client.user.displayAvatarURL({ dynamic: true }));

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Reactions')
					.addOptions([
						{
							label: 'Reactions',
							description: 'Number reactions for the number game.',
							value: 'reactions',
						},
						{
							label: 'Powerups',
							description: 'Powerups for the number game',
							value: 'powerups',
						},
					]),
			);


		interaction.reply({ embeds: [embed], components: [row] });
		const filter = i => i.user.id == interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				if (i.values[0] === 'reactions') {
					row.components[0].setPlaceholder('Reactions');
					await i.update({ embeds: [embed.setDescription(`${reactions}`)], components: [row] });
				}
				else if (i.values[0] === 'powerups') {
					row.components[0].setPlaceholder('Powerups');
					await i.update({ embeds: [embed.setDescription(`${powerups}`)], components: [row] });
				}
			}
			else await i.followUp({ content: 'This menu isn\'t for you!', ephemeral: true });
		});

		collector.on('end', async () => await interaction.editReply({ embeds: [embed], components: [] }));

	},
};