const Discord = require('discord.js');
module.exports = {
	name: 'Stats',
	summary: 'Shows your or the tagged user\'s stats and balance',
	description: 'Shows your or the tagged user\'s stats and balance.',
	category: 'misc',
	aliases: ['s', 'stat', 'info'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		const target = message.mentions.users.first() || message.author;
		const user = await client.userCommands.getUser(target.id);

		const embed = new Discord.MessageEmbed()
			.setTitle(`${target.tag}'s General Stats`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.addField('Balance:', `${client.util.formatNumber(user.balance)}💰`)
			.addField('Numbers Counted:', user.numbersCounted, true)
			.addField('Streaks Ruined:', user.streaksRuined, true)
			.setFooter('You can tag someone else to get their stats.', client.user.displayAvatarURL())
			;

		return message.channel.send(embed);
	},
};