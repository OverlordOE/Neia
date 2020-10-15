/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const itemInfo = require('../data/items');
const sellPercentage = 0.8;
module.exports = {
	name: 'sell',
	summary: `Sell items to get ${sellPercentage * 100}% of your money back`,
	description: `Sell items to get ${sellPercentage * 100}% of your money back.`,
	aliases: ['refund'],
	category: 'economy',
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const filter = m => m.author.id === message.author.id;
		let amount = 1;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Refunds')
			.setThumbnail(message.author.displayAvatarURL())
			.setDescription('What do you want to refund? `80% refund`')
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());

		message.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);
				// else if (args[i] == 'all') amount = 'all';
				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = profile.getItem(temp);
			if (temp == 'all') {
				sentMessage.edit(embed.setDescription('Are you sure that you want to sell your WHOLE inventory?\n\nReply with yes to continue'));
				message.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(async collected => {
						collected.first().delete();
						if (collected.first().content.toLowerCase() == 'yes') {

							const inventory = await profile.getInventory(message.author.id);
							let totalReceived = 0;

							inventory.map(i => {
								const item = itemInfo[i.name.toLowerCase()];
								const refundAmount = sellPercentage * item.value * i.amount;
								profile.removeItem(message.author.id, item, i.amount);
								profile.addMoney(message.author.id, refundAmount);
								totalReceived += refundAmount;
							});
							logger.debug(totalReceived);
							sentMessage.edit(embed.setDescription(`You sold your whole inventory for ${profile.formatNumber(totalReceived)}💰\n\nCurrent balance is ${profile.formatNumber(await profile.getBalance(message.author.id))}💰`));
						}
						else return sentMessage.edit(embed.setDescription('Cancelled selling inventory'));
					});
			}

			else if (item) {
				if (await profile.hasItem(message.author.id, item, amount)) sell(profile, sentMessage, amount, embed, item, message);
				else return sentMessage.edit(embed.setDescription(`You don't have enough ${item.emoji}__${item.name}(s)__!`));
			}
			else {
				message.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						const item = await profile.getItem(collected.first().content);
						if (!item) return sentMessage.edit(embed.setDescription(`\`${collected.first().content}\` is not a valid item.`));
						collected.first().delete();

						sentMessage.edit(embed.setDescription(`How much ${item.emoji}__${item.name}(s)__ do you want to sell?`)).then(() => {
							message.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									const amount = parseInt(collected.first().content);
									if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number!`));

									if (await profile.hasItem(message.author.id, item, amount)) sell(profile, sentMessage, amount, embed, item, message);
									else return sentMessage.edit(embed.setDescription(`You don't have enough ${item.emoji}__${item.name}(s)__!`));
								})
								.catch(e => {
									logger.error(e.stack);
									message.reply('you didn\'t answer in time.');
								});
						});
					})
					.catch(e => {
						logger.error(e.stack);
						message.reply('you didn\'t answer in time.');
					});
			}
		});
	},
};


async function sell(profile, sentMessage, amount, embed, item, message) {

	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
	else if (amount < 1) amount = 1;

	const refundAmount = sellPercentage * item.value * amount;
	try {
		profile.removeItem(message.author.id, item, amount);
	} catch (error) {
		return sentMessage.edit(embed.setDescription(`You do not have ${amount} ${item.emoji}__${item.name}(s)__! Selling cancelled.`));
	}

	const balance = await profile.addMoney(message.author.id, refundAmount);

	sentMessage.edit(embed.setDescription(`You've refunded ${amount} ${item.emoji}__${item.name}(s)__ and received ${profile.formatNumber(refundAmount)}💰 back.\nYour balance is ${profile.formatNumber(balance)}💰!`));
}