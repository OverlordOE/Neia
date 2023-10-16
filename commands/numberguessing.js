const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    
    data: new SlashCommandBuilder()
        .setName('initguessing')
        .setDescription('Starts the number guessing game in a specific channel. REQUIRES MANAGE_CHANNELS PERMISSION!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

        async execute(interaction, msgUser, msgGuild, client) {

            client.guildOverseer.setNumberGameChannel(msgGuild, interaction.channel.id);
            
            return interaction.reply(`This channel has been set for the guessing game.
            **Rules:**
            __- The same person can't guess twice in a row.__
            __- Users can add to the prize pool with /increasePool and Neia will double your amount.__
            __- If you guess wrong, Neia will tell if the actual number is higher or lower than your guess and decrease the prize pool.__
            `);
        },
};