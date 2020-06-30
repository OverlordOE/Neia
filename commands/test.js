const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'test',
	summary: 'Get a weekly gift',
	description: 'Get a weekly gift.',
	category: 'money',
	aliases: ['t'],
	args: false,
	usage: '',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const avatar = msg.author.displayAvatarURL();
		let chest;
		const luck = Math.floor(Math.random() * 2);
		if (luck >= 1) chest = 'Legendary chest';
		else chest = 'Epic chest';
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: chest } } });


		const embed = new Discord.MessageEmbed()
			.setTitle('Weekly Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());

		if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
			.setImage(`attachment://${item.picture}`);


			await user.addItem(item, 1);
			await profile.setWeekly(msg.author.id);
			msg.channel.send(embed.setDescription(`You got a ${item.emoji}${item.name} from your weekly 🎁\nCome back in a week for more!`));
},
};