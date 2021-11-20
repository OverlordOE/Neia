const Discord = require('discord.js');
module.exports = {
	name: 'Debugslots',
	summary: 'Play a round of Fruit Slots',
	description: 'Play a round of Fruit Slots. Horizontal rows and vertical rows only.',
	category: 'debug',
	aliases: ['ds', 'fruit', 'fruits', 'slot'],
	args: true,
	usage: '<gamble amount>',
	example: '100',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		/* 
		Profitability formula: y(1) = x*a*c / b^3
		y = avarage profit per spin in decimal percentage
		x = payout multiplier
		a = amount of proftitable rows per row
		b = amount of symbols
		c = amount of rows
		*/

		const payoutRate = 1.8;
		const icons = ['🍋', '🍋', '🍋', '🍉', '🍉', '🍉', '🍒', '🍒', '🍌', '🍌', '<:luckyseven:838417718944333884>'];
		let slots = [];
		const slotX = 3;
		const slotY = 3;
		let gambleAmount = 0;
		let output = '-';
		let rowsWon = 0;
		const embed = new Discord.MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium')
			.setFooter('Use the emojis to play the game.', client.user.displayAvatarURL({ dynamic: true }));


		for (let i = 0; i < args.length; i++) {
			if (!isNaN(parseInt(args[i]))) gambleAmount = parseInt(args[i]);
			else if (args[i] == 'all') gambleAmount = Math.floor(msgUser.balance);
		}

		if (gambleAmount < 1) gambleAmount = 1;
		if (gambleAmount > msgUser.balance) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, you only have ${client.util.formatNumber(msgUser.balance)}💰.`));


		for (let a = 0; a < args[1]; a++) {
			output += `\n${a}: `;
			slots = [];
			rowsWon = 0;
			client.userCommands.addBalance(msgUser, -gambleAmount, true);

			for (let i = 0; i < slotY; i++) {
				slots[i] = [];
				for (let j = 0; j < slotX; j++) {
					const slotIcon = icons[Math.floor(Math.random() * icons.length)];
					slots[i][j] = slotIcon;
				}
			}
			checkHorizontalWins();
			checkVerticalWins();
			checkDiagonalWins();
			endGame();
			if (output.length > 1800) {
				message.channel.send(embed.setDescription(output));
				output = '';
			}
		}
		message.channel.send(embed.setDescription(output));


		function checkHorizontalWins() {
			for (let i = 0; i < slotX; i++) {
				if (slots[i].every((val, g, arr) => val === arr[0])) checkWinType(i, 0);
				else output += '❌';
			}
		}

		function checkVerticalWins() {
			for (let i = 0; i < slotX; i++) {
				let win = true;
				const tempIcon = slots[0][i];

				for (let j = 0; j < slotY; j++)
					if (slots[j][i] != tempIcon) win = false;

				if (win) checkWinType(0, i);
				else output += '❌';
			}
		}

		function checkDiagonalWins() {
			let win = true;
			let tempIcon = slots[0][0];

			for (let i = 0; i < slotY; i++)
				if (slots[i][i] != tempIcon) win = false;

			if (win) checkWinType(0, 0);
			else output += '❌';

			win = true;
			tempIcon = slots[0][slotX - 1];

			for (let i = 0; i < slotX; i++)
				if (slots[i][slotX - i - 1] != tempIcon) win = false;

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
				output += `\n**${rowsWon}** row(s)! ${client.util.formatNumber(winAmount)}💰 balance is ${client.util.formatNumber(balance)}💰`;
			}
			else {
				output += `\n__**You lost!**__ balance is ${client.util.formatNumber(msgUser.balance)}💰`;
			}
			// sentMessage.edit(embed.setDescription(output));
		}
	},
};