const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('BOT OWNER DEBUG COMMAND'),

	execute(interaction, msgUser, msgGuild, client) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });

		const embed = new EmbedBuilder()
			.setColor('#f3ab16')
			.setTitle('Neia V3.8: API Upgrade and Bug Fixes')
			.setDescription(`
This update does not add many new features but instead is an upgrade to Neia's backbone so i can make better features later

### **Economy**
Neia's economy has changed, it still needs fine tuning but the rewards for count multipliers and dailies/hourlies was way too high so they got tuned

* Daily Multiplier from **5.0 -> 2.5**
* Hourly Multiplier from **1 -> 0.5**
* Count Multipliers from **1 -> 0.2** (Max from 11 -> 3)

### **Neia's DM Spam**
Neia no longer spams your DMs with all the Hourly and Daily counts and now instead reacts to the number whenever they happen

### **__Bug Fixes and Minor Changes__**
* \`Numberguessing\` got renamed to \`1in5\`
* \`Blackjack\` works again
* \`Slots\` now shows your final balance at the end
* Changed Avatar location on Number Event
* Updated UI on some commands
* Changed \`Profile\` Layout and made the inventories clearer
* Changed wording of Achievement unlocks for better clarity

### **User Suggestions**
I currently want to know what people want from Neia.
If anyone has **Suggestions** or **Feedback** I would love to hear them. Post all suggestions/Feedback in [#neia-discussions](https://discord.com/channels/390502342908444683/1040668787025911858).
[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=684458276129079320&permissions=397388672064&scope=applications.commands%20bot)
[Click here to join the support server](https://discord.gg/hFGxVDT)
[Click here to submit a bug or request  feature](https://discord.com/channels/390502342908444683/1040668787025911858)
For more info contact: OverlordOE#0717
 `.replace(/\t+/g, ''));

		try {
			client.guilds.cache.forEach(async (g) => {
				sendUpdate(g);
			});
			client.logger.info("Finished sending updates!");
			interaction.reply('Finished sending updates!');
		}
		catch (error) {
			interaction.reply(`Something went wrong!\n${error}`);
			return client.logger.error(error.stack);
		}

		async function sendUpdate(g) {

			const guild = await client.guildOverseer.getGuild(g.id);
			const numberGameInfo = client.guildOverseer.getNumberGame(guild);
			let numberGameChannel;

			try {
				numberGameChannel = await client.channels.fetch(numberGameInfo.channelId);
			}
			catch (e) {
				client.guildOverseer.setNumberGameChannel(guild, null);
				client.logger.warn(
					`${guild.name} NumberGameChannel DOES NOT EXIST, removing numbergamechannel`
				);
			}
			if (!numberGameInfo.channelId) return;


			await numberGameChannel.send({
				embeds: [embed]
			});

		}
	},
};

