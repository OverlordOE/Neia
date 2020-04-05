const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
var moment = require('moment');
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
        const items = await user.getItems();
        const avatar = target.displayAvatarURL();
        const count = await profile.getCount(target.id);
        let daily = true;
        if (await profile.getDaily(target.id) == moment().dayOfYear()) daily = false;

        const embed = new Discord.MessageEmbed()
            .setTitle(`${target.tag}'s Profile`)
            .setColor('#42f548')
            .setThumbnail(avatar)
            .addField(`Balance:`, `${balance}💰`)
            .addField(`Daily Available:`, daily, true)
            .addField(`Message Count:`, count, true)
            .setTimestamp();

        if (!items.length) { embed.addField('Inventory:', `${target.tag} has nothing!`); }
        else {
            embed.addField('Inventory:', '-----------------------------');
            items.map(i => embed.addField(`${i.item.name}: `, `${i.amount}`, true));
        }
        msg.channel.send(embed);
    },
};