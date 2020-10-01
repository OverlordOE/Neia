const Discord = require('discord.js');
const items = require('../data/items');
module.exports = {
	name: 'item',
	summary: 'Shows information about a specific item',
	description: 'Shows information about a specific item.',
	category: 'info',
	aliases: ['items', 'i'],
	args: false,
	usage: '<item>',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		let temp = '';
		let embed;

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}


		if (temp) {
			const item = await profile.getItem(temp);
			if (!item) return msgUser.reply(`${item} is not a valid item`);

			embed = new Discord.MessageEmbed()
				.setTitle(`${item.emoji}${item.name}`)
				.setDescription(item.description)
				.addField('Value', `**${profile.formatNumber(item.value)}💰**`, true)
				.addField('Category', item.ctg, true)
				.addField('Rarity', item.rarity, true)
				.setTimestamp()
				.setFooter('Neia', client.user.displayAvatarURL())
				.attachFiles(`assets/rarity/${item.rarity}.jpg`)
				.setThumbnail(`attachment://${item.rarity}.jpg`);

			if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
				.setImage(`attachment://${item.picture}`);

			if (item.ctg == 'equipment') {
				if (item.slot == 'weapon') embed.addField('Damage', `**${item.damage[0]} - ${item.damage[1] + item.damage[0]}**`);
			}
		}
		else {
			let consumable = '__**Consumables:**__\n';
			let collectables = '__**Collectables:**__\n';
			let chests = '__**Chests:**__\n';
			let equipment = '__**Equipment:**__\n';

			Object.values(items).sort((a, b) => {
				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				return 0;
			}).map((i) => {

				if (i.ctg == 'consumable') consumable += `${i.emoji}${i.name}\n`;
				else if (i.ctg == 'collectable') collectables += `${i.emoji}${i.name}\n`;
				else if (i.ctg == 'chest') chests += `${i.emoji}${i.name}\n`;
				else if (i.ctg == 'equipment') equipment += `${i.emoji}${i.name}\n`;
			});

			const description = `${chests}\n${consumable}\n${equipment}\n${collectables}`;

			embed = new Discord.MessageEmbed()
				.setTitle('Neia Shop')
				.setThumbnail(client.user.displayAvatarURL())
				.setDescription(description)
				.setColor(msgUser.pColour)
				.setTimestamp()
				.setFooter('Neia', client.user.displayAvatarURL());

		}

		return message.channel.send(embed);
	},
};