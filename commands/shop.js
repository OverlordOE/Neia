const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'shop',
	description: 'Shows all the shop items.',
	admin: false,
	aliases: ['store'],
	args: false,
	usage: '',
	owner: false,
	music: false,
	
	async execute(msg, args, profile) {
		const items = await CurrencyShop.findAll();
		return msg.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });
	},
};