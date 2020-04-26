module.exports = {
	name: 'reload',
	description: '"Admin debug tool" Reloads a command.',
	usage: '[command]',
	aliases: ['r', 're'],
	owner: true,
	args: true,
	cooldown: 0,
	admin: false,
	music: false,


	execute(message, args, profile, bot, ops, ytAPI, logger) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${commandName}.js`)];

		try {
			const newCommand = require(`./${commandName}.js`);
			message.client.commands.set(newCommand.name, newCommand);
		}
		catch (error) {
			logger.log('error', error);
			return message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
		}
		message.channel.send(`Command \`${commandName}\` was reloaded!`);
	},
};