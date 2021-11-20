const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setDescription('Play blackjack against Neia.')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount you want to gamble.')
				.setRequired(true)),

	async execute(interaction, msgUser, msgGuild, client) {
		const payoutRate = 1.8;
		let gambleAmount = interaction.options.getInteger('amount');

		if (gambleAmount < 1) gambleAmount = 1;
		if (gambleAmount > msgUser.balance) return interaction.reply({ content: `You don't have enough 💰.\n${client.util.formatNumber(gambleAmount - msgUser.balance)}💰 more needed.`, ephemeral: true });
		client.userCommands.addBalance(msgUser, -gambleAmount, true);


		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('hit')
					.setLabel('Hit')
					.setStyle('SUCCESS')
					.setEmoji('🃏'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('stand')
					.setLabel('Stand')
					.setStyle('PRIMARY')
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

		const embed = new MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`You have **bet** ${client.util.formatNumber(gambleAmount)}💰.`)
			.setTitle('Blackjack')
			.setFooter('Use the buttons to play the game.', client.user.displayAvatarURL({ dynamic: true }))
			.spliceFields(0, 5, [
				{ name: 'Players Hand', value: playerHand.toString(), inline: true },
				{ name: 'Players Value', value: playerHandValue.toString(), inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Neia\'s Hand', value: neiaHand.toString(), inline: true },
				{ name: 'Neia\'s Value', value: neiaHandValue.toString(), inline: true },
			]);


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
					embeds: [embed.setDescription(`__**You busted!**__\n
			__**You lost**__ ${client.util.formatNumber(gambleAmount)}💰
			Your **balance** is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303')], components: []
				});
			}
			else if (neiaHandValue > 21) {
				const balance = client.userCommands.addBalance(msgUser, winAmount, true);
				return await interaction.editReply({
					embeds: [embed.setDescription(`__Neia busted!__. __**You Win!**__\n
				You have won **${client.util.formatNumber(winAmount)}💰** and your balance is **${client.util.formatNumber(balance)}💰**`).setColor('#00fc43')], components: []
				});
			}
			else if (cardsDrawn >= 5) {
				const balance = client.userCommands.addBalance(msgUser, winAmount, true);
				return await interaction.editReply({
					embeds: [embed.setDescription(`You have drawn **5 cards** without busting!\n__**You win**__\n
				**You have won ${client.util.formatNumber(winAmount)}**💰 and your **balance** is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43')], components: []
				});
			}
			else if (neiaHandValue == playerHandValue) {
				const balance = client.userCommands.addBalance(msgUser, gambleAmount);
				return await interaction.editReply({ embeds: [embed.setDescription(`__**Its a draw!**__\n\nYour **balance** is ${client.util.formatNumber(balance)}💰`)], components: [] });
			}
			else if (playerHandValue > neiaHandValue) {
				const balance = client.userCommands.addBalance(msgUser, winAmount, true);
				return await interaction.editReply({
					embeds: [embed.setDescription(`__You win!__\n
				You have won ${client.util.formatNumber(winAmount)}💰 and your **balance** is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43')], components: []
				});
			}
			else if (neiaHandValue > playerHandValue) {
				return await interaction.editReply({
					embeds: [embed.setDescription(`__**Neia wins!**__\n
			__**You lost**__ ${client.util.formatNumber(gambleAmount)}💰\nYour **balance** is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303')], components: []
				});
			}
		});


		async function setEmbed(button) {
			embed.spliceFields(0, 5, [
				{ name: 'Players Hand', value: playerHand.toString(), inline: true },
				{ name: 'Players Value', value: playerHandValue.toString(), inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Neia\'s Hand', value: neiaHand.toString(), inline: true },
				{ name: 'Neia\'s Value', value: neiaHandValue.toString(), inline: true },
			]);
			await button.update({ embeds: [embed], components: [row] });
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

