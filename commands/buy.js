const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'buy',
	summary: 'Buy an item from the shop',
	description: 'With this you can buy an item from the shop.\nYou can either use `buy <item> <amount> to instantly buy the items or just use `buy`.\nIf you use the latter you will get prompted to enter the name and amount of the item that you want into the chat.',
	category: 'money',
	aliases: ['get'],
	usage: '<item> <amount>',
	cooldown: 5,
	args: false,

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {


		const avatar = msg.author.displayAvatarURL();

		const filter = m => m.author.id === msg.author.id;
		let amount = 0;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(avatar)
			.setDescription('What item do you want to buy?')
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia Imporium', bot.user.displayAvatarURL());


		msg.channel.send(embed).then(async sentMessage => {


			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = await CurrencyShop.findOne({ where: { name: { [Op.like]: temp } } });
			if (item) {
				buy(profile, sentMessage, amount, embed, item, msg);
			}
			else {
				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
						if (!item) return sentMessage.edit(embed.setDescription(`${collected.first().content} is not an item.`));
						collected.first().delete().catch(e => logger.error(e.stack));

						sentMessage.edit(embed.setDescription(`How many __${item.name}(s)__ do you want to buy?`)).then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									amount = parseInt(collected.first().content);
									collected.first().delete().catch(e => logger.error(e.stack));

									buy(profile, sentMessage, amount, embed, item, msg);

								})
								.catch(e => {
									logger.error(e.stack);
									msg.reply('you didn\'t answer in time or something went wrong.');
								});
						});
					});
			}
		})
			.catch(e => {
				logger.error(e.stack);
				msg.reply('you didn\'t answer in time or something went wrong.');
			});

	},
};

async function buy(profile, sentMessage, amount, embed, item, msg) {

	if (!Number.isInteger(amount)) {
		return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	}
	else if (amount < 1) {
		amount = 1;
	}

	const user = await Users.findOne({ where: { user_id: msg.author.id } });
	let balance = await profile.getBalance(msg.author.id);
	const cost = amount * item.cost;
	if (cost > balance) {
		return sentMessage.edit(embed.setDescription(`You currently have **${balance}💰**, but __**${amount}**__ __${item.name}(s)__ costs **${cost}💰**!`));
	}

	profile.addMoney(msg.author.id, -cost);
	profile.addShopSpent(msg.author.id, cost);
	await user.addItem(item, amount);
	balance = await profile.getBalance(msg.author.id);
	sentMessage.edit(embed.setDescription(`You've bought: __**${amount}**__ __${item.name}(s)__.\n\nCurrent balance is **${balance}💰**.`));
}