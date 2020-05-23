const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'shop',
	description: 'Shows all the shop items.',
	admin: false,
	aliases: ['store', 'item', 'items'],
	args: false,
	usage: '',
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const items = await CurrencyShop.findAll();
		const bAvatar = bot.user.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		let description = ``;
		items.map(item => { description += `**${item.name}:** ${item.cost}💰\n`; });

		const embed = new Discord.MessageEmbed()
			.setTitle('Syndicate Shop')
			.setThumbnail(bAvatar)
			.setDescription(description)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);

		return msg.channel.send(embed);
	},
};