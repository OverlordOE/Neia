const { EmbedBuilder , SlashCommandBuilder} = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('numbergamestats')
		.setDescription('Shows the stats of your server\'s numbergame'),


	async execute(interaction, msgUser, msgGuild, client) {
		const numberGameInfo = client.guildOverseer.getNumberGame(msgGuild);
		if (!numberGameInfo.channelId) return interaction.reply('You don\'t have a numbergame setup yet!\nUse the command `setchannel` to designate a channel for the numbergame');

		const channel = await client.channels.fetch(numberGameInfo.channelId);

		const embed = new EmbedBuilder()
			.setTitle('Numbergame stats')
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.addFields([{ name: 'Current Number', value: numberGameInfo.currentNumber.toString(), inline: false }])
			.setColor('#f3ab16');

		if (numberGameInfo.lastUserId) {
			const lastCounter = await interaction.guild.members.fetch(numberGameInfo.lastUserId);
			embed.addFields([{ name: 'Last Counter', value: lastCounter.toString(), inline: true }]);
		}

		embed.addFields([
			{ name: 'Channel', value: channel.toString(), inline: true },
			{ name: 'Total Numbers Counted', value: numberGameInfo.totalCounted.toString(), inline: true },
			{ name: 'Last Checkpoint', value: numberGameInfo.lastCheckpoint.toString(), inline: true },
			{ name: 'Next Checkpoint', value: numberGameInfo.nextCheckpoint.toString(), inline: true },
			{ name: 'Highest Streak', value: numberGameInfo.highestStreak.toString(), inline: true },
			{ name: 'Streaks Ruined', value: numberGameInfo.streaksRuined.toString(), inline: true }
		])
			;

		return interaction.reply({ embeds: [embed] });
	},
};