const Discord = require('discord.js');
module.exports = {
	name: 'Gamble',
	summary: 'Gives you a list of minigames to play',
	description: 'Play 1 of 3 minigames Rock, paper, scissors; Number guessing or Blackjack.',
	category: 'misc',
	aliases: ['guess'],
	args: false,
	usage: '<minigame>',
	example: 'blackjack',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		const avatar = message.author.displayAvatarURL({ dynamic: true });
		let gambleType = '';

		const filter = (reaction, user) => {
			return ['✂️', client.emojiCharacters[5], '🃏'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const embed = new Discord.MessageEmbed()
			.setColor(client.userCommands.getColour(msgUser))
			.setThumbnail(avatar)
			.setTitle('Neia\'s Gambling Imporium')
			.setFooter('Use the emojis to choose your game.', client.user.displayAvatarURL({ dynamic: true }));


		await message.channel.send(embed)
			.then(sentMessage => {

				for (let i = 0; i < args.length; i++) {
					if (gambleType.length > 2) gambleType += ` ${args[i]}`;
					else gambleType += `${args[i]}`;
				}

				if (gambleType == 'rock' || gambleType == 'rps' || gambleType == 'rock paper scissors' || gambleType == 'r') RPS(msgUser, logger, sentMessage, embed);
				else if (gambleType == 'number' || gambleType == 'numbers') oneInFive(msgUser, logger, sentMessage, embed, client);
				else if (gambleType == 'blackjack' || gambleType == 'jack' || gambleType == 'black') blackjack(msgUser, logger, sentMessage, embed);

				else {
					sentMessage.edit(embed.setDescription(`You can play the following games:\n

							${client.emojiCharacters[5]}__Number Guessing__\n 
							Guess which number is correct, guess right and you win.\n
					
							✂️__Rock, paper, scissors__\n
							Play a game of rock, paper, scissors against the bot and see who is superior.\n
							
							🃏__Blackjack__\n
							Play a game of blackjack against the bot and test your luck.\n
						
							Press one of the emojis below to start a game.
					`));
					sentMessage.react('✂️');
					sentMessage.react(client.emojiCharacters[5]);
					sentMessage.react('🃏');

					sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
						.then(async collected => {
							const reaction = collected.first();

							sentMessage.reactions.removeAll();
							if (reaction.emoji.name == client.emojiCharacters[5]) oneInFive(msgUser, logger, sentMessage, embed, client);
							else if (reaction.emoji.name == '✂️') RPS(msgUser, logger, sentMessage, embed);
							else if (reaction.emoji.name == '🃏') blackjack(msgUser, logger, sentMessage, embed);
						})
						.catch(error => {
							message.reply('You failed to react in time.');
							sentMessage.reactions.removeAll();
							return logger.error(error.stack);
						});
				}
			})
			.catch(error => {
				logger.log('error', `One of the emojis failed to react because of:\n${error.info}`);
				return message.reply('One of the emojis failed to react.');
			});
	},
};


async function oneInFive(msgUser, logger, sentMessage, embed, client) {
	const filter = (reaction, user) => {
		return [client.emojiCharacters[1], client.emojiCharacters[2], client.emojiCharacters[3], client.emojiCharacters[4], client.emojiCharacters[5]].includes(reaction.emoji.name) && user.id === msgUser.user_id;
	};

	const answer = Math.floor((Math.random() * 5) + 1);

	await sentMessage.edit(embed.setDescription('Guess the number between 1 and 5.').setTitle('Numbers'))
		.then(() => {
			for (let i = 1; i < 6; i++) sentMessage.react(client.emojiCharacters[i]);
		})
		.catch(e => {
			logger.log('error', `One of the emojis failed to react because of:\n${e.info}`);
		});


	sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(async collected => {
			const reaction = collected.first();


			if (reaction.emoji.name === client.emojiCharacters[answer]) {
				embed.setColor('#00fc43');
				sentMessage.edit(embed.setDescription('Correct! You have won.'));
			}
			else {
				embed.setColor('#fc0303');
				sentMessage.edit(embed.setDescription(`The correct answer was __${answer}__. You lost.`));
			}
			return sentMessage.reactions.removeAll();
		})
		.catch(collected => {
			logger.log('error', collected);
		});

}


async function blackjack(msgUser, logger, sentMessage, embed) {
	const filter = (reaction, user) => {
		return ['🃏', '✅'].includes(reaction.emoji.name) && user.id === msgUser.user_id;
	};

	const suits = ['♠️', '♥️', '♦️', '♣️'];
	const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	let playerHandValue = 0;
	let botHandValue = 0;
	let cardsDrawn = 0;
	let playerHand = '';
	let botHand = '';

	sentMessage.edit(embed
		.setDescription('[Click here for the rules](https://bicyclecards.com/how-to-play/blackjack/)\nPress 🃏 to hit or ✅ to stand.')
		.setTitle('Blackjack'))
		.then(() => {
			sentMessage.react('🃏'); // result 1
			sentMessage.react('✅'); // result 2

			const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

			for (let i = 0; i < 2; i++) {
				getCard('player');
				getCard('client');
			}
			setEmbed();

			collector.on('collect', async reaction => {
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
							setTimeout(() => setEmbed(), 1000);
						}
						collector.stop();
						return;
				}
			});

			collector.on('end', async () => {

				if (playerHandValue > 21) sentMessage.edit(embed.setDescription('__You busted__.').setColor('#fc0303'));

				else if (botHandValue > 21) sentMessage.edit(embed.setDescription('__The bot busted__. You Win!').setColor('#00fc43'));

				else if (cardsDrawn >= 5) return sentMessage.edit(embed.setDescription('You have drawn 5 cards without busting.\n__You win__.').setColor('#00fc43'));

				else if (botHandValue == playerHandValue) sentMessage.edit(embed.setDescription('__Its a draw__.'));

				else if (playerHandValue > botHandValue) sentMessage.edit(embed.setDescription('__You win__.').setColor('#00fc43'));

				else if (botHandValue > playerHandValue) sentMessage.edit(embed.setDescription('__The bot wins__.').setColor('#fc0303'));

				sentMessage.reactions.removeAll();
			});
		})
		.catch(e => {
			return logger.error(e.stack);
		});

	async function setEmbed() {
		await embed.spliceFields(0, 5, [
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

async function RPS(msgUser, logger, sentMessage, embed) {
	const filter = (reaction, user) => {
		return ['✊', '🧻', '✂️'].includes(reaction.emoji.name) && user.id === msgUser.user_id;
	};

	const answer = Math.floor((Math.random() * 3) + 1);

	await sentMessage.edit(embed.setDescription('Choose rock✊, paper🧻 or scissors✂️!').setTitle('Rock, paper, scissors'))
		.then(() => {
			sentMessage.react('✊'); // result 1
			sentMessage.react('🧻'); // result 2
			sentMessage.react('✂️'); // result 3
		})
		.catch(error => {
			logger.log('error', `One of the emojis failed to react because of:\n${error.info}`);
		});


	sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(async collected => {
			const reaction = collected.first();
			switch (reaction.emoji.name) {

				case '✊':
					if (answer == 1) sentMessage.edit(embed.setDescription('The bot chooses ✊. __It\'s a tie!__.'));
					else if (answer == 2) sentMessage.edit(embed.setDescription('The bot chooses 🧻. __You lose!__.')).setColor('#fc0303');
					else if (answer == 3) sentMessage.edit(embed.setDescription('The bot chooses ✂️. __You Win!__.').setColor('#00fc43'));
					break;

				case '🧻':
					if (answer == 1) sentMessage.edit(embed.setDescription('The bot chooses ✊. __You Win!__.').setColor('#00fc43'));
					else if (answer == 2) sentMessage.edit(embed.setDescription('The bot chooses 🧻. __It\'s a tie!__.'));
					else if (answer == 3) sentMessage.edit(embed.setDescription('The bot chooses ✂️. __You lose!__.').setColor('#fc0303'));
					break;

				case '✂️':
					if (answer == 1) sentMessage.edit(embed.setDescription('The bot chooses ✊. __You lose!__.').setColor('#fc0303'));
					else if (answer == 2) sentMessage.edit(embed.setDescription('The bot chooses 🧻. __You Win!__.').setColor('#00fc43'));
					else if (answer == 3) sentMessage.edit(embed.setDescription('The bot chooses ✂️. __It\'s a tie!__.'));
					break;
			}
			return sentMessage.reactions.removeAll();

		})
		.catch(collected => {
			logger.log('error', collected);
			sentMessage.reactions.removeAll();
		});
}
