const Discord = require('discord.js');
module.exports = {
	name: 'Fruitslots',
	summary: 'Play a round of Fruit Slots',
	description: 'Play a round of Fruit Slots. Horizontal rows and vertical rows only.',
	category: 'gambling',
	aliases: ['slots', 'fruit', 'fruits', 'slot'],
	args: true,
	usage: '<gamble amount>',
	example: '100',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		let gambleAmount = 0;
		const payoutRate = 4.5;
		const icons = ['🍓', '🍉', '🍒', '🍌', '<:luckyseven:838417718944333884>'];
		const slots = [];
		const slotX = 3;
		const slotY = 3;
		let output = '';
		let count = 0;
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

		if (!gambleAmount || isNaN(gambleAmount)) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, that's an **invalid amount**.`));
		if (gambleAmount > msgUser.balance) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, you only have ${client.util.formatNumber(msgUser.balance)}💰.`));
		if (gambleAmount <= 0) return message.channel.send(embed.setDescription(`Please enter an amount **greater than zero**, *${message.author}*.`));

		client.userCommands.addBalance(msgUser, -gambleAmount, true);

		output += `
		You have bet ${client.util.formatNumber(gambleAmount)}💰.
		Get **${slotX}** of the __**same symbol**__ in a row to **win**.
		Getting a <:luckyseven:838417718944333884> row will give **3X payout**.\n
		`;

		for (let i = 0; i < slotY; i++) {
			slots[i] = [];
			for (let j = 0; j < slotX; j++) {
				const slotIcon = icons[Math.floor(Math.random() * icons.length)];
				slots[i][j] = slotIcon;
			}
		}
		const sentMessage = await message.channel.send(embed.setDescription(output));
		setEmbed();

		function checkWins() {
			if (slots[count].every((val, g, arr) => val === arr[0])) {
				if (slots[count][0] == '<:luckyseven:838417718944333884>') {
					rowsWon += 3;
					output += '⭐';
				}
				else {
					rowsWon++;
					output += '✅';
				}
			}
			else output += '❌';
		}

		function checkVerticalWins(column) {
			let win = true;
			const tempIcon = slots[0][column];

			for (let i = 0; i < slotY; i++)
				if (slots[i][column] != tempIcon) win = false;

			return win;
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
			sentMessage.edit(embed.setDescription(output));
		}

		function setEmbed() {
			for (let j = 0; j < slots[count].length; j++) output += slots[count][j];

			checkWins();
			output += '\n';
			sentMessage.edit(embed.setDescription(output));

			count++;
			if (count < slotY) {
				setTimeout(() => setEmbed(), 1500);
			}
			else {
				for (let i = 0; i < slotX; i++) {
					if (checkVerticalWins(i)) {
						if (slots[count][0] == '<:luckyseven:838417718944333884>') {
							rowsWon += 3;
							output += '⭐';
						}
						else {
							rowsWon++;
							output += '✅';
						}
					}
					else output += '❌';
				}
				endGame();
			}
		}
	},
};

