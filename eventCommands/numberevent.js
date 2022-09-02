const checkpoints = [50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000, 2250, 2500, 2750, 3000, 3300, 3600, 3900, 4200, 4600, 5000, 5500, 6000, 6600, 7200, 7900, 8600, 9400, 10000];
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async function execute(client) {

	client.guilds.cache.forEach(async g => {
		const guild = await client.guildOverseer.getGuild(g.id);
		const numberGameInfo = client.guildOverseer.getNumberGame(guild);
		let claimed = false;
		let numberGameChannel;

		if (numberGameInfo.channelId) {

			const embed = new MessageEmbed()
				.setTitle('__**NUMBER BOOST EVENT**__')
				.setFooter('These events happen randomly every 2 hours.', client.user.displayAvatarURL({ dynamic: true }))
				.setColor('#efc420');

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('claim')
						.setLabel('Claim!')
						.setStyle('SUCCESS')
						.setEmoji('💰'),
				);

			
			try { numberGameChannel = await client.channels.fetch(numberGameInfo.channelId); }
			catch (e) {
				client.guildOverseer.setNumberChannel(guild, null);
				client.logger.warn(`${guild.name} NumberGameChannel DOES NOT EXIST, removing numbergamechannel`);
				return;
			}

			const numberIncrease = Math.floor(Math.random() * 5) + 5;
			const timeoutLength = 41.7;
			let description = `Be the **first** to click the button and Neia will count **${numberIncrease} times** for you.
			You will gain __**count rewards**__ for **every number** counted.`;

			let sentMessage;
			try {
				sentMessage = await numberGameChannel.send({ embeds: [embed.setDescription(description)], components: [row] });
			} catch (error) {
				client.logger.warn(error);
			}
			if (numberGameInfo.currentEvent) numberGameInfo.currentEvent.delete();
			client.guildOverseer.setNumberGameEvent(guild, sentMessage);
			client.guildOverseer.saveNumberGameInfo(guild, numberGameInfo);

			const collector = numberGameChannel.createMessageComponentCollector({ time: timeoutLength * 60000 });

			collector.on('collect', async button => {
				if (button.customId === 'claim') {

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
						payout += i * user.countMultiplier;
					}

					description += `\n\n**__THIS EVENT HAS BEEN CLAIMED BY:__ ${button.user}!**`;
					sentMessage.edit({ embeds: [embed.setDescription(description).setColor('#00fc43')], components: [] });

					numberGameInfo.lastUserId = null;
					client.userManager.changeBalance(user, payout);
					client.guildOverseer.setNumberGameEvent(guild, null);
					client.guildOverseer.saveNumberGameInfo(guild, numberGameInfo);
					numberGameChannel.send(`${oldNumber + numberIncrease}`).then(m => m.react(user.reaction));
					collector.stop();
				}
			});


			collector.on('end', () => {
				client.guildOverseer.setNumberGameEvent(guild, null);
				if (!claimed) sentMessage.delete();
			});
		}
	});
	client.logger.info('Finished Number Game Events!');
};