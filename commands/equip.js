const Discord = require('discord.js');
module.exports = {
	name: 'equip',
	summary: 'Equip an item from your inventory',
	description: 'Equip an item from your inventory.',
	category: 'pvp',
	aliases: ['item'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const filter = m => m.author.id === message.author.id;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Equipping')
			.setThumbnail(message.author.displayAvatarURL())
			.setDescription('What item do you want to equip?')
			.setThumbnail(client.user.displayAvatarURL())
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());


		message.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = profile.getItem(temp);
			if (item) {
				if (await profile.hasItem(message.author.id, item, 1)) {
					if (await profile.equip(msgUser.user_id, item)) sentMessage.edit(embed.setDescription(`Successfully equipped ${item.emoji}${item.name}.`));
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
							if (await profile.hasItem(message.author.id, item, 1)) {
								if (await profile.equip(msgUser.user_id, item)) sentMessage.edit(embed.setDescription(`Successfully equipped ${item.emoji}${item.name}.`));
								else sentMessage.edit(embed.setDescription(`Something went wrong with equipping ${item.emoji}${item.name}.`));
							}
							else return sentMessage.edit(embed.setDescription(`You don't have a __${item.emoji}${item.name}__!`));
						}
						else return sentMessage.edit(embed.setDescription(`${collected.first().content} is not a valid item.`));
					})
					.catch(e => {
						logger.error(e.stack);
						message.reply('you didn\'t answer in time or something went wrong.');
					});
			}
		});
	},
};