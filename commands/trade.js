const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('trade')
		.setDescription('Trade items or money to other people')
		.addSubcommand(subcommand =>
			subcommand
				.setName('item')
				.setDescription('Trade an item')
				.addUserOption(option =>
					option
						.setName('target')
						.setDescription('The user you want to trade too.')
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('item')
						.setDescription('The item you want to trade.')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName('amount')
						.setDescription('The amount of items you want to trade.')
						.setRequired(true),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('money')
				.setDescription('Trade money')
				.addUserOption(option =>
					option
						.setName('target')
						.setDescription('The user you want to trade too.')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName('amount')
						.setDescription('The amount of items you want to trade.')
						.setRequired(true),
				)),

	async execute(interaction, msgUser, msgGuild, client) {

		const embed = new MessageEmbed()
			.setTitle('Neia Trading Center')
			.setFooter('You can only trade to people on the same server.', client.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		const target = interaction.options.getUser('target');
		const targetUser = await client.userManager.getUser(target.id);
		let amount = interaction.options.getInteger('amount');
		if (amount < 1) amount = 1;
		let item;


		if (interaction.options.getSubcommand() === 'item') {
			const tempItem = interaction.options.getString('item');
			item = client.util.getItem(tempItem);

			if (item) itemTrade();
			else {
				return interaction.reply({
					embeds: [embed.setDescription(`__**ITEM(S) NOT TRADED!**__
					__${tempItem}__ is not a valid item.`).setColor('#fc0303')], ephemeral: true,
				});
			}
		}
		else if (interaction.options.getSubcommand() === 'money') moneyTrade();

		function moneyTrade() {
			let balance = msgUser.balance;
			if (amount > balance) {
				return interaction.reply({
					embeds: [embed.setDescription(`__**MONEY NOT TRADED!**__
					You only have ${client.util.formatNumber(balance)}💰 but you need ${client.util.formatNumber(amount)}💰.`)
						.setColor('#fc0303')], ephemeral: true,
				});
			}

			balance = client.userManager.changeBalance(msgUser, -amount);
			client.userManager.changeBalance(targetUser, amount);
			return interaction.reply({
				embeds: [embed.setDescription(
					`Trade with *${target}* succesfull!\n\nTransferred ${client.util.formatNumber(amount)}💰 to *${target}*.
				Your current balance is ${client.util.formatNumber(balance)}💰`)
					.setColor('#00fc43')],
			});
		}

		async function itemTrade() {
			if (!await client.itemHandler.hasItem(msgUser, item, amount)) {
				return interaction.reply({
					embeds: [embed.setDescription(`__**ITEM(S) NOT TRADED!**__
					You don't have enough **${item.name}**.`)
						.setColor('#fc0303')], ephemeral: true,
				});
			}
			if (item.exchangeble) {
				const protectionItem = client.util.getItem('streak protection');
				if (item == protectionItem && !(await client.userManager.newProtectionAllowed(targetUser))) {
					return interaction.reply({
						embeds: [embed.setDescription(`__**ITEM(S) NOT TRADED!**__
					${target} already has a Streak Protection or it's on cooldown.`).setColor('#fc0303')], ephemeral: true,
					});
				}
				if (item.ctg == 'reaction') {
					const reaction = client.userManager.getReaction(msgUser);
					if (item.emoji == reaction.emoji) {
						msgUser.reaction = JSON.stringify({
							emoji: '✅',
							value: 1,
						});
						msgUser.save();
					}
				}


				client.itemHandler.addItem(targetUser, item, amount);
				client.itemHandler.removeItem(msgUser, item, amount);
				interaction.reply({
					embeds: [embed.setDescription(`Trade with *${target}* succesfull!
			\nTraded ${amount} ${item.emoji}__${item.name}__ to *${target}*.`)
						.setColor('#00fc43')],
				});
			}
			else return interaction.reply({ embeds: [embed.setDescription('You can\'t trade this item.').setColor('#fc0303')], ephemeral: true });

		}

	},
};

