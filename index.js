/* eslint-disable no-multiple-empty-lines */
const Discord = require('discord.js');
const winston = require('winston');
const moment = require('moment');
const cron = require('cron');
const DBL = require('dblapi.js');
const fs = require('fs');
const { Users, userCommands } = require('./util/userCommands');
const { guildCommands, Guilds } = require('./util/guildCommands');
const { util } = require('./util/util');
const dbl = new DBL(process.env.DBL_TOKEN, { webhookPort: 3000, webhookAuth: process.env.WEBHOOK_TOKEN });
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
const active = new Map();
const numberGame = require('./eventCommands/numbergame.js');
client.emojiCharacters = require('./data/emojiCharacters.js');
client.music = { active: active };
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
require('dotenv').config();
moment().format();


// Logger
const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.errors({ stack: true }),
		winston.format.timestamp({ format: 'MM-DD HH:mm:ss' }),
		winston.format.printf(log => {
			if (log.stack && log.level == 'error') return `${log.timestamp}) [${log.level}] - ${log.message}\n${log.stack}`;
			return `${log.timestamp}) [${log.level}] - ${log.message}`;
		}),
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.colorize({
				all: true,
				colors: {
					error: 'red',
					info: 'cyan',
					warn: 'yellow',
					debug: 'green',
				},
			}),
		}),
		new winston.transports.File({
			filename: './logs/error.log',
			level: 'warn',
		}),
		new winston.transports.File({ filename: './logs/log.log' }),
	],
});
client.on('warn', e => logger.warn(e));
client.on('error', e => logger.error(e));
process.on('warning', e => logger.warn(e));
process.on('unhandledRejection', e => logger.error(e));
process.on('TypeError', e => logger.error(e));
process.on('uncaughtException', e => logger.error(e));


// Load in Commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name.toLowerCase(), command);
}


// Startup Tasks
client.login(process.env.TOKEN);
client.on('ready', async () => {
	try {
		const storedUsers = await Users.findAll();
		storedUsers.forEach(b => userCommands.set(b.user_id, b));
		const storedGuilds = await Guilds.findAll();
		storedGuilds.forEach(b => guildCommands.set(b.guild_id, b));
		let memberTotal = 0;
		client.guilds.cache.forEach(g => { if (!isNaN(memberTotal) && g.id != 264445053596991498) memberTotal += Number(g.memberCount); });
		client.user.setActivity(`with ${memberTotal} users.`);

		client.userCommands = userCommands;
		client.guildCommands = guildCommands;
		client.util = util;

		logger.info(`Logged in as ${client.user.tag}!`);
	}
	catch (e) {
		logger.error(e.stack);
	}
});







// Command handler
client.on('message', async message => {

	if (message.author.bot || message.channel.type == 'dm') return;

	const guild = await guildCommands.getGuild(message.guild.id);
	const prefix = await guildCommands.getPrefix(guild);
	const id = message.author.id;
	const user = await userCommands.getUser(id);

	if (Number.isInteger(Number(message.content)) && !message.attachments.first()) numberGame(message, user, guild, client, logger);

	// split message for further use
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// find command
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (command.category == 'debug' && (id != 137920111754346496)) return message.channel.send('You are not the owner of this bot!');
	if (command.permissions) if (!message.guild.member(message.author).hasPermission(command.permissions)) return message.reply(`you need the ${command.permissions} permission to use this command!`);


	// if the command is used wrongly correct the user
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		return message.channel.send(reply);
	}


	// cooldowns
	if (id != 137920111754346496) {
		if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = command.cooldown || 1500;
		const now = Date.now();

		if (timestamps.has(id)) {
			const expirationTime = timestamps.get(id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				const hourLeft = timeLeft / 3600;
				const minLeft = (hourLeft - Math.floor(hourLeft)) * 60;
				const secLeft = Math.floor((minLeft - Math.floor(minLeft)) * 60);

				if (hourLeft >= 1) return message.reply(`Please wait **${Math.floor(hourLeft)} hours**, **${Math.floor(minLeft)} minutes** and **${secLeft} seconds** before reusing the \`${command.name}\` command.`);
				else if (minLeft >= 1) return message.reply(`Please wait **${Math.floor(minLeft)} minutes** and **${secLeft} seconds** before reusing the \`${command.name}\` command.`);
				else return message.reply(`Please wait **${timeLeft.toFixed(1)} second(s)** before reusing the \`${command.name}\` command.`);
			}
		}
		timestamps.set(id, now);
		setTimeout(() => timestamps.delete(id), cooldownAmount);
	}

	if (user.firstCommand) {
		client.commands.get('changelog').execute(message, args, user, guild, client, logger);
		user.firstCommand = false;
		logger.info(`New user ${message.author.tag}`);
		user.save();
	}

	// Chech for manage message permission
	if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) {
		logger.warn(`Neia doesnt have MANAGE_MESSAGES permissions on guild ${guild.name}`);
		message.reply('Please make sure Neia has the `Manage Messages` permissions, otherwise the commands may not function properly');
	}


	// Execute command
	logger.log('info', `${message.author.tag} Called command: ${commandName} ${args.join(' ')}, in guild: ${message.guild.name}`);
	try {
		command.execute(message, args, user, guild, client, logger);
	}
	catch (e) {
		logger.error(e.stack);
		message.reply('there was an error trying to execute that command!');
	}
});




