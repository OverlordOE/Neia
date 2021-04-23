const Discord = require('discord.js');
module.exports = {
	name: 'Buy',
	summary: 'Buy an item from the shop',
	description: 'With this you can buy an item from the shop.',
	category: 'economy',
	aliases: ['get'],
	args: true,
	usage: '<item> <amount>',
	example: 'chest 2',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		const filter = m => m.author.id === message.author.id;
		let amount = 1;
		let temp = '';

		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia Shop')
			.setThumbnail(message.author.displayAvatarURL());

		const sentMessage = await message.channel.send(embed);

		for (let i = 0; i < args.length; i++) {
			if (!(isNaN(args[i]))) amount = parseInt(args[i]);

			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}

		const item = client.util.getItem(temp);
		if (item.buyable) {
			if (amount < 1) amount = 1;

			let balance = msgUser.balance;
			const cost = amount * item.value;
			if (cost > balance) return sentMessage.edit(embed.setDescription(`
					You currently have ${client.util.formatNumber(balance)}💰 but __${client.util.formatNumber(amount)}__ ${item.emoji}${item.name}(s) costs ${client.util.formatNumber(cost)}💰!
					You need ${client.util.formatNumber(cost - balance)}💰 more
					`));

			client.userCommands.addItem(msgUser, item, amount);
			balance = client.userCommands.addBalance(msgUser, -cost);

			sentMessage.edit(embed.setDescription(`You've bought: __${client.util.formatNumber(amount)}__ ${item.emoji}__${item.name}(s)__.\n\nCurrent balance is ${client.util.formatNumber(balance)}💰.`));

		}
		else if (item) return sentMessage.edit(embed.setDescription('You can\'t buy this item?'));
		else if (temp) return sentMessage.edit(embed.setDescription(`__${temp}__ is not a valid item.`));
		else return sentMessage.edit(embed.setDescription('You didn\'t specify the item you want to use.'));
	},
};