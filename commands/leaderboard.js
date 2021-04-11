const Discord = require('discord.js');
module.exports = {
	name: 'Leaderboard',
	summary: 'Shows global leaderboard',
	description: 'Shows global leaderboard of the different stats.',
	category: 'misc',
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


		let currentList = balanceList;
		let description = 'Current Balance\n';
		let page = 0;
		if (!isNaN(args[0]) && args[0] > 0 && args[0] < 6) page = args[0] - 1;


		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia leaderboard')
			.setDescription(editDescription(currentList, page, ' Current Balance \n'))
			.setThumbnail(client.user.displayAvatarURL())
			.setFooter('Use the emojis to scroll through the list or switch the list.', client.user.displayAvatarURL());


		message.channel.send(embed).then(sentMessage => {
			sentMessage.react('◀️');
			sentMessage.react('▶️');
			sentMessage.react('🔀');

			const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

			collector.on('collect', (reaction) => {
				reaction.users.remove(message.author.id);
				if (reaction.emoji.name == '◀️' && page > 0) {
					page--;
					sentMessage.edit(embed.setDescription(editDescription(currentList, page, description)));
				}
				else if (reaction.emoji.name == '▶️' && page < 4) {
					page++;
					sentMessage.edit(embed.setDescription(editDescription(currentList, page, description)));
				}
				else if (reaction.emoji.name == '🔀') {
					if (currentList == ruinedList) {
						currentList = balanceList;
						description = 'Current Balance\n';
					}
					else if (currentList == balanceList) {
						currentList = countList;
						description = 'Total Numbers Counted\n';
					}
					else {
						currentList = ruinedList;
						description = 'Total Streaks Ruined\n';
					}
					sentMessage.edit(embed.setDescription(editDescription(currentList, page, description)));
				}
			});
			collector.on('end', () => sentMessage.reactions.removeAll());
		});
	},
};

function editDescription(currentList, page, description) {
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (currentList[i]) description += currentList[i];
		else description += `\n__${i + 1}.__ noone`;
	}
	return description;
}