const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'daily',
	summary: 'Get a daily gift',
	description: 'Get a daily gift and part of your passive income from your collectables.',
	category: 'money',
	aliases: ['day', 'd'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		
		const daily = await profile.getDaily(msg.author.id);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const avatar = msg.author.displayAvatarURL();
		let reward = 0;
		let chest;

		const luck = Math.floor(Math.random() * 3);
		if (luck >= 1) chest = 'Rare chest';
		else chest = 'Epic chest';
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: chest } } });


		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());


		const items = await user.getItems();
		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					reward += i.item.cost / 100;
				}
			}
		});


		if (daily === true) {
			if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
				.setImage(`attachment://${item.picture}`);
			profile.addMoney(msg.author.id, reward);
			await user.addItem(item, 1);
			await profile.setDaily(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got a ${item.emoji}${item.name} from your daily 🎁 and **${reward.toFixed(1)}💰** from your collectables.\nCome back in a day for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get you next daily __${daily}__`)); }
	},
};