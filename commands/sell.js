/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'sell',
	description: 'Sell items to get 80% of your money back.',
	aliases: ['refund'],
	category: 'money',
	args: false,
	usage: '',

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {

		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();
		const filter = m => m.author.id === msg.author.id;
		const pColour = await profile.getPColour(msg.author.id);
		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();
		let amount = 0;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Refunds')
			.setThumbnail(avatar)
			.setDescription('What do you want to refund? `80% refund`')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neia', bAvatar);

		msg.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = await CurrencyShop.findOne({ where: { name: { [Op.like]: temp } } });
			if (item) {
				uitems.map(i => {
					if (i.item.name == item.name) {
						if (i.item.name == item.name && i.amount >= amount) sell(profile, sentMessage, amount, embed, item, msg);
						else return sentMessage.edit(embed.setDescription(`You only have **${i.amount}/${amount}** of the __${item.name}(s)__ needed!`));
					}
				});
			}
			else {
				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
						if (!item) return sentMessage.edit(embed.setDescription(`\`${item}\` is not a valid item.`));

						let hasItem = false;
						const uitems = await user.getItems();
						collected.first().delete().catch(e => logger.error(e.stack));

						sentMessage.edit(embed.setDescription(`How much __${item.name}(s)__ do you want to sell?`)).then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									const amount = parseInt(collected.first().content);
									if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number!`));
									else if (amount < 1 || amount > 10000) return sentMessage.edit(embed.setDescription('Enter a number between 1 and 10000'));

									uitems.map(i => {
										if (i.item.name == item.name && i.amount >= amount) {
											hasItem = true;
										}
									});

									if (!hasItem) {
										return sentMessage.edit(embed.setDescription(`You don't have enough __${item.name}(s)__!`));
									}

									sell(profile, sentMessage, amount, embed, item, msg);

								})
								.catch(e => {
									logger.error(e.stack);
									msg.reply('you didn\'t answer in time.');
								});
						});
					})
					.catch(e => {
						logger.error(e.stack);
						msg.reply('you didn\'t answer in time.');
					});
			}
		});
	},
};


async function sell(profile, sentMessage, amount, embed, item, msg) {

	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	else if (amount < 1) amount = 1;

	const user = await Users.findOne({ where: { user_id: msg.author.id } });
	const refundAmount = 0.8 * item.cost * amount;
	await user.removeItem(item, amount);
	await profile.addMoney(msg.author.id, refundAmount);

	const balance = await profile.getBalance(msg.author.id);
	sentMessage.edit(embed.setDescription(`You've refunded ${amount} __${item.name}(s)__ and received **${Math.floor(refundAmount)}💰** back.\nYour balance is **${balance}💰**!`));
}