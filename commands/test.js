const emojiCharacters = require('../emojiCharacters');
const Discord = require('discord.js');
module.exports = {
	name: 'test',
	description: 'Test command for new commands.',
	owner: true,
	aliases: ['t'],
	args: false,
	usage: '',
	admin: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger) {

		const bAvatar = bot.user.displayAvatarURL();
		const pColour = await profile.getPColour(msg.author.id);
		let description = `Press 💰 to participate in the jackpot!\nCurrent participants:`;
		let participants = [];
		let duplicate = false;

		const embed = new Discord.MessageEmbed()
			.setTitle('Syndicate Jackpot')
			.setDescription('Press 💰 to participate in the jackpot!')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);

		const filter = (reaction, user) => {
			return ['✂️', emojiCharacters[5]].includes(reaction.emoji.name) && !user.bot;
		};

		await msg.channel.send(embed)
			.then(sentMessage => {
				sentMessage.react('✂️');
				sentMessage.react(emojiCharacters[5]);

				const collector = sentMessage.createReactionCollector(filter, { time: 20000 });

				collector.on('collect', (r, user) => {

					for (let i = 0; i < participants.length; i++) {
						if (user.id == participants[i].id) {
							duplicate = true;
							break;
						}
					}
					if (!duplicate) {
						description += `\n${user} reacted with ${r.emoji.name}`;
						participants.push(user);
						sentMessage.edit(embed.setDescription(description));
					}
					duplicate = false;
				});
				collector.on('end', collected => {
					description += `\ncollection ended`;
					sentMessage.edit(embed.setDescription(description));
				});

			})
			.catch(e => {
				logger.log('error', `One of the emojis failed to react because of:\n${e}`);
				return msg.reply('Something went wrong.');
			});


	},
};