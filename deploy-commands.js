require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const local = process.argv.includes("--local") || process.argv.includes("-l");
const del = process.argv.includes("--delete") || process.argv.includes("-d");
const global = process.argv.includes("--global") || process.argv.includes("-g");
const test = process.argv.includes("--test") || process.argv.includes("-t");

// Place your client and guild ids here
const guildId = process.env.GUILD_ID;
let clientId;


if (test) clientId = process.env.TESTCLIENT_ID;
else clientId = process.env.CLIENT_ID;


for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  if (global) {
    try {
      console.log(
        "Started refreshing application (/) commands for global guilds."
      );

      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );

      console.log(
        "Successfully reloaded application (/) commands for global guilds."
      );
    }
    catch (error) {
      console.error(error);
    }
  }
  else if (local) {
    try {
      console.log(
        "Started refreshing application (/) commands for test guild."
      );

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });

      console.log(
        "Successfully reloaded application (/) commands for test guild."
      );
    }
    catch (error) {
      console.error(error);
    }
  }
  else if (del) {
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
      .then(() => console.log('Successfully deleted all guild commands.'))
      .catch(console.error);
  }

})();
