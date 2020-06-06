const moment = require('moment');
const Discord = require('discord.js');
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
		const pColour = await profile.getPColour(msg.author.id);

		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);

		const check = moment(lastDaily).add(1, 'd');

		const daily = check.format('dddd HH:mm');
		const now = moment();
		const reward = 20 + (Math.random() * 10);

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, reward);
			await profile.setDaily(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got ${Math.floor(reward)}💰 from your daily 🎁, come back in a day for more!\n Your current balance is ${balance}💰`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your daily 🎁\nYou can get you next daily ${daily}`)); }
	},
};