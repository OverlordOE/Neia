const Discord = require('discord.js');
module.exports = {
	name: 'Trade',
	summary: 'Trade money to other people',
	description: 'Trade money to other people.',
	aliases: ['give', 'donate', 'transfer'],
	category: 'misc',
	args: true,
	usage: '<target> <amount>',
	example: '@overlordOE 25',

	async execute(message, args, msgUser, msgGuild, client, logger) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia Trading Center')
			.setFooter('You can only trade to people on the same server.', client.user.displayAvatarURL())
			.setColor('#f3ab16');

		let target;
		let targetUser;
		let amount = 0;
		let temp = '';

		for (let i = 0; i < args.length; i++) {
			if (!(isNaN(args[i]))) amount = parseInt(args[i]);

			else if (args[i].startsWith('<@') && args[i].endsWith('>')) {
				let mention = args[i].slice(2, -1);
				if (mention.startsWith('!')) mention = mention.slice(1);

				target = client.users.cache.get(mention);
				targetUser = await client.userCommands.getUser(target.id);
				embed.setThumbnail(target.displayAvatarURL({ dynamic: true }));
			}

			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const item = client.userCommands.getItem(temp);
		const sentMessage = await message.channel.send(embed);
		
		if (target && item) itemTrade();
		else if (target && amount > 1) moneyTrade();

		else if (amount > 1) return sentMessage.edit(embed.setDescription('You didn\'t specify a target.'));
		else if (target) return sentMessage.edit(embed.setDescription('You didn\'t specify the amount or item you want to send.'));
		else return sentMessage.edit(embed.setDescription('Please specify who you want to trade with and what you want to trade.'));


		function moneyTrade() {
			if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a whole number`));
			else if (amount < 1) amount = 1;

			let balance = msgUser.balance;
			if (amount > balance) return sentMessage.edit(embed.setDescription(`You only have ${client.util.formatNumber(balance)}💰 but need ${client.util.formatNumber(amount)}.`));

			balance = client.userCommands.addBalance(msgUser, -amount);
			client.userCommands.addBalance(targetUser, amount);
			return sentMessage.edit(embed.setDescription(
				`Trade with *${target}* succesfull!\n\nTransferred ${client.util.formatNumber(amount)}💰 to *${target}*.
				Your current balance is ${client.util.formatNumber(balance)}💰`));
		}


		async function itemTrade() {
			if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
			else if (amount < 1) amount = 1;

			client.userCommands.addItem(await client.userCommands.getUser(target.id), item, amount);
			client.userCommands.removeItem(msgUser, item, amount);
			sentMessage.edit(embed.setDescription(`Trade with *${target}* succesfull!\n\nTraded ${amount} ${item.emoji}__${item.name}__ to *${target}*.`));
		}

	},
};

