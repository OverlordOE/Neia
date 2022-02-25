const collectables = require('../data/collectables');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('collectables')
		.setDescription('see the collectable list or details about a specific collectables.')
		.addStringOption(option =>
			option
				.setName('collectable')
				.setDescription('The collectable you want to see.')),


	execute(interaction, msgUser, msgGuild, client) {
		const embed = new MessageEmbed();
		const tempCollectable = interaction.options.getString('collectable');

		if (tempCollectable) {
			const collectable = client.util.getCollectable(tempCollectable);
			if (!collectable) return interaction.reply({ embeds: [embed.setDescription(`__${tempCollectable}__ is not a valid collectable.`)], ephemeral: true });

			embed
				.setTitle(`${collectable.emoji}${collectable.name}`)
				.setDescription(collectable.description)
				.addField('Category', collectable.ctg.toString(), true)
				.setFooter('Use the command without arguments to see the item list', client.user.displayAvatarURL({ dynamic: true }));

			client.util.setEmbedRarity(embed, collectable.rarity);
		}

		else {
			let reactions = '__**Reactions:**__\n';
			let multipliers = '__**Count Multipliers:**__\n';

			Object.values(collectables).sort((a, b) => {
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			}).map((i) => {

				if (i.ctg == 'reaction') reactions += `${i.emoji}${i.name}\n`;
				else if (i.ctg == 'multiplier') multipliers += `${i.emoji}${i.name}\n`;
			});

			embed
				.setTitle('Neia Collectable List')
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`${reactions}\n${multipliers}\n`)
				.setColor('#f3ab16');
		}

		return interaction.reply({ embeds: [embed] });
	},
};