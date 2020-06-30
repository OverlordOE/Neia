const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
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
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();
		let temp = '';
		let hasChest = false;

		for (let i = 0; i < args.length; i++) {
			if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: temp } } });
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
				const lootItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: loot.name } } });
				const amount = loot.amount[0] + Math.floor(Math.random() * loot.amount[1]);

				lootEmbed.setTitle('Common Chest')
					.setDescription(`You have discovered **${amount}** **__${lootItem.emoji}${lootItem.name}__** in this chest.`)
					.attachFiles('assets/items/common_open.png')
					.setThumbnail('attachment://common_open.png');

				if (lootItem.rarity == 'uncommon') lootEmbed.setColor('#1eff00');
				else lootEmbed.setColor('#eeeeee');


				if (lootItem.picture) lootEmbed.attachFiles(`assets/items/${lootItem.picture}`)
					.setThumbnail(`attachment://${lootItem.picture}`);

				msg.channel.send(lootEmbed);
				await user.addItem(lootItem, amount);
				await user.removeItem(item, 1);

				break;
			}

			default:
				msg.reply('there is no loot associated with that chest yet.');
				break;
		}
	},
};