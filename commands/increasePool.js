const { message, SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('increasepool')
        .setDescription('Add to the prize pool and Neia will double your amount!')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setRequired(true)
                .setDescription('The amount you want to add to the prize pool')
        )
        .addBooleanOption(option =>
            option
                .setName('allin')
                .setDescription('Throw all your money at Neia!')
                .setRequired(false)
        ),
    async execute(interaction, msgUser, client) {
        interaction.reply('Command WIP');
        // let poolAmount = interaction.options.getInteger('amount');

        // if (poolAmount < 1) poolAmount = 1;
        // if (interaction.options.getBoolean('allin')) poolAmount = msgUser.balance;
        // if (poolAmount > msgUser.balance) return interaction.reply({ content: `You don't have enough 💰.\n${client.util.formatNumber(poolAmount - msgUser.balance)}💰 more needed.`, ephemeral: true });

        // client.userManager.changeBalance(msgUser, -poolAmount, true);
        // numberGuessingInfo.prize += 2 * poolAmount;
        // message.reply(`The new prize pool is **${numberGuessingInfo.prize}**💰!`)
    }
};