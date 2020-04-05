const emojiCharacters = require('../emojiCharacters');
module.exports = {
	name: 'tgam',
	description: 'Test command for new gambling games',
	admin: false,
	aliases: ["rps"],
	args: true,
	usage: 'money',
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		const currentAmount = await profile.getBalance(msg.author.id);
		const gambleAmount = args[0];
		const rpsFilter = (reaction, user) => {
			return ['✊', '🧻', '✂️'].includes(reaction.emoji.name) && user.id === msg.author.id;
		};

		if (!gambleAmount || isNaN(gambleAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);
		if (gambleAmount > currentAmount) return msg.channel.send(`Sorry ${msg.author}, you only have ${currentAmount}.`);
		if (gambleAmount <= 0) return msg.channel.send(`Please enter an amount greater than zero, ${msg.author}.`);

		const answer = Math.floor((Math.random() * 3) + 1);
		logger.log('info', `The bot chooses ${answer}`)

		await msg.channel.send(`You have bet **${gambleAmount}💰**.\nChoose rock, paper or scissors!`)
			.then(() => {
				msg.channel.lastMessage.react('✊'); //result 1
				msg.channel.lastMessage.react('🧻'); //result 2
				msg.channel.lastMessage.react('✂️'); //result 3
			})
			.catch(e => {
				logger.log('error', `One of the emojis failed to react because of:\n${e}`)
				return msg.reply('One of the emojis failed to react.');
			});


		msg.channel.lastMessage.awaitReactions(rpsFilter, { max: 1, time: 60000, errors: ['time'] })
			.then(async collected => {
				const reaction = collected.first();
				switch (reaction.emoji.name) {
					case '✊':
						if (answer == 1) return msg.channel.send(`The bot chooses ✊. **It's a tie!**\nYour balance is **${currentAmount}💰**`);
						else if (answer == 2) {
							profile.addMoney(msg.author.id, -gambleAmount);
							const balance = await profile.getBalance(msg.author.id);
							return msg.channel.send(`The bot chooses 🧻. **You lose!**\nYour balance is **${balance}💰**`);
						}
						else if (answer == 3) {
							profile.addMoney(msg.author.id, gambleAmount);
							const balance = await profile.getBalance(msg.author.id);
							return msg.channel.send(`The bot chooses ✂️. **You Win!**\nYou won **${gambleAmount}💰** and your balance is **${balance}💰**`);
						}
						break;

					case '🧻':
						if (answer == 1) {
							profile.addMoney(msg.author.id, gambleAmount);
							const balance = await profile.getBalance(msg.author.id);
							return msg.channel.send(`The bot chooses ✊. **You Win!**\nYou won **${gambleAmount}💰** and your balance is **${balance}💰**`);
						}
						else if (answer == 2) return msg.channel.send(`The bot chooses 🧻. **It's a tie!**\nYour balance is **${currentAmount}💰**`);
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
							profile.addMoney(msg.author.id, gambleAmount);
							const balance = await profile.getBalance(msg.author.id);
							return msg.channel.send(`The bot chooses 🧻. **You Win!**\nYou won **${gambleAmount}💰** and your balance is **${balance}💰**`);
						}
						else if (answer == 3) return msg.channel.send(`The bot chooses ✂️. **It's a tie!**\nYour balance is **${currentAmount}💰**`);
						break;
				}

				msg.channel.send('you shouldnt see this');
			})
			.catch(collected => {
				message.reply('You failed to react in time.');
				logger.log('error', collected);
			});
	},
};