const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const wait = require('util').promisify(setTimeout);
import { stripIndents } from 'common-tags';
module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play blackjack against Neia.')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount you want to gamble.')
				.setRequired(true))
		.addBooleanOption(option =>
			option
				.setName('allin')
				.setDescription('Wheter you\'re going broke today')
				.setRequired(false)),

	async execute(interaction, msgUser, msgGuild, client) {
		const payoutRate = 1.8;
		let gambleAmount = interaction.options.getInteger('amount');

		if (gambleAmount < 1) gambleAmount = 1;
		if (interaction.options.getBoolean('allin')) gambleAmount = msgUser.balance;
		if (gambleAmount > msgUser.balance) return interaction.reply({ content: `You don't have enough 💰.\n${client.util.formatNumber(gambleAmount - msgUser.balance)}💰 more needed.`, ephemeral: true });
		client.userManager.changeBalance(msgUser, -gambleAmount, true);


		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('hit')
					.setLabel('Hit')
					.setStyle(ButtonStyle.Success)
					.setEmoji('🃏'),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('stand')
					.setLabel('Stand')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('🖐️'),
			);


		const winAmount = payoutRate * gambleAmount;
		const suits = ['♠️', '♥️', '♦️', '♣️'];
		const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		let playerHandValue = 0;
		let neiaHandValue = 0;
		let cardsDrawn = 0;

		let playerHand = '';
		let neiaHand = '';
		for (let i = 0; i < 2; i++) {
			getCard('player');
			getCard('client');
		}

		let description = stripIndents`
		You have **bet** ${client.util.formatNumber(gambleAmount)}💰.\n
		${interaction.user.username}'s Hand: ${playerHand}
		${interaction.user.username}'s Hand Value: **${playerHandValue}**\n
		Neia's Hand: ${neiaHand}
		Neia's Hand Value: **${neiaHandValue}**`;

		const embed = new EmbedBuilder()
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setDescription(description)
			.setTitle('Blackjack');


		const filter = i => i.user.id == interaction.user.id;
		await interaction.reply({ embeds: [embed], components: [row] });
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async button => {
			switch (button.customId) {

				case 'hit':
					getCard('player');
					if (neiaHandValue < 17) getCard('client');
					await setEmbed(button);
					if (playerHandValue >= 21 || neiaHandValue > 21 || (neiaHandValue >= 17 && playerHandValue > neiaHandValue) || cardsDrawn >= 5) {
						collector.stop();
						return;
					}
					break;

				case 'stand':
					while (neiaHandValue < 17) {
						await wait(500);
						getCard('client');
						await setEmbed(button);
					}
					collector.stop();
					return;
			}
		});

		collector.on('end', async () => {
			if (playerHandValue > 21) {
				return await interaction.editReply({
					embeds: [embed.setDescription(description += `\n
					__**You busted!**__\n
					__**You lost**__ ${client.util.formatNumber(gambleAmount)}💰
					Your balance is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303')], components: []
				});
			}
			else if (neiaHandValue > 21) {
				const balance = client.userManager.changeBalance(msgUser, winAmount, true);
				return await interaction.editReply({
					embeds: [embed.setDescription(description += stripIndents`
					\n**Neia busted!. __You Win!__**\n
					You have won ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43')], components: []
				});
			}
			else if (cardsDrawn >= 5) {
				const balance = client.userManager.changeBalance(msgUser, winAmount, true);
				return await interaction.editReply({
					embeds: [embed.setDescription(description += stripIndents`
					\nYou have drawn **5 cards** without busting!\n__**You win**__\n
					You have won ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43')], components: []
				});
			}
			else if (neiaHandValue == playerHandValue) {
				const balance = client.userManager.changeBalance(msgUser, gambleAmount);
				return await interaction.editReply({
					embeds: [embed.setDescription(description += stripIndents`
				\n__**Its a draw!**__\n\nYour balance is ${client.util.formatNumber(balance)}💰`)], components: []
				});
			}
			else if (playerHandValue > neiaHandValue) {
				const balance = client.userManager.changeBalance(msgUser, winAmount, true);
				return await interaction.editReply({
					embeds: [embed.setDescription(description += stripIndents`
						\n__You win!__\n
						You have won ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43')], components: []
				});
			}
			else if (neiaHandValue > playerHandValue) {
				return await interaction.editReply({
					embeds: [embed.setDescription(description += stripIndents`
					\n__**Neia wins!**__\n
					__**You lost**__ ${client.util.formatNumber(gambleAmount)}💰\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303')], components: []
				});
			}
		});


		async function setEmbed(button) {
			description = stripIndents`
			You have **bet** ${client.util.formatNumber(gambleAmount)}💰.\n
			${interaction.user.username}'s Hand: ${playerHand}
			${interaction.user.username}'s Hand Value: **${playerHandValue}**\n
			Neia's Hand: ${neiaHand}
			Neia's Hand Value: **${neiaHandValue}**`;

			embed.setDescription(description);
			button.deferUpdate();
			await interaction.editReply({ embeds: [embed], components: [row] });
		}

		function getCard(player) {

			const suit = Math.floor((Math.random() * 4));
			const number = Math.floor((Math.random() * 13));

			let weight = parseInt(values[number]);
			if (values[number] == 'J' || values[number] == 'Q' || values[number] == 'K') weight = 10;
			if (values[number] == 'A') weight = 11;
			const card = {
				value: values[number],
				suit: suits[suit],
				weight: weight,
			};

			if (player == 'client') {
				if (card.value == 'A') {
					if ((neiaHandValue + 11) > 21) {
						neiaHand += `${card.suit}${card.value}(1) `;
						neiaHandValue += 1;
					}
					else {
						neiaHand += `${card.suit}${card.value}(11) `;
						neiaHandValue += card.weight;
					}
				}
				else {
					neiaHand += `${card.suit}${card.value} `;
					neiaHandValue += card.weight;
				}
			}
			else if (player == 'player') {
				cardsDrawn++;
				if (card.value == 'A') {
					if ((playerHandValue + 11) == 21
						|| (playerHandValue + 11) < 21 && (playerHandValue + 11) > neiaHandValue && neiaHandValue > 17
						|| ((playerHandValue + 11) < 21 && neiaHandValue < 17)) {

						playerHand += `${card.suit}${card.value}(11) `;
						playerHandValue += card.weight;
					}
					else {
						playerHand += `${card.suit}${card.value}(1) `;
						playerHandValue++;
					}
				}
				else {
					playerHand += `${card.suit}${card.value} `;
					playerHandValue += card.weight;
				}
			}
			return card;
		}
	},
};

