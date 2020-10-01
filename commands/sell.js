/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
module.exports = {
	name: 'sell',
	summary: 'Sell items to get 90% of your money back',
	description: 'Sell items to get 90% of your money back.',
	aliases: ['refund'],
	category: 'economy',
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const filter = m => m.author.id === message.author.id;
		let amount = 0;
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
				else if (args[i] == 'all') amount = 'all';
				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = profile.getItem(temp);
			if (item) {
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

	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	else if (amount < 1) amount = 1;

	const refundAmount = 0.9 * item.value * amount;
	profile.removeItem(message.author.id, item, amount);
	const balance = await profile.addMoney(message.author.id, refundAmount);

	sentMessage.edit(embed.setDescription(`You've refunded ${amount} ${item.emoji}__${item.name}(s)__ and received **${profile.formatNumber(refundAmount)}💰** back.\nYour balance is **${profile.formatNumber(balance)}💰**!`));
}