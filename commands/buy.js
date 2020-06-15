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

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {

		const bAvatar = bot.user.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		const filter = m => m.author.id === msg.author.id;
		let amount = 0;
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Syndicate Shop')
			.setDescription('What item do you want to buy?')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);


		msg.channel.send(embed).then(async sentMessage => {


			for (let i = 0; i < 2; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);
				else item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[i] } } });
			}
			if (item) {
				buy(profile, sentMessage, amount, embed, item, msg);
			}
			else {
				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
						if (!item) return sentMessage.edit(embed.setDescription(`${item} is not an item.`));
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
		return sentMessage.edit(embed.setDescription('Enter a number between 1 and 10000(numbers greater then 500 will take longer to process.'));
	}

	const user = await Users.findOne({ where: { user_id: msg.author.id } });
	const balance = await profile.getBalance(msg.author.id);
	const cost = amount * item.cost;
	if (cost > balance) {
		return sentMessage.edit(embed.setDescription(`You currently have ${balance}, but ${amount} ${item.name} costs ${cost}💰!`));
	}

	profile.addMoney(msg.author.id, -cost);
	await user.addItem(item, amount);
	sentMessage.edit(embed.setDescription(`You've bought: ${amount} ${item.name}.`));
}