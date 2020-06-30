const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'picture'],
	category: 'misc',
	summary: 'Gets avatar of mentioned users or yourself',
	description: 'Will show a preview of the avatar together with a link to download the avatar.\nIf you tag someone it will show their avatar instead.',
	args: false,
	usage: '<target>',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {



		const target = msg.mentions.users.first() || msg.author;
		const avatar = target.displayAvatarURL();

		const embed = new Discord.MessageEmbed()
			.setTitle(`${target.tag}'s Avatar`)
			.setDescription(avatar)
			.setImage(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());

		msg.channel.send(embed);
	},
};
