const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'balance',
	description: 'Shows balance of tagged user or the sender if noone was tagged.',
	admin: false,
	aliases: ["wallet", "b", "money"],
	args: false,
	usage: '<user>',
	execute(msg, args, currency) {
		const target = msg.mentions.users.first() || msg.author;
        return msg.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);        
	},
};