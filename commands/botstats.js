const Discord = require('discord.js');
module.exports = {
	name: 'Botstats',
	summary: 'Shows how much servers and users use Neia',
	description: 'Shows how much servers and users use Neia.',
	category: 'misc',
	aliases: ['bs'],
	args: false,
	usage: '',
	example: '',

	async execute(message, args, msgUser, msgGuild, client, logger) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Stats')
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setColor(client.userCommands.getColour(msgUser))
			.setFooter('Neia', client.user.displayAvatarURL({ dynamic: true }));

		let guildTotal = 0;
		let memberTotal = 0;
		client.guilds.cache.forEach(guild => {
			guildTotal++;
			if (!isNaN(memberTotal) && guild.id != 264445053596991498) memberTotal += Number(guild.memberCount);
		});
		message.channel.send(embed.setDescription(`Neia is in **${guildTotal}** servers with a total of **${memberTotal}** users.`));
		client.user.setActivity(`with ${memberTotal} users.`);
	},
};