const Discord = require('discord.js');
module.exports = {
	name: 'Leaderboard',
	summary: 'Shows global leaderboard',
	description: 'Shows global leaderboard of the different stats.',
	category: 'info',
	aliases: ['lead', 'top', 'ranking'],
	args: false,
	usage: '<page>',
	example: '2',

	execute(message, args, msgUser, msgGuild, client, logger) {

		const filter = (reaction, user) => { return ['◀️', '▶️', '🔀'].includes(reaction.emoji.name) && user.id === message.author.id; };

		const ruinedList = client.userCommands.sort((a, b) => b.streaksRuined - a.streaksRuined)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.streaksRuined)}`);

		const countList = client.userCommands.sort((a, b) => b.numbersCounted - a.numbersCounted)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.numbersCounted)}`);

		const balanceList = client.userCommands.sort((a, b) => b.balance - a.balance)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}.**__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.balance)}💰`);


		const listArray = [{ list: balanceList, title: 'Current Balance' }, { list: ruinedList, title: 'Streaks Ruined' }, { list: countList, title: 'Total Numbers Counted' } ];
		let listIndex = 0;
		let page = 0;
		if (!isNaN(args[0]) && args[0] > 0 && args[0] < 6) page = args[0] - 1;


		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia leaderboard')
			.setDescription(editDescription(listArray[listIndex], page))
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter('Use the emojis to scroll through the list or switch the list.', client.user.displayAvatarURL())
			.setColor('#f3ab16');


		message.channel.send(embed).then(sentMessage => {
			sentMessage.react('◀️');
			sentMessage.react('▶️');
			sentMessage.react('🔀');

			const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

			collector.on('collect', (reaction) => {
				reaction.users.remove(message.author.id);
				if (reaction.emoji.name == '◀️' && page > 0) {
					page--;
					sentMessage.edit(embed.setDescription(editDescription(listArray[listIndex], page)));
				}
				else if (reaction.emoji.name == '▶️' && page < 4) {
					page++;
					sentMessage.edit(embed.setDescription(editDescription(listArray[listIndex], page)));
				}
				else if (reaction.emoji.name == '🔀') {
					listIndex++;
					if (listIndex >= listArray.length) listIndex = 0;

					sentMessage.edit(embed.setDescription(editDescription(listArray[listIndex], page)));
				}
			});
			collector.on('end', () => sentMessage.reactions.removeAll());
		});
	},
};

function editDescription(currentList, page) {
	let description = `__**${currentList.title}**__`;
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (currentList.list[i]) description += currentList.list[i];
		else description += `\n__${i + 1}.__ noone`;
	}
	return description;
}