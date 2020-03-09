const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
    name: 'use',
    description: 'use an item from your inventory.',
    admin: false,
    args: true,
    usage: '<item>',
    async execute(msg, args, currency) {
        var hasItem = false;
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
        if (!item) return msg.channel.send(`That item doesn't exist.`);

        const user = await Users.findOne({ where: { user_id: msg.author.id } });
        const uitems = await user.getItems();

        uitems.map(i => {
            if (i.item.name == item.name && i.amount >= 1) { hasItem = true; }
            console.log("\ni: ");
            console.log(i.item.name);
            console.log(i.amount);
            console.log("\nItem: ");
            console.log(item.name);
        })
        if (hasItem) {
            await user.removeItem(item)
            return msg.channel.send(`You've used: ${item.name}.`);
        }

        return msg.channel.send(`You don't have ${item.name}!`);

    },
};