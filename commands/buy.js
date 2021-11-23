const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy an item from the shop.')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('The item you want to buy.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of items you want to buy.')),


	async execute(interaction, msgUser, msgGuild, client) {
		const embed = new MessageEmbed()
			.setTitle('Neia Shop')
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));


		let amount = interaction.options.getInteger('amount');
		if (amount < 1 || !amount) amount = 1;
		const tempItem = interaction.options.getString('item');
		const item = client.util.getItem(tempItem);

		if (item) {

			if (item.exchangeble) {
				const protectionItem = client.util.getItem('streak protection');
				if (item == protectionItem && !(await client.userManager.newProtectionAllowed(msgUser))) {
					return interaction.reply({
						embeds: [embed.setDescription('You can\'t buy Streak Protection.\nYou can only have 1 at a time and your cooldown should be worn off')
							.setColor('#fc0303')], ephemeral: true
					});
				}
				else buyItem(amount);
			}
			else if (item) return interaction.reply({ embeds: [embed.setDescription('You can\'t buy this item.').setColor('#fc0303')], ephemeral: true });

		}
		else return interaction.reply({ embeds: [embed.setDescription(`__${tempItem}__ is not a valid item.`).setColor('#fc0303')], ephemeral: true });

		function buyItem(buyAmount) {
			let balance = msgUser.balance;
			const cost = buyAmount * item.value;
			if (cost > balance) {
				return interaction.reply({
					embeds: [embed.setDescription(`
					__**ITEM(S) NOT BOUGHT!**__
					You currently have ${client.util.formatNumber(balance)}💰 but __${client.util.formatNumber(buyAmount)}__ ${item.emoji}${item.name}(s) costs ${client.util.formatNumber(cost)}💰!
					You need ${client.util.formatNumber(cost - balance)}💰 more.
					`).setColor('#fc0303')]
				});
			}
			client.itemHandler.addItem(msgUser, item, buyAmount);
			balance = client.userManager.addBalance(msgUser, -cost);

			interaction.reply({
				embeds: [embed.setDescription(`You've bought: __${client.util.formatNumber(buyAmount)}__ ${item.emoji}__${item.name}(s)__.
				\nCurrent balance is ${client.util.formatNumber(balance)}💰.`).setColor('#00fc43')]
			});
		}
	},
};