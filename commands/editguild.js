module.exports = {
	name: 'Editguild',
	description: 'Edits the local guild.',
	category: 'debug',
	args: true,
	aliases: ['eg', 'edit'],
	usage: '<field> <value>',


	async execute(message, args, msgUser, msgGuild, client, logger) {
		try {
			if (args[0] == 'reset') {
				client.guildCommands.delete(msgGuild.guild_id);
				msgGuild.destroy();
				return message.reply('Reset succesfull');
			}
			else if (args[0] == 'number') {
				const numberGame = client.guildCommands.getNumberGame(msgGuild);
				numberGame[args[1]] = Number(args[2]);
				numberGame.lastUserId = null;
				client.guildCommands.saveNumberGameInfo(msgGuild, numberGame);
			}

			
			msgGuild[args[0]] = Number(args[1]);
			msgGuild.save();
		}
		catch (e) {
			message.reply('something went wrong');
			return logger.error(e.stack);
		}
		message.reply('Edit succesfull');
	},
};