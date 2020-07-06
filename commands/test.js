const Discord = require('discord.js');
module.exports = {
	name: 'test',
	aliases: ['t'],

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const avatar = msg.author.displayAvatarURL();


		const embed = new Discord.MessageEmbed()
			.setTitle('Weekly Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());

			msg.channel.send(embed.setDescription(`test`));
},
};