const checkpoints = [50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000, 2250, 2500, 2750, 3000];

module.exports = function execute(message, msgUser, guild, client, logger) {

	const numberGameInfo = client.guildCommands.getNumberGame(guild);

	if (!numberGameInfo || message.channel.id !== numberGameInfo.channelId) return;
	const number = Number(message.content);

	if (numberGameInfo.currentNumber == 0 && number != 1) return;

	if (numberGameInfo.lastUserId == message.author.id) {
		message.react('❌');
		message.channel.send(`**You can't count twice in a row.**\n${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!`);
		if (numberGameInfo.lastCheckpoint > 0) checkpoint();
		else wrongCount();
	}
	else if (number == numberGameInfo.currentNumber + 1) {
		succesfullCount();
	}
	else {
		message.react('❌');
		message.channel.send(`**Wrong number.**\n${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!`);
		if (numberGameInfo.lastCheckpoint > 0) checkpoint();
		else wrongCount();
	}

	return client.guildCommands.saveNumberGameInfo(guild, numberGameInfo);

	function succesfullCount() {
		const reaction = client.userCommands.getReaction(msgUser);
		if (reaction.emoji)	message.react(reaction.emoji);
		else message.react('✅');
		client.userCommands.addBalance(msgUser, Math.sqrt(reaction.value));
		easterEggs();

		if (checkpoints.includes(number)) {
			const nextCheckpointIndex = checkpoints.indexOf(number) + 1;
			numberGameInfo.lastCheckpoint = number;
			numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
			message.channel.send(`Checkpoint **${number}** reached!\nIf you make a mistake you will be reversed to this point`);
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
		message.channel.send('Starting again from **1**.');
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
		message.channel.send(`Starting from checkpoint **${numberGameInfo.lastCheckpoint}**.\nCheckpoint has reset to **0**`);
		numberGameInfo.currentNumber = numberGameInfo.lastCheckpoint;
		numberGameInfo.lastCheckpoint = 0;
		numberGameInfo.lastUserId = null;
		numberGameInfo.streaksRuined++;
		msgUser.streaksRuined++;
		msgUser.save();
	}
};