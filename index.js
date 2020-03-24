const Discord = require('discord.js');
const winston = require('winston');
const { Op } = require('sequelize');
const { prefix, token } = require('./config.json');
const { Users, CurrencyShop } = require('./dbObjects');
const botCommands = require('./commands');
const bot = new Discord.Client();
const currency = new Discord.Collection();
const cooldowns = new Discord.Collection();
var songQueue = [];
bot.commands = new Discord.Collection();


const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'log' }),
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});


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
		return user ? Math.floor(user.balance) : 0;
	},
	enumerable: true
});



module.exports = { currency };

//Logger
bot.on('debug', m => logger.log('debug', m));
bot.on('warn', m => logger.log('warn', m));
bot.on('error', m => logger.log('error', m));
process.on('unhandledRejection', m => logger.log('error', m));
process.on('TypeError', m => logger.log('error', m));
process.on('uncaughtException', m => logger.log('error', m));

//Execute for every message
bot.on('message', msg => {
	//split message for further use
	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const now = Date.now();
	const reward = 0.4 + (Math.random() * 0.3);



	//money reward
	if (!msg.author.bot && !msg.content.startsWith(prefix)) {
		if (!cooldowns.has("reward")) {
			cooldowns.set("reward", new Discord.Collection());
		}

		const cd = cooldowns.get("reward");
		const cdAmount = 4000;

		if (cd.has(msg.author.tag)) {
			const cdTime = cd.get(msg.author.tag) + cdAmount;

			if (now < cdTime) {
				const cdLeft = (cdTime - now) / 1000;
				return;
			}
		}
		currency.add(msg.author.id, reward);
		cd.set(msg.author.tag, now);
		setTimeout(() => cd.delete(msg.author.tag), cdAmount);
	}

	//check for prefix
	if (!msg.content.startsWith(prefix)) return;

	logger.log('info', `${msg.author.tag} Called command: ${commandName}`);

	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	//check for admin
	if (command.admin) {
		if (!msg.member.hasPermission('ADMINISTRATOR')) {
			return msg.channel.send("You need Admin privileges to use this command!");
		}
	}

	//check for owner
	if (command.owner) {
		if (msg.author.id != 137920111754346496) {
			return msg.channel.send("You are not the owner of this bot!");
		}
	}

	//cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

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
		command.execute(msg, args, currency, bot, songQueue);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});
