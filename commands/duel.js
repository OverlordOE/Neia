const Discord = require('discord.js');
module.exports = {
	name: 'duel',
	summary: 'Duel other players to the death',
	description: 'Duel other players to the death. If you kill them you will gain a portion of their current items and money.',

	args: true,
	usage: '<target>',
	category: 'pvp',
	aliases: ['fight'],

	async execute(message, args, msgUser, character, guildProfile, client, logger) {


	},
};