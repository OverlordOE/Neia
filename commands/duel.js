const Discord = require('discord.js');
module.exports = {
	name: 'duel',
	summary: 'Duel other players to the death',
	description: 'Duel other players to the death. If you kill them you will gain a portion of their current items and money.',
	args: true,
	usage: '<target>',
	category: 'pvp',
	aliases: ['fight'],

	async execute(message, args, msgUser, client, logger) {


		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Duels')
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter('You can only attack people on the same server', client.user.displayAvatarURL());

		message.channel.send(embed).then(async sentMessage => {

			// Get target
			const targetMention = message.mentions.users.first();
			if (!targetMention) return sentMessage.edit(embed.setDescription('Mention the user you want to attack.'));
			const target = await client.characterCommands.getUser(targetMention.id);

			// Get stats for both users
			const hostStats = await client.characterCommands.calculateStats(msgUser);
			const targetStats = await client.characterCommands.calculateStats(target);








		});



	},
};