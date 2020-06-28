const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'picture'],
	category: 'misc',
	summary: 'Gets avatar of mentioned users or yourself',
	description: 'Will show a preview of the avatar together with a link to download the avatar.\nIf you tag someone it will show their avatar instead.',
	args: false,
	usage: '<target>',

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {

		const bAvatar = bot.user.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		const target = msg.mentions.users.first() || msg.author;
		const avatar = target.displayAvatarURL();

		const embed = new Discord.MessageEmbed()
			.setTitle(`${target.tag}'s Avatar`)
			.setDescription(avatar)
			.setImage(avatar)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neia', bAvatar);

		msg.channel.send(embed);
	},
};
