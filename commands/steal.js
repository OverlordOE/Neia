const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'steal',
	description: 'Steal money from other players but have a chance to get caught **1 hour cooldown**.',
	cooldown: 3600,
	args: true,
	usage: 'target',
	admin: false,
	aliases: ['shoot'],
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, ops, ytAPI, logger) {

		const target = msg.mentions.users.first();
		const targetBalance = await profile.getBalance(target.id);
		if (targetBalance < 1) return msg.channel.send('You cant steal from someone who has no money.');
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();
		let hasItem = false;
		const item = await CurrencyShop.findOne({ where: { name: 'Gun' } });
		uitems.map(i => {
			if (i.item.name == item.name && i.amount >= 1) {
				hasItem = true;
			}
		});
		if (!hasItem) return msg.channel.send('You don\'t have a gun to steal with!');


		const luck = Math.floor(Math.random() * 100);
		if (luck >= 35) {

			let stealAmount = 30 + (Math.random() * 30);
			if (targetBalance < stealAmount) stealAmount = targetBalance;

			profile.addMoney(msg.author.id, stealAmount);
			profile.addMoney(target.id, -stealAmount);
			const balance = await profile.getBalance(msg.author.id);
			await user.removeItem(item);
			return msg.channel.send(`Successfully stolen ${Math.floor(stealAmount)}💰 from ${target.tag}. Your current balance is ${balance}💰`);
		}
		else if (luck < 35) {
			const fine = 15 + (Math.random() * 20);
			profile.addMoney(msg.author.id, -fine);
			const balance = await profile.getBalance(msg.author.id);
			await user.removeItem(item);
			return msg.channel.send(`You got caught trying to steal from ${target.tag}, you get fined ${Math.floor(fine)}💰. Your current balance is ${balance}💰`);
		}
		else { return msg.channel.send('Something went wrong'); }

	},
};