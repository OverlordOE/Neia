const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('botstats')
		.setDescription('Shows how many servers and users use Neia.'),

	async execute(interaction, msgUser, msgGuild, client) {

		const embed = new MessageEmbed()
			.setTitle('Neia Stats')
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16')
			.setFooter('Neia', client.user.displayAvatarURL({ dynamic: true }));

		let guildTotal = 0;
		let memberTotal = 0;
		client.guilds.cache.forEach(guild => {
			guildTotal++;
			if (!isNaN(memberTotal) && guild.id != 264445053596991498) memberTotal += Number(guild.memberCount);
		});
		interaction.reply({ embeds: [embed.setDescription(`Neia is in **${guildTotal}** servers with a total of **${memberTotal}** users.`)] });
	},
};