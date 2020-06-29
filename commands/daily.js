const Discord = require('discord.js');
const { Users } = require('../dbObjects');
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
		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();


		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const items = await user.getItems();
		let cReward = 0;

		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bAvatar);


		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					cReward += i.item.cost / 60;
				}
			}
		});

		const dReward = 20 + (Math.random() * 10);
		const finalReward = dReward + cReward;

		if (daily === true) {
			profile.addMoney(msg.author.id, finalReward);

			await profile.setDaily(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got **${dReward.toFixed(1)}💰** from your daily 🎁 and **${cReward.toFixed(1)}💰** from your collectables for a total of **${finalReward.toFixed(1)}💰**\nCome back in a day for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get you next daily __${daily}__`)); }
	},
};