const Discord = require('discord.js');
const { CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'shop',
	summary: 'Shows all the shop items',
	description: 'Shows all the shop items.',
	category: 'info',
	aliases: ['store'],
	args: false,
	usage: '',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const items = await CurrencyShop.findAll();
		const bAvatar = msg.author.displayAvatarURL();

		let consumable = '__**Consumables:**__\n';
		let collectables = '__**Collectables:**__\n';

		await items.map(item => {
			if (item.ctg == 'consumable') { consumable += `${item.emoji}__${item.name}__: **${item.cost}💰**\n`; }
			else if (item.ctg == 'collectables') { collectables += `${item.emoji}__${item.name}__: **${item.cost}💰**\n`; }
		});

		const description = `${consumable}\n${collectables}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(bAvatar)
			.setDescription(description)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bAvatar);

		return msg.channel.send(embed);
	},
};