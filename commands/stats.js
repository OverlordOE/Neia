const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Shows the tagged user\'s or your stats and balance.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Select a user')),

	async execute(interaction, msgUser, guild, client, logger) {
		const target = interaction.options.getUser('target') || interaction.user;
		const user = await client.userCommands.getUser(target.id);
		const items = await client.userCommands.getInventory(user);
		const reaction = client.userCommands.getReaction(user);
		const protection = client.userCommands.getProtection(user);
		const powerCounting = client.userCommands.getPowerCount(user);
		const countBoost = client.userCommands.getCountBoost(user);
		const hourlyCount = client.userCommands.getHourlyCount(user);
		const dailyCount = client.userCommands.getDailyCount(user);
		const stats = client.userCommands.getStats(user);


		const mainEmbed = new MessageEmbed()
			.setTitle(`${target.tag}'s Main Page`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.addField('Balance:', `${client.util.formatNumber(user.balance)}💰`, true)
			.addField('Number Game Reaction:', reaction.emoji, true)
			.addField('Number Game Reaction Bonus', `${client.util.formatNumber(Math.sqrt(reaction.value))}💰`, true)
			.addField('Protection Available:', `**${protection}**`, true)
			.addField('Power Count Available:', `**${powerCounting}**`, true)
			.addField('Count Boost Available:', `**${countBoost}**`, true)
			.addField('Next Daily Count Reward:', `**${dailyCount}**`, true)
			.addField('Next Hourly Count Reward:', `**${hourlyCount}**`, true)
			.setFooter('You can tag someone else to get their stats.', client.user.displayAvatarURL())
			.setColor('#f3ab16');

		const statEmbed = new MessageEmbed()
			.setTitle(`${target.tag}'s General Stats`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.addField('Numbers Counted:', stats.numbersCounted.toString(), true)
			.addField('Streaks Ruined:', stats.streaksRuined.toString(), true)
			.addField('Times Gambled:', stats.gamblingDone.toString(), true)
			.addField('Won with Gambling:', client.util.formatNumber(stats.gamblingMoneyGained), true)
			.addField('Lost with Gambling:', client.util.formatNumber(stats.gamblingMoneyLost), true)
			.setFooter('You can tag someone else to get their stats.', client.user.displayAvatarURL())
			.setColor('#f3ab16');

		const inventoryEmbed = new MessageEmbed()
			.setColor('#f3ab16')
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(target.displayAvatarURL({ dynamic: true }))
			.setFooter('You can use the emojis to switch pages.', client.user.displayAvatarURL());


		let inventory = '__Inventory:__\n\n';
		if (items.length) {
			items.map(i => {
				if (i.amount < 1) return;
				const item = client.util.getItem(i.name);
				inventory += `${item.emoji}${item.name}: ${client.util.formatNumber(i.amount)}\n`;
			});
			inventoryEmbed.setDescription(inventory);
		}
		else inventoryEmbed.addField('Inventory:', `*${target.tag}* has nothing!`);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('main')
					.setLabel('Balance and Cooldowns')
					.setStyle('PRIMARY')
					.setEmoji('💰'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('stats')
					.setLabel('Stats')
					.setStyle('PRIMARY')
					.setEmoji('📊'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('inventory')
					.setLabel('Inventory')
					.setStyle('PRIMARY')
					.setEmoji('📦'),
			);


		interaction.reply({ embeds: [mainEmbed], components: [row] });

		const filter = i => i.customId === 'primary' && i.user.id === '122157285790187530';
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async i => {
			if (i.customId === 'primary') {
				await i.update({ content: 'A button was clicked!', components: [] });
			}
		});
	},
};