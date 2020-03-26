const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'add',
    description: 'Adds money too the mentioned user',
    admin: true,
    owner: true,
    args: true,
    usage: 'money user',
    async execute(msg, args, profile) {
        const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
        const transferTarget = msg.mentions.users.first() || msg.author;

        if (!transferAmount || isNaN(transferAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);
        
        profile.addMoney(transferTarget.id, transferAmount);
        const balance = await profile.getBalance(transferTarget.id);
        if (transferAmount <= 0) return msg.channel.send(`Successfully removed ${transferAmount * -1}💰 from ${transferTarget.tag}. Their current balance is ${balance}💰`);
        return msg.channel.send(`Successfully added ${transferAmount}💰 to ${transferTarget.tag}. Their current balance is ${balance}💰`);
    },
};