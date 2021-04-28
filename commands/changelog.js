const Discord = require('discord.js');
module.exports = {
	name: 'Changelog',
	summary: 'Shows the latest major update that the bot has received',
	description: 'Shows the latest major update that the bot has received.',
	category: 'info',
	aliases: ['update'],
	args: false,
	usage: '',

	execute(message, args, msgUser, msgGuild, client, logger) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia V3.4: Power Counting')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL({ dynamic: true }))
			.addField('**Items**', `- New powerup: \`Power Counting\`.
			This powerup will let you count by yourself for **1 minute**. Has a **3 hour** cooldown.
- Added **pepeThat** reaction.
- Added **pepeEZ** reaction.
- Lowered **pepeBiz** value from **250k -> 200k.**
- Lowered **Monkey** value from **200k -> 150k.**
`)


			.addField('**Stats**', `
			- Split the main stats page into **2 pages**. 1 for cooldowns and balance, the other one for non important stats like __Streaks Ruined__.
- Added stat for **Power Counting** cooldown.
			`)

			.addField('**Gambling**', `- Added some more text highlighting.
			`)


			.addField('**Bug Fixes**', `
			- Fixed bug where Neia wouldn't recognize the amount you put in with the \`Buy\` and \`Trade\` commands.
- Fixed \`Item\` command not working at all.
- Fixed bug where you couldn't buy **Streak Protection**.
`);

		return message.channel.send(embed);
	},
};