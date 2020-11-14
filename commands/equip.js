const Discord = require('discord.js');
module.exports = {
	name: 'equip',
	summary: 'Equip an item from your inventory',
	description: 'Equip an item from your inventory.',
	category: 'pvp',
	aliases: ['e'],
	args: false,
	usage: '<item>',

	async execute(message, args, msgUser, profile, guildProfile, client, logger) {
		const filter = m => m.author.id === message.author.id;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Equipping')
			.setThumbnail(message.author.displayAvatarURL())
			.setDescription('What item do you want to equip?')
			.setColor(profile.getColour(msgUser))
			.setFooter('Use the `attack` command to kill people.', client.user.displayAvatarURL());

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		item = profile.getItem(temp);
		if (item) embed.attachFiles(`assets/items/${item.picture}`);

		message.channel.send(embed).then(async sentMessage => {
			if (item) {
				if (await profile.hasItem(msgUser, item, 1)) {
					if (profile.equip(msgUser, item)) sentMessage.edit(embed.setDescription(`Successfully equipped __${item.emoji}${item.name}__ to slot **${item.slot}**.`).setImage(`attachment://${item.picture}`));
					else sentMessage.edit(embed.setDescription(`Something went wrong with equipping ${item.emoji}${item.name}.`));
				}
				else return sentMessage.edit(embed.setDescription(`You don't have a __${item.name}__!`));
			}
			else {

				message.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(async collected => {
						item = profile.getItem(collected.first().content);
						collected.first().delete();

						if (item) {
							if (await profile.hasItem(msgUser, item, 1)) {
								if (profile.equip(msgUser, item)) sentMessage.edit(embed.setDescription(`Successfully equipped __${item.emoji}${item.name}__ to slot **${item.slot}**.`).setImage(`attachment://${item.picture}`));
								else sentMessage.edit(embed.setDescription(`Something went wrong with equipping ${item.emoji}${item.name}.`));
							}
							else return sentMessage.edit(embed.setDescription(`You don't have a __${item.emoji}${item.name}__!`));
						}
						else return sentMessage.edit(embed.setDescription(`${collected.first().content} is not a valid item.`));
					})
					.catch(e => {
						logger.error(e.stack);
						throw Error('Something went wrong');
					});
			}
		});
	},
};