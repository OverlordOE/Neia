const emojiCharacters = require('../emojiCharacters');
const Discord = require('discord.js');
module.exports = {
	name: 'gamble',
	description: 'Starts a minigame where you need to guess what number is correct',
	admin: false,
	aliases: ['guess'],
	args: true,
	usage: 'money',
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		const currentAmount = await profile.getBalance(msg.author.id);
		const gambleAmount = args[0];

		if (!gambleAmount || isNaN(gambleAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);
		if (gambleAmount > currentAmount) return msg.channel.send(`Sorry ${msg.author}, you only have ${currentAmount}.`);
		if (gambleAmount <= 0) return msg.channel.send(`Please enter an amount greater than zero, ${msg.author}.`);

		const embed = new Discord.MessageEmbed()
			.setColor('#ffff00')
			.setTimestamp()
			.setTitle('Syndicate\'s Gambling Improrium')
			.addField('Bet', `**${gambleAmount}💰**`)
			.addField('Number Guess',
				`In this game you get 5 numbers too choose from, guess the right one and you win.\n
				**Potential winnings: ${(2 * gambleAmount)}💰**
				`)
			.addField('Rock, paper and scissors',
				`It's a game of rock, paper and scissors against the bot, if you tie you lose nothing but gain nothing.\n
			**Potential winnings: ${(0.75 * gambleAmount)}💰**
			`);

		const filter = (reaction, user) => {
			return ['✂️', emojiCharacters[5]].includes(reaction.emoji.name) && user.id === msg.author.id;
		};


		await msg.channel.send(embed)
			.then(() => {
				msg.channel.lastMessage.react('✂️');
				msg.channel.lastMessage.react(emojiCharacters[5]);
			})
			.catch(e => {
				logger.log('error', `One of the emojis failed to react because of:\n${e}`);
				return msg.reply('One of the emojis failed to react.');
			});


		msg.channel.lastMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(async collected => {
				const reaction = collected.first();

				if (reaction.emoji.name == emojiCharacters[5]) OneInFive(msg, profile, logger, gambleAmount);
				else if (reaction.emoji.name == '✂️') RPS(msg, profile, logger, gambleAmount, currentAmount);
			})
			.catch(collected => {
				msg.reply('You failed to react in time.');
				logger.log('error', collected);
			});
	},
};


async function OneInFive(msg, profile, logger, gambleAmount) {
	const filter = (reaction, user) => {
		return [emojiCharacters[1], emojiCharacters[2], emojiCharacters[3], emojiCharacters[4], emojiCharacters[5]].includes(reaction.emoji.name) && user.id === msg.author.id;
	};

	const answer = Math.floor((Math.random() * 5) + 1);
	const winAmount = 2 * gambleAmount;
	logger.log('info', `The bot chooses ${answer}`);

	await msg.channel.send(`You have bet ${gambleAmount}💰.\nGuess the number between 1 and 5.`)
		.then(() => {
			msg.channel.lastMessage.react(emojiCharacters[1]);
			msg.channel.lastMessage.react(emojiCharacters[2]);
			msg.channel.lastMessage.react(emojiCharacters[3]);
			msg.channel.lastMessage.react(emojiCharacters[4]);
			msg.channel.lastMessage.react(emojiCharacters[5]);
		})
		.catch(e => {
			logger.log('error', `One of the emojis failed to react because of:\n${e}`);
			return msg.reply('One of the emojis failed to react.');
		});


	msg.channel.lastMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(async collected => {
			const reaction = collected.first();


			if (reaction.emoji.name === emojiCharacters[answer]) {
				profile.addMoney(msg.author.id, winAmount);
				const balance = await profile.getBalance(msg.author.id);
				return msg.channel.send(`Correct!!!! You have successfully won ${winAmount}💰.\nYour current balance is ${balance}💰`);
			} else {
				profile.addMoney(msg.author.id, -gambleAmount);
				const balance = await profile.getBalance(msg.author.id);
				return msg.channel.send(`The correct answer was ${answer}. You lost ${gambleAmount}💰.\nYour current balance is ${balance}💰`);
			}
		})
		.catch(collected => {
			msg.reply('You failed to react in time.');
			logger.log('error', collected);
		});

}


async function RPS(msg, profile, logger, gambleAmount, currentAmount) {
	const filter = (reaction, user) => {
		return ['✊', '🧻', '✂️'].includes(reaction.emoji.name) && user.id === msg.author.id;
	};

	const winAmount = 0.75 * gambleAmount;

	const answer = Math.floor((Math.random() * 3) + 1);
	logger.log('info', `The bot chooses ${answer}`);

	await msg.channel.send(`You have bet **${gambleAmount}💰**.\nChoose rock, paper or scissors!`)
		.then(() => {
			msg.channel.lastMessage.react('✊'); // result 1
			msg.channel.lastMessage.react('🧻'); // result 2
			msg.channel.lastMessage.react('✂️'); // result 3
		})
		.catch(e => {
			logger.log('error', `One of the emojis failed to react because of:\n${e}`);
			return msg.reply('One of the emojis failed to react.');
		});


	msg.channel.lastMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(async collected => {
			const reaction = collected.first();
			switch (reaction.emoji.name) {
			case '✊':
				if (answer == 1) {return msg.channel.send(`The bot chooses ✊. **It's a tie!**\nYour balance is **${currentAmount}💰**`);}
				else if (answer == 2) {
					profile.addMoney(msg.author.id, -gambleAmount);
					const balance = await profile.getBalance(msg.author.id);
					return msg.channel.send(`The bot chooses 🧻. **You lose!**\nYour balance is **${balance}💰**`);
				}
				else if (answer == 3) {
					profile.addMoney(msg.author.id, winAmount);
					const balance = await profile.getBalance(msg.author.id);
					return msg.channel.send(`The bot chooses ✂️. **You Win!**\nYou won **${winAmount}💰** and your balance is **${balance}💰**`);
				}
				break;

			case '🧻':
				if (answer == 1) {
					profile.addMoney(msg.author.id, winAmount);
					const balance = await profile.getBalance(msg.author.id);
					return msg.channel.send(`The bot chooses ✊. **You Win!**\nYou won **${winAmount}💰** and your balance is **${balance}💰**`);
				}
				else if (answer == 2) {return msg.channel.send(`The bot chooses 🧻. **It's a tie!**\nYour balance is **${currentAmount}💰**`);}
				else if (answer == 3) {
					profile.addMoney(msg.author.id, -gambleAmount);
					const balance = await profile.getBalance(msg.author.id);
					return msg.channel.send(`The bot chooses ✂️. **You lose!**\nYour balance is **${balance}💰**`);
				}
				break;

			case '✂️':
				if (answer == 1) {
					profile.addMoney(msg.author.id, -gambleAmount);
					const balance = await profile.getBalance(msg.author.id);
					return msg.channel.send(`The bot chooses ✊. **You lose!**\nYour balance is **${balance}💰**`);
				}
				else if (answer == 2) {
					profile.addMoney(msg.author.id, winAmount);
					const balance = await profile.getBalance(msg.author.id);
					return msg.channel.send(`The bot chooses 🧻. **You Win!**\nYou won **${winAmount}💰** and your balance is **${balance}💰**`);
				}
				else if (answer == 3) {return msg.channel.send(`The bot chooses ✂️. **It's a tie!**\nYour balance is **${currentAmount}💰**`);}
				break;
			}

			msg.channel.send('you shouldnt see this');
		})
		.catch(collected => {
			msg.reply('You failed to react in time.');
			logger.log('error', collected);
		});

}
