const Discord = require('discord.js');
module.exports = {
	name: 'changelog',
	summary: 'Shows the latest major update that the bot has received',
	description: 'Shows the latest major update that the bot has received.',
	category: 'info',
	aliases: ['update'],
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns, options) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Neia V2.3: New chest and stealing items')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL())
			.addField('Starting Off', `After alot of failure i finally found a way to let people steal a portion of someones inventory without lagging the whole bot.
			\n`)


			.addField('**New Features**', `- Added a new weapon: **Wooden Club**.
						- Added a new weapon: **Enchanted Waraxe**.
						- Added a new Lootchest: **Mystery chest**. This chest is high risk high reward, you can get something absolutely terrible or something really good out of it.
						- If you kill someone you will now also steal a portion of their inventory.\n`)


			.addField('**Small Changes and Bug Fixes**', `- Increased chance of getting epic chests from dailies and votes.
						- Lottery now gains more money when noone wins.
						- Added training weapons to Rare chest.
						- Added tips at the bottom of commands`);

		return message.channel.send(embed);
	},
};