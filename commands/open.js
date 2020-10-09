const Discord = require('discord.js');
const loottable = require('../data/loottables');
module.exports = {
	name: 'open',
	summary: 'open chests',
	description: 'Open chests to get the contents within.',
	category: 'economy',
	aliases: ['o', 'chest'],
	usage: '<chest>',
	cooldown: 0.5,
	args: true,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const lootEmbed = new Discord.MessageEmbed()
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());

		let temp = '';

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		switch (temp.toLowerCase()) {
			case 'common':
			case 'common chest': {

				const item = await profile.getItem('common chest');
				if (!await profile.hasItem(message.author.id, item, 1)) return message.reply(`You don't have any __${item.name}(s)__!`);

				const loot = loottable.common();
				const lootItem = await profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Common Chest')
					.setDescription(`${message.author} has discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__**.`)
					.attachFiles('assets/items/common_open.png')
					.setThumbnail('attachment://common_open.png');

				if (lootItem.rarity == 'uncommon') lootEmbed.setColor('#1eff00');
				else if (lootItem.rarity == 'rare') lootEmbed.setColor('#0070dd');
				else if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#eeeeee');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				message.channel.send(lootEmbed);
				profile.addItem(message.author.id, lootItem, amount);
				profile.removeItem(message.author.id, item, 1);

				break;
			}

			case 'rare':
			case 'rare chest': {
				const item = await profile.getItem('rare chest');
				if (!await profile.hasItem(message.author.id, item, 1)) return message.reply(`You don't have any __${item.name}(s)__!`);

				const loot = loottable.rare();
				const lootItem = await profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Rare Chest')
					.setDescription(`${message.author}, have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/rare_open.png')
					.setThumbnail('attachment://rare_open.png');

				if (lootItem.rarity == 'uncommon') lootEmbed.setColor('#1eff00');
				else if (lootItem.rarity == 'rare') lootEmbed.setColor('#0070dd');
				else if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#eeeeee');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				message.channel.send(lootEmbed);
				profile.addItem(message.author.id, lootItem, amount);
				profile.removeItem(message.author.id, item, 1);

				break;
			}

			case 'epic':
			case 'epic chest': {
				const item = await profile.getItem('epic chest');
				if (!await profile.hasItem(message.author.id, item, 1)) return message.reply(`You don't have any __${item.name}(s)__!`);

				const loot = loottable.epic();
				const lootItem = await profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Epic Chest')
					.setDescription(`${message.author}, have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/epic_open.png')
					.setThumbnail('attachment://epic_open.png');

				if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#0070dd');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				message.channel.send(lootEmbed);
				profile.addItem(message.author.id, lootItem, amount);
				profile.removeItem(message.author.id, item, 1);

				break;
			}

			case 'legendary':
			case 'legendary chest': {
				const item = await profile.getItem('legendary chest');
				if (!await profile.hasItem(message.author.id, item, 1)) return message.reply(`You don't have any __${item.name}(s)__!`);

				const loot = loottable.legendary();
				const lootItem = await profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Legendary Chest')
					.setDescription(`${message.author}, have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/legendary_open.png')
					.setThumbnail('attachment://legendary_open.png');

				if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#0070dd');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				message.channel.send(lootEmbed);
				profile.addItem(message.author.id, lootItem, amount);
				profile.removeItem(message.author.id, item, 1);

				break;
			}

			default:
				message.reply('there is no loot associated with that chest.');
				break;
		}
	},
};