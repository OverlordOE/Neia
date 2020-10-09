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
			.setTitle('Neia V2.0: PvP Update')
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL())
			.addField('Biggest update yet', `:\nThis is the biggest update Neia has had in its lifetime and has been in the works for months. It features alot of quality of life and stability improvements but more importantly the start of the new PvP system. This is just the start of the new PvP system and i plan to expand it greatly in the future.

			Now for the actual update changes.\n`)

			.addField('**The PvP system**', `:\nThe new PvP system is based around attacking other users and getting their HP to 0. You can do this by using the \`attack\` command(1 hour cooldown). Just attacking without a weapon isn't gonna do a lot of damage so there are weapons you can collect and buy. You can buy some basic weapons from the shop but the more powerful weapons can only be retrieved by opening loot boxes or trading with other players. Make sure to equip your weapons once you get them with the \`equip\` command

			To prevent people from attacking players with almost no money or items there is a minimum net worth needed to attack and be attacked(30k). You can also buy healing potions to heal yourself after being hit.

			If you kill someone you will gain a portion of their money and they will get protection against being attacked for a day. Be advised that if you use any of the PvP commands while you have protection that the protection will be broken.

			Im planning to also let players steal items from the player you kill.`)

			.addField('**NEW COMMANDS**', `:\n- New command \`attack\`: Mention the player you want to attack and you will use your equipped weapons to attack them. Both the attacker and defender need to have a networth of atleast 30k.

			- New command \`equip\`: Equips equipment too your slots.

			- New command \`changelog\`: Shows the changelog of the last major update.\n`)

			.addField('** MAJOR CHANGES**', `:\n- Your networth now includes all your items instead of just your collectables to make it easier to reach the attack requirements.
			- \`profile\` has a new tab for your health and equipment.
			- If you use the \`item\` command without any arguments it will show you the complete list of all the items that exist.
			- Alot of items are no longer buyable.
			- Reworked all lootbox loottables for fairer rewards, especially the epic chest.
			- The music queue now has a max of 4 songs per server, if you want to increase this limit for your server contact me on discord.
			- All music commands now use embeds
			- Inflated all item prices
			- You will now automatically get the changelog on your first command after a major update.
			- Added 7 weapons.\n`)

			.addField('SMALL CHANGES AND BUGFIXES', `:\n- \`open\` now shows the correct rarity colour of the item gained.
			- Blackjack draws will now always draw the game instead of being in the bots favour.
			- New invite link that allows the bot to join voice channels.
			- \`play\` command showing the wrong requester fix.
			- Removed the items: coffee, tea and cake.
			- The ship item now has a value of 600.
			- Music playing algorithm improved.
			- The lottery on the bot server will now autostart after the bot restarts.
			- You can now trade in 1 line, for example: -trade @OverlordOE car 4.
			- Added rarity colours to \`item\` command.\n`);

		return message.channel.send(embed);
	},
};