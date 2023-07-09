const { EmbedBuilder , SlashCommandBuilder} = require('discord.js');
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
		const embed = new EmbedBuilder()
			.setTitle('Neia Shop')
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));


		let amount = interaction.options.getInteger('amount');
		if (amount < 1 || !amount) amount = 1;
		const tempItem = interaction.options.getString('item');
		const item = client.util.getItem(tempItem);

		if (item) {
				const protectionItem = client.util.getItem('streak protection');
				if (item == protectionItem && !(await client.userManager.newProtectionAllowed(msgUser))) {
					return interaction.reply({
						embeds: [embed.setDescription('You can\'t buy Streak Protection.\nYou can only have 1 at a time and your cooldown should be worn off')
							.setColor('#fc0303')], ephemeral: true
					});
				}
				else await buyItem(amount);
		}
		else return interaction.reply({ embeds: [embed.setDescription(`__${tempItem}__ is not a valid item.`).setColor('#fc0303')], ephemeral: true });


		async function buyItem(buyAmount) {
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

			if (item.type == 'collectable') {
				const collectable = client.util.getCollectable(item.name);
				const canUnlock = await client.collectionOverseer.unlockCollectable(msgUser, collectable);
				if (canUnlock) {
					balance = client.userManager.changeBalance(msgUser, -cost);
					interaction.reply({
						embeds: [embed.setDescription(`**You've unlocked: ${collectable.emoji}__${collectable.name}__**!
						You can see it in your profile-collection tab.
						\nCurrent balance is ${client.util.formatNumber(balance)}💰.`).setColor('#00fc43')]
					});
				}
				else {
					return interaction.reply({
						embeds: [embed.setDescription(`
						__**COLLECTABLE NOT BOUGHT!**__
						You alread have ${item.emoji}${item.name}unlocked!
					`).setColor('#fc0303')]
					});
				}
			}
			else {
				client.itemHandler.addItem(msgUser, item, buyAmount);
				balance = client.userManager.changeBalance(msgUser, -cost);
				interaction.reply({
					embeds: [embed.setDescription(`
					You've bought: __${client.util.formatNumber(buyAmount)}__ ${item.emoji}__${item.name}(s)__.
					You can see it in your profile-inventory tab.
					\nCurrent balance is ${client.util.formatNumber(balance)}💰.`).setColor('#00fc43')]
				});
			}
		}
	},
};