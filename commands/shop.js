const Discord = require('discord.js');
const items = require('../data/items');
module.exports = {
	name: 'shop',
	summary: 'Shows all the shop items',
	description: 'Shows all the shop items.',
	category: 'money',
	aliases: ['store'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		let consumable = '__**Consumables:**__\n';
		let collectables = '__**collectables:**__\n';
		let chests = '__**Chests:**__\n';

		Object.values(items).sort((a, b) => a.cost - b.cost).map((i) => {
			if (i.cost) {
				if (i.ctg == 'consumable') consumable += `${i.emoji} ${i.name}: **${profile.formatNumber(i.cost)}💰**\n`;
				else if (i.ctg == 'collectable') collectables += `${i.emoji} ${i.name}: **${profile.formatNumber(i.cost)}💰**\n`;
				else if (i.ctg == 'chest') chests += `${i.emoji} ${i.name}: **${profile.formatNumber(i.cost)}💰**\n`;
			}
		});

		const description = `${chests}\n${consumable}\n${collectables}`;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(description)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());

		return message.channel.send(embed);
	},
};