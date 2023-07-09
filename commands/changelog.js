const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('changelog')
		.setDescription('Shows the latest major update that the bot has received.'),


	execute(interaction, msgUser, msgGuild, client) {
		const embed = new EmbedBuilder()
			.setTitle('Neia V3.6: Collectables and Reaction overhaul')
			.setDescription(`
			# **Neia V3.6: Collectables and Reaction overhaul**
## **Reset**
Because i had to make some drastic changes in the database i need to reset the database. 
This means that everything will be reset to 0, i will change the number game number to what the last one was in the server.

## **Collectables**
Reactions will now no longer be items but instead a new type of thing "A collectable". If you unlock/buy a collectable it will permanently unlock for you, this means you cannot sell or trade them. You can find them on a new tab in your \`profile\`. You can also call the \`Collectables\` command to see a list of all the collectables

## **Reactions/Count bonus**
Number Game Reactions will no longer give you bonus to counting and will be purely cosmetic from now on. In place for that there is a new type of Collectable called "Count Multiplier". You will start at a multiplier of 1x and each multiplier that you unlock adds +1 to that number. The multiplier multiplies the money you would normally get from counting.

## **All ins**
All ins are back for gambling commands! If you want to go all in you will need to insert a random number in the amount slot and then press tab to get to the all in option, select true there and thats it.

## **UI Rework**
I have changed the UI of the \`profile\` command, im planning to change all the commands to follow this theme so Neia will be easier and nicer to read.

### **Bug Fixes and Minor Changes**
* Number Game Event now reacts with your reaction instead of the default checkmark.
* Number Game Event now spawns every 2 hours.
* \`Use\` command should now change colour correctly to green on a success and red on a failure.
* \`Items\` and \`Shop\` commands have merged into 1 \`Shop\` command because all available items are now in the shop.

#  **What's Next?**
I have alot of plans of features to add, mostly small additions or improvements like:
- More leaderboard stats
- More stats in general
- UI changes
- More Achievements and Reactions
- Additional ways to increase count multiplier
- Gambling improvements
- More Number Game Events
- And more!
			`);

		return interaction.reply({ embeds: [embed] });
	},
};