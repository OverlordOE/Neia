const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'profile',
    description: 'Shows inventory of tagged user or the sender if noone was tagged.',
    admin: false,
    aliases: ["inv", "items", "prof", "inventory", "balance", "money"],
    args: false,
    usage: '<user>',
    async execute(msg, args, currency) {
        const target = msg.mentions.users.first() || msg.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        const profile = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(`${target.tag}'s Profile `)
            .setThumbnail(target.displayAvatarURL)
            .addField(`Balance:`, `${currency.getBalance(target.id)}💰`)
            .setTimestamp();

        if (!items.length) {profile.addField('Inventory:',`${target.tag} has nothing!`);}
        else {
            profile.addField('Inventory:', '-----------------------------');
            items.map(i => profile.addField(`${i.item.name}: `, `${i.amount}`, true));
        }
        msg.channel.send(profile);
    },
};