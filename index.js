const { Permissions } = require("discord.js");
const numberGame = require("./eventCommands/numbergame");
const numberEvent = require("./eventCommands/numberevent");
const cron = require("cron");
const { Client, Intents, Collection } = require("discord.js");
const {
  Users,
  userManager,
  itemHandler,
  achievementHunter,
  collectionOverseer,
} = require("./util/userManager");
const { guildOverseer, Guilds } = require("./util/guildOverseer");
const util = require("./util/util");
const fs = require("fs");
const beeFiles = fs.readdirSync("./pics");
require("winston/lib/winston/config");

const client = new Client({
  intents: new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ]),
  partials: ["CHANNEL"],
});

client.emojiCharacters = require("./data/emojiCharacters");
client.logger = require("./util/logger");

require("dotenv").config();
client.login(process.env.TOKEN);

//* Initialize client

client.once("ready", async () => {
  let memberTotal = 0;
  client.guilds.cache.forEach((g) => {
    if (!isNaN(memberTotal) && g.id != 264445053596991498)
      memberTotal += Number(g.memberCount);
  });

  const activityArray = [
    "people count",
    "you.",
    "time fly by",
    "Overlord",
    "Ainz",
    "the holy kingdom getting destroyed",
    "out for you",
    "the movie Vliegosaurus",
    "Garbiel waste all his money",
    "Jotan count in 10 servers",
  ];
  const activityNr = Math.floor(Math.random() * activityArray.length);
  client.user.setActivity(activityArray[activityNr], { type: "WATCHING" });

  //* Load in database
  try {
    const storedUsers = await Users.findAll();
    storedUsers.forEach((b) => userManager.set(b.user_id, b));
    const storedGuilds = await Guilds.findAll();
    storedGuilds.forEach((b) => guildOverseer.set(b.guild_id, b));

    client.guildOverseer = guildOverseer;
    client.userManager = userManager;
    client.itemHandler = itemHandler;
    client.achievementHunter = achievementHunter;
    client.collectionOverseer = collectionOverseer;
    client.util = util;
  } catch (e) {
    client.logger.error(e.stack);
  }

  client.logger.info(`Logged in as ${client.user.tag}!`);
});

// ? Bad error handling
client.on("warn", (e) => console.log(e));
client.on("error", (e) => console.log(e));
process.on("warning", (e) => console.log(e));
process.on("unhandledRejection", (e) => console.log(e));
process.on("TypeError", (e) => console.log(e));
process.on("uncaughtException", (e) => console.log(e));

//* Gather all commands
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

//* Respond to messages
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  else if (message.channel.type == "DM") {
    if (
      message.author.id == "753959113666592770" ||
      message.author.id == "137920111754346496"
    ) {
      const chosenFile = beeFiles[Math.floor(Math.random() * beeFiles.length)];
      message.author.send({ files: [`./pics/${chosenFile}`] });
    }

    client.logger.info(
      `${message.author.username} send message to Neia: ${message.content}`
    );
    const response = Math.floor(Math.random() * 5);
    if (!response) message.author.send("🙂");
    return;
  }

  const guild = await client.guildOverseer.getGuild(message.guildId);
  const user = await client.userManager.getUser(message.author.id);
  user.author = message.author;

  if (
    message.type != "DEFAULT" ||
    message.attachments.first() ||
    message.interaction ||
    message.author.bot ||
    message.stickers.first()
  )
    return;

  if (Number.isInteger(Number(message.content))) {
    return numberGame(message, user, guild, client);
  }
});

//* Handle interactions
client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    interaction.isMessageComponent() ||
    interaction.isButton() ||
    interaction.channel.type == "DM"
  )
    return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const guild = await client.guildOverseer.getGuild(interaction.guildId);
  const id = interaction.user.id;
  const user = await client.userManager.getUser(id);
  user.author = interaction.user;

  if (command.permissions) {
    if (
      !interaction.member.permissions.has(
        Permissions.FLAGS[command.permissions]
      )
    ) {
      return interaction.reply({
        content: `You need the \`${command.permissions}\` permission to use this command!`,
        ephemeral: true,
      });
    }
  }

  client.logger.info(
    `${interaction.user.tag} called "${interaction.commandName}" in "${interaction.guild.name}#${interaction.channel.name}".`
  );
  try {
    await command.execute(interaction, user, guild, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

//* Bot Events
const botEvents = new cron.CronJob("0 0/2 * * *", () => {
  setBotActivity();
  numberEventStart();
});
botEvents.start();

// Random number game event every 2 hours 0 0 / 2 * * *
function numberEventStart() {
  const time = Math.floor(Math.random() * 60) * 120000;
  client.logger.info(`Next NumberEvent in ${Math.floor(time / 60000)} minutes`);
  setTimeout(numberEvent, time, client);
}

function setBotActivity() {
  const activityArray = [
    "people count",
    "you.",
    "time fly by",
    "Overlord",
    "Ainz",
    "the holy kingdom getting destroyed",
    "out for you",
    "the movie Vliegosaurus",
    "Garbiel waste all his money",
    "Lilly count in 10 servers",
    "Lilly ruin the longest of streaks",
    "the bees fly by",
  ];

  const activityNr = Math.floor(Math.random() * activityArray.length);
  client.user.setActivity(activityArray[activityNr], { type: "WATCHING" });
}
