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
		if (character) {

			const embed = new Discord.MessageEmbed()
				.setTitle(`__${character.name}__`)
				.setDescription(character.description)
				.addField('Class', `**${character.class}**`, true)
				.addField('Rarity', character.rarity, true)
				.addField('HP', character.stats.hp, true)
				.addField('MP', character.stats.mp, true)
				.addField('Strength', character.stats.str, true)
				.addField('Dexterity', character.stats.dex, true)
				.addField('Constitution', character.stats.con, true)
				.addField('intelligence', character.stats.int, true)
				.setTimestamp()
				.setFooter('Neia', bot.user.displayAvatarURL())
				.attachFiles(`assets/rarity/${character.rarity}.jpg`)
				.setThumbnail(`attachment://${character.rarity}.jpg`);

			if (character.picture) embed.attachFiles(`assets/characters/${character.picture}`)
				.setImage(`attachment://${character.picture}`);

			return msg.channel.send(embed);
		}
		else {
			const filter = (reaction, user) => {
				return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === msg.author.id;
			};
			const fs = require('fs');
			const characterData = fs.readFileSync('data/characters.json');
			const characters = JSON.parse(characterData);
			characters.map(char => {
				switch (char.class) {
					case value:
						
						break;
				
					default:
						break;
				}

			})

		}
	},
};
function editDescription(list, page) {
	let description = '';
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (list[i]) description += list[i];
		else description += `\n__**${i + 1}.**__ noone`;
	}
	return description;
}