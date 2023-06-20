const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, hyperlink } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('test command'),

	async execute(interaction, msgUser, msgGuild, client) {

		//playing board logic
		let board = [];
		let output = "";
		const boardX = 3;
		const boardY = 3;

		const square = '⬛';
		const cross = '❌';
		const circle = '⭕';

		for (let i = 0; i < boardY; i++) {
			board[i] = [];
			for (let j = 0; j < boardX; j++) {
				board[i][j] = square;
			}
		}

		//main embed
		const embed = new MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium')

		await interaction.reply({ embeds: [embed.setDescription(refreshBoard())] });

		// setTimeout(() => {
		// 	board[0][2] = '❌'
		// 	interaction.editReply({ embeds: [embed.setDescription(refreshBoard())] });
		// }, 1500);

		

		function refreshBoard(){
			output = "";
			for (let i = 0; i < boardY; i++) {
				for (let j = 0; j < boardX; j++){
					output += board[i][j];
				}
				output += "\n"
			}
			return output;
		}
	},
};