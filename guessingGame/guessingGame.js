module.exports = async function execute(message, msgUser, guild, client) {

    const guessingGameInfo = client.guildOverseer.getGuessingGame(guild);
    
    if (!guessingGameInfo || message.channel.id !== guessingGameInfo.channelId) return;
    if (isNaN(message.content)) return;

    const number = Number(message.content);
    if (guessingGameInfo.targetNumber == isNaN()) return;

    // if (guessingGameInfo.lastUserId == message.author.id) {
    //     return message.reply('**You can\t guess twice in a row.** \nYour guess will be ignored.');
    // }


    //* Handle Stats
    guessingGameInfo.totalGuessed++;
    guessingGameInfo.currentGuessed++;
    guessingGameInfo.lastUserId = message.author.id;
    console.log(guessingGameInfo);
    if (number == guessingGameInfo.targetNumber) {
        correctGuess();
    }
    else {
        wrongGuess();
    }

    return client.guildOverseer.saveGuessingGame(guild, guessingGameInfo);

    // Functions
    function correctGuess() {
        client.userManager.changeBalance(msgUser, guessingGameInfo.prizePool);
        message.reply(`You guessed correctly and earned **${guessingGameInfo.prizePool}**!`);
        newGuessingGame();
    }

    function wrongGuess() {
        if (number > guessingGameInfo.targetNumber) {
            message.reply('Wrong, Try and guess a lower number!');
        }
        else {
            message.reply('Wrong, Try and guess a higher number!');
        }
        guessingGameInfo.prizePool = 0.9 * guessingGameInfo.prizePool;
    }

    function newGuessingGame() {
        guessingGameInfo.currentGuessed = 0;
        guessingGameInfo.lastUserId = null;
        guessingGameInfo.roundsCompleted++;

        // TODO implement random/better/adaptive prize pool?
        guessingGameInfo.prizePool = 10000;

        // TODO Pick better random number?
        guessingGameInfo.targetNumber = Math.ceil(Math.random() * 1000);
        
        // TODO Add stats and user? 
        if (guessingGameInfo.fastestGuess > guessingGameInfo.currentGuessed || guessingGameInfo.fastestGuess == 0) {
            guessingGameInfo.fastestGuess = guessingGameInfo.currentGuessed;
            message.channel.send(`New Fastest Guess Record!`);
        }

        message.channel.send(`
        **A new Round has started!**
        The starting prize pool is ${guessingGameInfo.prizePool}
        You can now add to the prize pool with \`/increasePool\` and Neia will double your amount!
        
        `);
    }
};