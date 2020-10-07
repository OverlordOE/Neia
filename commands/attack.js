const Discord = require('discord.js');
module.exports = {
	name: 'attack',
	summary: 'Attack other users and steal their items',
	description: 'Attack other players with your equipment. If you kill them you will gain a portion of their current items and money.',
	cooldown: 1,
	args: true,
	usage: '<target>',
	category: 'pvp',
	aliases: ['hunt'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const targetMention = message.mentions.users.first();
		if (!targetMention) return message.reply('mention the user you want to attack.');

		const lastAttack = await profile.getAttack(message.author.id);
		if (lastAttack !== true) return message.reply(`your attack is on cooldown. Your next attack is available at ${lastAttack}`);

		const target = await profile.getUser(targetMention.id);
		if (target.networth < 9000) return message.reply('the target user needs to have a networth of atleast 9000 to be attacked.');
		if (msgUser.networth < 9000) return message.reply('you need to have a networth of atleast 9000 to attack someone.');

		const protection = await profile.getProtection(targetMention.id);
		if (protection !== false) return message.channel.send(`*${targetMention}* has protection against attacks, you cannot attack them untill ${protection}.`);


		const equipment = await profile.getEquipment(message.author.id);
		let damage = Math.round(1 + (Math.random() * 4));
		if (equipment['weapon']) {
			const weapon = profile.getItem(equipment['weapon']);
			damage = Math.round(weapon.damage[0] + (Math.random() * weapon.damage[1]));
			message.channel.send(`You have attacked ${targetMention} with your ${weapon.emoji}${weapon.name} for ${damage} damage`);
		}
		else message.channel.send(`You have attacked ${targetMention} with your fists for ${damage} damage`);

		target.hp -= damage;
		profile.setAttack(message.author.id);

		if (target.hp <= 0) {
			const stealAmount = Math.floor(target.balance / (Math.random() + 4));
			profile.addMoney(targetMention.id, -stealAmount);
			profile.addMoney(message.author.id, stealAmount);
			message.channel.send(`You have killed ${targetMention} and stolen ${profile.formatNumber(stealAmount)}💰.`);
			profile.addProtection(targetMention.id, 24);
			target.hp = 1000;
		}
	},
};