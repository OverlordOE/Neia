const items = require('../data/items');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('item')
		.setDescription('see the item list or details about a specific item.')
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
				.addField('exchangeble', item.exchangeble.toString(), true)
				.addField('Category', item.ctg.toString(), true)
				.setFooter('Use the command without arguments to see the item list', client.user.displayAvatarURL({ dynamic: true }));

			if (item.picture) {
				embed.attachFiles(`assets/items/${item.picture}`)
					.setImage(`attachment://${item.picture}`);
			}

			if (item.rarity == 'uncommon') embed.setColor('#1eff00');
			else if (item.rarity == 'rare') embed.setColor('#0070dd');
			else if (item.rarity == 'epic') embed.setColor('#a335ee');
			else if (item.rarity == 'legendary') embed.setColor('#ff8000');
			else embed.setColor('#eeeeee');
		}

		else {
			let reactions = '__**Reactions:**__\n';
			let powerups = '__**Powerups:**__\n';

			Object.values(items).sort((a, b) => {
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			}).map((i) => {

				if (i.ctg == 'reaction') reactions += `${i.emoji}${i.name}\n`;
				else if (i.ctg == 'powerup') powerups += `${i.emoji}${i.name}\n`;
			});

			embed
				.setTitle('Neia Item List')
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`${reactions}\n${powerups}\n`)
				.setColor('#f3ab16');
		}

		return interaction.reply({ embeds: [embed] });
	},
};