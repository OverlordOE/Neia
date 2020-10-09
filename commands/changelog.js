const Discord = require('discord.js');
module.exports = {
	name: 'changelog',
	summary: 'Shows the latest major update that the bot has received',
	description: 'Shows the latest major update that the bot has received.',
	category: 'info',
	aliases: ['update'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns, options) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Changelog')
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL())
			.setDescription(`
			dddd
			`);
		return message.channel.send(embed);
	},
};