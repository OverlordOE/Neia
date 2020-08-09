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

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const daily = await profile.getDaily(message.author.id);
		let reward = 0;
		let chest;

		const luck = Math.floor(Math.random() * 5);
		if (luck >= 1) chest = 'Rare chest';
		else chest = 'Epic chest';
		chest = await profile.getItem(chest);


		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());


		const items = await profile.getInventory(message.author.id);
		items.map(i => {
			if (i.amount < 1) return;
			const item = profile.getItem(i.name);
			if (item.ctg == 'collectables') reward += i.amount * (item.cost / 100);
		});


		if (daily === true) {
			if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
				.setImage(`attachment://${chest.picture}`);

			profile.addMoney(message.author.id, reward);
			profile.addItem(message.author.id, chest, 1);
			profile.setDaily(message.author.id);

			const balance = await profile.getBalance(message.author.id);
			message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your daily 🎁 and **${Math.floor(reward)}💰** from your collectables.\nCome back in a day for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get you next daily __${daily}__`)); }
	},
};