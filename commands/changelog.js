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
			.setTitle('Neia V3.3: Powerups and bug fixes')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL({ dynamic: true }))
			.addField('**Powerups**', `Powerups will be a new item type added to be consumable items used to boost your number game experience. Currently there is 1 powerup, The Streak Protection. I already have plans for additional powerups.
			- **Streak Protection** is a new item that will prevent 1 streak from being ruined. You can only have 1 in your inventory at any time and once is has been consumed it will go on a 24h cooldown. You can see the cooldown in your \`stats\`.`)


			.addField('**Number Game**', `
			- When someone makes a mistake in the number game it will now react with different emojis based on if its __under protection__, __goes back to a checkpoint__ or __resets to 0__.
			- Changed text of checkpoint resets to avoid confusion.`)

			.addField('**Number Guessing**', `- Increased payout from 3.2 -> 4.5. Now its actually worth playing.`)


			.addField('**Bug Fixes**', `- Fixed bug that would break he numbergame.
			- Fixed that your own reaction emoji would show when looking at someone else's stats.
			- Fixed custom reactions not resetting when sold.`);

		return message.channel.send(embed);
	},
};