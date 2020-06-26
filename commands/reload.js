module.exports = {
	name: 'reload',
	description: '"Admin debug tool" Reloads a command.',
	usage: '<command>',
	aliases: ['r', 're'],
	owner: true,
	args: true,
	cooldown: 0,
	admin: false,
	music: false,


	execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const commandName = args[0].toLowerCase();
		const command = msg.client.commands.get(commandName)
			|| msg.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return msg.channel.send(`There is no command with name or alias \`${commandName}\`, ${msg.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			msg.client.commands.set(newCommand.name, newCommand);
		}
		catch (e) {
			logger.error(e.stack);
			return msg.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${e.message}\``);
		}
		msg.channel.send(`Command \`${command.name}\` was reloaded!`);
	},
};