const Discord = require('discord.js');
const itemInfo = require('../data/items');
module.exports = {
	name: 'profile',
	summary: 'Shows profile of you or the tagger user',
	description: 'Shows profile of you or the tagger user.',
	category: 'info',
	aliases: ['inv', 'items', 'prof', 'inventory', 'balance', 'money', 'p', 'equipment'],
	args: false,
	usage: '<user>',


	async execute(message, args, msgUser, profile, guildProfile, client, logger) {
		const filter = (reaction, user) => {
			return user.id === message.author.id;
		};

		const target = message.mentions.users.first() || message.author;
		const avatar = target.displayAvatarURL();
		const userProfile = await profile.getUser(message.author.id);
		const items = await profile.getInventory(userProfile);
		const pColour = profile.getColour(userProfile);
		await profile.calculateStats(userProfile);

		const prot = profile.getProtection(userProfile);
		let daily = profile.getDaily(userProfile);
		let hourly = profile.getHourly(userProfile);
		let vote = profile.getVote(userProfile);
		let heal = profile.getHeal(userProfile);
		let attack = profile.getAttack(userProfile);

		const levelInfo = await profile.levelInfo(userProfile, message);
		let exp = `${levelInfo.exp}/${levelInfo.expNeeded}`;
		if (levelInfo.level == 60) exp = '__**Max**__';


		let userClass = null;
		if (userProfile.class) userClass = profile.getClass(userProfile.class);

		let className;
		let colour;
		if (userClass) {
			className = userClass.name;
			colour = userClass.colour;
		} else {
			className = 'No class';
			colour = '#ffffff';
		}

		if (daily === true) daily = 'now';
		if (hourly === true) hourly = 'now';
		if (vote === true) vote = 'now';
		if (heal === true) heal = 'now';
		if (attack === true) attack = 'now';

		const moneyEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s General Stats`)
			.setThumbnail(avatar)
			.addField('Balance:', `${profile.formatNumber(userProfile.balance)}💰`)
			.addField('Next hourly:', hourly, true)
			.addField('Next daily:', daily, true)
			.addField('Next Vote', vote, true)
			.addField('Next Heal', heal, true)
			.addField('Next Attack', attack, true)
			.setFooter('You can use the emojis to switch pages.', client.user.displayAvatarURL());
		if (prot !== false) moneyEmbed.addField('Protection untill:', prot);

		const inventoryEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.setFooter('You can use the emojis to switch pages.', client.user.displayAvatarURL());

		const characterEmbed = new Discord.MessageEmbed()
			.setTitle(`**${target.tag}'s Character Stats**`)
			.setThumbnail(avatar)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('You can use the emojis to switch pages.', client.user.displayAvatarURL());

		const equipmentEmbed = new Discord.MessageEmbed()

			.setTitle(`**${target.tag}'s Equipment**`)
			.setThumbnail(avatar)
			.setColor(colour)
			.setTimestamp()
			.setFooter('You can use the emojis to switch pages.', client.user.displayAvatarURL());


		let inventory = '__Inventory:__\n\n';
		if (items.length) {
			items.map(i => {
				if (i.amount < 1) return;
				const item = itemInfo[i.name.toLowerCase()];
				inventory += `${item.emoji}${item.name}: ${profile.formatNumber(i.amount)}\n`;
			});

			const income = await profile.calculateIncome(userProfile);
			inventoryEmbed.addField('Max passive income', `${profile.formatNumber(income.income)}💰`);
			inventoryEmbed.addField('Networth', `${profile.formatNumber(income.networth)}💰`, true);

			inventoryEmbed.setDescription(inventory);
		}
		else inventoryEmbed.addField('Inventory:', `*${target.tag}* has nothing!`);


		if (userClass) {
			const stats = profile.getStats(userProfile);
			const baseStats = profile.getBaseStats(userProfile);

			let statDescription = `**Class:** ${className} ${levelInfo.level}\n**exp:** ${exp}\n`;
			for (const stat in stats) {
				if (baseStats[stat]) statDescription += `\n**${stat.toUpperCase()}**: ${stats[stat]} (${stats[stat] - baseStats[stat]})`;
				else statDescription += `\n**${stat.toUpperCase()}**: ${stats[stat]}`;
			}
			characterEmbed.setDescription(statDescription);

			const equipment = await profile.getEquipment(userProfile);
			let equipmentDescription = '';
			for (const slot in equipment) {
				if (equipment[slot]) {
					const item = profile.getItem(equipment[slot]);
					equipmentDescription += `\n**${slot}**: ${item.emoji}${item.name}`;
				}
				else equipmentDescription += `\n**${slot}**: Nothing`;
			}
			equipmentEmbed.setDescription(equipmentDescription);
		}
		else {
			characterEmbed.setDescription(`${target} does not have a class yet.\n\nTo choose a class use the command \`class\`.`);
			equipmentEmbed.setDescription(`${target} does not have a class yet.\n\nTo choose a class use the command \`class\`.`);
		}

		message.channel.send(characterEmbed)
			.then(sentMessage => {
				sentMessage.react('730807684865065005');
				sentMessage.react('🛡️');
				sentMessage.react('💰');
				sentMessage.react('📦');
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(message.author.id);
					if (reaction.emoji.name == 'character') sentMessage.edit(characterEmbed);
					else if (reaction.emoji.name == '🛡️') sentMessage.edit(equipmentEmbed);
					else if (reaction.emoji.name == '💰') sentMessage.edit(moneyEmbed);
					else if (reaction.emoji.name == '📦') sentMessage.edit(inventoryEmbed);
				});
				collector.on('end', () => sentMessage.reactions.removeAll());
			});
	},
};