const Discord = require('discord.js');
module.exports = {
	name: 'changelog',
	summary: 'Shows the latest major update that the bot has received',
	description: 'Shows the latest major update that the bot has received.',
	category: 'misc',
	aliases: ['update'],
	args: false,
	usage: '',

	execute(message, args, msgUser, client, logger) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia V3.0: Bot Split and Music Improvements')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL())
			.addField('Starting Off', `This update will split Neia into 2 bots. Neia will be an all purpose bot and the game will be transferred too another bot and will be on pause for now. I have also made a lot of improvements to the music player.
			\n`)


			.addField('**New Features**', `- The music player will now give you actual errors when something goes wrong instead of undefined or nothing at all.
- The queue will now show the thumbnail of the current playing song.\n`)

			.addField('**Major Changes**', `- Transferred the PvP game into another bot so the bot is less cluttered.
- Removed the looping functionality temporarily.\n`)


			.addField('**Small Changes and Bug Fixes**', `- Increased music queue size to 5 songs max.
- The bot will now give you an error message if it is not set up correctly.
- Fixed queue duration formatting.
- Small optimisations.`);

		return message.channel.send(embed);
	},
};