const Discord = require('discord.js');
const { Users } = require('../dbObjects');
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

		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const items = await user.getItems();
		let cReward = 0;

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());


		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					cReward += i.item.cost / 400;
				}
			}
		});

		const hReward = 3 + (Math.random() * 5);
		const finalReward = hReward + cReward;

		if (hourly === true) {
			profile.addMoney(msg.author.id, finalReward);
			await profile.setHourly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got **${hReward.toFixed(1)}💰** from your hourly 🎁 and **${cReward.toFixed(1)}💰** from your collectables for a total of **${finalReward.toFixed(1)}💰**\nCome back in an hour for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};