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
			console.log(args[i]);
			console.log(!isNaN(parseInt(args[i])));
			if (!isNaN(parseInt(args[i]))) amount = parseInt(args[i]);

			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}
		if (amount < 1) amount = 1;

		const item = client.util.getItem(temp);
		if (item.buyable) {
			const protectionItem = client.util.getItem('streak protection');
			if (item == protectionItem && !(await client.userCommands.protectionAllowed(msgUser))) return sentMessage.edit(embed.setDescription('You can\'t buy Streak Protection.\nYou can only have 1 at a time and your cooldown should be worn off'));
			else buyItem(amount);

		}
		else if (item) return sentMessage.edit(embed.setDescription('You can\'t buy this item?'));
		else if (temp) return sentMessage.edit(embed.setDescription(`__${temp}__ is not a valid item.`));
		else return sentMessage.edit(embed.setDescription('You didn\'t specify the item you want to use.'));

		function buyItem(buyAmount) {
			let balance = msgUser.balance;
			const cost = buyAmount * item.value;
			if (cost > balance) return sentMessage.edit(embed.setDescription(`
					You currently have ${client.util.formatNumber(balance)}💰 but __${client.util.formatNumber(buyAmount)}__ ${item.emoji}${item.name}(s) costs ${client.util.formatNumber(cost)}💰!
					You need ${client.util.formatNumber(cost - balance)}💰 more
					`));

			client.userCommands.addItem(msgUser, item, buyAmount);
			balance = client.userCommands.addBalance(msgUser, -cost);

			sentMessage.edit(embed.setDescription(`You've bought: __${client.util.formatNumber(buyAmount)}__ ${item.emoji}__${item.name}(s)__.\n\nCurrent balance is ${client.util.formatNumber(balance)}💰.`));

		}
	},
};