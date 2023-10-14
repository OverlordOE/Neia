const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');

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


		const embed = new EmbedBuilder()
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');


		const mainDescription = `
		Balance: ${client.util.formatNumber(user.balance)}💰
		Number Game Reaction: ${user.reaction}
		Count Multiplier: **${user.countMultiplier}X**
		Next Daily Count Reward: **${dailyCount}**
		Next Hourly Count Reward: **${hourlyCount}**
		`.replace(/\t+/g, '');

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
		`.replace(/\t+/g, '');


		const statsDescription = `
		Numbers Counted: **${stats.numbersCounted}**
		Streaks Ruined: **${stats.streaksRuined}**
		
		Times Gambled: **${stats.timesGambled}**
		Won with Gambling: ${client.util.formatNumber(stats.gamblingMoneyGained)}💰
		Lost with Gambling: ${client.util.formatNumber(stats.gamblingMoneyLost)}💰
		`.replace(/\t+/g, '');


		//	INVENTORY
		let inventoryDescription;
		if (!inventory.length) inventoryDescription = `*${target.username}* does not have any items.`;
		else inventoryDescription = client.util.mapToDescription(inventory);

		//	COLLECTION
		let collectionDescription = '__Collectables:__\n\n';
		if (!collection.length) collectionDescription = `*${target.username}*does not have any collectables.`;
		else collectionDescription = client.util.mapToDescription(collection);

		//	ACHIEVEMENTS
		let achievementDescription = '__Achievements:__\n\n';
		if (achievements.length) {
			achievements.sort((a, b) => {
				if (a.emoji < b.emoji) return -1;
				if (a.emoji > b.emoji) return 1;
				return 0;
			})
				.map(a => {
					const achievement = client.util.getAchievement(a.name);
					achievementDescription += `${achievement.emoji}**${achievement.name}**\n`;
				});
		}
		else achievementDescription = `*${target.username}* has no achievements!`;

		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
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
				.setTitle(`${target.username}'s Main Page`)
				.setDescription(mainDescription)],
			components: [row]
		});
		const filter = i => i.user.id == interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.isStringSelectMenu()) {
				if (i.values[0] === 'main') {
					row.components[0].setPlaceholder('Main Page');
					await i.update({
						embeds: [embed
							.setTitle(`${target.username}'s Main Page`)
							.setDescription(mainDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'numbergame') {
					row.components[0].setPlaceholder('Number Game Page');
					await i.update({
						embeds: [embed
							.setTitle(`${target.username}'s Number Game Page`)
							.setDescription(numbergameDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'stats') {
					row.components[0].setPlaceholder('Statistics');
					await i.update({
						embeds: [embed
							.setTitle(`${target.username}'s Statistics`)
							.setDescription(statsDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'collection') {
					row.components[0].setPlaceholder('Collection');
					await i.update({
						embeds: [embed
							.setTitle(`${target.username}'s Collection`)
							.setDescription(collectionDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'inventory') {
					row.components[0].setPlaceholder('Inventory');
					await i.update({
						embeds: [embed
							.setTitle(`${target.username}'s Inventory`)
							.setDescription(inventoryDescription)
						], components: [row]
					});
				}
				else if (i.values[0] === 'achievements') {
					row.components[0].setPlaceholder('Achievements');
					await i.update({
						embeds: [embed
							.setTitle(`${target.username}'s Achievements`)
							.setDescription(achievementDescription)
						], components: [row]
					});
				}
			}
		});

		collector.on('end', async () => await interaction.editReply({ embeds: [embed], components: [] }));
	},
};

