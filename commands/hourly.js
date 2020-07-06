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

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const hourly = await profile.getHourly(msg.author.id);
		const avatar = msg.author.displayAvatarURL();
		let reward = 0;
		let chest;

		const luck = Math.floor(Math.random() * 5);
		if (luck >= 1) chest = 'Common Chest';
		else chest = 'Rare Chest';
		const item = await profile.getItem(chest);

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());


		const items = await profile.getInventory(msg.author.id);
		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					reward += i.item.cost / 400;
				}
			}
		});


		if (hourly === true) {
			if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
				.setImage(`attachment://${item.picture}`);
			profile.addMoney(msg.author.id, reward);
			await profile.addItem(msg.author.id, item, 1);
			await profile.setHourly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got a ${item.emoji}${item.name} from your hourly 🎁 and **${reward.toFixed(1)}💰** from your collectables.\nCome back in an hour for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};