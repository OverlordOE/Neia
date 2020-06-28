const Discord = require('discord.js');
const winston = require('winston');
require('dotenv').config();
const token = process.env.TEST_TOKEN;
const ytAPI = process.env.YT_API;
const { Users, profile, Guilds, guildProfile } = require('./dbObjects');
const botCommands = require('./commands');
const moment = require('moment');
const bot = new Discord.Client();
const cooldowns = new Discord.Collection();
const active = new Map();
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

bot.commands = new Discord.Collection();
moment().format();


const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'MM-DD HH:mm:ss',
		}),
		winston.format.printf(log => `(${log.timestamp}) [${log.level.toUpperCase()}] - ${log.message}`),
		winston.format.colorize(),
	),

	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'warn' }),
		new winston.transports.File({ filename: 'log.log' }),
	],
});


Object.keys(botCommands).map(key => {
	bot.commands.set(botCommands[key].name, botCommands[key]);
});


bot.login(token);

// Execute on bot start
bot.on('ready', async () => {
	try {
		const storedUsers = await Users.findAll();
		storedUsers.forEach(b => profile.set(b.user_id, b));
		const storedGuilds = await Guilds.findAll();
		storedGuilds.forEach(b => guildProfile.set(b.guild_id, b));
		logger.log('info', `Logged in as ${bot.user.tag}!`);
	}
	catch (e) {
		logger.error(e.stack);
	}

});


// Logger
bot.on('warn', m => logger.warn(m.stack));
bot.on('error', m => logger.error(m.stack));
process.on('unhandledRejection', m => logger.error(m.stack));
process.on('TypeError', m => logger.error(m.stack));
process.on('uncaughtException', m => logger.error(m.stack));

// Execute for every message
bot.on('message', async msg => {
	if (msg.author.bot) return;

	const guild = guildProfile.get(msg.guild.id);
	if (!guild) await guildProfile.newGuild(msg.guild.id);
	const prefix = await guildProfile.getPrefix(msg.guild.id);
	const now = Date.now();
	const id = msg.author.id;
	const user = profile.get(id);
	if (!user) await profile.newUser(id);


	// split message for further use
	const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(msg.content)) return;

	const [, matchedPrefix] = msg.content.match(prefixRegex);
	const args = msg.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	

	profile.addCount(id, 1);

	logger.log('info', `${msg.author.tag} Called command: ${commandName}`);

	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// check for admin
	if (command.category == 'admin') {
		if (!msg.member.hasPermission('ADMINISTRATOR')) {
			return msg.channel.send('You need Admin privileges to use this command!');
		}
	}

	// check for owner
	if (command.category == 'debug') {
		if (id != 137920111754346496) {
			return msg.channel.send('You are not the owner of this bot!');
		}
	}

	// if the command is used wrongly correct the user
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${msg.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return msg.channel.send(reply);
	}

	// cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1.5) * 1000;

	if (timestamps.has(id)) {
		const expirationTime = timestamps.get(id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const minLeft = timeLeft / 60;
			const secLeft = Math.floor((minLeft - Math.floor(minLeft)) * 60);
			if (minLeft >= 1) { return msg.reply(`Please wait **${Math.floor(minLeft)} minutes** and **${secLeft} seconds** before reusing the \`${command.name}\` command.`); }
			else { return msg.reply(`Please wait **${timeLeft.toFixed(1)} second(s)** before reusing the \`${command.name}\` command.`); }
		}
	}
	timestamps.set(id, now);
	setTimeout(() => timestamps.delete(id), cooldownAmount);


	const options = {
		active: active,
	};
	profile.addBotUsage(id, 1);
	// execute command
	try {
		command.execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns);
	}
	catch (e) {
		logger.error(e.stack);
		msg.reply('there was an error trying to execute that command!');
	}
});

