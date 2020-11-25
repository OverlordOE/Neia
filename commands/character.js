const Discord = require('discord.js');
const itemInfo = require('../data/items');
module.exports = {
	name: 'character',
	summary: 'Shows your character or the tagger user\'s character',
	description: 'Shows your character or the tagger user\'s character.',
	category: 'info',
	aliases: ['inv', 'items', 'char', 'inventory', 'balance', 'money', 'c', 'equipment'],
	args: false,
	usage: '<user>',


	async execute(message, args, msgUser, client, logger) {
		const filter = (reaction, user) => {
			return user.id === message.author.id;
		};

		const target = message.mentions.users.first() || message.author;
		const avatar = target.displayAvatarURL();
		const userProfile = await client.characterCommands.getUser(message.author.id);
		const items = await client.characterCommands.getInventory(userProfile);
		const pColour = client.characterCommands.getColour(userProfile);
		await client.characterCommands.calculateStats(userProfile);

		const prot = client.characterCommands.getProtection(userProfile);
		let daily = client.characterCommands.getDaily(userProfile);
		let hourly = client.characterCommands.getHourly(userProfile);
		let vote = client.characterCommands.getVote(userProfile);
		let heal = client.characterCommands.getHeal(userProfile);
		let attack = client.characterCommands.getAttack(userProfile);

		const levelInfo = await client.characterCommands.levelInfo(userProfile, message);
		let exp = `${levelInfo.exp}/${levelInfo.expNeeded}`;
		if (levelInfo.level == 60) exp = '__**Max**__';


		let userClass = null;
		if (userProfile.class) userClass = client.characterCommands.getClass(userProfile.class);

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
			.addField('Balance:', `${client.util.formatNumber(userProfile.balance)}💰`)
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
				inventory += `${item.emoji}${item.name}: ${client.util.formatNumber(i.amount)}\n`;
			});

			const income = await client.characterCommands.calculateIncome(userProfile);
			inventoryEmbed.addField('Max passive income', `${client.util.formatNumber(income.income)}💰`);
			inventoryEmbed.addField('Networth', `${client.util.formatNumber(income.networth)}💰`, true);

			inventoryEmbed.setDescription(inventory);
		}
		else inventoryEmbed.addField('Inventory:', `*${target.tag}* has nothing!`);


		if (userClass) {
			const stats = client.characterCommands.getStats(userProfile);
			const baseStats = client.characterCommands.getBaseStats(userProfile);

			let statDescription = `**Class:** ${className} ${levelInfo.level}\n**exp:** ${exp}\n`;
			for (const stat in stats) {
				if (baseStats[stat]) {
					if (stat == 'maxHP') statDescription += `\n**Max HP**: ${stats[stat]} (${stats[stat] - baseStats[stat]})<:health:730849477765890130>`;
					else if (stat == 'maxMP') statDescription += `\n**Max MP**: ${stats[stat]} (${stats[stat] - baseStats[stat]})<:mana:730849477640061029>`;
					else statDescription += `\n**${stat.toUpperCase()}**: ${stats[stat]} (${stats[stat] - baseStats[stat]})`;
				}
				else statDescription += `\n**${stat.toUpperCase()}**: ${stats[stat]}`;
			}
			characterEmbed.setDescription(statDescription);

			const equipment = await client.characterCommands.getEquipment(userProfile);
			let equipmentDescription = '';
			for (const slot in equipment) {
				if (equipment[slot]) {
					const item = client.characterCommands.getItem(equipment[slot]);
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