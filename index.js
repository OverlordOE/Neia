require('dotenv').config();
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { Op } = require('sequelize');
const { Users, CurrencyShop } = require('./dbObjects');
const currency = new Discord.Collection();
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
	bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = token;

bot.login(TOKEN);

bot.on('ready', () => {
	console.info(`Logged in as ${bot.user.tag}!`);
	bot.user.setActivity('The Syndicate', { type: 'WATCHING' });
});

bot.on('message', msg => {
	//split message for further use
	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	//check for prefix
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	console.info(`Called command: ${commandName}`);

	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	//chech for admin
	if (command.admin) {
		if (!msg.member.hasPermission('ADMINISTRATOR')) {
			return msg.channel.send("You need Admin privileges to use this command!");
		}
	}

	//if the command is used wrongly correct the user
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${msg.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return msg.channel.send(reply);
	}

	//execute command
	try {
		command.execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});
