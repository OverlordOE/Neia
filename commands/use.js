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
        // const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
        // if (!item) return msg.channel.send(`That item doesn't exist.`);
        // if (item.cost > currency.getBalance(msg.author.id)) {
        //     return msg.channel.send(`You currently have ${currency.getBalance(msg.author.id)}, but the ${item.name} costs ${item.cost}!`);
        // }

        // const user = await Users.findOne({ where: { user_id: msg.author.id } });
        // currency.add(msg.author.id, -item.cost);
        // await user.addItem(item);

        // msg.channel.send(`You've bought: ${item.name}.`);

    },
};