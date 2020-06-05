const moment = require('moment');
const Discord = require('discord.js');
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

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);


		const check = moment(lastHourly).add(1, 'h');

		const hourly = check.format('dddd HH:mm');
		const now = moment();
		const reward = 3 + (Math.random() * 5);

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, reward);
			await profile.setHourly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got ${Math.floor(reward)}💰 from your hourly 🎁, come back in an hour for more!\nYour current balance is ${balance}💰`));
		}
		else { msg.channel.send(embed.setDescription(`you have already gotten your hourly 🎁, you can get your next hourly ${hourly}.`)); }


	},
};