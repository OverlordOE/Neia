const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rockpaperscissors')
		.setDescription('Play a game of Rock, Paper, Scissors against Neia.')
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
		const payoutRate = 1.8;

		const embed = new MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Rock, Paper, Scissors')
			.setFooter('Use the emojis to play the game.', client.user.displayAvatarURL({ dynamic: true }));


		let gambleAmount = interaction.options.getInteger('amount');
		if (gambleAmount < 1) gambleAmount = 1;
		if (interaction.options.getBoolean('allin')) gambleAmount = msgUser.balance;
		if (gambleAmount > msgUser.balance) return interaction.reply({ content: `You don't have enough 💰.\n${client.util.formatNumber(gambleAmount - msgUser.balance)}💰 more needed.`, ephemeral: true });

		client.userManager.changeBalance(msgUser, -gambleAmount, true);

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
		interaction.reply({
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
		});
	},
};

