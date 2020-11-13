const Discord = require('discord.js');
module.exports = {
	name: 'hourly',
	summary: 'Get an hourly gift',
	description: 'Get an hourly gift and part of your passive income from your collectables.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',

	category: 'economy',

	async execute(message, args, msgUser, profile, guildProfile, client, logger) {
		const hourly = profile.getHourly(msgUser);
		let chest;

		const luck = Math.floor(Math.random() * 6);
		if (luck == 0) chest = 'Mystery Chest';
		else if (luck == 1 || luck == 2) chest = 'Rare chest';
		else chest = 'Common Chest';
		chest = profile.getItem(chest);

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(msgUser.pColour)

			.setFooter('You can see how much income you get on your profile.', client.user.displayAvatarURL());


		if (hourly === true) {
			if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
				.setImage(`attachment://${chest.picture}`);

			const income = await profile.calculateIncome(msgUser);
			const balance = profile.addMoney(msgUser, income.hourly);
			profile.addItem(msgUser, chest, 1);
			profile.setHourly(msgUser);

			message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your hourly 🎁 and ${profile.formatNumber(income.hourly)}💰 from your collectables.\nCome back in an hour for more!\n\nYour current balance is ${profile.formatNumber(balance)}💰`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};