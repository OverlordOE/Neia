const achievements = require('../data/achievements');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('achievements')
		.setDescription('see the achievements list or details about a specific achievement.')
		.addStringOption(option =>
			option
				.setName('achievement')
				.setDescription('The achievement you want to see.')),


	execute(interaction, msgUser, msgGuild, client) {
		const embed = new EmbedBuilder();
		const tempAchievement = interaction.options.getString('achievement');

		if (tempAchievement) {
			const achievement = client.util.getAchievement(tempAchievement);
			if (!achievement) return interaction.reply({ embeds: [embed.setDescription(`__${tempAchievement}__ is not a valid achievement.`)], ephemeral: true });
			const reward = client.util.getCollectable(achievement.reward);

			embed
				.setTitle(`${achievement.emoji}${achievement.name}`)
				.setDescription(achievement.description)
				.addFields([
					{ name: 'Unlock Message', value: achievement.unlockMessage, inline: true },
					{ name: 'Reward', value: `${reward.emoji}${reward.name}`, inline: true }
				])
				.setFooter('Use the command without arguments to see the achievement list', client.user.displayAvatarURL({ dynamic: true }));

			client.util.setEmbedRarity(embed, achievement.rarity);
		}

		else {
			let description = '';

			Object.values(achievements).map((i) => description += `${i.emoji}**${i.name}**\n`);

			embed
				.setTitle('Neia Achievement List')
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setDescription(description)
				.setColor('#f3ab16');
		}

		return interaction.reply({ embeds: [embed] });
	},
};