const Discord = require('discord.js');
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
		const avatar = msg.author.displayAvatarURL();
		let reward = 0;
		let chest;

		const luck = Math.floor(Math.random() * 5);
		if (luck >= 1) chest = 'Rare chest';
		else chest = 'Epic chest';
		const item = await profile.getItem(chest);


		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());


		const items = await profile.getInventory(msg.author.id);
		items.map(i => {
			if (i.amount < 1) return;
			if (i.base.ctg == 'collectables') reward += i.amount * (i.base.cost / 100);
		});


		if (daily === true) {
			if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
				.setImage(`attachment://${item.picture}`);
			profile.addMoney(msg.author.id, reward);
			await profile.addItem(msg.author.id, item, 1);
			await profile.setDaily(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got a ${item.emoji}${item.name} from your daily 🎁 and **${reward.toFixed(1)}💰** from your collectables.\nCome back in a day for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get you next daily __${daily}__`)); }
	},
};