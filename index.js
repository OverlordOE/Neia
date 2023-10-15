const timeEvents = require('./events/timeEvents.js');
const messageEvents = require('./events/messageEvents.js');
const interactionEvents = require('./events/interactionEvents.js');
const { Client, GatewayIntentBits, Collection, Events, Partials } = require("discord.js");
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
require("winston/lib/winston/config");

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel]
});

client.emojiCharacters = require("./data/emojiCharacters");
client.logger = require("./util/logger");

require("dotenv").config();

if (process.argv.includes("-t") || process.argv.includes("-test")) client.login(process.env.TESTTOKEN);
else client.login(process.env.TOKEN);


//* Initialize client

client.once("ready", async () => {
  let memberTotal = 0;
  client.guilds.cache.forEach((g) => {
    if (!isNaN(memberTotal) && g.id != 264445053596991498) {
      memberTotal += Number(g.memberCount);
    }
  });

  //* Start time based Events
  timeEvents.execute(client);

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
client.on(Events.MessageCreate, async (message) => {
  messageEvents.message(message, client);
});

//* Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
  interactionEvents.interaction(interaction, client);
});