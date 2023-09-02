module.exports = async function execute(message, guild, client){
    
    const numberGuessingInfo = client.guildOverseer.getNumberGuessing(guild);
    
    if (!numberGuessingInfo || message.channel.id !== numberGuessingInfo.channelId) return;
    if (isNaN(message.content)) return;

    const number = Number(message.content);
    if (numberGuessingInfo.secretNumber == NaN) return;

    if(numberGuessingInfo.lastUserId == message.author.id) {
        message.reply('**You can\t count twice in a row.** \nYour guess will be ignored.');
        return;
    }
    else if(number == numberGuessingInfo.secretNumber) {
        correctGuess();
    }
    else {
        wrongGuess();
    }

    return client.guildOverseer.saveNumberGuessingInfo(guild, numberGuessingInfo)


    // Functions
    async function correctGuess(){
        client.userManager.changeBalance(msgUser, numberGuessingInfo.prize)
        message.reply(`You guessed correctly and earned **${numberGuessingInfo.prize}**!`)
        message.reply('Neia will now think of a new number...')
    }

    async function wrongGuess() {

    }
}