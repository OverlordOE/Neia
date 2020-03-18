const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
    name: 'transfer',
    description: 'Transfers money to the mentioned user from own balance',
    admin: false,
    aliases: ["give", "donate", "trade"],
    args: true,
    usage: 'money user\n -trade item amount target',
    async execute(msg, args, currency) {
        const target = msg.mentions.users.first();
        let temp;
        let amount = 1;
        for (var i = 0; i < args.length; i++) {
            if (!isNaN(args[i])) {
                amount = args[i];
                break;
            }
            temp = args.find(arg => !/<@!?\d+>/g.test(arg));
            console.log(args[i]);
        }
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: temp } } });

        //money transfer
        if (!item) {
            const balance = currency.getBalance(msg.author.id);
            const transferAmount = args.find(arg => !/<@?\d+>/g.test(arg));
            if (!transferAmount || isNaN(transferAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);
            if (transferAmount > balance) return msg.channel.send(`Sorry ${msg.author}, you only have ${balance}.`);
            if (transferAmount <= 0) return msg.channel.send(`Please enter an amount greater than zero, ${msg.author}.`);

            currency.add(msg.author.id, -transferAmount);
            currency.add(target.id, transferAmount);

            return msg.channel.send(`Successfully transferred ${transferAmount}💰 to ${target.tag}. Your current balance is ${currency.getBalance(msg.author.id)}💰`);
        }

        //item trade
        var hasItem = false;
        const user = await Users.findOne({ where: { user_id: msg.author.id } });
        const userTarget = await Users.findOne({ where: { user_id: target.id } });
        const uitems = await user.getItems();



        uitems.map(i => {
            if (i.item.name == item.name && i.amount >= 1) {
                hasItem = true;
            }
        })
        if (!hasItem) {
            return msg.channel.send(`You don't have ${item.name}!`);
        }

        const interupt = Math.round(amount / 100);
        for (var i = 0; i < amount; i++) {
            await user.removeItem(item);
            await userTarget.addItem(item);
            console.log(`Handled purchase ${i} out of ${amount} for item: ${item.name}`);
            if (interupt != 0) {
                if (i >= amount / interupt && i < (amount / interupt) + 1) {
                    msg.channel.send(`Handled trade ${i} out of ${amount} for item: ${item.name}`);
                }
            }
        }

        msg.channel.send(`You've traded ${amount} ${item.name} too ${target.tag}.`);
    },
};