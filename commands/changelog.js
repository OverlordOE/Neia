const Discord = require('discord.js');
module.exports = {
	name: 'Changelog',
	summary: 'Shows the latest major update that the bot has received',
	description: 'Shows the latest major update that the bot has received.',
	category: 'misc',
	aliases: ['update'],
	args: false,
	usage: '',

	execute(message, args, msgUser, msgGuild, client, logger) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia V3.0: Bot Split and Music Improvements')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL({ dynamic: true }))
			.addField('Starting Off', 'This update are mostly quality of live changes and the kick and ban commands.\n')


			.addField('**New Features**', `
			- New command: \`kick\`, this command can be used to kick someone and add a reason for the kick.
- New command: \`pause\`, this command can be used to ban someone and add a reason for the ban.
- New command: \`pause\`, this command pauses the currently playing music on the bot. Use it again to unpause.
- The \`play\` and \`queue\` command now show what channel the song is from.\n`)

			.addField('**Major Changes**', `- Added an examples tab in the \`help\` command for all commands that need additional input to be used.
- Added a permissions tab in the \`help\` command for all commands that need additional permissions to be used.\n`)


			.addField('**Small Changes and Bug Fixes**', `- Capitalized all commands.
- Added support for GIF avatars in the \`avatar\` command`);

		return message.channel.send(embed);
	},
};