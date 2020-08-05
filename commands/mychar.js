const Discord = require('discord.js');
module.exports = {
	name: 'profile',
	summary: 'Shows information about a specific profile',
	description: 'Shows information about a specific profile.',
	category: 'info',
	aliases: ['char'],
	args: false,
	usage: '<profile>',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		let temp = '';
		const target = msg.mentions.users.first() || msg.author;

		for (let i = 0; i < args.length; i++) {
			if (!(args[i].startsWith('<@'))) {
				if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}
		}

		const userChar = await profile.getUserChar(target.id, temp);
		const profile = userChar.base;
		if (!userChar) return msg.reply(`${target} doesn't have a profile with the nickname ${temp}`);
		const embed = new Discord.MessageEmbed()
			.setTitle(`__${profile.name}__`)
			.setDescription(profile.description)
			.addField('Class', `**${profile.class}**`, true)
			.addField('Rarity', profile.rarity, true)
			.addField('HP', profile.stats.hp, true)
			.addField('MP', profile.stats.mp, true)
			.addField('Strength', profile.stats.str, true)
			.addField('Dexterity', profile.stats.dex, true)
			.addField('Constitution', profile.stats.con, true)
			.addField('intelligence', profile.stats.int, true)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL())
			.attachFiles(`assets/rarity/${profile.rarity}.jpg`)
			.setThumbnail(`attachment://${profile.rarity}.jpg`);

		if (profile.picture) embed.attachFiles(`assets/characters/${profile.picture}`)
			.setImage(`attachment://${profile.picture}`);

		return msg.channel.send(embed);

	},
};