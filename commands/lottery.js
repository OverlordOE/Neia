const Discord = require('discord.js');
const cron = require('cron');
module.exports = {
	name: 'lottery',
	description: 'Daily lottery everyone can enter.',
	owner: true,
	aliases: [],
	args: false,
	usage: '',
	admin: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const lottery = new cron.CronJob('* * * * *', async () => {
			//0 18 * * *
			const channel = bot.channels.cache.get('720083496420376616');

			const bAvatar = bot.user.displayAvatarURL();
			const pColour = await profile.getPColour(msg.author.id);
			const buyin = 5;
			let players = 'Current participants:';
			const participants = [];
			let lottery = 50 + (participants.length * buyin);
			const description = `Press 💰 to participate in the lottery!\n${buyin}💰 buy-in.\nCurrent jackpot: ${lottery}💰!`;
			let duplicate = false;

			const embed = new Discord.MessageEmbed()
				.setTitle('Syndicate Lottery')
				.setDescription(description)
				.setColor(pColour)
				.setTimestamp()
				.setFooter('Syndicate Imporium', bAvatar);

			const filter = (reaction, user) => {
				return ['💰'].includes(reaction.emoji.name) && !user.bot;
			};

			await channel.send(embed)
				.then(sentMessage => {
					sentMessage.react('💰');

					const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

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
								profile.addMoney(user.id, -buyin);
								players += `\n${participants.length}: ${user}`;
								lottery = 100 + (participants.length * buyin);
								sentMessage.edit(embed.setDescription(`Press 💰 to participate in the lottery!\n${buyin}💰 buy-in.\nCurrent lottery: ${lottery}💰\n${players}`));
							}
							else {
								user.send(`You only have ${bCheck}💰 but the buy-in is ${buyin}💰.`);
							}
						}
						duplicate = false;
					});


					collector.on('end', collected => {

						const winner = Math.floor(Math.random() * 50);

						for (let i = 0; i < participants.length; i++) {
							if (i == winner) {
								profile.addMoney(participants[i].id, lottery);
								return sentMessage.edit(embed.setDescription(`Current lottery: ${lottery}💰\n${players}\n\nLottery has ended and the winning number is __**${winner + 1}**__\n${participants[winner]} has won the lottery of **${lottery}💰**`));
							}
						}

						sentMessage.edit(embed.setDescription(`Current lottery: ${lottery}💰\n${players}\n\nLottery has ended and the winning number is __**${winner + 1}**__\n\nNoone won the lottery of **${lottery}💰**, it will be added to next days lottery!`));
					});

				})
				.catch(e => {
					logger.log('error', `One of the emojis failed to react because of:\n${e}`);
					return msg.reply('Something went wrong.');
				});
		});
		lottery.start();
		msg.reply('Starting lottery');


	},
};