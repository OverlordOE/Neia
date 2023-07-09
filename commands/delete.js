const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete up to the last 100 messages. REQUIRES MANAGE_MESSAGES PERMISSION!')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of messages you want to delete.')
				.setRequired(true)),

	permissions: 'MANAGE_MESSAGES',

	execute(interaction, msgUser, msgGuild, client) {

		const amount = interaction.options.getInteger('amount');
		if (isNaN(amount)) return interaction.reply(`**${amount}** is not a valid number`);
		if (amount < 1 || amount > 100) return interaction.reply('Input a number between 1 and 100');

		try {
			interaction.channel.bulkDelete(amount);
			interaction.reply({ content: `You succesfully deleted **${amount}** messages.`, ephemeral: true });
			client.logger.log('info', `*${interaction.user.tag}* deleted **${amount}** messages in channel ${interaction.channel.name}`);
		}
		catch (error) {
			client.logger.error(error.stack);
			throw Error('Something went wrong');
		}
	},
};