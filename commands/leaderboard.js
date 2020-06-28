const Discord = require('discord.js');
module.exports = {
	name: 'leaderboard',
	summary: 'Shows global leaderboard',
	description: 'Shows global leaderboard.',
	category: 'info',
	aliases: ['lead', 'top', 'ranking'],
	args: false,
	usage: '<page>',

	async execute(msg, args, profile, guildProfile, bot) {

		const filter = (reaction, user) => {
			return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === msg.author.id;
		};

		const bAvatar = bot.user.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);

		const list = profile.sort((a, b) => b.balance - a.balance)
			.filter(user => bot.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}.**__ *${(bot.users.cache.get(user.user_id))}*: **${Math.floor(user.balance)}💰**`);

		let page = 0;
		if (!isNaN(args[0]) && args[0] > 0 && args[0] < 6) page = args[0] - 1;

		const description = editDescription(list, page);

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia leaderboard')
			.setDescription(description)
			.setThumbnail(bAvatar)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neia', bAvatar);

		msg.channel.send(embed).then(sentMessage => {
			sentMessage.react('◀️');
			sentMessage.react('▶️');
			const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

			collector.on('collect', (reaction) => {
				reaction.users.remove(msg.author.id);
				if (reaction.emoji.name == '◀️') {
					if (page > 0) {
						page--;
						sentMessage.edit(embed.setDescription(editDescription(list, page)));
					}
				}
				else if (reaction.emoji.name == '▶️') {
					if (page < 4) {
						page++;
						sentMessage.edit(embed.setDescription(editDescription(list, page)));
					}
				}
			});
		});
	},
};

function editDescription(list, page) {
	let description = '';
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (list[i]) description += list[i];
		else description += `\n__**${i + 1}.**__ noone`;
	}
	return description;
}