// Random number game event every hour
const numberGameEvents = new cron.CronJob(`${Math.floor(Math.random() * 60)} * * * *`, () => {
	client.guilds.cache.forEach(async g => {
		const guild = await guildCommands.getGuild(g.id);
		const numberGameInfo = client.guildCommands.getNumberGame(guild);
		let claimed = false;

		if (numberGameInfo.channelId) {
			const filter = (reaction, user) => {
				return reaction.emoji.name == '💰' && !user.bot;
			};
			const embed = new Discord.MessageEmbed()
				.setTitle('__**NUMBER BOOST EVENT**__')
				.setFooter('These events happen randomly every hour.', client.user.displayAvatarURL())
				.setColor('#f3ab16');


			const numberGameChannel = await client.channels.fetch(numberGameInfo.channelId);
			const numberIncrease = Math.floor(Math.random() * 5) + 8;
			let description = `Be the **first** to click the emoji and the bot will count **${numberIncrease} times** for you.
			You will gain __normal count__ and __custom reaction__ **rewards** for every number counted.
			
			This event will expire in **10 minutes**`;
			const sentMessage = await numberGameChannel.send(embed.setDescription(description));


			sentMessage.react('💰');
			const collector = sentMessage.createReactionCollector(filter, { time: 600000 });

			collector.on('collect', async (r, u) => {
				const checkpoints = [50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000, 2250, 2500, 2750, 3000];
				const user = await client.userCommands.getUser(u.id);
				const oldNumber = numberGameInfo.currentNumber;

				numberGameInfo.currentNumber += numberIncrease;
				claimed = true;

				const reaction = client.userCommands.getReaction(user);
				let payout = 0;
				if (reaction.emoji && reaction.value) {
					for (let i = oldNumber; i < oldNumber + numberIncrease; i++) {
						if (checkpoints.includes(i)) {
							const nextCheckpointIndex = checkpoints.indexOf(i) + 1;
							numberGameInfo.lastCheckpoint = i;
							numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
							numberGameChannel.send(`Checkpoint __**${i}**__ reached!\nIf you make a mistake you will be reversed to this point.`);
						}
						payout += i + Math.sqrt(reaction.value);
					}
				}
				description += `\n\n**__THIS EVENT HAS BEEN CLAIMED BY:__ ${u}!**`;
				sentMessage.edit(embed.setDescription(description).setColor('#00fc43'));

				client.userCommands.addBalance(user, payout);
				client.guildCommands.saveNumberGameInfo(await client.guildCommands.getGuild(sentMessage.guild.id), numberGameInfo);
				numberGameChannel.send(oldNumber + numberIncrease).then(m => m.react('✅'));
				collector.stop();
			});
			collector.on('end', () => {
				sentMessage.reactions.removeAll();
				if (!claimed) {
					description += '\n\n__**THIS EVENT HAS EXPIRED!**__';
					sentMessage.edit(embed.setDescription(description).setColor('#fc0303'));
				}
			});
		}
	});


	logger.info('Finished Number Game Events!');
});
numberGameEvents.start();




// Regular tasks executed every hour
const botTasks = new cron.CronJob('0 * * * *', () => {
	let memberTotal = 0;
	client.guilds.cache.forEach(guild => { if (!isNaN(memberTotal) && guild.id != 264445053596991498) memberTotal += Number(guild.memberCount); });
	client.user.setActivity(`with ${memberTotal} users.`);

	logger.info('Finished regular tasks!');
});
botTasks.start();












// DBL voting webhook handler
dbl.webhook.on('ready', () => logger.info('DBL Webhook up and running.'));
dbl.on('error', e => logger.error(`Oops! ${e}`));

dbl.webhook.on('vote', async vote => {
	const userID = vote.user;
	const discordUser = client.users.cache.get(userID);
	logger.info(`${discordUser.tag} has just voted.`);

	return discordUser.send('Thank you for voting!\n You can vote again in 12 hours.');
});