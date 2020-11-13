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

			.setFooter('You can open multiple chests at the same time.', client.user.displayAvatarURL());

		const chestList = ['common', 'rare', 'epic', 'legendary', 'mystery', 'common chest', 'rare chest', 'epic chest', 'legendary chest', 'mystery chest'];

		let temp = '';
		let amount = 1;

		for (let i = 0; i < args.length; i++) {
			if (!(isNaN(args[i]))) amount = parseInt(args[i]);
			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}
		const chest = temp.toLowerCase().replace(' chest', '');

		if (chestList.includes(chest)) {

			if (amount > 1) {

				const item = await profile.getItem(`${chest} chest`);
				if (!await profile.hasItem(msgUser, item, amount)) return message.reply(`You don't have ${amount} __${item.name}(s)__!`);
				lootEmbed.setTitle(`${amount} ${chest} chests`);

				let description = `${message.author} has discovered:\n`;
				const lootlist = {};

				for (let i = 0; i < amount; i++) {
					const loot = loottable[chest]();
					const itemAmount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);
					if (!lootlist[loot.name]) lootlist[loot.name] = itemAmount;
					else lootlist[loot.name] += itemAmount;
				}

				for (const loot in lootlist) {
					const lootItem = await profile.getItem(loot);
					description += `\n**${profile.formatNumber(lootlist[loot])}** ${lootItem.emoji}__${lootItem.name}__`;
					profile.addItem(msgUser, lootItem, lootlist[loot]);
				}

				lootEmbed.setDescription(description)
					.attachFiles(`assets/items/${chest}_open.png`)
					.setThumbnail(`attachment://${chest}_open.png`);

				message.channel.send(lootEmbed);
				profile.removeItem(msgUser, item, amount);
			}
			else {
				const item = await profile.getItem(`${chest} chest`);
				if (!await profile.hasItem(msgUser, item, amount)) return message.reply(`You don't have ${amount} __${item.name}(s)__!`);

				const loot = loottable[chest]();
				const lootItem = await profile.getItem(loot.name);
				const itemAmount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);


				lootEmbed.setTitle(`${chest} Chest`)
					.setDescription(`${message.author} has discovered **${itemAmount}** **__${lootItem.emoji}${lootItem.name}__**.`)
					.attachFiles(`assets/items/${chest}_open.png`)
					.setThumbnail(`attachment://${chest}_open.png`);

				if (lootItem.rarity == 'uncommon') lootEmbed.setColor('#1eff00');
				else if (lootItem.rarity == 'rare') lootEmbed.setColor('#0070dd');
				else if (lootItem.rarity == 'epic') lootEmbed.setColor('#a335ee');
				else if (lootItem.rarity == 'legendary') lootEmbed.setColor('#ff8000');
				else lootEmbed.setColor('#eeeeee');

				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setImage(`attachment://${lootItem.picture}`);

				message.channel.send(lootEmbed);
				profile.addItem(msgUser, lootItem, itemAmount);
				profile.removeItem(msgUser, item, 1);

			}
		}
		else message.reply('there is no loot associated with that chest.');
	},
};