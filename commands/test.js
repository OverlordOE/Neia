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


	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {

		const embed = new Discord.MessageEmbed()
			.setTitle('Test embed')
			.setDescription('test description')
			.setTimestamp();

		const filter = m => m.author.id === msg.author.id;

		msg.channel.send(embed).then(sentMessage => {
			msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

				.then(async collected => {
					const input = collected.first().content;

					embed.setDescription(input);
					sentMessage.edit(embed);
					collected.first().delete()
						.catch(e => logger.log('error', e));
				})
				.catch(e => {
					logger.log('error', e);
					msg.reply('Something went wrong.');
				});
		});

	},
};