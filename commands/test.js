const Discord = require('discord.js');
module.exports = {
	name: 'test',
	description: 'Test command for new commands.',
	owner: true,
	aliases: ['t'],
	args: true,
	usage: '(buy-in amount)',
	admin: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger) {

		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		const buyin = args[0];
		let participants = [];
		let jackpot = participants.length * buyin;
		let duplicate = false;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neija Jackpot')
			.setThumbnail(avatar)
			.setDescription(`Press 💰 to participate in the jackpot, you have 20 seconds to join in!\nCurrent jackpot: ${jackpot}💰`)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);

		if (!buyin || isNaN(buyin)) return msg.channel.send(embed.setDescription(`Sorry ${msg.author}, that's an invalid amount.`));
		if (buyin <= 0) return msg.channel.send(embed.setDescription(`Please enter an amount greater than zero, ${msg.author}.`));


		const filter = (reaction, user) => {
			return ['💰'].includes(reaction.emoji.name) && !user.bot;
		};

		await msg.channel.send(embed)
			.then(sentMessage => {
				sentMessage.react('💰');

				const collector = sentMessage.createReactionCollector(filter, { time: 20000 });

				collector.on('collect', async (r, user) => {

					for (let i = 0; i < participants.length; i++) {
						if (user.id == participants[i].id) {
							duplicate = true;
							break;
						}
					}
					if (!duplicate) {
						const bCheck = await profile.getBalance(user.id);

						if (bCheck >= buyin) {
							participants.push(user);
							jackpot = participants.length * buyin;
							sentMessage.edit(embed.setDescription(`Press 💰 to participate in the jackpot, you have 20 seconds to join in!\nCurrent jackpot: ${jackpot}💰`));
						} else {
							user.send(`You only have ${bCheck}💰 but the buy-in is ${buyin}💰.`);
						}
					}
					duplicate = false;
				});
				collector.on('end', collected => {
					const winner = Math.floor(Math.random() * participants.length);

					for (let i = 0; i < participants.length; i++) {
						profile.addMoney(participants[i].id, -buyin);
						if (i == winner) profile.addMoney(participants[i].id, jackpot);
					}

					sentMessage.edit(embed.setDescription(`Press 💰 to participate in the jackpot, you have 20 seconds to join in!\nCurrent jackpot: ${jackpot}💰\n\nBuy-in time has ended\n${participants[winner]} has won the jackpot of **${jackpot}💰**`));
				});

			})
			.catch(e => {
				logger.log('error', `One of the emojis failed to react because of:\n${e.info}`);
				return msg.reply('Something went wrong.');
			});
	},
};