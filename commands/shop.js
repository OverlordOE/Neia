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
		const bAvatar = msg.author.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		let consumable = '__**Consumables:**__\n';
		let discord = '__**Discord related items:**__\n';
		let collectables = '__**Collectables:**__\n';

		await items.map(item => {
			if (item.ctg == 'consumable') { consumable += `${item.name}: ${item.cost}💰\n`; }
			else if (item.ctg == 'collectables') { collectables += `${item.name}: ${item.cost}💰\n`; }
			else if (item.ctg == 'discord') { discord += `${item.name}: ${item.cost}💰\n`; }
		});

		const description = `${consumable}\n${collectables}\n${discord}`;

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