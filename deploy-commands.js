require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const local = process.argv.includes('--local') || process.argv.includes('-l');
const global = process.argv.includes('--global') || process.argv.includes('-g');

// Place your client and guild ids here
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	if (global) {
		try {
			console.log('Started refreshing application (/) commands for global guilds.');

			await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log('Successfully reloaded application (/) commands for global guilds.');
		}
		catch (error) {
			console.error(error);
		}
	}
	else if (local) {
		try {
			console.log('Started refreshing application (/) commands for test guild.');

			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);

			console.log('Successfully reloaded application (/) commands for test guild.');
		}
		catch (error) {
			console.error(error);
		}
	}
})();
