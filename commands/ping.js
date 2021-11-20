const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
		
	async execute(interaction) {
		await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('Pong!');
	},
};