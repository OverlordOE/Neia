const { Users, CurrencyShop } = require('../dbObjects');
const moment = require('moment');
const Discord = require('discord.js');
module.exports = {
	name: 'steal',
	description: 'Steal money from other players but have a chance to get caught **45 minute cooldown**.',
	cooldown: 2400,
	args: true,
	usage: 'target',
	admin: false,
	aliases: ['shoot'],
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {

		if (!cooldowns.has('steal')) {
			cooldowns.set('steal', new Discord.Collection());
		}
		const timestamps = cooldowns.get('steal');


		const target = msg.mentions.users.first();
		if (!target) {
			timestamps.delete(msg.author.id);
			return msg.channel.send('Incorrect mention');
		}

		const now = moment();
		const protection = moment(await profile.getProtection(target.id));
		const checkProtection = moment(protection).isBefore(now);

		if (!checkProtection) {
			timestamps.delete(msg.author.id);
			return msg.channel.send(`${target.tag} has steal protection on, you cannot steal from them right now.`);
		}

		const targetBalance = await profile.getBalance(target.id);
		if (targetBalance < 1) {
			timestamps.delete(msg.author.id);
			return msg.channel.send('You cant steal from someone who has no money.');
		}
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();
		let hasItem = false;
		const item = await CurrencyShop.findOne({ where: { name: 'Gun' } });
		uitems.map(i => {
			if (i.item.name == item.name && i.amount >= 1) {
				hasItem = true;
			}
		});
		if (!hasItem) {
			timestamps.delete(msg.author.id);
			return msg.channel.send('You don\'t have a gun to steal with!');
		}


		const luck = Math.floor(Math.random() * 100);
		if (luck >= 30) {

			let stealAmount = 15 + (Math.random() * targetBalance * 0.1);
			if (targetBalance < stealAmount) stealAmount = targetBalance;

			profile.addMoney(msg.author.id, stealAmount);
			profile.addStealingEarned(msg.author.id, stealAmount);
			profile.addMoney(target.id, -stealAmount);
			const balance = await profile.getBalance(msg.author.id);
			await user.removeItem(item, 1);
			const prot = moment(now).add(1, 'h');
			await profile.setProtection(target.id, prot);
			return msg.channel.send(`Successfully stolen ${Math.floor(stealAmount)}💰 from ${target.tag}. Your current balance is ${balance}💰`);
		}
		else if (luck >= 15) {
			await user.removeItem(item, 1);
			return msg.channel.send(`You got caught trying to steal from ${target.tag}, but managed to get away safely.`);
		}
		else if (luck < 15) {
			const fine = 10 + (Math.random() * 20);
			profile.addMoney(msg.author.id, -fine);
			const balance = await profile.getBalance(msg.author.id);
			await user.removeItem(item, 1);
			return msg.channel.send(`You got caught trying to steal from ${target.tag}, you get fined ${Math.floor(fine)}💰. Your current balance is ${balance}💰`);
		}
		else {
			timestamps.delete(msg.author.id);
			return msg.channel.send('Something went wrong');
		}

	},
};