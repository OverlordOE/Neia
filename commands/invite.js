const Discord = require('discord.js');
module.exports = {
	name: 'invite',
	description: 'Sends an invite link to add the bot to other servers.',
	admin: false,
	args: false,
	usage: '',
	async execute(msg) {
		const embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Click here to invite me to your own server!')
			.setURL('https://discordapp.com/oauth2/authorize?client_id=684458276129079320&permissions=8&scope=bot')
		msg.channel.send(embed);
	},
};
// https://discord.gg/duQjgAn
// https://discordapp.com/oauth2/authorize?client_id=684458276129079320&permissions=8&scope=bot