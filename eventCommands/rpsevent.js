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
			const numberIncrease = Math.floor(Math.random() * 5) + 5;
			const timeoutLength = 30;
			let description = `Be the **first** to click the button and Neia will count **${numberIncrease} times** for you.
			You will gain __**count rewards**__ for **every number** counted.
			
			This event will expire in **${timeoutLength} minutes.**`;
			const sentMessage = await numberGameChannel.send({ embeds: [embed.setDescription(description)], components: [row] });

			const emojiArray = ['✊', '🧻', '✂️'];
			const botAnswer = Math.floor(Math.random() * emojiArray.length);
			const winAmount = payoutRate * gambleAmount;
	
			const guessRow = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('0')
						.setEmoji('✊')
						.setStyle('PRIMARY')
				)
				.addComponents(
					new MessageButton()
						.setCustomId('1')
						.setStyle('PRIMARY')
						.setEmoji('🧻')
				)
				.addComponents(
					new MessageButton()
						.setCustomId('2')
						.setStyle('PRIMARY')
						.setEmoji('✂️')
				);
	
			const trueRow = new MessageActionRow();
			for (let i = 0; i < emojiArray.length; i++) {
				if (i == botAnswer) {
					trueRow.addComponents(
						new MessageButton()
							.setCustomId(`true${i}`)
							.setStyle('PRIMARY')
							.setEmoji(`${emojiArray[i]}`),
					);
				}
				else if (botAnswer - i === 1 || botAnswer - i === -2) {
					trueRow.addComponents(
						new MessageButton()
							.setCustomId(`true${i}`)
							.setStyle('DANGER')
							.setEmoji(`${emojiArray[i]}`),
					);
				}
				else if (i - botAnswer === 1 || i - botAnswer === -2) {
					trueRow.addComponents(
						new MessageButton()
							.setCustomId(`true${i}`)
							.setStyle('SUCCESS')
							.setEmoji(`${emojiArray[i]}`),
					);
				}
			}
	
	
			const filter = i => i.user.id == interaction.user.id;
			await interaction.reply({
				embeds: [embed.setDescription(`You have **bet** ${client.util.formatNumber(gambleAmount)}💰.
				**Choose __Rock__, __Paper__ or __Scissors__.**`)], components: [guessRow]
			});
			const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000 });

			collector.on('collect', async button => {
				const userAnswer = button.customId;
				
				if (botAnswer == userAnswer) {
					const balance = client.userManager.changeBalance(msgUser, gambleAmount, true);
					embed.setColor('#00fc43');
					button.update({
						embeds: [embed.setDescription(`__**You**__ have chosen ${emojiArray[userAnswer]}\n__**Neia**__ has chosen ${emojiArray[botAnswer]}.\n
						__**You Tied.**__ ${client.util.formatNumber(winAmount)}💰.\nYour current balance is ${client.util.formatNumber(balance)}💰`)], components: [trueRow]
					});
				}
				else if (botAnswer - userAnswer === 1 || botAnswer - userAnswer === -2) {
					embed.setColor('#fc0303');
					button.update({
						embeds: [embed.setDescription(`__**You**__ have chosen ${emojiArray[userAnswer]}\n__**Neia**__ has chosen ${emojiArray[botAnswer]}.\n
						__**You Lost**__ ${client.util.formatNumber(gambleAmount)}💰.\nYour current balance is ${client.util.formatNumber(msgUser.balance)}💰`)], components: [trueRow]
					});
				}
				else if (userAnswer - botAnswer === 1 || userAnswer - botAnswer === -2) {
					const balance = client.userManager.changeBalance(msgUser, winAmount, true);
					embed.setColor('#00fc43');
					button.update({
						embeds: [embed.setDescription(`__**You**__ have chosen ${emojiArray[userAnswer]}\n__**Neia**__ has chosen ${emojiArray[botAnswer]}.\n
						__**You Win!**__ ${client.util.formatNumber(winAmount)}💰.\nYour current balance is ${client.util.formatNumber(balance)}💰`)], components: [trueRow]
					});
				}

					let payout = 0;
					const user = await client.userManager.getUser(button.user.id);
					const oldNumber = numberGameInfo.currentNumber;

					numberGameInfo.currentNumber += numberIncrease;
					claimed = true;


					for (let i = oldNumber; i < oldNumber + numberIncrease; i++) {
						if (checkpoints.includes(i)) {
							const nextCheckpointIndex = checkpoints.indexOf(i) + 1;
							numberGameInfo.lastCheckpoint = i;
							numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
							numberGameChannel.send(`Checkpoint __**${i}**__ reached!\nIf you make a mistake you will be reversed to this checkpoint.`);
						}
						payout += i + Math.ceil(Math.sqrt(100) / 3); // ! NEEDS NEW VALUE
					}

					description += `\n\n**__THIS EVENT HAS BEEN CLAIMED BY:__ ${button.user}!**`;
					sentMessage.edit({ embeds: [embed.setDescription(description).setColor('#00fc43')], components: [] });

					numberGameInfo.lastUserId = null;
					client.userManager.changeBalance(user, payout);
					client.guildOverseer.saveNumberGameInfo(await client.guildOverseer.getGuild(sentMessage.guildId), numberGameInfo);
					numberGameChannel.send(`${oldNumber + numberIncrease}`).then(m => m.react(user.reaction));
					collector.stop();
			});
			//const collector = numberGameChannel.createMessageComponentCollector({ time: timeoutLength * 60000 });

			// collector.on('collect', async button => {
			// 	if (button.customId === 'claim') {

			// 		let payout = 0;
			// 		const user = await client.userManager.getUser(button.user.id);
			// 		const oldNumber = numberGameInfo.currentNumber;

			// 		numberGameInfo.currentNumber += numberIncrease;
			// 		claimed = true;


			// 		for (let i = oldNumber; i < oldNumber + numberIncrease; i++) {
			// 			if (checkpoints.includes(i)) {
			// 				const nextCheckpointIndex = checkpoints.indexOf(i) + 1;
			// 				numberGameInfo.lastCheckpoint = i;
			// 				numberGameInfo.nextCheckpoint = checkpoints[nextCheckpointIndex];
			// 				numberGameChannel.send(`Checkpoint __**${i}**__ reached!\nIf you make a mistake you will be reversed to this checkpoint.`);
			// 			}
			// 			payout += i + Math.ceil(Math.sqrt(100) / 3); // ! NEEDS NEW VALUE
			// 		}

			// 		description += `\n\n**__THIS EVENT HAS BEEN CLAIMED BY:__ ${button.user}!**`;
			// 		sentMessage.edit({ embeds: [embed.setDescription(description).setColor('#00fc43')], components: [] });

			// 		numberGameInfo.lastUserId = null;
			// 		client.userManager.changeBalance(user, payout);
			// 		client.guildOverseer.saveNumberGameInfo(await client.guildOverseer.getGuild(sentMessage.guildId), numberGameInfo);
			// 		numberGameChannel.send(`${oldNumber + numberIncrease}`).then(m => m.react(user.reaction));
			// 		collector.stop();
			// 	}
			// });


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