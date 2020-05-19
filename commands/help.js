const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	admin: false,
	aliases: ['commands'],
	usage: 'command name',
	owner: false,
	args: false,
	music: false,

	execute(message, args, profile) {
		const pColour = await profile.getPColour(target.id);
		const { commands } = message.client;
		let adminCommands = ``;
		let musicCommands = ``;
		let normalCommands = ``;

		const help = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTimestamp();

		if (!args.length) {
			help.setTitle('Syndicate bot command list');
			commands.map(command => {
				if (!command.owner) {
					if (command.admin) { adminCommands += `**-${command.name}** - ${command.description}\n`; }
					else if (command.music) { musicCommands += `**-${command.name}** - ${command.description}\n`; }
					else { normalCommands += `**-${command.name}** - ${command.description}\n`; }
				}

			});


			help.addField('**Normal commands**', normalCommands);
			help.addField('**Music commands**', musicCommands);
			help.addField('**Admin commands**', adminCommands);
			help.addField('**Help**', '**You can send `-help [command name]` to get info on a specific command!**');
		}
		else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply('that\'s not a valid command!');
			}

			if (command.owner) { return message.channel.send('This command is for debug purposes'); }
			help.setTitle(command.name);

			if (command.description) help.addField('**Description:**', command.description);
			if (command.usage) help.addField('**Usage:**', `-${command.name} ${command.usage}`);
			if (command.aliases) help.addField('**Aliases:**', command.aliases.join(', '));
			if (command.admin) help.addField('**Need Admin:**', command.admin);
		}


		message.channel.send(help);
	},
};