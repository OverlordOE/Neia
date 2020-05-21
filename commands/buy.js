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
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const filter = m => m.author.id === msg.author.id;

		const embed = new Discord.MessageEmbed()
			.setTitle('Syndicate Shop')
			.setDescription('What item do you want to buy?')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);

		msg.channel.send(embed).then(sentMessage => {
			msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

				.then(async collected => {
					const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
					if (!item) return sentMessage.edit(embed.setDescription('That item doesn\'t exist.'));
					collected.first().delete().catch(e => logger.log('error', e));

					sentMessage.edit(embed.setDescription('How many do you want to buy (max of 1000)?')).then(() => {
						msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

							.then(async collected => {
								const amount = parseInt(collected.first().content);
								collected.first().delete().catch(e => logger.log('error', e));

								if (!Number.isInteger(amount)) {
									return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
								}
								else if (amount < 1 || amount > 1000) {
									return sentMessage.edit(embed.setDescription('Enter a number between 1 and 1000'));
								}


								const balance = await profile.getBalance(msg.author.id);
								const cost = amount * item.cost;
								if (cost > balance) {
									return sentMessage.edit(embed.setDescription(`You currently have ${balance}, but ${amount} ${item.name} costs ${cost}💰!`));
								}

								profile.addMoney(msg.author.id, -cost);
								for (let i = 0; i < amount; i++) {
									await user.addItem(item);
									logger.log('info', `Handled purchase ${i + 1} out of ${amount} for item: ${item.name}`);
								}
								sentMessage.edit(embed.setDescription(`You've bought: ${amount} ${item.name}.`));

							})
							.catch(e => {
								logger.log('error', e);
								msg.reply('you didn\'t answer in time.');
							});
					});
				});
		})
			.catch(e => {
				logger.log('error', e);
				msg.reply('you didn\'t answer in time.');
			});
	},
};