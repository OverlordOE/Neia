module.exports = async function execute(message, msgUser, guild, client) {

    const guessingGameInfo = client.guildOverseer.getGuessingGame(guild);

    if (!guessingGameInfo || message.channel.id !== guessingGameInfo.channelId) return;
    if (isNaN(message.content)) return;

    const number = Number(message.content);
    if (guessingGameInfo.targetNumber == isNaN()) return;

    if (guessingGameInfo.lastUserId == message.author.id) {
        return message.reply('**You can\t guess twice in a row.** \nYour guess will be ignored.');
    }
    if (number == guessingGameInfo.targetNumber) {
        correctGuess();
    }
    else {
        wrongGuess();
    }

    return client.guildOverseer.saveGuessingGameInfo(guild, guessingGameInfo);

    // Functions
    async function correctGuess() {
        client.userManager.changeBalance(msgUser, guessingGameInfo.prize);
        message.reply(`You guessed correctly and earned **${guessingGameInfo.prize}**!`);
        message.reply(`You can now add to the prize pool with /increasePool and Neia will double your amount!`);
    }

    async function wrongGuess() {
        if (number > guessingGameInfo.targetNumber) {
            message.reply('Wrong, Try and guess a lower number!');
        }
        else {
            message.reply('Wrong, Try and guess a higher number!');
        }
        guessingGameInfo.prize = 0.8 * guessingGameInfo.prize;
    }
};