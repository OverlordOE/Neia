const checkpoints = [50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000, 2250, 2500, 2750, 3000];
const Discord = require('discord.js');

module.exports = async function execute(client, logger) {

	client.guilds.cache.forEach(async g => {
		const guild = await client.guildCommands.getGuild(g.id);
		const numberGameInfo = client.guildCommands.getNumberGame(guild);
		let claimed = false;

		if (numberGameInfo.channelId) {
			const filter = (reaction, user) => {
				return reaction.emoji.name == '💰' && !user.bot;
			};
			const embed = new Discord.MessageEmbed()
				.setTitle('__**NUMBER BOOST EVENT**__')
				.setFooter('These events happen randomly every hour.', client.user.displayAvatarURL())
				.setColor('#f3ab16');


			const numberGameChannel = await client.channels.fetch(numberGameInfo.channelId);
			const numberIncrease = Math.floor(Math.random() * 10) + 6;
			const timeoutLength = 30;
			let description = `Be the **first** to click the emoji and the bot will count **${numberIncrease} times** for you.
			You will gain __**normal count**__ and __**custom reaction**__ rewards for **every number** counted.
			
			This event will expire in **${timeoutLength} minutes.**`;
			const sentMessage = await numberGameChannel.send(embed.setDescription(description));


			sentMessage.react('💰');
			const collector = sentMessage.createReactionCollector({ filter, time: timeoutLength * 60000 });

			collector.on('collect', async (r, u) => {
				let payout = 0;
				const user = await client.userCommands.getUser(u.id);
				const oldNumber = numberGameInfo.currentNumber;

				numberGameInfo.currentNumber += numberIncrease;
				claimed = true;

				const reaction = client.userCommands.getReaction(user);
				if (reaction.emoji && reaction.value) {
					for (let i = oldNumber; i < oldNumber + numberIncrease; i++) {
						if (checkpoints.includes(i)) {
							const nextCheckpointIndex = checkpoints.indexOf(i) + 1;
							numberGameInfo.lastCheckpoint = i;
							numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
							numberGameChannel.send(`Checkpoint __**${i}**__ reached!\nIf you make a mistake you will be reversed to this checkpoint.`);
						}
						payout += i + Math.sqrt(reaction.value);
					}
				}
				description += `\n\n**__THIS EVENT HAS BEEN CLAIMED BY:__ ${u}!**`;
				sentMessage.edit(embed.setDescription(description).setColor('#00fc43'));

				numberGameInfo.lastUserId = null;
				client.userCommands.addBalance(user, payout);
				client.guildCommands.saveNumberGameInfo(await client.guildCommands.getGuild(sentMessage.guild.id), numberGameInfo);
				numberGameChannel.send(oldNumber + numberIncrease).then(m => m.react('✅'));
				collector.stop();
			});
			collector.on('end', () => {
				sentMessage.reactions.removeAll();
				if (!claimed) {
					description += '\n\n__**THIS EVENT HAS EXPIRED!**__';
					sentMessage.edit(embed.setDescription(description).setColor('#fc0303'));
				}
			});
		}
	});
	logger.info('Finished Number Game Events!');
};