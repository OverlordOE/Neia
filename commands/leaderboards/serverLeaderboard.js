const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle } = require('discord.js');


module.exports = async function execute(interaction, msgUser, msgGuild, client) {
	const searchFilter = guild => client.guilds.cache.has(guild.guild_id);

	const highestStreakList = client.guildOverseer.sort((a, b) => client.guildOverseer.getNumberGame(b).highestStreak - client.guildOverseer.getNumberGame(a).highestStreak)
		.filter(searchFilter)
		.first(50)
		.map((guild, position) => `\n__**${position + 1}**.__ *${client.guilds.cache.get(guild.guild_id).name}*: ${client.util.formatNumber(client.guildOverseer.getNumberGame(guild).highestStreak)}`);

	const numbersCountedList = client.guildOverseer.sort((a, b) => client.guildOverseer.getNumberGame(b).totalCounted - client.guildOverseer.getNumberGame(a).totalCounted)
		.filter(searchFilter)
		.first(50)
		.map((guild, position) => `\n__**${position + 1}**.__ *${client.guilds.cache.get(guild.guild_id).name}*: ${client.util.formatNumber(client.guildOverseer.getNumberGame(guild).totalCounted)}`);

	const currentStreakList = client.guildOverseer.sort((a, b) => client.guildOverseer.getNumberGame(b).currentNumber - client.guildOverseer.getNumberGame(a).currentNumber)
		.filter(searchFilter)
		.first(50)
		.map((guild, position) => `\n__**${position + 1}**.__ *${client.guilds.cache.get(guild.guild_id).name}*: ${client.util.formatNumber(client.guildOverseer.getNumberGame(guild).currentNumber)}`);

	const streakRuinedList = client.guildOverseer.sort((a, b) => client.guildOverseer.getNumberGame(b).streaksRuined - client.guildOverseer.getNumberGame(a).streaksRuined)
		.filter(searchFilter)
		.first(50)
		.map((guild, position) => `\n__**${position + 1}**.__ *${client.guilds.cache.get(guild.guild_id).name}*: ${client.util.formatNumber(client.guildOverseer.getNumberGame(guild).streaksRuined)}`);


	const listArray = [
		{ list: highestStreakList, title: 'Highest Streak' },
		{ list: numbersCountedList, title: 'Numbers Counted' },
		{ list: streakRuinedList, title: 'Streaks Ruined' },
		{ list: currentStreakList, title: 'Current Streak' },
	];
	let listIndex = 0;
	let page = 0;


	const embed = new EmbedBuilder()
		.setTitle('Neia leaderboard')
		.setDescription(editDescription(listArray[listIndex], page))
		.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
		.setColor('#f3ab16');


	const menuRow = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('list')
				.setPlaceholder('Highest Streak')
				.addOptions([
					{
						label: 'Highest Streak ',
						description: 'Highest Streak between all servers.',
						value: 'streak',
					},
					{
						label: 'Numbers Counted',
						description: 'Total amount of numbers counted between all servers.',
						value: 'count',
					},
					{
						label: 'Streaks Ruined',
						description: 'Amount of Streaks Ruined between all servers.',
						value: 'ruined',
					},
					{
						label: 'Current Streak',
						description: 'Highest Current Streak between all servers',
						value: 'current',
					},
				]),
		);

	const buttonRow = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('previous')
				.setLabel('Previous Page')
				.setStyle(ButtonStyle.Primary)
				.setEmoji('◀️'),
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('next')
				.setLabel('Next Page')
				.setStyle(ButtonStyle.Primary)
				.setEmoji('▶️'),
		);


	await interaction.reply({ embeds: [embed], components: [menuRow, buttonRow] });
	const buttonFilter = i => i.user.id == interaction.user.id;
	const collector = interaction.channel.createMessageComponentCollector({ buttonFilter, time: 60000 });

	collector.on('collect', async i => {
		if (i.user.id === interaction.user.id) {
			if (i.customId === 'previous' && page > 0) {

				page--;
				embed.setDescription(editDescription(listArray[listIndex], page));
				await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
			}
			else if (i.customId === 'next' && page < 4) {

				page++;
				embed.setDescription(editDescription(listArray[listIndex], page));
				await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
			}
			else if (i.customId === 'list') {

				if (i.values[0] === 'streak') {
					listIndex = 0;
					menuRow.components[0].setPlaceholder('Highest Streak');
					embed.setDescription(editDescription(listArray[listIndex], page));
					await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
				}
				else if (i.values[0] === 'count') {
					listIndex = 1;
					menuRow.components[0].setPlaceholder('Numbers Counted');
					embed.setDescription(editDescription(listArray[listIndex], page));
					await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
				}
				else if (i.values[0] === 'ruined') {
					listIndex = 2;
					menuRow.components[0].setPlaceholder('Streaks Ruined');
					embed.setDescription(editDescription(listArray[listIndex], page));
					await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
				}
				else if (i.values[0] === 'current') {
					listIndex = 3;
					menuRow.components[0].setPlaceholder('Current Streak');
					embed.setDescription(editDescription(listArray[listIndex], page));
					await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
				}
			}
		}
		else await i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
	});

	collector.on('end', async () => await interaction.editReply({ embeds: [embed], components: [] }));

};

function editDescription(currentList, page) {
	let description = `__**${currentList.title}**__`;
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (currentList.list[i]) description += currentList.list[i];
		else description += `\n__${i + 1}.__ noone`;
	}
	return description;
}