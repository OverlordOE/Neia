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
			.addField('**Number Game Event**', `
			A random event will now pop-up in the designated Number Game channel randomly every hour.
Only 1 person can claim it and when they do the bot will count around 10 numbers for them and give them all the money they would normally would gain from counting.
If the event isn't claimed within 10 minutes it will expire.
`)


			.addField('**Items**', `
			- Added **Pepe Money** custom reaction priced **200.1k**
			`)

			.addField('**Power Count**', `
			- Changed name from \`Power Counting\` to \`Power Count\`.
- It will now give you a warning **10 seconds** before it runs out.
			`)

			.addField('**Gambling**', `
			- Fruit Slots: 
A new symbol 7️⃣ has been added to replace the 🍋 . If you get a 7️⃣ row you will get **3** rows instead of **1**.
- Gambling commands now show you how much you have bet.
- \`Blackjack\` and \`Fruit Slots\` now show how much money you have won and lost.
			`)


			.addField('**Bug Fixes**', `
			- Fixed \`Sell\` command not working at all.
- \`Buy\`, \`Trade\` and \`Sell\`  now change colour based on if the command was successful.
`);

		return message.channel.send(embed);
	},
};