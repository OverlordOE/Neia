const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, SlashCommandBuilder, ButtonStyle } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboards')
		.setDescription('Shows the leaderboard of a couple of stats.'),

	async execute(interaction, msgUser, msgGuild, client) {
		const searchFilter = user => client.users.cache.has(user.user_id);

		const ruinedList = client.userManager.sort((a, b) => client.userManager.getStats(b).streaksRuined - client.userManager.getStats(a).streaksRuined)
			.filter(searchFilter)
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(client.userManager.getStats(user).streaksRuined)}`);


		const countList = client.userManager.sort((a, b) => client.userManager.getStats(b).numbersCounted - client.userManager.getStats(a).numbersCounted)
			.filter(searchFilter)
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(client.userManager.getStats(user).numbersCounted)}`);

		const countGainList = client.userManager.sort((a, b) => client.userManager.getStats(b).countingMoneyGained - client.userManager.getStats(a).countingMoneyGained)
			.filter(searchFilter)
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(client.userManager.getStats(user).countingMoneyGained)}💰`);

		const gamblingGainList = client.userManager.sort((a, b) => client.userManager.getStats(b).gamblingMoneyGained - client.userManager.getStats(a).gamblingMoneyGained)
			.filter(searchFilter)
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(client.userManager.getStats(user).gamblingMoneyGained)}💰`);


		const balanceList = client.userManager.sort((a, b) => b.balance - a.balance)
			.filter(searchFilter)
			.first(50)
			.map((user, position) => `\n__**${position + 1}.**__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.balance)}💰`);


		const listArray = [
			{ list: balanceList, title: 'Current Balance' },
			{ list: countList, title: 'Total Numbers Counted' },
			{ list: ruinedList, title: 'Streaks Ruined' },
			{ list: gamblingGainList, title: 'Money Gained Gambling' },
			{ list: countGainList, title: 'Money Gained Counting' },
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
					.setPlaceholder('Balance List')
					.addOptions([
						{
							label: 'Balance List',
							description: 'Balance Leaderboard.',
							value: 'balance',
						},
						{
							label: 'Numbers Counted List',
							description: 'Numbers Counted Leaderboard.',
							value: 'count',
						},
						{
							label: 'Streaks Ruined List',
							description: 'Streaks Ruined Leaderboard.',
							value: 'ruined',
						},
						{
							label: 'Money Gained Gambling List',
							description: 'Money Gained Gambling Leaderboard.',
							value: 'ggambling',
						},
						{
							label: 'Money Gained Counting List',
							description: 'Money Gained Counting Leaderboard.',
							value: 'gcounting',
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

					if (i.values[0] === 'balance') {
						listIndex = 0;
						menuRow.components[0].setPlaceholder('Balance List');
						embed.setDescription(editDescription(listArray[listIndex], page));
						await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
					}
					else if (i.values[0] === 'count') {
						listIndex = 1;
						menuRow.components[0].setPlaceholder('Numbers Counted List');
						embed.setDescription(editDescription(listArray[listIndex], page));
						await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
					}
					else if (i.values[0] === 'ruined') {
						listIndex = 2;
						menuRow.components[0].setPlaceholder('Streaks Ruined List');
						embed.setDescription(editDescription(listArray[listIndex], page));
						await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
					}
					else if (i.values[0] === 'ggambling') {
						listIndex = 3;
						menuRow.components[0].setPlaceholder('Streaks Ruined List');
						embed.setDescription(editDescription(listArray[listIndex], page));
						await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
					}
					else if (i.values[0] === 'gcounting') {
						listIndex = 4;
						menuRow.components[0].setPlaceholder('Money Gained Counting List');
						embed.setDescription(editDescription(listArray[listIndex], page));
						await i.update({ embeds: [embed], components: [menuRow, buttonRow] });
					}
				}
			}
			else await i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
		});

		collector.on('end', async () => await interaction.editReply({ embeds: [embed], components: [] }));

	},
};

function editDescription(currentList, page) {
	let description = `__**${currentList.title}**__`;
	for (let i = page * 10; i < (10 + page * 10); i++) {
		if (currentList.list[i]) description += currentList.list[i];
		else description += `\n__${i + 1}.__ noone`;
	}
	return description;
}