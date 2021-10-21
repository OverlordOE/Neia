const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('slots')
		.setDescription('Play a round of slots.')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount you want to gamble.')
				.setRequired(true)),

	async execute(interaction, msgUser, msgGuild, client) {
		/*
		?Profitability formula: y(1) = x*a*c / b^3
		y = avarage profit per spin in decimal percentage
		x = payout multiplier
		a = amount of proftitable rows per row
		b = amount of symbols
		c = amount of rows
		*/

		const embed = new MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium')
			.setFooter('Use the emojis to play the game.', client.user.displayAvatarURL({ dynamic: true }));


		const payoutRate = 1.8;
		const icons = ['🍋', '🍋', '🍋', '🍉', '🍉', '🍉', '🍒', '🍒', '🍌', '🍌', '<:luckyseven:838417718944333884>'];
		const slots = [];
		const slotX = 3;
		const slotY = 3;
		let output = '';
		let count = 0;
		let rowsWon = 0;

		let gambleAmount = interaction.options.getInteger('amount');
		if (gambleAmount < 1) gambleAmount = 1;
		if (gambleAmount > msgUser.balance) return interaction.reply({ content: `You don't have enough 💰.\n${client.util.formatNumber(gambleAmount - msgUser.balance)}💰 more needed.`, ephemeral: true });
		client.userCommands.addBalance(msgUser, -gambleAmount, true);


		output += `
		You have bet ${client.util.formatNumber(gambleAmount)}💰.
		Get **${slotX}** of the __**same symbol**__ in a row to **win**.
		Getting a 🍒 or 🍌 row will give **2X payout**.
		Getting a <:luckyseven:838417718944333884> row will give **4X payout**.\n
		`;

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
				const balance = client.userCommands.addBalance(msgUser, winAmount, true);
				output += `\n\n__**You won!**__ **${rowsWon}** row(s)!\nYou gained ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`;
				embed.setColor('#00fc43');
			}
			else {
				embed.setColor('#fc0303');
				output += `\n\n__**You lost!**__ ${client.util.formatNumber(gambleAmount)}💰\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`;
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
				output += '\n🇽';
				checkDiagonalWins();
				endGame();
			}
		}
	},
};