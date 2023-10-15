const { SlashCommandBuilder } = require('discord.js');
const userLeaderboard = require('./leaderboards/userLeaderboard');
const serverLeaderboard = require('./leaderboards/serverLeaderboard');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboards')
		.setDescription('Shows the different leaderboards.').addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('See the user leaderboards'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('See the server leaderboards')),


	async execute(interaction, msgUser, msgGuild, client) {

		if (interaction.options.getSubcommand() === 'user') userLeaderboard(interaction, msgUser, msgGuild, client);

		else if (interaction.options.getSubcommand() === 'server') serverLeaderboard(interaction, msgUser, msgGuild, client);


	},
};

