const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
    name: 'buy',
    description: 'buy an item from the shop.',
    admin: false,
    aliases: ["get"],
    args: true,
    usage: 'item (amount)',
    cooldown: 5,
    async execute(msg, args, profile) {
        let amount = 1;
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[0] } } });
        if (!item) return msg.channel.send(`That item doesn't exist.`);

        if (args[1]) {
            if (Number.isInteger(args[1])) {
                return msg.channel.send(`${args[1]} is not a valid amount`);
            } else if (args[1] < 1 || args[1] > 1000) {
                return msg.channel.send(`Enter a number between 1 and 1000`);
            } else { amount = args[1]; }
        }

        const balance = await profile.getBalance(msg.author.id);
        const cost = amount * item.cost
        if (cost > balance) {
            return msg.channel.send(`You currently have ${balance}, but ${amount} ${item.name} costs ${cost}💰!`);
        }

        const user = await Users.findOne({ where: { user_id: msg.author.id } });
        profile.addMoney(msg.author.id, -cost);
        const interupt = Math.round(amount / 100);
        for (var i = 0; i < amount; i++) {
            await user.addItem(item);
            console.log(`Handled purchase ${i} out of ${amount} for item: ${item.name}`);
            if (interupt != 0) {
                if (i >= amount / interupt && i < (amount / interupt) + 1) {
                    msg.channel.send(`Handled purchase ${i} out of ${amount} for item: ${item.name}`);
                }
            }
        }
        msg.channel.send(`You've bought: ${amount} ${item.name}.`);
    },
};