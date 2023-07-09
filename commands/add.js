const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('BOT OWNER DEBUG COMMAND')
		.addSubcommand(subcommand =>
			subcommand
				.setName('item')
				.setDescription('Add an item to a user')
				.addUserOption(option =>
					option
						.setName('target')
						.setDescription('The user')
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('item')
						.setDescription('The item')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName('amount')
						.setDescription('The amount of items to give')
						.setRequired(true),
				))

		.addSubcommand(subcommand =>
			subcommand
				.setName('money')
				.setDescription('Add money to a user')
				.addUserOption(option =>
					option
						.setName('target')
						.setDescription('The user')
						.setRequired(true),
				)
				.addIntegerOption(option =>
					option
						.setName('amount')
						.setDescription('The amount to give')
						.setRequired(true),
				)),


	async execute(interaction, msgUser, msgGuild, client) {
		if (interaction.user.id != 137920111754346496) return interaction.reply({ content: 'Only Neia\'s owner can use this command!', ephemeral: true });

		const amount = interaction.options.getInteger('amount');
		const target = interaction.options.getUser('target');
		const targetUser = await client.userManager.getUser(target.id);


		if (interaction.options.getSubcommand() === 'item') {
			const item = client.util.getItem(interaction.options.getUser('item'));
			client.itemHandler.addItem(targetUser, item, amount);
			return interaction.reply(`Added ${amount} __${item.name}__ to ${target}`);
		}
		else if (interaction.options.getSubcommand() === 'money') {
			client.userManager.changeBalance(targetUser, amount);
			const balance = client.util.formatNumber(targetUser.balance);

			if (amount <= 0) return interaction.reply(`Successfully removed ${client.util.formatNumber(amount * -1)}💰 from *${target}*. Their current balance is ${balance}💰`);
			return interaction.reply(`Successfully added ${client.util.formatNumber(amount)}💰 to *${target}*. Their current balance is ${balance}💰`);
		}
	},
};