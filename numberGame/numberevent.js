const nf = require("../util/numberFunctions");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async function execute(client) {

  client.guilds.cache.forEach(async (g) => {
    sendEvent(client, g);
  });

  client.logger.info("Finished Number Game Events!");
};


async function sendEvent(client, g) {

  const guild = await client.guildOverseer.getGuild(g.id);
  const numberGameInfo = client.guildOverseer.getNumberGame(guild);
  let claimed = false;
  let numberGameChannel;

  if (!numberGameInfo.channelId) return;

  const embed = new EmbedBuilder()
    .setTitle("__**NUMBER BOOST EVENT**__")
    .setColor("#efc420");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("claim")
      .setLabel("Claim!")
      .setStyle(ButtonStyle.Success)
      .setEmoji("💰")
  );

  try {
    numberGameChannel = await client.channels.fetch(numberGameInfo.channelId);
  }
  catch (e) {
    client.guildOverseer.setNumberChannel(guild, null);
    client.logger.warn(
      `${guild.name} NumberGameChannel DOES NOT EXIST, removing numbergamechannel`
    );
    return;
  }

  const numberIncrease = Math.floor(Math.random() * 5) + 5;
  const timeoutLength = 41.7;
  let description = `Be the **first** to click the button and Neia will count **${numberIncrease} times** for you.
    You will gain __**count rewards**__ for **every number** counted.`;

  let sentMessage;
  try {
    sentMessage = await numberGameChannel.send({
      embeds: [embed.setDescription(description)],
      components: [row],
    });
  }
  catch (error) {
    client.logger.warn(error);
  }

  if (numberGameInfo.currentEvent) numberGameInfo.currentEvent.delete();
  client.guildOverseer.setNumberGameEvent(guild, sentMessage);
  client.guildOverseer.saveNumberGameInfo(guild, numberGameInfo);

  const collector = numberGameChannel.createMessageComponentCollector({
    time: timeoutLength * 60000,
  });

  collector.on("collect", async (button) => {
    if (button.customId === "claim") {
      let payout = 0;
      const user = await client.userManager.getUser(button.user.id);
      const oldNumber = numberGameInfo.currentNumber;

      numberGameInfo.currentNumber += numberIncrease;
      claimed = true;


      // Check all counted numbers for easter eggs and checkpoints
      for (let i = oldNumber; i < oldNumber + numberIncrease; i++) {
        const easterEgg = nf.getEasterEggs(i);
        if (easterEgg.length) {
          const msg = await numberGameChannel.send(`${i}`);
          nf.applyEasterEggs(easterEgg, msg);
        }

        const checkpoint = nf.checkCheckpoint(i);
        if (checkpoint) {
          numberGameInfo.lastCheckpoint = i;
          numberGameInfo.nextCheckpoint = checkpoint;
          numberGameChannel.send(
            `Checkpoint __**${i}**__ reached!\nIf you make a mistake you will be reversed to this checkpoint.`
          );
        }
        payout += i * user.countMultiplier;
      }

      const buttonUser = button.user;
      const avatarLink = buttonUser.displayAvatarURL({ dynamic: true });
      description += `\n\n**__THIS EVENT HAS BEEN CLAIMED BY:__ ${buttonUser}!**`;
      sentMessage.edit({
        embeds: [
          embed
            .setDescription(description)
            .setColor("#00fc43")
            .setThumbnail(avatarLink),
        ],
        components: [],
      });

      // Send Final Number
      const m = await numberGameChannel.send(`${oldNumber + numberIncrease}`);
      m.react(user.reaction);
      const easterEgg = nf.getEasterEggs(oldNumber + numberIncrease);
      if (easterEgg.length) nf.applyEasterEggs(easterEgg, m);

      numberGameInfo.lastUserId = null;
      client.userManager.changeBalance(user, payout);
      client.guildOverseer.setNumberGameEvent(guild, null);
      client.guildOverseer.saveNumberGameInfo(guild, numberGameInfo);
      collector.stop();
    }
  });

  collector.on("end", () => {
    client.guildOverseer.setNumberGameEvent(guild, null);
    if (!claimed) sentMessage.delete();
  });
}