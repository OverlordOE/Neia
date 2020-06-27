const Discord = require('discord.js');
const { CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'shop',
	description: 'Shows all the shop items.',
	admin: false,
	aliases: ['store'],
	args: false,
	usage: '',
	owner: false,
	music: false,

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		const items = await CurrencyShop.findAll();
		const bAvatar = msg.author.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		let consumable = '__**Consumables:**__\n';
		let collectables = '__**Collectables:**__\n';

		await items.map(item => {
			if (item.ctg == 'consumable') { consumable += `${item.emoji}__${item.name}__: **${item.cost}💰**\n`; }
			else if (item.ctg == 'collectables') { collectables += `${item.emoji}__${item.name}__: **${item.cost}💰**\n`; }
		});

		const description = `${consumable}\n${collectables}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neija Shop')
			.setThumbnail(bAvatar)
			.setDescription(description)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);

		return msg.channel.send(embed);
	},
};