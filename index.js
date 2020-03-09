const Discord = require('discord.js');
const winston = require('winston');
const { Op } = require('sequelize');
const { prefix, token } = require('./config.json');
const { Users, CurrencyShop } = require('./dbObjects');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const currency = new Discord.Collection();
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'log' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});


//Make add and balance method
Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
	enumerable: true
});

module.exports = {currency};

Object.keys(botCommands).map(key => {
	bot.commands.set(botCommands[key].name, botCommands[key]);
});


bot.login(token);

//Execute on bot start
bot.on('ready', async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	logger.log('info', `Logged in as ${bot.user.tag}!`);
	bot.user.setActivity('The Syndicate', { type: 'WATCHING' });
});

//Logger
bot.on('debug', m => logger.log('debug', m));
bot.on('warn', m => logger.log('warn', m));
bot.on('error', m => logger.log('error', m));
process.on('unhandledRejection', error => logger.log('error', error));
process.on('TypeError', error => logger.log('error', error));
process.on('uncaughtException', error => logger.log('error', error));

//Execute for every message
bot.on('message', msg => {
	currency.add(msg.author.id, 1);

	//split message for further use
	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	//check for prefix
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	logger.log('info', `${msg.author.tag} Called command: ${commandName}`, );

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
		command.execute(msg, args, currency, bot);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});
