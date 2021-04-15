const Discord = require('discord.js');
module.exports = {
	name: 'Gamble',
	summary: 'Gives you a list of minigames to play',
	description: 'Play 1 of 4 minigames Rock, paper, scissors; Number guessing ,Blackjack or Fruit Slots.',
	category: 'misc',
	aliases: ['guess'],
	args: true,
	usage: '<gamble amount> <minigame>',
	example: '100 blackjack',

	execute(message, args, msgUser, msgGuild, client, logger) {
		const icons = ['✂️', client.emojiCharacters[5], '🃏', '🍒'];
		let gambleType = '';
		let gambleAmount = 0;
		const rpsRate = 1.80;
		const numberRate = 3.2;
		const blackjackRate = 2;
		const slotsRate = 6.5;

		let filter = (reaction, user) => {
			return icons.includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const embed = new Discord.MessageEmbed()
			.setColor(client.userCommands.getColour(msgUser))
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium')
			.setFooter('Use the emojis to choose your game.', client.user.displayAvatarURL({ dynamic: true }));


		for (let i = 0; i < args.length; i++) {
			if (!(isNaN(args[i]))) gambleAmount = parseInt(args[i]);
			else if (args[i] == 'all') gambleAmount = Math.floor(msgUser.balance);
			else if (gambleType.length > 2) gambleType += ` ${args[i]}`;
			else gambleType += `${args[i]}`;
		}

		if (!gambleAmount || isNaN(gambleAmount)) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, that's an invalid amount.`));
		if (gambleAmount > msgUser.balance) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, you only have ${client.util.formatNumber(msgUser.balance)}💰.`));
		if (gambleAmount <= 0) return message.channel.send(embed.setDescription(`Please enter an amount greater than zero, *${message.author}*.`));

		client.userCommands.addBalance(msgUser, -gambleAmount, true);

		if (gambleType == 'rock' || gambleType == 'rps' || gambleType == 'rock paper scissors' || gambleType == 'r') RPS();
		else if (gambleType == 'number' || gambleType == 'numbers') oneInFive();
		else if (gambleType == 'blackjack' || gambleType == 'jack' || gambleType == 'black' || gambleType == 'bj') blackjack();
		else if (gambleType == 'fruit' || gambleType == 'fruits' || gambleType == 'fruitslots' || gambleType == 'slots' || gambleType == 's') fruitSlots();

		else {
			message.channel.send(embed.setDescription(`You can play the following games:\n

							${client.emojiCharacters[5]}__**Number Guessing**__\n
							Guess which number is correct, guess right and you win.\n
							Potential winnings: ${client.util.formatNumber(numberRate * gambleAmount)}💰\n

							✂️__**Rock, paper, scissors**__\n
							Play a game of __Rock, Paper, Scissors__ against the bot and see who is superior.\n
							Potential winnings: ${client.util.formatNumber(rpsRate * gambleAmount)}💰

							🃏__**Blackjack**__\n
							Play a game of __Blackjack__ against the bot and test your luck.\n
							Potential winnings: ${client.util.formatNumber(blackjackRate * gambleAmount)}💰

							🍒__**Fruitslots**__\n
							Test your fruity luck with __Fruitslots__.\n
							Potential winnings: ${client.util.formatNumber(slotsRate * gambleAmount)}💰
						
							Press one of the emojis below to start a game.
					`))
				.then(sentMessage => {
					for (let i = 0; i < icons.length; i++) sentMessage.react(icons[i]);

					sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
						.then(collected => {
							const reaction = collected.first();

							if (reaction.emoji.name == client.emojiCharacters[5]) oneInFive(sentMessage);
							else if (reaction.emoji.name == '✂️') RPS(sentMessage);
							else if (reaction.emoji.name == '🃏') blackjack(sentMessage);
							else if (reaction.emoji.name == '🍒') fruitSlots(sentMessage);

							sentMessage.delete();
						})
						.catch(error => {
							message.reply('You failed to react in time.');
							return sentMessage.reactions.removeAll();
						});
				});
		}


		async function oneInFive() {
			filter = (reaction, user) => {
				return [client.emojiCharacters[1], client.emojiCharacters[2], client.emojiCharacters[3], client.emojiCharacters[4], client.emojiCharacters[5]]
					.includes(reaction.emoji.name) && user.id === msgUser.user_id;
			};

			const answer = Math.floor((Math.random() * 5) + 1);
			const winAmount = numberRate * gambleAmount;

			const sentMessage = await message.channel.send(embed.setDescription('Guess the number between 1 and 5.').setTitle('Numbers Guessing'));
			for (let i = 1; i < 6; i++) sentMessage.react(client.emojiCharacters[i]);

			sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();

					if (reaction.emoji.name === client.emojiCharacters[answer]) {
						const balance = client.userCommands.addBalance(msgUser, winAmount, true);
						embed.setColor('#00fc43');
						sentMessage.edit(embed.setDescription(`Correct! You have successfully won ${client.util.formatNumber(winAmount)}💰.\nYour current balance is ${client.util.formatNumber(balance)}💰`));
					}
					else {
						embed.setColor('#fc0303');
						sentMessage.edit(embed.setDescription(`The correct answer was __${answer}__. You lost ${client.util.formatNumber(gambleAmount)}💰.\nYour current balance is ${client.util.formatNumber(msgUser.balance)}💰`));
					}
					return sentMessage.reactions.removeAll();
				});
		}

		async function blackjack() {
			filter = (reaction, user) => {
				return ['🃏', '✅'].includes(reaction.emoji.name) && user.id === msgUser.user_id;
			};

			const winAmount = blackjackRate * gambleAmount;
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
					{ name: 'Bot Hand', value: botHand, inline: true },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Player Value', value: playerHandValue, inline: true },
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
						if ((playerHandValue + 11) < 21 && (playerHandValue + 11) > botHandValue && botHandValue > 17 || ((playerHandValue + 11) < 21 && botHandValue < 17) || (playerHandValue + 11) == 21) {
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
		}

		async function RPS() {
			const symbols = ['✊', '🧻', '✂️'];
			filter = (reaction, user) => {
				return symbols.includes(reaction.emoji.name) && user.id === msgUser.user_id;
			};

			const botAnswer = Math.floor(Math.random() * symbols.length);
			const winAmount = rpsRate * gambleAmount;

			const sentMessage = await message.channel.send(embed.setDescription('Choose Rock✊, Paper🧻 or Scissors✂️!').setTitle('Rock, Paper, Scissors'));
			for (let i = 0; i < symbols.length; i++) sentMessage.react(symbols[i]);


			sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();
					const userAnswer = symbols.indexOf(reaction.emoji.name);

					if (userAnswer === botAnswer) {
						const balance = client.userCommands.addBalance(msgUser, gambleAmount);
						sentMessage.edit(embed.setDescription(`The bot chooses ${symbols[botAnswer]}. __It's a tie!__\nYour balance is ${client.util.formatNumber(balance)}💰`));
					}
					else if (botAnswer - userAnswer === 1 || botAnswer - userAnswer === -2) {
						sentMessage.edit(embed.setDescription(`The bot chooses ${symbols[botAnswer]}. __You lose!__\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303'));
					}
					else if (userAnswer - botAnswer === 1 || userAnswer - botAnswer === -2) {
						const balance = client.userCommands.addBalance(msgUser, winAmount, true);
						sentMessage.edit(embed.setDescription(`The bot chooses ${symbols[botAnswer]}. __You Win!__\nYou won ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43'));
					}
					return sentMessage.reactions.removeAll();
				})
				.catch(() => sentMessage.reactions.removeAll());
		}

		async function fruitSlots() {
			const icons = ['🍓', '🍉', '🍒', '🍌', '🍋'];
			const slots = [];
			const slotX = 3;
			const slotY = 3;
			let output = `Get **${slotX}** of the same in a row to win.\n\n`;
			let count = 0;
			let rowsWon = 0;

			for (let i = 0; i < slotY; i++) {
				slots[i] = [];
				for (let j = 0; j < slotX; j++) {
					const slotIcon = icons[Math.floor(Math.random() * icons.length)];
					slots[i][j] = slotIcon;
				}
			}
			const sentMessage = await message.channel.send(embed.setDescription(output));
			setEmbed();

			function checkWins() {
				if (slots[count].every((val, g, arr) => val === arr[0])) {
					rowsWon++;
					output += '**X**';
				}
				else output += 'x';
			}

			function checkVerticalWins(column) {
				let win = true;
				const tempIcon = slots[0][column];

				for (let i = 0; i < slotY; i++)
					if (slots[i][column] != tempIcon) win = false;

				return win;
			}

			function endGame() {
				if (rowsWon >= 1) {
					const winAmount = gambleAmount * slotsRate * rowsWon;
					const balance = client.userCommands.addBalance(msgUser, winAmount, true);
					output += `\n\n__**You won**__ **${rowsWon}** row(s)!\nYou gained ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`;
				}
				else output += `\n\n__**You lost**__\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`;

				sentMessage.edit(embed.setDescription(output));
			}

			function setEmbed() {
				for (let j = 0; j < slots[count].length; j++) output += slots[count][j];

				checkWins();
				output += '\n';
				sentMessage.edit(embed.setDescription(output));

				count++;
				if (count < slotY) {
					setTimeout(() => setEmbed(), 1500);
				}
				else {
					for (let i = 0; i < slotX; i++) {
						if (checkVerticalWins(i)) {
							rowsWon++;
							output += '**.X.**';
						}
						else output += '..x..';
					}
					endGame();
				}
			}


		}
	},
};

