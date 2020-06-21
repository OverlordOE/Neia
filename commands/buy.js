const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'buy',
	description: 'buy an item from the shop.',
	admin: false,
	aliases: ['get'],
	usage: '',
	cooldown: 5,
	owner: false,
	args: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns, dbl) {

		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		const filter = m => m.author.id === msg.author.id;
		let amount = 0;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neija Shop')
			.setThumbnail(avatar)
			.setDescription('What item do you want to buy?')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija Imporium', bAvatar);


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
						collected.first().delete().catch(e => logger.log('error', e));

						sentMessage.edit(embed.setDescription(`How many ${item.name} do you want to buy (max of 10000)?`)).then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									amount = parseInt(collected.first().content);
									collected.first().delete().catch(e => logger.log('error', e));

									buy(profile, sentMessage, amount, embed, item, msg);

								})
								.catch(e => {
									logger.log('error', e);
									msg.reply('you didn\'t answer in time or something went wrong.');
								});
						});
					});
			}
		})
			.catch(e => {
				logger.log('error', e);
				msg.reply('you didn\'t answer in time or something went wrong.');
			});

	},
};

async function buy(profile, sentMessage, amount, embed, item, msg) {

	if (!Number.isInteger(amount)) {
		return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
	}
	else if (amount < 1 || amount > 10000) {
		amount = 1;
	}

	const user = await Users.findOne({ where: { user_id: msg.author.id } });
	let balance = await profile.getBalance(msg.author.id);
	const cost = amount * item.cost;
	if (cost > balance) {
		return sentMessage.edit(embed.setDescription(`You currently have ${balance}, but ${amount} ${item.name}(s) costs ${cost}💰!`));
	}

	profile.addMoney(msg.author.id, -cost);
	await user.addItem(item, amount);
	balance = await profile.getBalance(msg.author.id);
	sentMessage.edit(embed.setDescription(`You've bought: ${amount} ${item.name}(s).\n\nCurrent balance is ${balance}💰.`));
}