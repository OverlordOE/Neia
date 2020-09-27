const Discord = require('discord.js');
module.exports = {
	name: 'attack',
	summary: 'Attack other users and steal their items',
	description: 'Attack other players with your equipment. If you kill them you will gain a portion of their current items.',
	cooldown: 10,
	args: true,
	usage: '<target>',
	category: 'money',
	aliases: ['hunt'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const targetMention = message.mentions.users.first();
		if (!targetMention) return message.reply('mention the user you want to attack.');

		const target = await profile.getUser(targetMention.id);
		if (target.networth < 9000) return message.reply('the target user needs to have a networth of atleast 9000 to be attacked.');
		if (target.hp <= 0) return message.reply('the target user is already dead.');

		const damage = Math.floor(15 + (Math.random() * 10));
		target.hp -= damage;
		message.channel.send(`You have attacked ${targetMention} for ${damage} damage`);

		if (target.hp <= 0) {
			message.channel.send(`You have killed ${targetMention}.`);
			target.hp = 100;
		}
	},
};