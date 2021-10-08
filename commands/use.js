const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('use')
		.setDescription('Use an item from your inventory.')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('The item you want to use.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of items you want to use.')),


	async execute(interaction, msgUser, msgGuild, client, logger) {
		const embed = new MessageEmbed()
			.setTitle('Neia Item Use')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16')
			.setFooter('To see what an item does use the `item` command', client.user.displayAvatarURL({ dynamic: true }));


		let amount = interaction.options.getInteger('amount');
		if (amount < 1 || !amount) amount = 1;
		const tempItem = interaction.options.getString('item');
		const item = client.util.getItem(tempItem);


		if (item) {
			if (await client.userCommands.hasItem(msgUser, item, amount)) {

				if (item.use) {
					const result = await item.use(client, amount, embed, item, msgUser, msgGuild, interaction);

					if (result.succes) {
						client.userCommands.removeItem(msgUser, item, amount);
						return interaction.reply({ embeds: [embed.setDescription(result.message)] });
					}
					else if (result.message) return interaction.reply({ embeds: [embed.setDescription(result.message)] });
					else return interaction.reply({ embeds: [embed.setDescription('An error has occurred, please report this to OverlordOE#0717')], ephemeral: true });
				}

				else if (item.ctg == 'reaction') {
					msgUser.reaction = JSON.stringify({
						emoji: item.emoji,
						value: item.value,
					});
					msgUser.save();
					return interaction.reply({
						embeds: [embed.setDescription(`Number Game reaction **emoji** is now: ${item.emoji}
											It will add ${client.util.formatNumber(Math.sqrt(item.value))}💰 for each number counted.`)]
					});
				}
				// else if (item.ctg == 'chest') return interaction.reply({ embeds: [embed.setDescription('Please use the `open` command to use a chest'));
				else return interaction.reply({ embeds: [embed.setDescription(`There is no use for __${item.name}__ yet, the item was not used.`)], ephemeral: true });
			}
			else return interaction.reply({ embeds: [embed.setDescription(`You don't have enough __${item.emoji}${item.name}(s)__!`)], ephemeral: true });
		}
		else if (tempItem) return interaction.reply({ embeds: [embed.setDescription(`__${tempItem}__ is not a valid item.`)], ephemeral: true });
	},
};