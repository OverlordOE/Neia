const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'balance',
	description: 'This command is outdated use "-profile" instead',
	admin: false,
	args: false,
	usage: '<user>',
	execute(msg, args, currency) {
		msg.channel.send(`This command is outdated use "-profile" instead`);
    },      
};