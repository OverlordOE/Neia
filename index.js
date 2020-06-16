const Discord = require('discord.js');
const winston = require('winston');
require('dotenv').config();
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const ytAPI = process.env.YT_API;
const { Users } = require('./dbObjects');
const botCommands = require('./commands');
const moment = require('moment');
const bot = new Discord.Client();
const profile = new Discord.Collection();
const cooldowns = new Discord.Collection();
const active = new Map();
bot.commands = new Discord.Collection();
moment().format();


const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'MM-DD HH:mm:ss',
		}),
		winston.format.printf(log => `(${log.timestamp}) [${log.level.toUpperCase()}] - ${log.message}`),
		winston.format.colorize(),
	),

	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
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
		const storedBalances = await Users.findAll();
	storedBalances.forEach(b => profile.set(b.user_id, b));
	logger.log('info', `Logged in as ${bot.user.tag}!`);
	} catch (error) {
		logger.log('error', error);
	}
	
});


// Add db commands
Reflect.defineProperty(profile, 'addMoney', {
	value: async function addMoney(id, amount) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		user.balance += Number(amount);
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getBalance', {
	value: async function getBalance(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		return user ? Math.floor(user.balance) : 0;
	},
});

Reflect.defineProperty(profile, 'getDaily', {
	value: async function getDaily(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		return user ? user.lastDaily : 0;
	},

});

Reflect.defineProperty(profile, 'setDaily', {
	value: async function setDaily(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);

		const currentDay = moment();
		user.lastDaily = currentDay;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getHourly', {
	value: async function getHourly(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		return user ? user.lastHourly : 0;
	},

});

Reflect.defineProperty(profile, 'setHourly', {
	value: async function setHourly(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);

		const day = moment();
		user.lastHourly = day;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getWeekly', {
	value: async function getWeekly(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		return user ? user.lastWeekly : 0;
	},

});

Reflect.defineProperty(profile, 'setWeekly', {
	value: async function setWeekly(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);

		const day = moment();
		user.lastWeekly = day;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'addCount', {
	value: async function addCount(id, amount) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		user.msgCount += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getCount', {
	value: async function getCount(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		return user ? Math.floor(user.msgCount) : 0;
	},
});

Reflect.defineProperty(profile, 'getProtection', {
	value: async function getProtection(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		return user ? user.protection : 0;
	},

});

Reflect.defineProperty(profile, 'setProtection', {
	value: async function setProtection(id, day) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);

		user.protection = day;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getPColour', {
	value: async function getPColour(id) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		return user ? user.pColour : 0;
	},

});

Reflect.defineProperty(profile, 'setPColour', {
	value: async function setPColour(id, colour) {
		let user = profile.get(id);
		if (!user) user = await newUser(id);
		if (!colour.startsWith('#')) throw 'not a valid colour!';

		user.pColour = colour;
		return user.save();
	},
});

async function newUser(id) {
	const day = moment().dayOfYear();
	const newUser = await Users.create({
		user_id: id,
		balance: 1,
		msgCount: 1,
		lastDaily: (day - 1),
		lastHourly: (day - 1),
		lastWeekly: (day - 1),
		protection: (day - 1),
		pColour: '#fffb00',
	});
	profile.set(id, newUser);
	return newUser;
}

module.exports = { profile };

// Logger
bot.on('debug', m => logger.log('debug', m));
bot.on('warn', m => logger.log('warn', m));
bot.on('error', m => logger.log('error', m));
process.on('unhandledRejection', m => logger.log('error', m));
process.on('TypeError', m => logger.log('error', m));
process.on('uncaughtException', m => logger.log('error', m));

// Execute for every message
bot.on('message', async msg => {
	// split message for further use
	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const now = Date.now();
	const id = msg.author.id;
	const user = profile.get(id);
	if (!user) {
		await newUser(id);
	}

	profile.addCount(id, 1);

	// money reward
	if (!msg.author.bot && !msg.content.startsWith(prefix)) {
		if (!cooldowns.has('reward')) {
			cooldowns.set('reward', new Discord.Collection());
		}

		const cd = cooldowns.get('reward');
		const cdAmount = 8000;

		if (cd.has(msg.author.tag)) {
			const cdTime = cd.get(msg.author.tag) + cdAmount;

			if (now < cdTime) {
				return;
			}
		}
		const reward = 0.8 + (Math.random() * 0.6);
		profile.addMoney(msg.author.id, reward);

		cd.set(msg.author.tag, now);
		setTimeout(() => cd.delete(msg.author.tag), cdAmount);
	}
	// check for prefix
	if (!msg.content.startsWith(prefix)) return;

	logger.log('info', `${msg.author.tag} Called command: ${commandName}`);

	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// check for admin
	if (command.admin) {
		if (!msg.member.hasPermission('ADMINISTRATOR')) {
			return msg.channel.send('You need Admin privileges to use this command!');
		}
	}

	// check for owner
	if (command.owner) {
		if (msg.author.id != 137920111754346496) {
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

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const minLeft = timeLeft / 60;
			const secLeft = Math.floor((minLeft - Math.floor(minLeft)) * 60);
			if (minLeft >= 1) { return msg.reply(`Please wait **${Math.floor(minLeft)} minutes** and **${secLeft} seconds** before reusing the \`${command.name}\` command.`); }
			else { return msg.reply(`Please wait **${timeLeft.toFixed(1)} second(s)** before reusing the \`${command.name}\` command.`); }
		}
	}
	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);


	const options = {
		active: active,
	};

	// execute command
	try {
		command.execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns);
	}
	catch (error) {
		logger.log('error', error);
		msg.reply('there was an error trying to execute that command!');
	}
});

