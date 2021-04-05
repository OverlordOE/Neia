const Discord = require('discord.js');
module.exports = {
	name: 'Numbergame',
	summary: 'Shows the stats of your server\'s numbergame',
	description: 'Shows the stats of your server\'s numbergame, like the highest streak.',
	category: 'misc',
	aliases: ['ng'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		const numberGameInfo = client.guildCommands.getNumberGame(msgGuild);
		if (!numberGameInfo.channelId) return message.channel.send('You don\'t have a numbergame setup yet!\nUse the command `setchannel` to designate a channel for the numbergame');

		const channel = await client.channels.fetch(numberGameInfo.channelId);


		const embed = new Discord.MessageEmbed()
			.setTitle('Numbergame stats')
			.setFooter('To change the channel for the number game use the `sc` command.', client.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(message.guild.iconURL())
			.addField('Channel', channel)
			.addField('Current Number', numberGameInfo.currentNumber, true)
			.addField('Total Numbers Counted', numberGameInfo.totalCounted, true)
			.addField('Highest Streak', numberGameInfo.highestStreak, true)
			.addField('Streaks Ruined', numberGameInfo.streaksRuined, true)
			;
		if (numberGameInfo.lastUserId) {
			const lastCounter = await message.guild.members.fetch(numberGameInfo.lastUserId);
			embed.addField('Last Counter', lastCounter, true);
		}

		return message.channel.send(embed);
	},
};