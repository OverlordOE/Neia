const moment = require('moment');
const Discord = require('discord.js');
const { Users } = require('../dbObjects');
module.exports = {
	name: 'hourly',
	description: 'Get an hourly gift.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',
	cooldown: 5,
	owner: false,
	admin: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const lastHourly = moment(await profile.getHourly(msg.author.id));
		const bAvatar = bot.user.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const items = await user.getItems();
		let cReward = 0;

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);


		const check = moment(lastHourly).add(1, 'h');


		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					cReward += i.item.cost / 200;
				}
			}
		});

		const hourly = check.format('dddd HH:mm');
		const now = moment();
		const hReward = 3 + (Math.random() * 5);
		const finalReward = hReward + cReward;

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, finalReward);
			await profile.setHourly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got ${hReward.toFixed(1)}💰 from your hourly 🎁 and ${cReward.toFixed(1)}💰 from your collectables for a total of ${finalReward.toFixed(1)}💰, come back in an hour for more!\n\nYour current balance is ${balance}💰`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly ${hourly}.`)); }


	},
};