const Discord = require('discord.js');
const loottable = require('../loottables');
module.exports = {
	name: 'open',
	summary: 'open chests',
	description: 'Open chests to get the contents within.',
	category: 'money',
	aliases: ['o', 'chest'],
	usage: '<chest>',
	cooldown: 0.5,
	args: true,

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const lootEmbed = new Discord.MessageEmbed()
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());
		const uitems = await profile.getInventory(msg.author.id);
		let temp = '';
		let hasChest = false;

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const item = profile.getItem(temp);
		if (item) {
			uitems.map(i => {
				if (i.item.name == item.name) {
					if (i.amount >= 1) hasChest = true;
				}
			});
		}

		if (!hasChest) return msg.reply(`You don't have any __${item.name}(s)__!`);

		switch (item.name) {

			case 'Common Chest': {

				const loot = loottable.common();
				const lootItem = profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Common Chest')
					.setDescription(`${msg.author}, have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/common_open.png')
					.setThumbnail('attachment://common_open.png');

				if (lootItem.rarity == 'uncommon') lootEmbed.setColor('#1eff00');
				else lootEmbed.setColor('#eeeeee');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				msg.channel.send(lootEmbed);
				await profile.addItem(msg.author.id, lootItem, amount);
				await profile.removeItem(msg.author.id, item, 1);

				break;
			}

			case 'Rare Chest': {

				const loot = loottable.rare();
				const lootItem = profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Rare Chest')
					.setDescription(`${msg.author}, have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/rare_open.png')
					.setThumbnail('attachment://rare_open.png');

				if (lootItem.rarity == 'rare') lootEmbed.setColor('#0070dd');
				else lootEmbed.setColor('#1eff00');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				msg.channel.send(lootEmbed);
				await profile.addItem(msg.author.id, lootItem, amount);
				await profile.removeItem(msg.author.id, item, 1);

				break;
			}

			case 'Epic Chest': {

				const loot = loottable.epic();
				const lootItem = profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Epic Chest')
					.setDescription(`${msg.author}, have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/epic_open.png')
					.setThumbnail('attachment://epic_open.png');

				if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#0070dd');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				msg.channel.send(lootEmbed);
				await profile.addItem(msg.author.id, lootItem, amount);
				await profile.removeItem(msg.author.id, item, 1);

				break;
			}

			case 'Legendary Chest': {

				const loot = loottable.legendary();
				const lootItem = profile.getItem(loot.name);
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Legendary Chest')
					.setDescription(`${msg.author}, have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/legendary_open.png')
					.setThumbnail('attachment://legendary_open.png');

				if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#0070dd');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				msg.channel.send(lootEmbed);
				await profile.addItem(msg.author.id, lootItem, amount);
				await profile.removeItem(msg.author.id, item, 1);

				break;
			}

			default:
				msg.reply('there is no loot associated with that chest yet.');
				break;
		}
	},
};