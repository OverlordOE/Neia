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
		let item;
		let amount = 0;
		const filter = m => m.author.id === msg.author.id;

		const embed = new Discord.MessageEmbed()
			.setTitle('Syndicate Shop')
			.setDescription('What item do you want to buy?')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);


		msg.channel.send(embed).then(sentMessage => {
			const collector = msg.channel.createMessageCollector(filter, { time: 60000 });

			collector.on('collect', async m => {
				m.delete().catch(e => logger.log('error', e));
				item = await CurrencyShop.findOne({ where: { name: { [Op.like]: m.content } } });
				if (!item) return sentMessage.edit(embed.setDescription(`What item do you want to buy?\n\n${m.content} doesn't exist, try again.`));
				else collector.emit('end');
			});

			collector.on('end', () => {

				sentMessage.edit(embed.setDescription(`How many ${item.name} do you want to buy (max of 10000)?`)).then(() => {

					const collector2 = msg.channel.createMessageCollector(filter, { time: 60000 });

					collector2.on('collect', m => {
						m.delete().catch(e => logger.log('error', e));
						amount = parseInt(m.content);

						if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
						else if (amount < 1 || amount > 10000) return sentMessage.edit(embed.setDescription('Enter a number between 1 and 10000'));
						else collector2.emit('end');
					});

					collector2.on('end', async () => {
						
						const balance = await profile.getBalance(msg.author.id);
						const cost = amount * item.cost;
						if (cost > balance) {
							return sentMessage.edit(embed.setDescription(`You currently have ${balance}, but ${amount} ${item.name} costs ${cost}💰!`));
						}
						profile.addMoney(msg.author.id, -cost);
						await user.addItem(item, amount);
						const balance2 = await profile.getBalance(msg.author.id);
						sentMessage.edit(embed.setDescription(`You've bought: ${amount} ${item.name}.\nYour balance is ${balance2}💰.`));

					});
				});
			});
		});
	},
};