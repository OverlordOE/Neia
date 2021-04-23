/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const itemInfo = require('../data/items');
const sellPercentage = 0.6;
module.exports = {
	name: 'Sell',
	summary: `Sell items to get ${sellPercentage * 100}% of your money back`,
	description: `Sell items to get ${sellPercentage * 100}% of your money back.`,
	aliases: ['refund'],
	category: 'economy',
	args: true,
	usage: '<item> <amount>',
	example: 'chest 2',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		const filter = m => m.author.id === msgUser.user_id;
		let amount = 1;
		let temp = '';

		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia Refunds')
			.setThumbnail(message.author.displayAvatarURL())
			.setDescription('What do you want to refund? `80% refund`')
			.setColor('#f3ab16')
			.setFooter('You can type `sell all` to sell your whole inventory.', client.user.displayAvatarURL());

		const sentMessage = await message.channel.send(embed);

		for (let i = 0; i < args.length; i++) {
			if (!(isNaN(args[i]))) amount = parseInt(args[i]);
			// else if (args[i] == 'all') amount = 'all';
			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const item = client.util.getItem(temp);

		if (item) {
			if (await client.userCommands.hasItem(msgUser, item, amount)) {
				if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
				else if (amount < 1) amount = 1;
				const refundAmount = sellPercentage * item.value * amount;

				if (item.emoji == msgUser.reaction) {
					msgUser.reaction == JSON.stringify({
						emoji: '✅',
						value: 1,
					});
					msgUser.save();
				}

				client.userCommands.removeItem(msgUser, item, amount);
				const balance = client.userCommands.addBalance(msgUser, refundAmount);

				sentMessage.edit(embed.setDescription(`You've refunded ${amount} ${item.emoji}__${item.name}(s)__ and received ${client.util.formatNumber(refundAmount)}💰 back.\nYour balance is ${client.util.formatNumber(balance)}💰!`));
			}
			else return sentMessage.edit(embed.setDescription(`You don't have enough ${item.emoji}__${item.name}(s)__!`));
		}
		else return sentMessage.edit(embed.setDescription('You didn\'t specify the item you want to use.'));
	},
};