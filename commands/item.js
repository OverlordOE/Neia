const Discord = require('discord.js');
module.exports = {
	name: 'item',
	summary: 'Shows information about a specific item',
	description: 'Shows information about a specific item.',
	category: 'info',
	aliases: ['items'],
	args: false,
	usage: '<item>',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		let temp = '';

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const item = await profile.getItem(temp);
		if (!item) return msgUser.reply(`${item} is not a valid item`);
		const embed = new Discord.MessageEmbed()
			.setTitle(`${item.emoji}${item.name}`)
			.setDescription(item.description)
			.addField('cost', `**${item.cost}💰**`, true)
			.addField('Category', item.type, true)
			.addField('Rarity', item.rarity, true)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL())
			.attachFiles(`assets/rarity/${item.rarity}.jpg`)
			.setThumbnail(`attachment://${item.rarity}.jpg`);

		if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
			.setImage(`attachment://${item.picture}`);
		return message.channel.send(embed);
	},
};