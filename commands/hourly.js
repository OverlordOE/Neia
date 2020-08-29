const Discord = require('discord.js');
module.exports = {
	name: 'hourly',
	summary: 'Get an hourly gift',
	description: 'Get an hourly gift and part of your passive income from your collectables.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',
	cooldown: 5,
	category: 'money',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const hourly = await profile.getHourly(message.author.id);
		let chest;

		const luck = Math.floor(Math.random() * 7);
		if (luck >= 1) chest = 'Common Chest';
		else chest = 'Rare Chest';
		chest = await profile.getItem(chest);

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());


		if (hourly === true) {
			if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
				.setImage(`attachment://${chest.picture}`);

			const income = await profile.calculateIncome(message.author.id);
			profile.addMoney(message.author.id, income.hourly);
			profile.addItem(message.author.id, chest, 1);
			profile.setHourly(message.author.id);
		
			message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your hourly 🎁 and **${profile.formatNumber(income.hourly)}💰** from your collectables.\nCome back in an hour for more!\n\nYour current balance is **${profile.formatNumber(await profile.getBalance(message.author.id))}💰**`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};