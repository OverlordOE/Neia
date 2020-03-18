const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'add',
    description: 'Adds money too the mentioned user',
    admin: true,
    aliases: [],
    args: true,
    usage: 'money user',
    execute(msg, args, currency) {
        const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
        const transferTarget = msg.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);
        
        currency.add(transferTarget.id, transferAmount);

        if (transferAmount <= 0) return msg.channel.send(`Successfully removed ${transferAmount * -1}💰 from ${transferTarget.tag}. Their current balance is ${currency.getBalance(transferTarget.id)}💰`);
        return msg.channel.send(`Successfully added ${transferAmount}💰 to ${transferTarget.tag}. Their current balance is ${currency.getBalance(transferTarget.id)}💰`);
    },
};