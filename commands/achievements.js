const achievements = require('../data/achievements');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('achievements')
		.setDescription('see the achievements list or details about a specific achievement.')
		.addStringOption(option =>
			option
				.setName('achievement')
				.setDescription('The achievement you want to see.')),


	execute(interaction, msgUser, msgGuild, client) {
		const embed = new MessageEmbed();
		const tempAchievement = interaction.options.getString('achievement');

		if (tempAchievement) {
			const achievement = client.util.getAchievement(tempAchievement);
			if (!achievement) return interaction.reply({ embeds: [embed.setDescription(`__${tempAchievement}__ is not a valid achievement.`)], ephemeral: true });
			const reward = client.util.getItem(achievement.reward);

			embed
				.setTitle(`${achievement.emoji}${achievement.name}`)
				.setDescription(achievement.description)
				.addField('Unlock Message', achievement.unlockMessage, true)
				.addField('Reward', `${reward.emoji}${reward.name}`, true)
				.setFooter('Use the command without arguments to see the achievement list', client.user.displayAvatarURL({ dynamic: true }));

			if (achievement.picture) {
				embed.attachFiles(`assets/achievements/${achievement.picture}`)
					.setImage(`attachment://${achievement.picture}`);
			}

			if (achievement.rarity == 'uncommon') embed.setColor('#1eff00');
			else if (achievement.rarity == 'rare') embed.setColor('#0070dd');
			else if (achievement.rarity == 'epic') embed.setColor('#a335ee');
			else if (achievement.rarity == 'legendary') embed.setColor('#ff8000');
			else embed.setColor('#eeeeee');
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