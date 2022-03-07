const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Shows the tagged user\'s or your profile.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Select a user')),

	async execute(interaction, msgUser, msgGuild, client) {
		const target = interaction.options.getUser('target') || interaction.user;
		const user = await client.userManager.getUser(target.id);
		const inventory = await client.itemHandler.getInventory(user);
		const collection = await client.collectionOverseer.getCollection(user);
		const achievements = await client.achievementHunter.getAchievements(user);
		const protection = client.userManager.getProtection(user);
		const powerCounting = client.userManager.getPowerCount(user);
		const countBoost = client.userManager.getCountBoost(user);
		const hourlyCount = client.userManager.getHourlyCount(user);
		const dailyCount = client.userManager.getDailyCount(user);
		const stats = client.userManager.getStats(user);


		const embed = new MessageEmbed()
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.setFooter('You can use the buttons to switch pages.', client.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		const mainDescription = `
		Balance: ${client.util.formatNumber(user.balance)}💰
		Number Game Reaction: ${user.reaction}
		Count Multiplier: **${user.countMultiplier}X**
		Next Daily Count Reward: **${dailyCount}**
		Next Hourly Count Reward: **${hourlyCount}**
		`;

		const numbergameDescription = `
		Number Game Reaction: ${user.reaction}
		Count Multiplier: **${user.countMultiplier}X**
		
		Next Daily Count Reward: **${dailyCount}**
		Next Hourly Count Reward: **${hourlyCount}**
		
		Protection Available: **${protection}**
		Power Count Available: **${powerCounting}**
		Count Boost Available: **${countBoost}**

		💰 Gained with Counting : ${client.util.formatNumber(stats.countingMoneyGained)}💰
		Numbers Counted: **${stats.numbersCounted}**
		Streaks Ruined: **${stats.streaksRuined}**
		`;


		const statsDescription = `
		Numbers Counted: **${stats.numbersCounted}**
		Streaks Ruined: **${stats.streaksRuined}**
		
		Times Gambled: **${stats.timesGambled}**
		Won with Gambling: ${client.util.formatNumber(stats.gamblingMoneyGained)}💰
		Lost with Gambling: ${client.util.formatNumber(stats.gamblingMoneyLost)}💰
		`;

		let inventoryDescription = '__Inventory:__\n\n';
		if (inventory.length) {
			inventory.map(i => {
				if (i.amount >= 1) {
					const item = client.util.getItem(i.name);
					inventoryDescription += `${item.emoji}${item.name}: ${client.util.formatNumber(i.amount)}\n`;
				}
			});
		}
		else inventoryDescription = `*${target.tag}* does not have any items.`;

		let collectionDescription = '__Collectables:__\n\n';
		if (collection.length) {
			collection.map(c => {
				const collectable = client.util.getCollectable(c.name);
				collectionDescription += `${collectable.emoji}${collectable.name}\n`;
			});
		}
		else collectionDescription = `*${target.tag}*does not have any collectables.`;

		let achievementDescription = '__Achievements:__\n\n';
		if (achievements.length) {
			achievements.map(a => {
				const achievement = client.util.getAchievement(a.name);
				achievementDescription += `${achievement.emoji}**${achievement.name}**\n`;
			});
		}
		else achievementDescription = `*${target.tag}* has no achievements!`;

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Main Page')
					.addOptions([
						{
							label: 'Main Page',
							description: 'Overview of the most used stats.',
							value: 'main',
						},
						{
							label: 'Number Game Page',
							description: 'Everything related to your numbergame options.',
							value: 'numbergame',
						},
						{
							label: 'Collection',
							description: 'Your unlocked collectables',
							value: 'collection',
						},
						{
							label: 'Inventory',
							description: 'Item Inventory',
							value: 'inventory',
						},
						{
							label: 'Achievements',
							description: 'The list of achievements acquired',
							value: 'achievements',
						},
						{
							label: 'Statistics',
							description: 'Different statistics about you.',
							value: 'stats',
						},
					]),
			);


		await interaction.reply({
			embeds: [embed
				.setTitle(`${target.tag}'s Main Page`)
				.setDescription(mainDescription)],
			components: [row]
		});
		const filter = i => i.user.id == interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.isSelectMenu()) {
				if (i.values[0] === 'main') {
					row.components[0].setPlaceholder('Main Page');
					await i.update({
						embeds: [embed
							.setTitle(`${target.tag}'s Main Page`)
							.setDescription(mainDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'numbergame') {
					row.components[0].setPlaceholder('Number Game Page');
					await i.update({
						embeds: [embed
							.setTitle(`${target.tag}'s Number Game Page`)
							.setDescription(numbergameDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'stats') {
					row.components[0].setPlaceholder('Statistics');
					await i.update({
						embeds: [embed
							.setTitle(`${target.tag}'s Statistics`)
							.setDescription(statsDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'collection') {
					row.components[0].setPlaceholder('Collection');
					await i.update({
						embeds: [embed
							.setTitle(`${target.tag}'s Collection`)
							.setDescription(collectionDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'inventory') {
					row.components[0].setPlaceholder('Inventory');
					await i.update({
						embeds: [embed
							.setTitle(`${target.tag}'s Inventory`)
							.setDescription(inventoryDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'achievements') {
					row.components[0].setPlaceholder('Achievements');
					await i.update({
						embeds: [embed
							.setTitle(`${target.tag}'s Achievements`)
							.setDescription(achievementDescription)
						], components: [row]
					});
				}
			}
		});

		collector.on('end', async () => await interaction.editReply({ embeds: [embed], components: [] }));

	},
};