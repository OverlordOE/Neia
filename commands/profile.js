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
		const items = await client.itemHandler.getInventory(user);
		const reaction = client.userManager.getReaction(user);
		const protection = client.userManager.getProtection(user);
		const powerCounting = client.userManager.getPowerCount(user);
		const countBoost = client.userManager.getCountBoost(user);
		const hourlyCount = client.userManager.getHourlyCount(user);
		const dailyCount = client.userManager.getDailyCount(user);
		const stats = client.userManager.getStats(user);


		const mainEmbed = new MessageEmbed()
			.setTitle(`${target.tag}'s Main Page`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.addField('Balance:', `${client.util.formatNumber(user.balance)}💰`)
			.addField('Number Game Reaction:', reaction.emoji, true)
			.addField('Next Daily Count Reward:', `**${dailyCount}**`, true)
			.addField('Next Hourly Count Reward:', `**${hourlyCount}**`, true)
			.setFooter('You can use the buttons to switch pages.', client.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		const numbergameEmbed = new MessageEmbed()
			.setTitle(`${target.tag}'s Number Game Page`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.addField('Number Game Reaction:', reaction.emoji, true)
			.addField('Number Game Reaction Bonus', `${client.util.formatNumber(Math.sqrt(reaction.value) / 3)}💰`, true)
			.addField('Protection Available:', `**${protection}**`, true)
			.addField('Power Count Available:', `**${powerCounting}**`, true)
			.addField('Count Boost Available:', `**${countBoost}**`, true)
			.addField('Next Daily Count Reward:', `**${dailyCount}**`, true)
			.addField('Next Hourly Count Reward:', `**${hourlyCount}**`, true)
			.addField('Numbers Counted:', stats.numbersCounted.toString(), true)
			.addField('Streaks Ruined:', stats.streaksRuined.toString(), true)
			.setFooter('You can use the buttons to switch pages.', client.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');


		const statEmbed = new MessageEmbed()
			.setTitle(`${target.tag}'s General Stats`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.addField('Numbers Counted:', stats.numbersCounted.toString(), true)
			.addField('Streaks Ruined:', stats.streaksRuined.toString(), true)
			.addField('Times Gambled:', stats.timesGambled.toString(), true)
			.addField('Won with Gambling:', client.util.formatNumber(stats.gamblingMoneyGained), true)
			.addField('Lost with Gambling:', client.util.formatNumber(stats.gamblingMoneyLost), true)
			.setFooter('You can use the buttons to switch pages.', client.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		const inventoryEmbed = new MessageEmbed()
			.setColor('#f3ab16')
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.setFooter('You can use the buttons to switch pages.', client.user.displayAvatarURL({ dynamic: true }));


		let inventory = '__Inventory:__\n\n';
		if (items.length) {
			items.map(i => {
				if (i.amount >= 1) {
					const item = client.util.getItem(i.name);
					inventory += `${item.emoji}${item.name}: ${client.util.formatNumber(i.amount)}\n`;
				}
			});
			inventoryEmbed.setDescription(inventory);
		}
		else inventoryEmbed.addField('Inventory:', `*${target.tag}* has nothing!`);

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
							label: 'Statistics',
							description: 'Different statistics about you.',
							value: 'stats',
						},
						{
							label: 'Inventory',
							description: 'This is also a description',
							value: 'inventory',
						},
					]),
			);


		interaction.reply({ embeds: [mainEmbed], components: [row] });
		const filter = i => i.user.id == interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				if (i.values[0] === 'main') {
					row.components[0].setPlaceholder('Main Page');
					await i.update({ embeds: [mainEmbed], components: [row] });
				}
				else if (i.values[0] === 'numbergame') {
					row.components[0].setPlaceholder('Number Game Page');
					await i.update({ embeds: [numbergameEmbed], components: [row] });
				}
				else if (i.values[0] === 'stats') {
					row.components[0].setPlaceholder('Statistics');
					await i.update({ embeds: [statEmbed], components: [row] });
				}
				else if (i.values[0] === 'inventory') {
					row.components[0].setPlaceholder('Inventory');
					await i.update({ embeds: [inventoryEmbed], components: [row] });
				}
			}
			else await i.followUp({ content: 'this menu isn\'t for you!', ephemeral: true });
		});

		collector.on('end', async () => await interaction.editReply({ embeds: [mainEmbed], components: [] }));

	},
};