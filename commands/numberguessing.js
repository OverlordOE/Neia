const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('numberguessing')
		.setDescription('Guess which number Neia has in her mind.')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount you want to gamble.')
				.setRequired(true))
		.addBooleanOption(option =>
				option
					.setName('allin')
					.setDescription('Wheter you\'re going broke today')
					.setRequired(false)),
		


	async execute(interaction, msgUser, msgGuild, client) {
		const embed = new MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Number Guessing')
			.setFooter('Use the emojis to play the game.', client.user.displayAvatarURL({ dynamic: true }));

		const payoutRate = 5;

		let gambleAmount = interaction.options.getInteger('amount');
		
		if (gambleAmount < 1) gambleAmount = 1;
		if (interaction.options.getBoolean('allin')) gambleAmount = msgUser.balance;
		if (gambleAmount > msgUser.balance) return interaction.reply({ content: `You don't have enough 💰.\n${client.util.formatNumber(gambleAmount - msgUser.balance)}💰 more needed.`, ephemeral: true });

		client.userManager.changeBalance(msgUser, -gambleAmount, true);

		const answer = Math.floor((Math.random() * 5) + 1);
		const winAmount = payoutRate * gambleAmount;


		const guessRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('1')
					.setLabel('1')
					.setStyle('PRIMARY')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('2')
					.setStyle('PRIMARY')
					.setLabel('2')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('3')
					.setStyle('PRIMARY')
					.setLabel('3')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('4')
					.setStyle('PRIMARY')
					.setLabel('4')
			)
			.addComponents(
				new MessageButton()
					.setCustomId('5')
					.setStyle('PRIMARY')
					.setLabel('5')
			);
		const trueRow = new MessageActionRow();
		for (let i = 1; i < 6; i++) {
			if (i == answer) {
				trueRow.addComponents(
					new MessageButton()
						.setCustomId(`true${i}`)
						.setStyle('SUCCESS')
						.setLabel(`${i}`),
				);
			}
			else {
				trueRow.addComponents(
					new MessageButton()
						.setCustomId(`true${i}`)
						.setStyle('DANGER')
						.setLabel(`${i}`),
				);
			}
		}


		const filter = i => i.user.id == interaction.user.id;
		interaction.reply({
			embeds: [embed.setDescription(`You have **bet** ${client.util.formatNumber(gambleAmount)}💰.
			**Guess the __number__ between __1 and 5__.**`)], components: [guessRow]
		});
		const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 60000 });

		collector.on('collect', async button => {
			if (button.customId == answer) {
				const balance = client.userManager.changeBalance(msgUser, winAmount, true);
				embed.setColor('#00fc43');
				button.update({
					embeds: [embed.setDescription(`You have chosen __${button.customId}__\nThe correct answer was **${answer}**.\n
					__**You win**__ ${client.util.formatNumber(winAmount)}💰.\nYour current balance is ${client.util.formatNumber(balance)}💰`)], components: [trueRow]
				});
			}
			else {
				embed.setColor('#fc0303');
				button.update({
					embeds: [embed.setDescription(`You have chosen __${button.customId}__\nThe correct answer was **${answer}**.\n
					__**You lost**__ ${client.util.formatNumber(gambleAmount)}💰.\nYour current balance is ${client.util.formatNumber(msgUser.balance)}💰`)], components: [trueRow]
				});
			}
		});
	},
};

