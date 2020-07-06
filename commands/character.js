const Discord = require('discord.js');
module.exports = {
	name: 'character',
	summary: 'Shows information about a specific character',
	description: 'Shows information about a specific character.',
	category: 'info',
	aliases: ['char'],
	args: true,
	usage: '<character>',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		let temp = '';

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const character = await profile.getCharacter(temp);
		if (!character) return msg.channel.send(`\`${temp}\` is not a valid character.`, { code: true });

		const embed = new Discord.MessageEmbed()
			.setTitle(`__${character.name}__`)
			.setDescription(character.description)
			.addField('Class', `**${character.class}**`, true)
			.addField('Rarity', character.rarity, true)
			.addField('HP', character.hp, true)
			.addField('MP', character.mp, true)
			.addField('Strength', character.str, true)
			.addField('Dexterity', character.dex, true)
			.addField('Constitution', character.con, true)
			.addField('intelligence', character.int, true)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL())
			.attachFiles(`assets/rarity/${character.rarity}.jpg`)
			.setThumbnail(`attachment://${character.rarity}.jpg`);

		if (character.picture) embed.attachFiles(`assets/characters/${character.picture}`)
			.setImage(`attachment://${character.picture}`);

		return msg.channel.send(embed);
	},
};