const Discord = require('discord.js');
module.exports = {
	name: 'leaderboard',
	description: 'Shows global leaderboard.',
	admin: false,
	aliases: ['lead', 'top', 'ranking'],
	args: false,
	usage: '',
	owner: false,
	music: false,


	async execute(msg, args, profile, bot) {


		const filter = (reaction, user) => {
			return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === msg.author.id;
		};

		const bAvatar = bot.user.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);

		const list = profile.sort((a, b) => b.balance - a.balance)
			.filter(user => bot.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}.**__ ${(bot.users.cache.get(user.user_id))}: **${Math.floor(user.balance)}💰**`);

		let page = 0;
		const description = editDescription(list, page);



		const embed = new Discord.MessageEmbed()
			.setTitle('Neija leaderboard')
			.setDescription(description)
			.setThumbnail(bAvatar)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);

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
	let description;
	for (let i = page * 10; i < (10 + page * 10); i++) description += list[i];
	return description;
}