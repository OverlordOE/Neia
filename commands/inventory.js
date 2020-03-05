const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'inventory',
    description: 'Shows inventory of tagged user or the sender if noone was tagged.',
    admin: false,
    aliases: ["inv", "i", "items"],
    args: false,
    usage: '<user>',
    async execute(msg, args, currency) {
        const target = msg.mentions.users.first() || msg.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        if (!items.length) return msg.channel.send(`${target.tag} has nothing!`);
        return msg.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
    },
};