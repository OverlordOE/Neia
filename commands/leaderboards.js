const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboards')
		.setDescription('Shows the leaderboard of a couple of stats.')
		.addIntegerOption(option =>
			option
				.setName('page')
				.setDescription('The page you want to see.')),

	execute(interaction, msgUser, msgGuild, client) {

		const ruinedList = client.userManager.sort((a, b) => client.userManager.getStats(b).streaksRuined - client.userManager.getStats(a).streaksRuined)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(client.userManager.getStats(user).streaksRuined)}`);


		const countList = client.userManager.sort((a, b) => client.userManager.getStats(b).numbersCounted - client.userManager.getStats(a).numbersCounted)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}**.__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(client.userManager.getStats(user).numbersCounted)}`);


		const balanceList = client.userManager.sort((a, b) => b.balance - a.balance)
			.filter(user => client.users.cache.has(user.user_id))
			.first(50)
			.map((user, position) => `\n__**${position + 1}.**__ *${client.users.cache.get(user.user_id).tag}*: ${client.util.formatNumber(user.balance)}💰`);


		const listArray = [{ list: balanceList, title: 'Current Balance' }, { list: countList, title: 'Total Numbers Counted' }, { list: ruinedList, title: 'Streaks Ruined' }];
		let listIndex = 0;
		let page = interaction.options.getInteger('page') || 0;
		if (page < 0 && page > 4) page = 0;


		const embed = new MessageEmbed()
			.setTitle('Neia leaderboard')
			.setDescription(editDescription(listArray[listIndex], page))
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setFooter('Use the emojis to scroll through the list or switch the list.', client.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');


		const menuRow = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
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
					]),
			);

		const buttonRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('previous')
					.setLabel('Previous Page')
					.setStyle('PRIMARY')
					.setEmoji('◀️'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('next')
					.setLabel('Next Page')
					.setStyle('PRIMARY')
					.setEmoji('▶️'),
			);


		interaction.reply({ embeds: [embed], components: [menuRow, buttonRow] });
		const filter = i => i.user.id == interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

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