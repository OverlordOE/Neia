const Discord = require('discord.js');
module.exports = {
	name: 'weekly',
	summary: 'Get a weekly gift',
	description: 'Get a weekly gift.',
	category: 'money',
	aliases: ['week', 'w'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const weekly = await profile.getWeekly(msg.author.id);
		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();


		const embed = new Discord.MessageEmbed()
			.setTitle('Weekly Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bAvatar);

		const reward = 100 + (Math.random() * 50);

		if (weekly === true) {
			profile.addMoney(msg.author.id, reward);
			await profile.setWeekly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.channel.send(embed.setDescription(`You got **${reward.toFixed(1)}💰** from your weekly 🎁\nCome back in a week for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { msg.channel.send(embed.setDescription(`You have already gotten your weekly 🎁\n\nYou can get you next weekly __${weekly}__`)); }
	},
};