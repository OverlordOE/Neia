const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('BOT OWNER DEBUG COMMAND'),

	execute(interaction, msgUser, msgGuild, client) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });

		const embed = new EmbedBuilder()
			.setColor('#f3ab16')
			.setTitle('Neia V3.8: Collectables and Reaction overhaul')
			.setDescription(`hdsdabdsd
		dsadas`);

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
				client.guildOverseer.setNumberChannel(guild, null);
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

