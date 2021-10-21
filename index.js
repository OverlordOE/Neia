const { Client, Intents, Collection, Permissions } = require('discord.js');
const client = new Client({
	intents: new Intents(
		[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES]
	)
});
const { Users, userCommands } = require('./util/userCommands');
const { guildCommands, Guilds } = require('./util/guildCommands');
const { util } = require('./util/util');
const numberGame = require('./eventCommands/numbergame');
const numberEvent = require('./eventCommands/numberevent');
const logger = require('./util/logger');
const cron = require('cron');
const fs = require('fs');
const active = new Map();
client.emojiCharacters = require('./data/emojiCharacters');
client.music = { active: active };
client.logger = logger;
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
client.on('warn', e => console.log(e));
client.on('error', e => console.log(e));
process.on('warning', e => console.log(e));
process.on('unhandledRejection', e => console.log(e));
process.on('TypeError', e => console.log(e));
process.on('uncaughtException', e => console.log(e));


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
	if (message.author.bot || message.channel.type == 'dm') return;

	const guild = await guildCommands.getGuild(message.guildId); 
	const id = message.author.id;
	const user = await userCommands.getUser(id);
	if (message.type != 'DEFAULT' || message.attachments.first() || message.interaction || message.author.bot) return;

	if (Number.isInteger(Number(message.content))) {
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

	if (command.permissions) {
		if (!interaction.member.permissions.has(Permissions.FLAGS[command.permissions])) {
			return interaction.reply({ content: `You need the \`${command.permissions}\` permission to use this command!`, ephemeral: true });
		}
	}

	logger.info(`${interaction.user.tag} called "${interaction.commandName}" in "${interaction.guild.name}#${interaction.channel.name}".`);
	try {
		await command.execute(interaction, user, guild, client, logger);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Random number game event every 3 hours0 0/3 * * *
const numberGameEvents = new cron.CronJob('0 0/2 * * *', () => {
	const time = Math.floor(Math.random() * 60) * 120000;
	console.log(time);
	setTimeout(
		numberEvent,
		time,
		client, logger,
	);
});
numberGameEvents.start();