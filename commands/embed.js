const Discord = require('discord.js');
module.exports = {
	name: 'embed',
	description: 'test command',
	admin: false,
	aliases: [],
	args: false,
	usage: '',
	owner: true,
	music: false,


	async execute(msg, args, profile) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Hunter')
			.setURL('https://classic.wowhead.com/guides/classic-wow-consumables-list-for-each-class')
			.setColor('#43eb34')
			.setThumbnail('https://cdn.discordapp.com/emojis/658576150112763934.png?v=1')
			.addField('Hunter description', 'The hunter is a class that uses mainly bow and arrows and beast pets')
			.addField('**Hunter consumables**', '[Greater Fire Protection Potion:](https://classic.wowhead.com/item=13457/greater-fire-protection-potion) 10x\n[Greater Arcane Protection Potion:](https://classic.wowhead.com/item=13461/greater-arcane-protection-potion) 2x')			
			
			.setTimestamp();

		msg.channel.send(embed);
	},
};