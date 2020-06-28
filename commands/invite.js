const Discord = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Sends a bunch of helpfull links.',
	category: 'misc',
	args: false,
	usage: '',
	aliases: ['inv', 'bug', 'join', 'support', 'link'],

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {

		const pColour = await profile.getPColour(msg.author.id);
		const bAvatar = bot.user.displayAvatarURL();
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Invites')
			.setColor(pColour)
			.setThumbnail(bAvatar)
			.setTimestamp()
			.setFooter('Neia', bAvatar)
			.setDescription(`[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=372517968)\n
							 [Click here to join the support server](https://discord.gg/hFGxVDT)\n
							 [Click here to submit a bug or request  feature](https://github.com/OverlordOE/Neia/issues/new/choose)\n
							 For more info contact: OverlordOE#0717
			`);
		msg.channel.send(embed);
	},
};
// https://discord.gg/hFGxVDT
// https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=372517968