const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows info about how to use Neia.'),

	async execute(interaction, msgUser, msgGuild, client) {


		const embed = new MessageEmbed()
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setFooter('You can use the menu below to switch Categories.')
			.setColor('#f3ab16');

		const intro = `
		**Welcome to Neia! This command will provide you with information about the features of Neia and how to use them.**
		Neia is a bot that takes numbergames to a new level with cosmetics/items and an economy.

		**Features!**
		Fully functional numbergame with cosmetics and events
		Economy based around the numbergame
		User Profiles
		Gambling
		Achievements
		Leaderboards
		More coming soon!

		**Index**
		- Intro
		- Number Game setup and features
		- Profile
		- Economy and making money
		- Collectables
		- Gambling
		- Achievements
		

		**Use the menu below to switch between categories**
		`;


		const numbergameBasics = `
		**The basics of the Numbergame and how to set it up**
		The goal of the Numbergame is very simple, __Count as high as you can without breaking the streak__.
		There are only 2 rules:
		__Every number needs to be exactly 1 higher then the previous one__
		__The same person **CAN'T** count twice in a row__

		If you break either of these rules the Numbergame will be reset back to 0!
		That's it, sounds simple and it is simple but that why Neia makes it more interesting with more interesting features!

		**How to setup the Numbergame**
		The Numbergame requires a dedicated channel to count in, i would suggest you make a new channel for this.
		After you have setup your channel use the command /setnumbergame (requires manage channel permissions) and thats it. After that you can start counting!

		**Numbergame info**
		If you want to know about the current state of the numbergame like the current number or the next checkpoint use the \`numbergamestats\` command.
		This command will give you info about the currentnumber, current and next checkpoints, who counted the last time and more!

		**MORE INFO ON THE NEXT PAGE**
		`;

		let numbergameBasics2 = `
		**Checkpoints**
		To make sure 1 tiny mistake doesn't ruin days or weeks or progress there are checkpoints. Checkpoints are points that you will go back too instead of going back to 0.
		You get checkpoints by counting to certain predetermined numbers, you can see the next checkpoint in the \`numbergamestats\` command.
		After you use a checkpoint the checkpoints get RESET so you don't get another save untill you reach a new checkpoint!

		**Numbergame Economy**
		By counting in the Numbergame you can earn money, you can use this money for lots of different things like buying cosmetics or gambling.
		The amount of money you gain per count is determined as follows: __You get money equal to the number you counted * your count multiplier(Default is 1)__
		So for example if you just counted the number 25 and you have a count multiplier of 2x that mean you would get __25 * 2 = 50 money!__

		**Numbergame Reactions**
		A Numbergame reaction is the emoji that Neia reacts with when you count the right number. These reactions can be changed based on which are available to you.
		You can get more of them by unlocking achievements or buying them from the shop. To change your reaction use the \`use\` command in the following way \`use "name of reaction"\`.`;
		

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


		interaction.reply({
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