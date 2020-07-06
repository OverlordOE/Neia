/* eslint-disable max-nested-callbacks */
/* eslint-disable indent */
const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
	name: 'use',
	summary: 'Use an item from your inventory',
	description: 'Use an item from your inventory.',
	category: 'money',
	aliases: ['item'],
	args: false,
	usage: '',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {

		const avatar = msg.author.displayAvatarURL();
		const uitems = await profile.getInventory(msg.author.id);

		const filter = m => m.author.id === msg.author.id;
		let iAmount = 0;
		let amount = 0;
		let temp = '';
		let item;


		const embed = new Discord.MessageEmbed()
			.setTitle('Use Command')
			.setThumbnail(avatar)
			.setDescription('What item do you want to use?')
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());


		msg.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = await profile.getItem(temp);
			if (item) {
				uitems.map(i => {
					if (i.name == item.name) {
						if (i.amount >= amount) use(profile, sentMessage, amount, embed, item, msg, filter);
						else return sentMessage.edit(embed.setDescription(`You only have **${i.amount}/${amount}** of the __${item.name}(s)__ needed!`));
					}
					else return sentMessage.edit(embed.setDescription(`You don't have any __${item.name}(s)__!`));
				});
			}
			else {

				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(async collected => {
						item = await profile.getItem(collected.first().content);
						collected.first().delete().catch(e => logger.error(e.stack));

						if (item) {
							uitems.map(i => {
								if (i.name == item.name && i.amount >= 1) {
									iAmount = i.amount;
								}
							});

							sentMessage.edit(embed.setDescription(`How much __${item.name}__ do you want to use?`)).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
									.then(async collected => {

										amount = parseInt(collected.first().content);
										collected.first().delete().catch(e => logger.error(e.stack));
										if (iAmount >= amount) use(profile, sentMessage, amount, embed, item, msg, filter);
										else return sentMessage.edit(embed.setDescription(`You only have **${iAmount}/${amount}** of the __${item.name}(s)__ needed!`));

									}).catch(e => {
										logger.error(e.stack);
										msg.reply('you didn\'t answer in time or something went wrong.');
									});
							});
						}
						else return sentMessage.edit(embed.setDescription(`${collected.first().content} is not an item.`));
					})
					.catch(e => {
						logger.error(e.stack);
						msg.reply('you didn\'t answer in time or something went wrong.');
					});
			}
		});
	},
};


async function use(profile, sentMessage, amount, embed, item, msg, filter) {
	if (!Number.isInteger(amount)) {
		return sentMessage.edit(embed.setDescription(`**${amount}** is not a number`));
	}
	else if (amount < 1 || amount > 10000) {
		amount = 1;
	}

	switch (item.name) {

		case 'Tea': {

			if (amount > 50) sentMessage.edit(embed.setDescription('☕You drink an enormous amount of tea☕\nYou die of tea poisoning!'));
			else if (amount > 10) sentMessage.edit(embed.setDescription('☕You drink a shit ton of tea☕\nAre you ok?'));
			else if (amount > 3) sentMessage.edit(embed.setDescription(`☕You drink **${amount}** cups of tea☕\nYour teeth begin to ache.`));
			else sentMessage.edit(embed.setDescription('☕You drink a cup of tea☕\nYou enjoy it.'));

			await profile.removeItem(msg.author.id, item, amount);
			break;
		}


		case 'Cake': {

			if (amount > 10) sentMessage.edit(embed.setDescription('🎂THE CAKE HAS RIPPED A HOLE IN REALITY🎂\nNot even The Avengers can fix this...'));
			else if (amount > 5) sentMessage.edit(embed.setDescription('🎂THE CAKE IS EVOLVING🎂\nYou are not gonna be ok.'));
			else if (amount > 2) sentMessage.edit(embed.setDescription('🎂THE CAKE IS BULLYING YOU🎂\nYour mental state deteriorates.'));
			else sentMessage.edit(embed.setDescription('🎂THE CAkE IS A LIE🎂\nYou feel deceived!'));

			await profile.removeItem(msg.author.id, item, amount);
			break;
		}


		case 'Coffee': {

			if (amount > 9000) sentMessage.edit(embed.setDescription(`*${msg.author.username}'s* power increased by **${amount}**%\nIT'S OVER 9000`));
			else if (amount == 69) sentMessage.edit(embed.setDescription(`*${msg.author.username}'s* power increased by **${amount}**%\n👁️👄👁️`));
			else sentMessage.edit(embed.setDescription(`*${msg.author.username}'s* power increased by **${amount}**%`));

			await profile.removeItem(msg.author.id, item, amount);
			break;
		}


		case 'Profile Colour': {

			sentMessage.edit(embed.setDescription('Specify the colour you want for your profile in the format **#0099ff**\n[hex colour picker](https://www.color-hex.com/)')).then(() => {
				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						const colour = collected.first().content;
						try {
							profile.setPColour(msg.author.id, colour);
						}
						catch { return sentMessage.edit(embed.setDescription('Thats not a valid Hex code')); }
						sentMessage.edit(embed.setDescription(`Profile colour succesfully changed to colour **${colour}**`));

						await profile.removeItem(msg.author.id, item, 1);
					})
					.catch(e => {
						msg.reply('you didn\'t answer in time or something went wrong.');
					});
			});
			break;
		}


		case 'Gun': {
			sentMessage.edit(embed.setDescription('To use a gun please use the `steal` command'));
			break;
		}

		case 'Steal Protection': {

			let prot;
			const now = moment();
			const protTime = 8 * amount;
			const oldProtection = await profile.getProtection(msg.author.id);
			const checkProtection = moment(oldProtection).isBefore(now);

			if (checkProtection) { prot = moment(now).add(protTime, 'h'); }
			else { prot = moment(oldProtection).add(protTime, 'h'); }

			const protection = prot.format('dddd HH:mm');
			sentMessage.edit(embed.setDescription(`You have activated steal protection.\nIt will last untill __${protection}__`));

			await profile.setProtection(msg.author.id, prot);
			await profile.removeItem(msg.author.id, item, amount);
			break;
		}

		default: {
			return sentMessage.edit(embed.setDescription(`There is no use for __${item.name}(s)__ yet, the item was not used.`));
		}
	}
}