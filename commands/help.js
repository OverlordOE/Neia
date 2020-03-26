const { prefix } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	admin: false,
	aliases: ['commands'],
	usage: 'command name',
	execute(message, args) {
		const data = [];
		const { commands } = message.client;
		const help = new Discord.MessageEmbed()
			.setColor('#000000')
			.setTimestamp();

		if (!args.length) {
			help.setTitle(`Syndicate bot command list`);
			commands.map(command => help.addField(`**${command.name}**`, command.description));
			help.setFooter(`You can send \`${prefix}help [command name]\` to get info on a specific command!`);
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('that\'s not a valid command!');
			}

			help.setTitle(command.name);

			if (command.aliases) help.addField(`**Aliases:**`, command.aliases.join(', '));
			if (command.description) help.addField(`**Description:**`, command.description);
			if (command.usage) help.addField(`**Usage:**`, `${prefix}${command.name} ${command.usage}`);
			if (command.admin) help.addField(`**Need Admin:**`, command.admin);
		}



		message.channel.send(help);
	},
};