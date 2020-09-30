const Discord = require('discord.js');
module.exports = {
	name: 'buy',
	summary: 'Buy an item from the shop',
	description: 'With this you can buy an item from the shop.\nYou can either use `buy <item> <amount> to instantly buy the items or just use `buy`.\nIf you use the latter you will get prompted to enter the name and amount of the item that you want into the chat.',
	category: 'economy',
	aliases: ['get'],
	usage: '<item> <amount>',
	cooldown: 5,
	args: false,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const filter = m => m.author.id === message.author.id;
		let amount = 0;
		let temp = '';
		let item;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Shop')
			.setThumbnail(message.author.displayAvatarURL())
			.setTimestamp()
			.setFooter('Neia Imporium', client.user.displayAvatarURL());


		message.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = await profile.getItem(temp);
			if (item) buy(profile, sentMessage, amount, embed, item, msgUser);

			else {
				sentMessage.edit(embed.setDescription('What item do you want to buy?'));
				message.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						item = await profile.getItem(collected.first().content);
						if (!item) return sentMessage.edit(embed.setDescription(`${collected.first().content} is not a valid item.`));
						collected.first().delete();

						sentMessage.edit(embed.setDescription(`How many __${item.name}(s)__ do you want to buy?`)).then(() => {
							message.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									amount = parseInt(collected.first().content);
									collected.first().delete();
									buy(profile, sentMessage, amount, embed, item, msgUser);
								})
								.catch(e => {
									logger.error(e.stack);
									message.reply('you didn\'t answer in time or something went wrong.');
								});
						});
					});
			}
		})
			.catch(e => {
				logger.error(e.stack);
				message.reply('you didn\'t answer in time or something went wrong.');
			});
	},
};

async function buy(profile, sentMessage, amount, embed, item, msgUser) {

	if (!Number.isInteger(amount)) return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	else if (amount < 1) amount = 1;

	const balance = msgUser.balance;
	const cost = amount * item.cost;
	if (cost > balance) return sentMessage.edit(embed.setDescription(`You currently have **${profile.formatNumber(balance)}💰**, but __**${amount}**__ ${item.emoji}__${item.name}(s)__ costs **${profile.formatNumber(cost)}💰**!`));

	profile.addItem(msgUser.user_id, item, amount);
	profile.addMoney(msgUser.user_id, -cost);

	sentMessage.edit(embed.setDescription(`You've bought: __**${profile.formatNumber(amount)}**__ ${item.emoji}__${item.name}(s)__.\n\nCurrent balance is **${profile.formatNumber(await profile.getBalance(msgUser.user_id))}💰**.`));
}