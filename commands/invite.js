const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Sends a bunch of helpfull links.'),

	execute(interaction, msgUser, msgGuild, client) {

		const embed = new MessageEmbed()
			.setTitle('Neia Invites')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`
							[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=1178070081)\n
							[Click here to join the support server](https://discord.gg/hFGxVDT)\n
							[Click here to submit a bug or request  feature](https://github.com/OverlordOE/Neia/issues/new/choose)\n
							For more info contact: OverlordOE#0717
			`)
			.setColor('#f3ab16');
		interaction.reply({ embeds: [embed] });
	},
};
// https://discord.gg/hFGxVDT
//https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=1178070081