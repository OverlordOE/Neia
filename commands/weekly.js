const moment = require('moment');
const Discord = require('discord.js');
module.exports = {
	name: 'weekly',
	description: 'Get a weekly gift.',
	admin: false,
	aliases: ['week', 'w'],
	args: false,
	cooldown: 5,
	owner: false,
	usage: '',
	music: false,

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		const lastWeekly = moment(await profile.getWeekly(msg.author.id));
		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);

		const embed = new Discord.MessageEmbed()
			.setTitle('Weekly Reward')
			.setThumbnail(avatar)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);

		const check = moment(lastWeekly).add(1, 'w');
		const weekly = check.format('dddd HH:mm');
		const now = moment();
		const reward = 100 + (Math.random() * 50);

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, reward);
			await profile.setWeekly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got ${reward.toFixed(1)}💰 from your weekly 🎁, come back in a week for more!\n\nYour current balance is ${balance}💰`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your weekly 🎁\n\nYou can get you next weekly ${weekly}`)); }
	},
};