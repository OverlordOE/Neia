const Discord = require('discord.js');
const emojiCharacters = require('../emojiCharacters');
module.exports = {
	name: 'character',
	summary: 'Shows information about a specific character',
	description: 'Shows information about a specific character.',
	category: 'info',
	aliases: ['char'],
	args: false,
	usage: '<character>',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		let temp = '';
		const embed = new Discord.MessageEmbed()
		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const character = await profile.getCharacter(temp);
		if (character) {
			embed
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
				return [emojiCharacters[1], emojiCharacters[2], emojiCharacters[3], emojiCharacters[4], emojiCharacters[5], emojiCharacters[6]].includes(reaction.emoji.name) && user.id === msg.author.id;
			};
			let warrior = '';
			let assassin = '';
			let archer = '';
			let crusader = '';
			let wizard = '';
			let necromancer = '';

			const fs = require('fs');
			const characterData = fs.readFileSync('data/characters.json');
			const characters = JSON.parse(characterData);
			characters.map(char => {
				switch (char.class) {
					case 'Warrior':
						warrior += `__${char.rarity}__ **${char.name}**: ${char.description}`;
						break;

					case 'Assassin':
						assassin += `__${char.rarity}__ **${char.name}**: ${char.description}`;
						break;

					case 'Archer':
						archer += `__${char.rarity}__ **${char.name}**: ${char.description}`;
						break;

					case 'Crusader':
						crusader += `__${char.rarity}__ **${char.name}**: ${char.description}`;
						break;

					case 'Wizard':
						wizard += `__${char.rarity}__ **${char.name}**: ${char.description}`;
						break;

					case 'Necromancer':
						necromancer += `__${char.rarity}__ **${char.name}**: ${char.description}`;
						break;
				}
			});

			msg.channel.send(embed.setTitle('Warriors')
				.setDescription(warrior)
				.setColor('#b56100')).then(sentMessage => {
				sentMessage.react(emojiCharacters[1]);
				sentMessage.react(emojiCharacters[2]);
				sentMessage.react(emojiCharacters[3]);
				sentMessage.react(emojiCharacters[4]);
				sentMessage.react(emojiCharacters[5]);
				sentMessage.react(emojiCharacters[6]);
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(msg.author.id);
					switch (reaction.emoji.name) {
						case emojiCharacters[1]:
							sentMessage.edit(embed.setTitle('Warriors')
								.setDescription(warrior)
								.setColor('#b56100'));
							break;

						case emojiCharacters[2]:
							sentMessage.edit(embed.setTitle('Assassins')
								.setDescription(assassin)
								.setColor('#6587c0'));
							break;

						case emojiCharacters[3]:
							sentMessage.edit(embed.setTitle('Archers')
								.setDescription(archer)
								.setColor('#0c5f2c'));
							break;

						case emojiCharacters[4]:
							sentMessage.edit(embed.setTitle('Crusaders')
								.setDescription(crusader)
								.setColor('#ffb90f'));
							break;

						case emojiCharacters[5]:
							sentMessage.edit(embed.setTitle('Wizards')
								.setDescription(wizard)
								.setColor('#d546a6'));
							break;

						case emojiCharacters[6]:
							sentMessage.edit(embed.setTitle('Necromancers')
								.setDescription(necromancer)
								.setColor('#4d1395'));
							break;
					}
				});
			});
		}
	},
};
function editEmbed(description, page, embed) {

}