const moment = require('moment');
const Discord = require('discord.js');
const { Users } = require('../dbObjects');
module.exports = {
	name: 'daily',
	description: 'Get a daily gift.',
	admin: false,
	aliases: ['day', 'd'],
	args: false,
	cooldown: 5,
	owner: false,
	usage: '',
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const lastDaily = moment(await profile.getDaily(msg.author.id));
		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();

		const pColour = await profile.getPColour(msg.author.id);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const items = await user.getItems();
		let cReward = 0;

		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(avatar)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);

		const check = moment(lastDaily).add(1, 'd');


		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					cReward += i.item.cost / 20;
				}
			}
		});


		const daily = check.format('dddd HH:mm');
		const now = moment();
		const dReward = 20 + (Math.random() * 10);
		const finalReward = dReward + cReward;

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, finalReward);
			await profile.setDaily(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got ${dReward.toFixed(1)}💰 from your daily 🎁 and ${cReward.toFixed(1)}💰 from your collectables for a total of ${finalReward.toFixed(1)}💰, come back in a day for more!\n\nYour current balance is ${balance}💰`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get you next daily ${daily}`)); }
	},
};