const Discord = require('discord.js');
module.exports = {
	name: 'duel',
	description: 'Fight to the death against someone else in the server.',
	owner: false,
	aliases: ['fight'],
	args: true,
	usage: '(target)',
	admin: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger) {

		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		const target = msg.mentions.users.first();




		if (!target) {
			return msg.channel.send('Incorrect mention');
		}

		let description = `Press 💰 to participate in the jackpot, you have 60 seconds to join in !\n${buyin}💰 buy-in.\nCurrent jackpot: ${jackpot} 💰`;

		const embed = new Discord.MessageEmbed()
			.setTitle(`${msg.author} VS ${target}`)
			.setThumbnail(avatar)
			.setDescription(description)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);



		const filter = (reaction, user) => {
			return ['⚔️'].includes(reaction.emoji.name) && user.id === target.id;
		};

		await msg.channel.send(embed)
			.then(sentMessage => {
				sentMessage.react('💰');

				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', async (r, user) => {


					if (!duplicate) {
						const bCheck = await profile.getBalance(user.id);

						if (bCheck >= buyin) {
							participants.push(user);
							players += `\n${user}`;
							jackpot = participants.length * buyin;
							sentMessage.edit(embed.setDescription(`Press 💰 to participate in the jackpot, you have 60 seconds to join in!\n${buyin}💰 buy-in.\nCurrent jackpot: ${jackpot}💰\n${players}`));
						} else {
							user.send(`You only have ${bCheck}💰 but the buy-in is ${buyin}💰.`);
						}
					}
					duplicate = false;
				});
				collector.on('end', collected => {
					if (participants.length < 2) return sentMessage.edit(embed.setDescription(`Current jackpot: ${jackpot}💰\n${players}\n\nNot enough people signed up, jackpot cancelled.`));

					const winner = Math.floor(Math.random() * participants.length);

					for (let i = 0; i < participants.length; i++) {
						profile.addMoney(participants[i].id, -buyin);
						if (i == winner) profile.addMoney(participants[i].id, jackpot);
					}

					sentMessage.edit(embed.setDescription(`Current jackpot: ${jackpot}💰\n${players}\n\nBuy-in time has ended\n${participants[winner]} has won the jackpot of **${jackpot}💰**`));
				});

			})
			.catch(e => {
				logger.log('error', `One of the emojis failed to react because of:\n${e}`);
				return msg.reply('Something went wrong.');
			});
	},
};