module.exports = async function execute(message, msgUser, guild, client) {

    const guessingGameInfo = client.guildOverseer.getGuessingGame(guild);

    if (!guessingGameInfo || message.channel.id !== guessingGameInfo.channelId) return;
    if (isNaN(message.content)) return;

    const number = Number(message.content);
    if (guessingGameInfo.targetNumber == isNaN()) return;

    // if (guessingGameInfo.lastUserId == message.author.id) {
    //     return message.reply('**You can\t guess twice in a row.** \nYour guess will be ignored.');
    // }

    // Reward Money
    const guessRange = 1000;
    const minPrizePool = 80000;
    const prizePoolVariation = 40000;
    const guessReward = 100;

    //* Handle Stats
    guessingGameInfo.totalGuessed++;
    guessingGameInfo.currentGuessed++;
    guessingGameInfo.lastUserId = message.author.id;
    console.log(guessingGameInfo);

    client.userManager.addStats(msgUser, 'numbersGuessed', 1);

    if (number == guessingGameInfo.targetNumber) {
        correctGuess();
    }
    else {
        wrongGuess();
    }

    return client.guildOverseer.saveGuessingGame(guild, guessingGameInfo);


    //* Functions
    function correctGuess() {
        client.userManager.changeBalance(msgUser, guessingGameInfo.prizePool);
        message.reply(`You guessed correctly and earned **${client.util.formatNumber(guessingGameInfo.prizePool)}**💰!`);

        client.userManager.addStats(msgUser, 'guessingMoneyGained', guessingGameInfo.prizePool);
        client.userManager.addStats(msgUser, 'guessesCompleted', 1);
        newGuessingGame();
    }

    function wrongGuess() {
        if (number > guessingGameInfo.targetNumber) {
            message.reply('Wrong, Try and guess a lower number!');
        }
        else {
            message.reply('Wrong, Try and guess a higher number!');
        }

        client.userManager.changeBalance(msgUser, guessReward * msgUser.countMultiplier);
        giveBonus();
        client.userManager.addStats(msgUser, 'guessingMoneyGained', guessReward * msgUser.countMultiplier);

        guessingGameInfo.prizePool = 0.9 * guessingGameInfo.prizePool;


    }

    function newGuessingGame() {
        guessingGameInfo.currentGuessed = 0;
        guessingGameInfo.lastUserId = null;
        guessingGameInfo.roundsCompleted++;

        // TODO implement random/better/adaptive prize pool?
        guessingGameInfo.prizePool = minPrizePool + Math.ceil(Math.random() * prizePoolVariation);

        // TODO Pick better random number?
        guessingGameInfo.targetNumber = Math.ceil(Math.random() * guessRange);

        // TODO Add stats and user? 
        if (guessingGameInfo.fastestGuess > guessingGameInfo.currentGuessed || guessingGameInfo.fastestGuess == 0) {
            guessingGameInfo.fastestGuess = guessingGameInfo.currentGuessed;
            client.userManager.addStats(msgUser, 'fastestGuess', guessingGameInfo.currentGuessed);
            message.channel.send(`New Fastest Guess Record by ${message.user}!`);
        }

        message.channel.send(`
        **A new Round has started!**
        *Guess a number between 1 and ${guessRange}*
        The starting prize pool is **${client.util.formatNumber(guessingGameInfo.prizePool)}**💰!
        You can now add to the prize pool with \`/increasePool\` and Neia will double your amount!
        
        `);
    }

    function giveBonus() {
        const dailyMultiplier = 2.5;
        const hourlyMultiplier = 0.5;
        const daily = client.userManager.getDailyCount(msgUser);
        const hourly = client.userManager.getHourlyCount(msgUser);


        if (daily === true) {
            client.userManager.changeBalance(msgUser, guessReward * dailyMultiplier);
            client.userManager.addStats(msgUser, 'guessingMoneyGained', guessReward * dailyMultiplier);
            message.react('💰');
            client.userManager.setDailyCount(msgUser);
        }

        if (hourly === true) {
            client.userManager.changeBalance(msgUser, guessReward * hourlyMultiplier);
            client.userManager.addStats(msgUser, 'guessingMoneyGained', guessReward * hourlyMultiplier);
            message.react('💵');
            client.userManager.setHourlyCount(msgUser);
        }
    }
};