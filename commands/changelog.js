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
			.setTitle('**__Neia V3.5: Hourly Counts & Reset__**')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL({ dynamic: true }))
			
			.addField('**Reset**', `
			Because i had to make some drastic changes in the database stat structure and the inflated economy i have decided to reset the database.
This means that everything will be reset to 0, including the number game and your money.
			`)

			.addField('** Daily and Hourly Counts **', `
			Daily and Hourly counts activate when you count in the number game. You will get a greater count reward when they activate.
You will get a DM from Neia when they activate. You can see the cooldowns in your \`Stats\`.
			`)

			.addField('**Count Boost**', `
			This is a new power-up that gives you extra money per count that you make for a minute. It has a **3 hour** cooldown.
			`)
			
			.addField('**Number Game Event**', `
			- Spawn time increased from **1 hour -> 3 hours**.
- Count amount increased to compensate from **8-12 -> 10-15**.
`)			

			.addField('**Fruit Slots**', `
			- You can now get rewards for the diagonal rows.
- Decreased extra row payout for :seven: from **3 -> 2**.
- fruit slots payout decreased from **4.5 - > 4.0**.
			`)

			.addField('**Bug Fixes and Minor Changes**', `
			- \`Number Guessing\` payout increased from **4.5 -> 5.0**
- Added more checkpoints to the number game.
- Fixed some typos.
- Removed a lot of unused reactions so they won't clutter the shop as much. 
- \`Trade\` should now change colour correctly to green on a success.
`);

		return message.channel.send(embed);
	},
};