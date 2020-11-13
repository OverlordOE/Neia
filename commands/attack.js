const Discord = require('discord.js');
module.exports = {
	name: 'attack',
	summary: 'Attack other users and steal their items',
	description: 'Attack other players with your equipment. If you kill them you will gain a portion of their current items and money.',
	args: true,
	usage: '<target>',
	category: 'pvp',
	aliases: ['hunt'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Attacking')
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter('You can only attack people on the same server', client.user.displayAvatarURL());

		message.channel.send(embed.setDescription(embed)).then(async sentMessage => {

			// Get cooldowns and protections
			const targetMention = message.mentions.users.first();
			if (!targetMention) return sentMessage.edit(embed.setDescription('Mention the user you want to attack.'));

			const lastAttack = profile.getAttack(msgUser);
			if (lastAttack !== true) return sentMessage.edit(embed.setDescription(`Your attack is on cooldown. Your next attack is available at ${lastAttack}`));

			const target = await profile.getUser(targetMention.id);
			// if (target.networth < 30000) return sentMessage.edit(embed.setDescription(`${targetMention} user needs to have a networth of atleast 30k to be attacked.`));
			// if (msgUser.networth < 30000) return sentMessage.edit(embed.setDescription('You need to have a networth of atleast 30k to attack someone.'));

			const protection = profile.getProtection(target);
			if (protection !== false) return sentMessage.edit(embed.setDescription(`*${targetMention}* has protection against attacks, you cannot attack them untill ${protection}.`));


			// Attack resolution
			const attackResult = profile.attackUser(msgUser, target);
			sentMessage.edit(embed.setDescription(`You have attacked ${targetMention} with your ${attackResult.weapon.emoji}${attackResult.weapon.name} for **${attackResult.damage}** damage`));


			// On Kill
			if (target.hp <= 0) {
				const stealAmount = Math.floor(target.balance / (Math.random() + 4));
				const lootList = {};
				let lootListValue = 0;
				let description = `You have killed ${targetMention} and stolen:\n${profile.formatNumber(stealAmount)}💰.`;
				const networth = target.networth;
				const inventory = await profile.getInventory(target);

				if (inventory.length) {
					for (let i = 0; lootListValue <= networth / 5; i++) {
						const nextIndex = Math.floor(Math.random() * inventory.length);

						const loot = profile.getItem(inventory[nextIndex].name);
						if (inventory[nextIndex].amount > 1) inventory[nextIndex].amount--;
						else inventory.splice(nextIndex, 1);

						lootListValue += Number(loot.value);
						if (!lootList[loot.name]) lootList[loot.name] = 1;
						else lootList[loot.name]++;
					}

					for (const loot in lootList) {
						const lootItem = profile.getItem(loot);
						description += `\n${profile.formatNumber(lootList[loot])} ${lootItem.emoji}__${lootItem.name}__`;
						profile.addItem(msgUser, lootItem, lootList[loot]);
						profile.removeItem(target, lootItem, lootList[loot]);
					}
				}

				profile.addMoney(target, -stealAmount);
				profile.addMoney(msgUser, stealAmount);
				sentMessage.edit(embed.setDescription(description));
				profile.addProtection(target, 24);
				target.hp = 1000;
				target.save();
			}
		});
	},
};