const Discord = require('discord.js');
module.exports = {
	name: 'Blackjack',
	summary: 'Play blackjack against Neia',
	description: 'Play blackjack against Neia.',
	category: 'gambling',
	aliases: ['black', 'jack', 'bj'],
	args: true,
	usage: '<gamble amount>',
	example: '100',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		let gambleAmount = 0;
		const payoutRate = 1.8;

		const embed = new Discord.MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium')
			.setFooter('Use the emojis to play the game.', client.user.displayAvatarURL({ dynamic: true }));


		for (let i = 0; i < args.length; i++) {
			if (!isNaN(parseInt(args[i]))) gambleAmount = parseInt(args[i]);
			else if (args[i] == 'all') gambleAmount = Math.floor(msgUser.balance);
		}

		if (gambleAmount < 1) gambleAmount = 1;

		if (!gambleAmount || isNaN(gambleAmount)) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, that's an invalid amount.`));
		if (gambleAmount > msgUser.balance) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, you only have ${client.util.formatNumber(msgUser.balance)}💰.`));
		if (gambleAmount <= 0) return message.channel.send(embed.setDescription(`Please enter an amount greater than zero, *${message.author}*.`));

		client.userCommands.addBalance(msgUser, -gambleAmount, true);


		const filter = (reaction, user) => {
			return ['🃏', '✅'].includes(reaction.emoji.name) && user.id === msgUser.user_id;
		};

		const winAmount = payoutRate * gambleAmount;
		const suits = ['♠️', '♥️', '♦️', '♣️'];
		const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		let playerHandValue = 0;
		let botHandValue = 0;
		let cardsDrawn = 0;
		let playerHand = '';
		let botHand = '';

		const sentMessage = await message.channel.send(embed
			.setDescription('[Click here for the rules](https://bicyclecards.com/how-to-play/blackjack/)\nPress 🃏 to hit or ✅ to stand.')
			.setTitle('Blackjack'));

		sentMessage.react('🃏'); // result 1
		sentMessage.react('✅'); // result 2

		const collector = sentMessage.createReactionCollector(filter, { time: 60000 });
		for (let i = 0; i < 2; i++) {
			getCard('player');
			getCard('client');
		}
		setEmbed();

		collector.on('collect', reaction => {
			reaction.users.remove(msgUser.user_id);

			switch (reaction.emoji.name) {

				case '🃏':
					reaction.users.remove(msgUser.user_id);
					getCard('player');
					if (botHandValue < 17) getCard('client');
					setEmbed();
					if (playerHandValue >= 21 || botHandValue > 21 || (botHandValue >= 17 && playerHandValue > botHandValue) || cardsDrawn >= 5) {
						collector.stop();
						return;
					}
					break;

				case '✅':
					while (botHandValue < 17) {
						getCard('client');
						setEmbed();
					}
					collector.stop();
					return;
			}
		});

		collector.on('end', () => {
			if (playerHandValue > 21) sentMessage.edit(embed.setDescription(`__You busted__\n\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303'));
			else if (botHandValue > 21) {
				const balance = client.userCommands.addBalance(msgUser, winAmount, true);
				sentMessage.edit(embed.setDescription(`__The bot busted__. You Win!\n\nYou won **${winAmount}💰** and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43'));
			}
			else if (cardsDrawn >= 5) {
				const balance = client.userCommands.addBalance(msgUser, winAmount, true);
				return sentMessage.edit(embed.setDescription(`You have drawn 5 cards without busting.\n__You win__\n\n**You won ${winAmount}**💰 and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43'));
			}
			else if (botHandValue == playerHandValue) {
				const balance = client.userCommands.addBalance(msgUser, gambleAmount);
				sentMessage.edit(embed.setDescription(`__Its a draw__\n\nYour balance is ${client.util.formatNumber(balance)}💰`));
			}
			else if (playerHandValue > botHandValue) {
				const balance = client.userCommands.addBalance(msgUser, winAmount, true);
				sentMessage.edit(embed.setDescription(`__You win__\n\nYou won ${winAmount}💰 and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43'));
			}
			else if (botHandValue > playerHandValue) sentMessage.edit(embed.setDescription(`__The bot wins__\n\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303'));

			sentMessage.reactions.removeAll();
		});


		function setEmbed() {
			embed.spliceFields(0, 5, [
				{ name: 'Player Hand', value: playerHand, inline: true },
				{ name: 'Player Value', value: playerHandValue, inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Bot Hand', value: botHand, inline: true },
				{ name: 'Bot Value', value: botHandValue, inline: true },
			]);
			sentMessage.edit(embed);
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
					if ((botHandValue + 11) > 21) {
						botHand += `${card.suit}${card.value}(1) `;
						botHandValue += 1;
					}
					else {
						botHand += `${card.suit}${card.value}(11) `;
						botHandValue += card.weight;
					}
				}
				else {
					botHand += `${card.suit}${card.value} `;
					botHandValue += card.weight;
				}
			}
			else if (player == 'player') {
				cardsDrawn++;
				if (card.value == 'A') {
					if ((playerHandValue + 11) == 21
					|| (playerHandValue + 11) < 21 && (playerHandValue + 11) > botHandValue && botHandValue > 17
					|| ((playerHandValue + 11) < 21 && botHandValue < 17)) {
					
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

