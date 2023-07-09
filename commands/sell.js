const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const sellPercentage = 0.8;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription(`Sell items to get ${sellPercentage * 100}% of your money back`)
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('The item you want to sell.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of items you want to sell.')),


	async execute(interaction, msgUser, msgGuild, client) {
		const embed = new EmbedBuilder()
			.setTitle('Neia Refunds')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16')
			.setFooter('.', client.user.displayAvatarURL({ dynamic: true }));

		let amount = interaction.options.getInteger('amount');
		if (amount < 1 || !amount) amount = 1;
		const tempItem = interaction.options.getString('item');
		const item = client.util.getItem(tempItem);

		if (item) {
			if (item.exchangeble) {
				if (await client.itemHandler.hasItem(msgUser, item, amount)) {
					const refundAmount = sellPercentage * item.value * amount;

					if (item.ctg == 'reaction' && item.emoji == msgUser.reaction) {
						msgUser.reaction = '✅';
						msgUser.save();
					}

					await client.itemHandler.removeItem(msgUser, item, amount);
					const balance = client.userManager.changeBalance(msgUser, refundAmount);

					interaction.reply({
						embeds: [embed.setDescription(`You've refunded ${amount} ${item.emoji}__${item.name}(s)__ and received ${client.util.formatNumber(refundAmount)}💰 back.
				Your balance is ${client.util.formatNumber(balance)}💰!`)
							.setColor('#00fc43')]
					});
				}
				else return interaction.reply({ embeds: [embed.setDescription(`__**ITEM(S) NOT SOLD!**__\nYou don't have enough ${item.emoji}__${item.name}(s)__!`).setColor('#fc0303')], ephemeral: true });
			}
			else return interaction.reply({ embeds: [embed.setDescription('You can\'t sell this item.').setColor('#fc0303')], ephemeral: true });
		}
		else return interaction.reply({ embeds: [embed.setDescription(`__**ITEM(S) NOT SOLD!**__\n__${tempItem}__ is not a valid item.`).setColor('#fc0303')], ephemeral: true });
	},
};