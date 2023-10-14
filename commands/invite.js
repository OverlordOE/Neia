const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Sends a bunch of helpfull links.'),

	execute(interaction, msgUser, msgGuild, client) {

		const embed = new EmbedBuilder()
			.setTitle('Neia Invites')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`
							[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&permissions=397388672064&scope=applications.commands%20bot)\n
							[Click here to join the support server](https://discord.gg/hFGxVDT)\n
							[Click here to submit a bug or request  feature](https://discord.com/channels/390502342908444683/1040668787025911858)\n
							For more info contact: OverlordOE#0717
			`.replace(/\t+/g, ''))
			.setColor('#f3ab16');
		interaction.reply({ embeds: [embed] });
	},
};
// https://discord.gg/hFGxVDT
// https://discord.com/oauth2/authorize?client_id=684458276129079320&permissions=397388672064&scope=applications.commands%20bot