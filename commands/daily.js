const Discord = require('discord.js');
module.exports = {
	name: 'daily',
	summary: 'Get a daily gift',
	description: 'Get a daily gift and part of your passive income from your collectables.',
	category: 'economy',
	aliases: ['day', 'd'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const daily = await profile.getDaily(msgUser);
		let chest;

		const luck = Math.floor(Math.random() * 5);
		if (luck == 0) chest = 'Epic chest';
		if (luck == 1) chest = 'Mystery chest';
		else chest = 'Rare chest';
		chest = await profile.getItem(chest);


		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(msgUser.pColour)
			.setFooter('You can get up to 2 extra dailys per day by voting.', client.user.displayAvatarURL());


		if (daily === true) {
			if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
				.setImage(`attachment://${chest.picture}`);

			const income = await profile.calculateIncome(msgUser);
			profile.addMoney(msgUser, income.daily);
			profile.addItem(msgUser, chest, 1);
			profile.setDaily(msgUser);

			const balance = profile.formatNumber(msgUser.balance);
			message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your daily 🎁 and ${profile.formatNumber(income.daily)}💰 from your collectables.\nCome back in a day for more!\n\nYour current balance is ${balance}💰`));
		}
		else message.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get you next daily __${daily}__`));
	},
};