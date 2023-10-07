const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { stripIndents } = require('common-tags');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('numbergamestats')
		.setDescription('Shows the stats of your server\'s numbergame'),


	async execute(interaction, msgUser, msgGuild, client) {
		const numberGameInfo = client.guildOverseer.getNumberGame(msgGuild);
		if (!numberGameInfo.channelId) return interaction.reply('You don\'t have a numbergame setup yet!\nUse the command `setchannel` to designate a channel for the numbergame');

		const channel = await client.channels.fetch(numberGameInfo.channelId);
		let lastUser = 'Noone';

		if (numberGameInfo.lastUserId) {
			const lastCounter = await interaction.guild.members.fetch(numberGameInfo.lastUserId);
			lastUser = lastCounter.toString();
		}
		const embed = new EmbedBuilder()
			.setTitle('Numbergame stats')
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setColor('#f3ab16');

		embed.setDescription(stripIndents`
			**Current Number:** ${numberGameInfo.currentNumber}
			**Last Checkpoint:** ${numberGameInfo.lastCheckpoint}
			**Next Checkpoint:** ${numberGameInfo.nextCheckpoint}	
		
			**Last Counter:** ${lastUser}
			**Channel:** ${channel.toString()}
			
			**Total Numbers Counted:** ${numberGameInfo.totalCounted}
			**Highest Streak:** ${numberGameInfo.highestStreak}
			**Streaks Ruined:** ${numberGameInfo.streaksRuined}`
		);

		return interaction.reply({ embeds: [embed] });
	},
};