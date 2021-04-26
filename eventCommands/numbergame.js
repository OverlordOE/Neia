const checkpoints = [50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000, 2250, 2500, 2750, 3000];

module.exports = async function execute(message, msgUser, guild, client, logger) {

	const numberGameInfo = client.guildCommands.getNumberGame(guild);

	if (!numberGameInfo || message.channel.id !== numberGameInfo.channelId) return;
	const number = Number(message.content);

	if (numberGameInfo.currentNumber == 0 && number != 1) return;

	if (numberGameInfo.lastUserId == message.author.id) {
		message.channel.send('**You can\'t count twice in a row.**');
		await mistake();
	}
	else if (number == numberGameInfo.currentNumber + 1) {
		succesfullCount();
	}
	else {
		message.channel.send('**Wrong number.**');
		await mistake();
	}

	return client.guildCommands.saveNumberGameInfo(guild, numberGameInfo);

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
		easterEggs();

		if (checkpoints.includes(number)) {
			const nextCheckpointIndex = checkpoints.indexOf(number) + 1;
			numberGameInfo.lastCheckpoint = number;
			numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
			message.channel.send(`Checkpoint **${number}** reached!\nIf you make a mistake you will be reversed to this point.`);
		}

		if (number > numberGameInfo.highestStreak) numberGameInfo.highestStreak = number;
		numberGameInfo.currentNumber++;
		numberGameInfo.totalCounted++;
		numberGameInfo.lastUserId = message.author.id;
		client.userCommands.addBalance(msgUser, number);
		msgUser.numbersCounted++;
		msgUser.save();
	}

	function wrongCount() {
		message.react('❌');
		message.channel.send(`${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!\nStarting again from **0**.`);

		numberGameInfo.currentNumber = 0;
		numberGameInfo.lastCheckpoint = 0;
		numberGameInfo.nextCheckpoint = checkpoints[0];
		numberGameInfo.lastUserId = null;
		numberGameInfo.streaksRuined++;
		msgUser.streaksRuined++;
		msgUser.save();
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
		message.channel.send(`${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!
		Starting from checkpoint **${numberGameInfo.lastCheckpoint}**.\nCheckpoint has reset.`);

		numberGameInfo.currentNumber = numberGameInfo.lastCheckpoint;
		numberGameInfo.lastCheckpoint = 0;
		numberGameInfo.lastUserId = null;
		numberGameInfo.streaksRuined++;
		msgUser.streaksRuined++;
		msgUser.save();
	}

	function protection() {
		const protectionItem = client.util.getItem('streak protection');
		message.react('🛡️');
		message.channel.send('Your streak protection has been used and will go on a 24 hour cooldown.');
		client.userCommands.setProtection(msgUser);
		client.userCommands.removeItem(msgUser, protectionItem, 1);
	}
};