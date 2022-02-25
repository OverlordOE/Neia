const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('use')
		.setDescription('Use an item from your inventory.')
		.addStringOption(option =>
			option
				.setName('item')
				.setDescription('The item you want to use.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of items you want to use.')),


	async execute(interaction, msgUser, msgGuild, client) {
		const embed = new MessageEmbed()
			.setTitle('Neia Item Use')
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
			.setColor('#f3ab16');

		const tempItem = interaction.options.getString('item');
		const collectable = client.util.getCollectable(tempItem);
		if (collectable) useCollectable();
		else useItem();


		async function useCollectable() {

			if (collectable.ctg == 'reaction') {
				if (await client.collectionOverseer.hasCollectable(msgUser, collectable)) {
					msgUser.reaction = collectable.emoji;
					msgUser.save();

					return interaction.reply({
						embeds: [embed.setDescription(`Number Game reaction has been changed to: ${collectable.emoji}`).setColor('#00fc43')]
					});
				}
			}
			else return interaction.reply({ embeds: [embed.setDescription(`There is nu use for __${collectable.name}__.`).setColor('#fc0303')], ephemeral: true });
		}


		async function useItem() {
			let amount = interaction.options.getInteger('amount');
			if (amount < 1 || !amount) amount = 1;

			const item = client.util.getItem(tempItem);


			if (item) {
				if (await client.itemHandler.hasItem(msgUser, item, amount)) {
					if (item.use) {
						const result = await item.use(client, amount, embed, item, msgUser, msgGuild, interaction);

						if (result.succes) {
							client.itemHandler.removeItem(msgUser, item, amount);
							return interaction.reply({ embeds: [embed.setDescription(result.message).setColor('#00fc43')] });
						}
						else if (result.message) return interaction.reply({ embeds: [embed.setDescription(result.message)] });
						else return interaction.reply({ embeds: [embed.setDescription('An error has occurred, please report this to OverlordOE#0717').setColor('#fc0303')], ephemeral: true });
					}

					else return interaction.reply({ embeds: [embed.setDescription(`There is no use for __${item.name}__ yet, the item was not used.`).setColor('#fc0303')], ephemeral: true });
				}
				else return interaction.reply({ embeds: [embed.setDescription(`You don't have enough __${item.emoji}${item.name}(s)__!`).setColor('#fc0303')], ephemeral: true });
			}
			else if (tempItem) return interaction.reply({ embeds: [embed.setDescription(`__${tempItem}__ is not a valid item.`).setColor('#fc0303')], ephemeral: true });

		}
	},
};