const Discord = require('discord.js');
module.exports = {
	name: 'daily',
	summary: 'Get a daily gift',
	description: 'Get a daily gift and part of your passive income from your collectables.',
	category: 'economy',
	aliases: ['day', 'd'],
	args: false,

	usage: '',

	async execute(message, args, msgUser, character, guildProfile, client, logger) {
		const daily = character.getDaily(msgUser);
		let chest;

		const luck = Math.floor(Math.random() * 5);
		if (luck == 0) chest = 'Epic chest';
		if (luck == 1) chest = 'Mystery chest';
		else chest = 'Rare chest';
		chest = character.getItem(chest);


		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(character.getColour(msgUser))
			.setFooter('You can get up to 2 extra dailys per day by voting.', client.user.displayAvatarURL());


		if (daily === true) {
			if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
				.setImage(`attachment://${chest.picture}`);

			const income = await character.calculateIncome(msgUser);
			character.addMoney(msgUser, income.daily);
			character.addItem(msgUser, chest, 1);
			character.setDaily(msgUser);

			const balance = character.formatNumber(msgUser.balance);
			message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your daily 🎁 and ${character.formatNumber(income.daily)}💰 from your collectables.\nCome back in a day for more!\n\nYour current balance is ${balance}💰`));
		}
		else message.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get you next daily __${daily}__`));
	},
};