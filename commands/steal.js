const moment = require('moment');
const Discord = require('discord.js');
module.exports = {
	name: 'steal',
	summary: 'Steal money from other players',
	description: 'Steal money from other players but have a chance to get caught **45 minute cooldown**.',
	cooldown: 2400,
	args: true,
	usage: 'target',
	category: 'money',
	aliases: ['shoot'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		if (!cooldowns.has('steal')) {
			cooldowns.set('steal', new Discord.Collection());
		}
		const timestamps = cooldowns.get('steal');


		const target = message.mentions.users.first();
		if (!target) {
			timestamps.delete(message.author.id);
			return message.channel.send('Incorrect mention');
		}

		const targetOpted = await profile.getOptIn(target.id);
		if (!targetOpted) {
			timestamps.delete(message.author.id);
			return message.channel.send(`*${target.tag}* is not opted into pvp for the client.\nThey can use the command \`opt in\` to enable pvp.`);
		}

		const protection = await profile.getProtection(target.id);
		const now = moment();

		if (protection !== false) {
			timestamps.delete(message.author.id);
			return message.channel.send(`*${target.tag}* has steal protection on, you cannot steal from them right now.`);
		}

		const targetBalance = await profile.getBalance(target.id);
		if (targetBalance < 1) {
			timestamps.delete(message.author.id);
			return message.channel.send('You cant steal from someone who has no money.');
		}
		const uitems = await profile.getInventory(message.author.id);
		let hasItem = false;
		const item = await profile.getItem('gun');
		uitems.map(i => {
			if (i.name == item.name && i.amount >= 1) {
				hasItem = true;
			}
		});
		if (!hasItem) {
			timestamps.delete(message.author.id);
			return message.channel.send('You don\'t have a gun to steal with!');
		}


		const luck = Math.floor(Math.random() * 100);
		if (luck >= 30) {

			const stealLuck = 0.05 + (Math.random() * 0.1);
			let stealAmount = 15 + (targetBalance * stealLuck);
			if (targetBalance < stealAmount) stealAmount = targetBalance;

			profile.addMoney(message.author.id, stealAmount);
			profile.addStealingEarned(message.author.id, stealAmount);
			profile.addMoney(target.id, -stealAmount);
			const balance = await profile.getBalance(message.author.id);
			await profile.removeItem(message.author.id, item, 1);
			const prot = moment(now).add(1, 'h');
			await profile.setProtection(target.id, prot);
			return message.channel.send(`Successfully stolen **${Math.floor(stealAmount)}💰** from *${target.tag}*. Your current balance is **${balance}💰**`);
		}
		else if (luck >= 15) {
			await profile.removeItem(message.author.id, item, 1);
			return message.channel.send(`You got caught trying to steal from *${target.tag}*, but managed to get away safely.`);
		}
		else if (luck < 15) {
			const fine = 10 + (Math.random() * 20);
			profile.addMoney(message.author.id, -fine);
			const balance = await profile.getBalance(message.author.id);
			await profile.removeItem(message.author.id, item, 1);
			return message.channel.send(`You got caught trying to steal from *${target.tag}*, you get fined **${Math.floor(fine)}💰**. Your current balance is **${balance}💰**`);
		}
		else {
			timestamps.delete(message.author.id);
			return message.channel.send('Something went wrong');
		}

	},
};