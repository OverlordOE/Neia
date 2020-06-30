const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'hourly',
	summary: 'Get an hourly gift',
	description: 'Get an hourly gift and part of your passive income from your collectables.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',
	cooldown: 5,
	category: 'money',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const hourly = await profile.getHourly(msg.author.id);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const avatar = msg.author.displayAvatarURL();
		let reward = 0;
		let chest;

		const luck = Math.floor(Math.random() * 4);
		if (luck >= 1) chest = 'Common chest';
		else chest = 'Rare chest';
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: chest } } });

	
		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());
		
			if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
			.setImage(`attachment://${item.picture}`);

		const items = await user.getItems();
		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					reward += i.item.cost / 400;
				}
			}
		});


		if (hourly === true) {
			profile.addMoney(msg.author.id, reward);
			await user.addItem(item, 1);
			await profile.setHourly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got a ${item.emoji}${item.name} from your hourly 🎁 and **${reward.toFixed(1)}💰** from your collectables.\nCome back in an hour for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};