require('dotenv').config();
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
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
});

bot.on('message', msg => {
	const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	console.info(`Called command: ${command}`);


	try {
		bot.commands.get(command).execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});
