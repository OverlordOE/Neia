const Discord = require('discord.js');
module.exports = {
	name: 'test',
	aliases: ['t'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Stats')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(msgUser.pColour)

			.setFooter('Neia', client.user.displayAvatarURL());

		let guildTotal = 0;
		let memberTotal = 0;
		client.guilds.cache.forEach(guild => {
			guildTotal++;
			memberTotal += guild.memberCount;
		});
		message.channel.send(embed.setDescription(`Neia is in **${guildTotal}** servers with a total of **${memberTotal}** members.`));
	},
};