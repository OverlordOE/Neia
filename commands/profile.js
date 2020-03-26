const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'profile',
    description: 'Shows inventory of tagged user or the sender if noone was tagged.',
    admin: false,
    aliases: ["inv", "items", "prof", "inventory", "balance", "money"],
    args: false,
    usage: 'user',
    async execute(msg, args, profile) {
        const target = msg.mentions.users.first() || msg.author;
        const balance = await profile.getBalance(target.id);
        const user = await Users.findOne({ where: { user_id: target.id } });
        try { var items = await user.getItems(); } catch{ console.error(`${target} doesnt exist`); }

        const avatar = target.displayAvatarURL();

        const embed = new Discord.MessageEmbed()
            .setTitle(`${target.tag}'s Profile`)
            .setColor('#42f548')
            .setThumbnail(avatar)
            .addField(`Balance:`, `${balance}💰`)
            .setTimestamp();

        if (!items.length) { embed.addField('Inventory:', `${target.tag} has nothing!`); }
        else {
            embed.addField('Inventory:', '-----------------------------');
            items.map(i => embed.addField(`${i.item.name}: `, `${i.amount}`, true));
        }
        msg.channel.send(embed);
    },
};