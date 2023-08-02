const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('slots')
		.setDescription('Play a round of slots.')
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
		/*
		fixme: Profitability formula: y(1) = x*a*c / b^3
		y = avarage profit per spin in decimal percentage
		x = payout multiplier
		a = amount of proftitable rows per row
		b = amount of symbols
		c = amount of rows
		*/

		const embed = new EmbedBuilder()
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium');


		const payoutRate = 1.6;
		const icons = [
			'🍋', '🍋', '🍋', '🍋', '🍋',
			'🍉', '🍉', '🍉', '🍉', '🍉',
			'🍒', '🍒', '🍒',
			'🍌', '🍌', '🍌',
			'<:luckyseven:838417718944333884>', '<:luckyseven:838417718944333884>'];
		const slots = [];
		const slotX = 3;
		const slotY = 3;
		let output = '';
		let count = 0;
		let rowsWon = 0;

		let gambleAmount = interaction.options.getInteger('amount');
		if (gambleAmount < 1) gambleAmount = 1;
		if (interaction.options.getBoolean('allin')) gambleAmount = msgUser.balance;
		if (gambleAmount > msgUser.balance) return interaction.reply({ content: `You don't have enough 💰.\n${client.util.formatNumber(gambleAmount - msgUser.balance)}💰 more needed.`, ephemeral: true });
		client.userManager.changeBalance(msgUser, -gambleAmount, true);


		output += `
		You have bet ${client.util.formatNumber(gambleAmount)}💰.

		**${payoutRate}X** Payout per row.
		🍋 and 🍉 add **1 row**
		🍒 and 🍌 add **2 rows**
		<:luckyseven:838417718944333884> adda **4 rows**
		\n`;

		for (let i = 0; i < slotY; i++) {
			slots[i] = [];
			for (let j = 0; j < slotX; j++) {
				const slotIcon = icons[Math.floor(Math.random() * icons.length)];
				slots[i][j] = slotIcon;
			}
		}
		await interaction.reply({ embeds: [embed.setDescription(output)] });
		setEmbed();

		function checkHorizontalWins() {
			if (slots[count].every((val, g, arr) => val === arr[0])) checkWinType(count, 0);
			else output += '❌';
		}

		function checkVerticalWins() {
			for (let i = 0; i < slotX; i++) {
				let win = true;
				const tempIcon = slots[0][i];

				for (let j = 0; j < slotY; j++) {
					if (slots[j][i] != tempIcon) win = false;
				}

				if (win) checkWinType(0, i);
				else output += '❌';
			}
		}

		function checkDiagonalWins() {
			let win = true;
			let tempIcon = slots[0][0];

			for (let i = 0; i < slotY; i++) {
				if (slots[i][i] != tempIcon) win = false;
			}

			if (win) checkWinType(0, 0);
			else output += '❌';

			win = true;
			tempIcon = slots[0][slotX - 1];

			for (let i = 0; i < slotX; i++) {
				if (slots[i][slotX - i - 1] != tempIcon) win = false;
			}

			if (win) checkWinType(0, slotX - 1);
			else output += '❌';

		}

		function checkWinType(x, y) {
			if (slots[x][y] == '<:luckyseven:838417718944333884>') {
				rowsWon += 4;
				output += '🌟';
			}
			else if (slots[x][y] == '🍌' || slots[x][y] == '🍒') {
				rowsWon += 2;
				output += '⭐';
			}
			else {
				rowsWon++;
				output += '✅';
			}
		}

		function endGame() {
			if (rowsWon >= 1) {
				const winAmount = gambleAmount * payoutRate * rowsWon;
				client.userManager.changeBalance(msgUser, winAmount, true);
				output += `\n\n**__You have ${rowsWon} row(s)__ and got a payout of __${payoutRate * rowsWon}X your bet!__**\nYou won ${client.util.formatNumber(winAmount)}💰`;
				embed.setColor('#00fc43');
			}
			else {
				embed.setColor('#fc0303');
				output += `\n\n__**You lost!**__ ${client.util.formatNumber(gambleAmount)}💰`;
			}
			interaction.editReply({ embeds: [embed.setDescription(output)] });
		}

		function setEmbed() {
			for (let j = 0; j < slots[count].length; j++) output += slots[count][j];

			checkHorizontalWins();
			output += '\n';
			interaction.editReply({ embeds: [embed.setDescription(output)] });

			count++;
			if (count < slotY) {
				setTimeout(() => setEmbed(), 1500);
			}
			else {
				checkVerticalWins();
				output += '\n\n🇽';
				checkDiagonalWins();
				endGame();
			}
		}
	},
};