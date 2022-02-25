const items = require('../data/items');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('see the shop or details about a specific item.')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('The item you want to see.')),


	execute(interaction, msgUser, msgGuild, client) {
		const embed = new MessageEmbed();
		const tempItem = interaction.options.getString('item');

		if (tempItem) {
			const item = client.util.getItem(tempItem);
			if (!item) return interaction.reply({ embeds: [embed.setDescription(`__${tempItem}__ is not a valid item.`)], ephemeral: true });

			embed
				.setTitle(`${item.emoji}${item.name}`)
				.setDescription(item.description)
				.addField('Value', `${client.util.formatNumber(item.value)}💰`, true)
				.addField('Category', item.ctg.toString(), true)
				.setFooter('Use the command without arguments to see the item list', client.user.displayAvatarURL({ dynamic: true }));

			client.util.setEmbedRarity(embed, item.rarity);
		}

		else {
			let reactions = '__**Reactions:**__\n';
			let powerups = '__**Powerups:**__\n';
			let multipliers = '__**Multipliers:**__\n';

			Object.values(items).sort((a, b) => a.value - b.value)
				.map((i) => {
				if (i.ctg == 'powerup') powerups += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`;
				else if (i.ctg == 'multiplier') multipliers += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`; 
				else if (i.ctg == 'reaction') reactions += `${i.emoji} ${i.name}: ${client.util.formatNumber(i.value)}💰\n`; 
			});

			embed
				.setTitle('Neia Shop')
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`${multipliers}\n${powerups}\n${reactions}\n`)
				.setColor('#f3ab16');
		}

		return interaction.reply({ embeds: [embed] });
	},
};