const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
    name: 'buy',
    description: 'buy an item from the shop.',
    admin: false,
    aliases: ["get"],
    args: true,
    usage: '<item>',
    async execute(msg, args, currency) {
        var amount = 1;
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[0] } } });
        if (!item) return msg.channel.send(`That item doesn't exist.`);
        if (args[1]) {amount = args[1]; }

        const cost = amount * item.cost
        if (cost > currency.getBalance(msg.author.id)) {
            return msg.channel.send(`You currently have ${currency.getBalance(msg.author.id)}, but ${amount} ${item.name} costs ${cost}!`);
        }

        const user = await Users.findOne({ where: { user_id: msg.author.id } });
        currency.add(msg.author.id, -cost);
        for (var i = 0; i < amount; i++) {
            await user.addItem(item);
        }
        msg.channel.send(`You've bought: ${amount} ${item.name}.`);

    },
};