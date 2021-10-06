const { Client, Intents, Collection } = require('discord.js');
//* Make client
const client = new Client({
	intents: new Intents(
		[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
	)
});
const { Users, userCommands } = require('./util/userCommands');
const { guildCommands, Guilds } = require('./util/guildCommands');
const { util } = require('./util/util');
const numberGame = require('./eventCommands/numbergame');
const numberEvent = require('./eventCommands/numberevent');
const logger = require('./util/logger');
const fs = require('fs');
const active = new Map();
client.emojiCharacters = require('./data/emojiCharacters');
client.music = { active: active };
require('dotenv').config();

// Initialize client
client.login(process.env.TOKEN);
client.once('ready', async () => {
	let memberTotal = 0;
	client.guilds.cache.forEach(g => { if (!isNaN(memberTotal) && g.id != 264445053596991498) memberTotal += Number(g.memberCount); });
	client.user.setActivity('you.', { type: 'WATCHING' });


	//* Load in database
	try {
		const storedUsers = await Users.findAll();
		storedUsers.forEach(b => userCommands.set(b.user_id, b));
		const storedGuilds = await Guilds.findAll();
		storedGuilds.forEach(b => guildCommands.set(b.guild_id, b));

		client.userCommands = userCommands;
		client.guildCommands = guildCommands;
		client.util = util;
	}
	catch (e) {
		logger.error(e.stack);
	}

	logger.info(`Logged in as ${client.user.tag}!`);
});


//? Bad error handling
client.on('warn', e => logger.warn(e));
client.on('error', e => logger.error(e));
process.on('warning', e => logger.warn(e));
process.on('unhandledRejection', e => logger.error(e));
process.on('TypeError', e => logger.error(e));
process.on('uncaughtException', e => logger.error(e));


//* Gather all commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


client.on('messageCreate', async message => {
	const guild = await guildCommands.getGuild(message.guildId);
	const id = message.author.id;
	const user = await userCommands.getUser(id);
	
	if (Number.isInteger(Number(message.content)) && !message.attachments.first() && !message.interaction) {
		return numberGame(message, user, guild, client, logger);
	}
});


//* Handle interactions
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand() || interaction.isMessageComponent() || interaction.isButton()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	const guild = await guildCommands.getGuild(interaction.guildId);
	const id = interaction.user.id;
	const user = await userCommands.getUser(id);

	logger.info(`${interaction.user.tag} called "${interaction.commandName}" in "${interaction.guild.name}#${interaction.channel.name}".`);
	try {	
		await command.execute(interaction, user, guild, client, logger);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Random number game event every 3 hours
const numberGameEvents = new cron.CronJob('0 0/3 * * *', () => {
	const time = Math.floor(Math.random() * 60) * 180000;
	console.log(time);
	setTimeout(
		numberEvent,
		time,
		client, logger,
	);
});
numberGameEvents.start();