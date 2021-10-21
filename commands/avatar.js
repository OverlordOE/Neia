const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, hyperlink } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Will show a preview of the avatar together with a link to download the avatar.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Select a user')),

	execute(interaction, msgUser, msgGuild, client) {
		const target = interaction.options.getUser('target') || interaction.user;
		const avatarLink = target.displayAvatarURL({ dynamic: true });

		const embed = new MessageEmbed()
			.setTitle(`${target.tag}'s Avatar`)
			.setDescription(hyperlink('Download Link', avatarLink))
			.setImage(avatarLink)
			.setColor('#f3ab16');

		interaction.reply({ embeds: [embed] });
	},
};
