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
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();
        const avatar = target.displayAvatarURL();

        const embed = new Discord.MessageEmbed()
            .setTitle(`${target.tag}'s Profile`)
            .setColor('#42f548')
            .setThumbnail(avatar)
            .addField(`Balance:`, `${profile.getBalance(target.id)}💰`)
            .setTimestamp();

        if (!items.length) {embed.addField('Inventory:',`${target.tag} has nothing!`);}
        else {
            embed.addField('Inventory:', '-----------------------------');
            items.map(i => embed.addField(`${i.item.name}: `, `${i.amount}`, true));
        }
        msg.channel.send(embed);
    },
};