const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('numbergamestats')
		.setDescription('Shows the stats of your server\'s numbergame'),


	async execute(interaction, msgUser, msgGuild, client, logger) {
		const numberGameInfo = client.guildCommands.getNumberGame(msgGuild);
		if (!numberGameInfo.channelId) return interaction.reply('You don\'t have a numbergame setup yet!\nUse the command `setchannel` to designate a channel for the numbergame');

		const channel = await client.channels.fetch(numberGameInfo.channelId);

		const embed = new MessageEmbed()
			.setTitle('Numbergame stats')
			.setFooter('To change the channel for the number game use the `sc` command.', client.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.addField('Current Number', numberGameInfo.currentNumber.toString())
			.setColor('#f3ab16');

		if (numberGameInfo.lastUserId) {
			const lastCounter = await interaction.guild.members.fetch(numberGameInfo.lastUserId);
			embed.addField('Last Counter', lastCounter.toString(), true);
		}

		embed.addField('Channel', channel.toString(), true)
			.addField('Total Numbers Counted', numberGameInfo.totalCounted.toString(), true)
			.addField('Last Checkpoint', numberGameInfo.lastCheckpoint.toString(), true)
			.addField('Next Checkpoint', numberGameInfo.nextCheckpoint.toString(), true)
			.addField('Highest Streak', numberGameInfo.highestStreak.toString(), true)
			.addField('Streaks Ruined', numberGameInfo.streaksRuined.toString(), true)
			;

		return interaction.reply({ embeds: [embed] });
	},
};