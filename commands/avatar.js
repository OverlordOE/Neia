const Discord = require('discord.js');
module.exports = {
	name: 'avatar',
	aliases: ['icon', 'pfp', 'picture'],
	admin: false,
	description: 'Gets avatar of mentioned users, if there are no mentions it shows the senders avatar.',
	args: false,
	usage: 'user',
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {

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
			.setFooter('Neija', bAvatar);

		msg.channel.send(embed);
	},
};
