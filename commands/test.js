const Discord = require('discord.js');
module.exports = {
	name: 'test',
	aliases: ['t'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const avatar = message.author.displayAvatarURL();


		const embed = new Discord.MessageEmbed()
			.setTitle('Weekly Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());

		message.channel.send(embed.setDescription(`test`));
	},
};