const nf = require('../util/numberFunctions');

module.exports = async function execute(message, msgUser, guild, client) {

	const numberGameInfo = client.guildOverseer.getNumberGame(guild);

	if (!numberGameInfo || message.channel.id !== numberGameInfo.channelId) return;
	if (isNaN(message.content)) return;

	const number = Number(message.content);
	if (numberGameInfo.currentNumber == 0 && number != 1) return;

	client.logger.info(`Count ${numberGameInfo.currentNumber} --> ${number} in "${message.guild.name}#${message.channel.name}"`);

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

	return client.guildOverseer.saveNumberGame(guild, numberGameInfo);


	// Functions
	async function mistake() {
		if (await client.userManager.protectionAllowed(msgUser)) protection();
		else if (numberGameInfo.lastCheckpoint > 0) checkpoint();
		else wrongCount();
	}

	function succesfullCount() {
		// Money
		if (number > 2) client.userManager.changeBalance(msgUser, number * msgUser.countMultiplier);
		giveBonus();

		// Reactions
		message.react(msgUser.reaction);
		const easterEgg = nf.getEasterEggs(number);
		if (easterEgg.length) nf.applyEasterEggs(easterEgg, message);

		//  Checkpoints
		const check = nf.checkCheckpoint(number);
		if (check) {
			numberGameInfo.lastCheckpoint = number;
			numberGameInfo.nextCheckpoint = check;
			message.reply(`Checkpoint **${number}** reached!\nIf you make a mistake you will be reversed to this checkpoint.`);
		}

		// Stats
		if (number > numberGameInfo.highestStreak) numberGameInfo.highestStreak = number;
		numberGameInfo.currentNumber++;
		numberGameInfo.totalCounted++;
		numberGameInfo.lastUserId = message.author.id;

		client.userManager.addStats(msgUser, 'numbersCounted', 1);
		client.userManager.addStats(msgUser, 'countingMoneyGained', number * msgUser.countMultiplier);
	}

	function wrongCount() {
		message.react('❌');
		message.channel.send(`${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!\nStarting again from **0**.`);

		numberGameInfo.currentNumber = 0;
		numberGameInfo.lastCheckpoint = 0;
		numberGameInfo.nextCheckpoint = 50;
		numberGameInfo.lastUserId = null;
		numberGameInfo.streaksRuined++;
		client.userManager.addStats(msgUser, 'streaksRuined', 1);
	}


	function checkpoint() {
		message.react('🏁');
		message.channel.send(`${message.author} has ruined the streak at **${numberGameInfo.currentNumber}**!
		Starting from checkpoint **${numberGameInfo.lastCheckpoint}**.\nCheckpoint has reset.`);

		numberGameInfo.currentNumber = numberGameInfo.lastCheckpoint;
		numberGameInfo.lastCheckpoint = 0;
		numberGameInfo.lastUserId = null;
		numberGameInfo.streaksRuined++;
		client.userManager.addStats(msgUser, 'streaksRuined', 1);
	}

	function protection() {
		const protectionItem = client.util.getItem('streak protection');
		message.react('🛡️');
		message.channel.send(`Your streak protection has been used and will go on a __**24 hour**__ cooldown.
							Last number was **${numberGameInfo.currentNumber}**.`);
		client.userManager.setProtection(msgUser);
		client.itemHandler.removeItem(msgUser, protectionItem, 1);
	}

	function giveBonus() {
		const dailyMultiplier = 2.5;
		const hourlyMultiplier = 0.5;
		const daily = client.userManager.getDailyCount(msgUser);
		const hourly = client.userManager.getHourlyCount(msgUser);


		if (daily === true) {
			client.userManager.changeBalance(msgUser, number * dailyMultiplier);
			message.react('💰');
			client.userManager.setDailyCount(msgUser);
		}

		if (hourly === true) {
			client.userManager.changeBalance(msgUser, number * hourlyMultiplier);
			message.react('💵');
			client.userManager.setHourlyCount(msgUser);
		}
	}
};