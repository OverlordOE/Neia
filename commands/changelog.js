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
			.setTitle('Neia V2.1: Bug Fixes and balance changes')
			.setFooter('To see earlier updates join the support server.', client.user.displayAvatarURL())
			.addField('Starting Off', `You guys really fucked the bot economy up, but that was partly my fault too. These changes will hopefully stop the infinite profit on lootboxes.
			\n`)


			.addField('**New Features**', `- Added a new collectable: Castle.
			- You can now open multiple lootboxes at once by adding the number of lootboxes you want to open.
			- You can now sell you whole inventory at once by using \`-sell all\`.\n`)

			.addField('**Major Changes**', `- \`sell\` only refunds 80% again.\n`)

			.addField('**Small Changes and Bug Fixes**', `- Equipment will now be unequipped if you sell them.
			- Fixed bug of rare and epic lootboxes giving undefined.
			- Fixed selling exploit when a weapon was equipped(Thanks @garbiel#8845)\n\n\nThis update will also reset everyones profiles again because the economy was fucked`);

		return message.channel.send(embed);
	},
};



