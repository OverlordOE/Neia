const checkpoints = [50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000, 2250, 2500, 2750, 3000, 3300, 3600, 3900, 4200, 4600, 5000];
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async function execute(client) {

	client.guilds.cache.forEach(async g => {
		const guild = await client.guildOverseer.getGuild(g.id);
		const numberGameInfo = client.guildOverseer.getNumberGame(guild);
		let claimed = false;

		if (numberGameInfo.channelId) {
			const embed = new MessageEmbed()
				.setTitle('__**NUMBER BOOST EVENT**__')
				.setFooter('These events happen randomly every 2 hours.', client.user.displayAvatarURL({ dynamic: true }))
				.setColor('#f3ab16');

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('claim')
						.setLabel('Claim!')
						.setStyle('SUCCESS')
						.setEmoji('💰'),
				);

			const numberGameChannel = await client.channels.fetch(numberGameInfo.channelId);
			const numberIncrease = Math.floor(Math.random() * 5) + 4;
			const timeoutLength = 30;
			let description = `Be the **first** to click the emoji and the bot will count **${numberIncrease} times** for you.
			You will gain __**normal count**__ and __**custom reaction**__ rewards for **every number** counted.
			
			This event will expire in **${timeoutLength} minutes.**`;
			const sentMessage = await numberGameChannel.send({ embeds: [embed.setDescription(description)], components: [row] });


			const collector = numberGameChannel.createMessageComponentCollector({ time: timeoutLength * 60000 });

			collector.on('collect', async button => {
				if (button.customId === 'claim') {

					let payout = 0;
					const user = await client.userManager.getUser(button.user.id);
					const oldNumber = numberGameInfo.currentNumber;

					numberGameInfo.currentNumber += numberIncrease;
					claimed = true;

					const reaction = client.userManager.getReaction(user);
					if (reaction.emoji && reaction.value) {
						for (let i = oldNumber; i < oldNumber + numberIncrease; i++) {
							if (checkpoints.includes(i)) {
								const nextCheckpointIndex = checkpoints.indexOf(i) + 1;
								numberGameInfo.lastCheckpoint = i;
								numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
								numberGameChannel.send(`Checkpoint __**${i}**__ reached!\nIf you make a mistake you will be reversed to this checkpoint.`);
							}
							payout += i + Math.sqrt(reaction.value) / 3;
						}
					}
					description += `\n\n**__THIS EVENT HAS BEEN CLAIMED BY:__ ${button.user}!**`;
					sentMessage.edit({ embeds: [embed.setDescription(description).setColor('#00fc43')], components: [] });

					numberGameInfo.lastUserId = null;
					client.userManager.addBalance(user, payout);
					client.guildOverseer.saveNumberGameInfo(await client.guildOverseer.getGuild(sentMessage.guildId), numberGameInfo);
					numberGameChannel.send(`${oldNumber + numberIncrease}`).then(m => m.react('✅'));
					collector.stop();
				}
			});


			collector.on('end', () => {
				if (!claimed) {
					description += '\n\n__**THIS EVENT HAS EXPIRED!**__';
					sentMessage.edit({ embeds: [embed.setDescription(description).setColor('#fc0303')], components: [] });
				}
			});
		}
	});
	client.logger.info('Finished Number Game Events!');
};