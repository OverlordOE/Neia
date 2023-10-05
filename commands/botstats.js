const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('botstats')
		.setDescription('Shows how many servers and users use Neia.'),

	async execute(interaction, msgUser, msgGuild, client) {
		let guildTotal = 0;
		let memberTotal = 0;

		client.guilds.cache.forEach(guild => {
			guildTotal++;
			if (!isNaN(memberTotal) && guild.id != 264445053596991498) memberTotal += Number(guild.memberCount);
		});

		const embed = new EmbedBuilder()
			.setDescription(`Neia is in **${guildTotal}** servers with a total of **${memberTotal}** users.`)
			.setColor('#f3ab16');

		interaction.reply({ embeds: [embed] });
	},
};