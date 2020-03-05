const { Users, CurrencyShop } = require('../dbObjects');
const currency = require('../index.js')
module.exports = {
	name: 'balance',
	description: 'Shows balance of tagged user or the sender if noone was tagged.',
	admin: false,
	aliases: ["wallet", "b", "money"],
	args: false,
	usage: '<user>',
	execute(msg, args) {
        const target = msg.mentions.users.first() || msg.author;
        return msg.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);        
	},
};