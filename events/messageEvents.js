const numberGame = require("../numberGame/numbergame");
const numberGuessing = require("../numberGame/numberguessing");
const fs = require("fs");
const beeFiles = fs.readdirSync("./pics");
const { ChannelType } = require("discord.js");
const numberguessing = require("../numberGame/numberguessing");


module.exports = {
	async message(message, client) {
		if (message.author.bot) return;
		if (message.channel.type == ChannelType.DM) {
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
			message.attachments.first() ||
			message.interaction ||
			message.author.bot ||
			message.stickers.first()
		) return;

		if (Number.isInteger(Number(message.content))) {
			numberGame(message, user, guild, client);
			numberguessing(message, user, guild, client);
		}
	}
};