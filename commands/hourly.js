const Discord = require('discord.js');
module.exports = {
	name: 'hourly',
	summary: 'Get an hourly gift',
	description: 'Get an hourly gift and part of your passive income from your collectables.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',

	category: 'economy',

	async execute(message, args, msgUser, character, guildProfile, client, logger) {
		const hourly = character.getHourly(msgUser);
		let chest;

		const luck = Math.floor(Math.random() * 6);
		if (luck == 0) chest = 'Mystery Chest';
		else if (luck == 1 || luck == 2) chest = 'Rare chest';
		else chest = 'Common Chest';
		chest = character.getItem(chest);

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(character.getColour(msgUser))

			.setFooter('You can see how much income you get on your character.', client.user.displayAvatarURL());


		if (hourly === true) {
			if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
				.setImage(`attachment://${chest.picture}`);

			const income = await character.calculateIncome(msgUser);
			const balance = character.addMoney(msgUser, income.hourly);
			character.addItem(msgUser, chest, 1);
			character.setHourly(msgUser);

			message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your hourly 🎁 and ${character.formatNumber(income.hourly)}💰 from your collectables.\nCome back in an hour for more!\n\nYour current balance is ${character.formatNumber(balance)}💰`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};