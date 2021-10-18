const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Play blackjack against Neia.')
		.addIntegerOption(option =>
			option
				.setName('sides')
				.setDescription('The amount of sides the dice have.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of dice you want to use. MAX 100!')
				.setRequired(true)),

	execute(interaction, msgUser, msgGuild, client, logger) {
		let total = 0;
		let result = '';
		const sides = interaction.options.getInteger('sides');
		const amount = interaction.options.getInteger('amount');

		if (amount > 100 || amount < 1) return interaction.reply('The max die amount is 100.');


		const firstRoll = Math.floor((Math.random() * sides) + 1);
		total += firstRoll;
		if (firstRoll == sides || firstRoll == 1) result += `**${firstRoll}**`;
		else result += `${firstRoll}`;

		for (let i = 1; i < amount; i++) {
			const roll = Math.floor((Math.random() * sides) + 1);
			if (roll == sides || roll == 1) result += ` + **${roll}**`;
			else result += ` + ${roll}`;
			total += roll;
		}

		const embed = new MessageEmbed()
			.setColor('#f3ab16')
			.setDescription(`You rolled a **D${sides} ${amount}** times!\nThese are the results: \n${result}`)
			.addField('Total:', `**${total}**`, true)
			.addField('Average:', `**${Math.fround(total / amount)}**`, true);

		interaction.reply({ embeds: [embed] });
	},
};