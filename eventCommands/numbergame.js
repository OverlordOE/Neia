const checkpoints = [50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000, 2250, 2500, 2750, 3000, 3300, 3600, 3900, 4200, 4600, 5000];
const Discord = require('discord.js');

module.exports = async function execute(message, msgUser, guild, client, logger) {

	const numberGameInfo = client.guildCommands.getNumberGame(guild);

	if (!numberGameInfo || message.channel.id !== numberGameInfo.channelId) return;
	if (isNaN(message.content)) return;

	const number = Number(message.content);
	if (numberGameInfo.currentNumber == 0 && number != 1) return;

	console.log(`Counted Number ${number}`);
	console.log(`Previous Number ${numberGameInfo.currentNumber}`);

	if (numberGameInfo.lastUserId == message.author.id && !msgUser.powerCounting) {
		message.reply('**You can\'t count twice in a row.**');
		await mistake();
	}
	else if (number == numberGameInfo.currentNumber + 1) {
		succesfullCount();
	}
	else {
		message.reply('**Wrong number.**');
		await mistake();
	}

	return client.guildCommands.saveNumberGameInfo(guild, numberGameInfo);


	// Functions
	async function mistake() {
		if (await client.userCommands.protectionAllowed(msgUser)) protection();
		else if (numberGameInfo.lastCheckpoint > 0) checkpoint();
		else wrongCount();
	}

	function succesfullCount() {
		try {
			const reaction = client.userCommands.getReaction(msgUser);
			if (reaction.emoji && reaction.value) {
				message.react(reaction.emoji);
				client.userCommands.addBalance(msgUser, Math.sqrt(reaction.value));
			}
		}
		catch (error) {
			logger.warn('Emoji failed');
			message.react('✅');
		}

		giveBonus();
		easterEggs();

		if (checkpoints.includes(number)) {
			const nextCheckpointIndex = checkpoints.indexOf(number) + 1;
			numberGameInfo.lastCheckpoint = number;
			numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
			message.reply(`Checkpoint **${number}** reached!\nIf you make a mistake you will be reversed to this checkpoint.`);
		}

		if (number > numberGameInfo.highestStreak) numberGameInfo.highestStreak = number;
		numberGameInfo.currentNumber++;
		numberGameInfo.totalCounted++;
		numberGameInfo.lastUserId = message.author.id;
		client.userCommands.addBalance(msgUser, number + msgUser.countBoost);
		client.userCommands.addStats(msgUser, 'numbersCounted', 1);
	}

	function wrongCount() {
		message.react('❌');
		message.channel.send(`${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!\nStarting again from **0**.`);

		numberGameInfo.currentNumber = 0;
		numberGameInfo.lastCheckpoint = 0;
		numberGameInfo.nextCheckpoint = checkpoints[0];
		numberGameInfo.lastUserId = null;
		numberGameInfo.streaksRuined++;
		client.userCommands.addStats(msgUser, 'streaksRuined', 1);
	}

	function easterEggs() {
		switch (number) {
			case 7:
				message.react('🍀');
				break;
			case 13:
				message.react('✡️');
				break;
			case 42:
				message.react(client.emojiCharacters[0]);
				break;
			case 69:
				message.react('🍆');
				break;
			case 100:
				message.react('💯');
				break;
			case 111:
				message.react(client.emojiCharacters[1]);
				break;
			case 112:
				message.react('🚑');
				break;
			case 123:
				message.react(client.emojiCharacters[4]);
				break;
			case 222:
				message.react(client.emojiCharacters[2]);
				break;
			case 333:
				message.react(client.emojiCharacters[3]);
				break;
			case 314:
				message.react('🥧');
				break;
			case 404:
				message.react('❔');
				break;
			case 444:
				message.react(client.emojiCharacters[4]);
				break;
			case 555:
				message.react(client.emojiCharacters[5]);
				break;
			case 666:
				message.react('✡️');
				break;
			case 777:
				message.react('🍀');
				break;
			case 888:
				message.react(client.emojiCharacters[8]);
				break;
			case 999:
				message.react(client.emojiCharacters[9]);
				break;
			case 1000:
				message.react(client.emojiCharacters[1]);
				message.react('🇰');
				break;
		}
	}

	function checkpoint() {
		message.react('🏁');
		message.send(`${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!
		Starting from checkpoint **${numberGameInfo.lastCheckpoint}**.\nCheckpoint has reset.`);

		numberGameInfo.currentNumber = numberGameInfo.lastCheckpoint;
		numberGameInfo.lastCheckpoint = 0;
		numberGameInfo.lastUserId = null;
		numberGameInfo.streaksRuined++;
		client.userCommands.addStats(msgUser, 'streaksRuined', 1);
	}

	function protection() {
		const protectionItem = client.util.getItem('streak protection');
		message.react('🛡️');
		message.channel.send(`Your streak protection has been used and will go on a __**24 hour**__ cooldown.
							Last number was **${numberGameInfo.currentNumber}**.`);
		client.userCommands.setProtection(msgUser);
		client.userCommands.removeItem(msgUser, protectionItem, 1);
	}

	function giveBonus() {
		const dailyMultiplier = 10;
		const hourlyMultiplier = 2.5;
		const daily = client.userCommands.getDailyCount(msgUser);
		const hourly = client.userCommands.getHourlyCount(msgUser);

		const embed = new Discord.MessageEmbed()
			.setTitle('Count Reward')
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16')
			.setFooter('Neia', client.user.displayAvatarURL({ dynamic: true }));

		if (daily === true) {
			const balance = client.userCommands.addBalance(msgUser, number * dailyMultiplier);
			message.author.send({
				embeds: [embed.setDescription(`You have received your __**Daily Count**__ reward
								You gained ${client.util.formatNumber(number * dailyMultiplier)}💰 and your balance is ${client.util.formatNumber(balance)}💰.
								You will get your next __**Daily Count**__ in 1 day.
								`)]
			});
			client.userCommands.setDailyCount(msgUser);
		}

		else if (hourly === true) {
			const balance = client.userCommands.addBalance(msgUser, number * hourlyMultiplier);
			message.author.send({
				embeds: [embed.setDescription(`You have received your __**Hourly Count**__ reward!
								You gained ${client.util.formatNumber(number * hourlyMultiplier)}💰 and your balance is ${client.util.formatNumber(balance)}💰.
								You will get your next __**Hourly Count**__ in 1 hour.
								`)]
			}
			);
			client.userCommands.setHourlyCount(msgUser);
		}
	}
};