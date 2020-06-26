const Discord = require('discord.js');
const cron = require('cron');
const fs = require('fs');
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
		//	crontime: 0 0-23/3 * * *	collectortime: 10740000	channelID: 721743056528867393		winchance: 50
		const lotteryJob = new cron.CronJob('0 0-23/3 * * *', async () => {

			let writeData;
			const misc = JSON.parse(fs.readFileSync('miscData.json'));
			const channel = bot.channels.cache.get('721743056528867393');
			const bAvatar = bot.user.displayAvatarURL();
			const pColour = await profile.getPColour(msg.author.id);
			const buyin = 5;
			let players = 'Current participants:';
			const participants = [];
			const notifyList = [];
			let lottery = misc.lastLottery;
			const description = `Press 💰 to participate in the lottery!\nPress 🔔 to get notified when the lottery ends\n\n${buyin}💰 buy-in.`;
			let duplicate = false;

			const embed = new Discord.MessageEmbed()
				.setTitle('Neija Lottery')
				.setDescription(`${description}\nCurrent jackpot: ${lottery}💰!`)
				.setColor(pColour)
				.setTimestamp()
				.setFooter('Neija', bAvatar);

			const filter = (reaction, user) => {
				return ['💰', '🔔'].includes(reaction.emoji.name) && !user.bot;
			};

			await channel.send(embed)
				.then(sentMessage => {
					sentMessage.react('💰');
					sentMessage.react('🔔');

					const collector = sentMessage.createReactionCollector(filter, { time: 10740000 });

					collector.on('collect', async (r, user) => {

						if (r.emoji.name == '🔔') {
							notifyList.push(user);
							user.send(`You will be notified when the lottery will end\n\nThis lottery has a jackpot of **${lottery}💰** \nYour ticket number is \`not implemented yet\`.`);
						}
						else if (r.emoji.name == '💰') {
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
									lottery = misc.lastLottery + (participants.length * buyin);
									sentMessage.edit(embed.setDescription(`${description}\nCurrent lottery: **${lottery}💰**\n${players}`));
								}
								else {
									user.send(`You only have **${bCheck}💰** but the buy-in is **${buyin}💰**.`);
								}
							}
							duplicate = false;
						}
					});


					collector.on('end', () => {

						const winNumber = Math.floor(Math.random() * 50);
						let winner;

						for (let i = 0; i < participants.length; i++) {
							if (i == winNumber) {
								misc.lastLottery = 0;
								profile.addMoney(participants[i].id, lottery);
								winner = participants[i];
								channel.send(`Congrats ${participants[i]} on winning the jackpot of **${lottery}💰**!!!`);
								sentMessage.edit(embed.setDescription(`Current lottery: **${lottery}💰**\n${players}\n\nLottery has ended and the winning number is __**${winNumber + 1}**__\n${participants[winNumber]} has won the lottery of **${lottery}💰**`));
								
							}
						}
						misc.lastLottery = lottery + 50;

						for (let i = 0; i < notifyList.length; i++) {
							if (winner == notifyList[i]) notifyList[i].send(`The lottery has ended\nYou have won the lottery with lucky number __**${winNumber + 1}**__ and won **${lottery}💰**!\n\nThe next jackpot will be **${50}💰** and is starting in 1 minute`);
							else notifyList[i].send(`The lottery has ended\nThe winning number is __**${winNumber + 1}**__ but you had the number \`not implemented yet\`.\n\nThe next jackpot will be **${misc.lastLottery}💰** and is starting in 1 minute`);
						}

						writeData = JSON.stringify(misc);
						fs.writeFileSync('miscData.json', writeData);
						if (!winner) sentMessage.edit(embed.setDescription(`Current lottery: **${lottery}💰**\n${players}\n\nLottery has ended and the winning number is __**${winNumber + 1}**__\n\nNoone won the lottery of **${lottery}💰**, it will be added to next days lottery!`));
					});

				})
				.catch(e => {
					logger.error(e.stack);
					return msg.reply('Something went wrong.');
				});
		});
		lotteryJob.start();
		msg.reply('Starting lottery');


	},
};