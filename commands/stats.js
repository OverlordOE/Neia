const Discord = require('discord.js');
module.exports = {
	name: 'Stats',
	summary: 'Shows your or the tagged user\'s stats and balance',
	description: 'Shows the tagged user\'s or your stats and balance.',
	category: 'info',
	aliases: ['s', 'stat', 'info'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		const target = message.mentions.users.first() || message.author;
		const user = await client.userCommands.getUser(target.id);
		const items = await client.userCommands.getInventory(user);
		const filter = (reaction, emojiUser) => {
			return emojiUser.id === message.author.id;
		};

		const statEmbed = new Discord.MessageEmbed()
			.setTitle(`${target.tag}'s General Stats`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.addField('Balance:', `${client.util.formatNumber(user.balance)}💰`, true)
			.addField('Numbers Counted:', user.numbersCounted, true)
			.addField('Streaks Ruined:', user.streaksRuined, true)
			.addField('Times Gambled:', user.gamblingDone, true)
			.addField('Won with Gambling:', client.util.formatNumber(user.gamblingMoneyGained), true)
			.addField('Lost with Gambling:', client.util.formatNumber(user.gamblingMoneyLost), true)
			.addField('Number Game Reaction:', user.reaction, true)
			.setFooter('You can tag someone else to get their stats.', client.user.displayAvatarURL())
			.setColor('#f3ab16');

		const inventoryEmbed = new Discord.MessageEmbed()
			.setColor('#f3ab16')
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.setFooter('You can use the emojis to switch pages.', client.user.displayAvatarURL());

		
		let inventory = '__Inventory:__\n\n';
		if (items.length) {
			items.map(i => {
				if (i.amount < 1) return;
				const item = client.util.getItem(i.name);
				inventory += `${item.emoji}${item.name}: ${client.util.formatNumber(i.amount)}\n`;
			});

			// const income = await client.characterCommands.calculateIncome(userProfile);
			// inventoryEmbed.addField('Max passive income', `${client.util.formatNumber(income.income)}💰`);
			// inventoryEmbed.addField('Networth', `${client.util.formatNumber(income.networth)}💰`, true);

			inventoryEmbed.setDescription(inventory);
		}
		else inventoryEmbed.addField('Inventory:', `*${target.tag}* has nothing!`);

		message.channel.send(statEmbed)
			.then(sentMessage => {
				sentMessage.react('💰');
				sentMessage.react('📦');
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(message.author.id);
					if (reaction.emoji.name == '💰') sentMessage.edit(statEmbed);
					else if (reaction.emoji.name == '📦') sentMessage.edit(inventoryEmbed);
				});
				collector.on('end', () => sentMessage.reactions.removeAll());
			});
	},
};