const Discord = require('discord.js');
module.exports = {
	name: 'Help',
	summary: 'This command',
	description: 'List all the commands or get info about a specific command.',
	category: 'info',
	aliases: ['commands'],
	usage: '<command name>',
	example: 'avatar',
	args: false,

	execute(message, args, msgUser, msgGuild, client, logger) {
		const commands = client.commands;
		let adminCommands = '';
		let musicCommands = '';
		let miscCommands = '';
		let infoCommands = '';
		let economyCommands = '';

		const help = new Discord.MessageEmbed()
			.setColor('#f3ab16');

		if (!args.length) {
			help.setTitle('Neia command list');
			commands.map(command => {
				switch (command.category) {
					case 'admin':
						adminCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'economy':
						economyCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'music':
						musicCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'misc':
						miscCommands += `**${command.name}** - ${command.summary}\n`;
						break;
					case 'info':
						infoCommands += `**${command.name}** - ${command.summary}\n`;
						break;
				}
			});

			help.setDescription(`__**Miscellaneous Commands**__\n${miscCommands}\n
								__**Economy Commands**__\n${economyCommands}\n
								__**Info or Stat Commands**__\n${infoCommands}\n
								__**Music Commands**__\n${musicCommands}\n
								__**Admin Commands**__\n${adminCommands}\n
								`)
				.addField('__**Help**__', '**You can send `help [command name]` to get info on a specific command!**')
				.addField('Helpfull Links', `[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&scope=bot&permissions=1178070081)\n
							 [Click here to join the support server](https://discord.gg/hFGxVDT)\n
							 [Click here to submit a bug or request  feature](https://github.com/OverlordOE/Neia/issues/new/choose)\n
							 For more info contact: OverlordOE#0717
			`);
		}

		else if (args[0] == 'viggo' || args[0] == 'virgil') message.reply('Vliegosaurus');

		else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) return message.reply('that\'s not a valid command!');

			if (command.category == 'debug') return message.channel.send('This command is for debug purposes');
			help.setTitle(command.name);

			if (command.description) help.addField('**Description:**', command.description);
			if (command.permissions && command.permissions != '') help.addField('Permissions Needed:', `**${command.permissions}**`);
			if (command.aliases && command.aliases != '') help.addField('**Aliases:**', command.aliases.join(', '));
			if (command.usage) help.addField('**Usage:**', `**${command.name} ${command.usage}**`);
			if (command.example && command.example != '') help.addField('**Example:**', `\`${command.name} ${command.example}\``);
		}

		message.channel.send(help);
	},
};