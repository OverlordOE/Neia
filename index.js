const numberGame = require("./numberGame/numbergame.js");
const events = require('./events/events.js');
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
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
  intents: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.emojiCharacters = require("./data/emojiCharacters");
client.logger = require("./util/logger");

require("dotenv").config();
client.login(process.env.TOKEN);

//* Initialize client

client.once("ready", async () => {
  let memberTotal = 0;
  client.guilds.cache.forEach((g) => {
    if (!isNaN(memberTotal) && g.id != 264445053596991498) {
      memberTotal += Number(g.memberCount);
    }
  });

  // Start Bi Hourly Events
  events.execute(client);

  //* Load in database
  try {
    const storedUsers = await Users.findAll();
    storedUsers.forEach((b) => userManager.set(b.user_id, b));
    const storedGuilds = await Guilds.findAll();
    storedGuilds.forEach((b) => guildOverseer.set(b.guild_id, b));
  }
  catch (e) {
    client.logger.error(e);
  }

  client.guildOverseer = guildOverseer;
  client.userManager = userManager;
  client.itemHandler = itemHandler;
  client.achievementHunter = achievementHunter;
  client.collectionOverseer = collectionOverseer;
  client.util = util;

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
  ) return;

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
  ) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const guild = await client.guildOverseer.getGuild(interaction.guildId);
  const id = interaction.user.id;
  const user = await client.userManager.getUser(id);
  user.author = interaction.user;


  // Execute Command
  client.logger.info(
    `${interaction.user.tag} called "${interaction.commandName}" in "${interaction.guild.name}#${interaction.channel.name}".`
  );

  try {
    await command.execute(interaction, user, guild, client);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});