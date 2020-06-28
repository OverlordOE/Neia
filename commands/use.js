/* eslint-disable max-nested-callbacks */
/* eslint-disable indent */
const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const moment = require('moment');
const { Op } = require('sequelize');
module.exports = {
	name: 'use',
	description: 'Use an item from your inventory.',
	admin: false,
	aliases: ['item'],
	args: false,
	usage: '',
	owner: false,
	music: false,

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {

		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();

		const pColour = await profile.getPColour(msg.author.id);
		const filter = m => m.author.id === msg.author.id;
		let iAmount = 0;
		let amount = 0;
		let temp = '';
		let item;


		const embed = new Discord.MessageEmbed()
			.setTitle('Use Command')
			.setThumbnail(avatar)
			.setDescription('What item do you want to use?')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neia', bAvatar);


		msg.channel.send(embed).then(async sentMessage => {

			for (let i = 0; i < args.length; i++) {
				if (!(isNaN(args[i]))) amount = parseInt(args[i]);

				else if (temp.length > 2) temp += ` ${args[i]}`;
				else temp += `${args[i]}`;
			}

			item = await CurrencyShop.findOne({ where: { name: { [Op.like]: temp } } });
			if (item) {
				uitems.map(i => {
					if (i.item.name == item.name) {
						if (i.item.name == item.name && i.amount >= amount) use(profile, sentMessage, amount, embed, item, msg, filter);
						else return sentMessage.edit(embed.setDescription(`You only have ${i.amount}/${amount} of the ${item.name}(s) needed!`));
					}

				});
			}
			else {

				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(async collected => {
						item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
						collected.first().delete().catch(e => logger.error(e.stack));

						if (item) {
							uitems.map(i => {
								if (i.item.name == item.name && i.amount >= 1) {
									iAmount = i.amount;
								}

							});

							sentMessage.edit(embed.setDescription(`How much ${item.name} do you want to use?`)).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
									.then(async collected => {

										amount = parseInt(collected.first().content);
										collected.first().delete().catch(e => logger.error(e.stack));
										if (iAmount >= amount) use(profile, sentMessage, amount, embed, item, msg, filter);
										else return sentMessage.edit(embed.setDescription(`You only have ${iAmount}/${amount} of the ${item.name}(s) needed!`));

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
		return sentMessage.edit(embed.setDescription(`${amount} is not a number`));
	}
	else if (amount < 1 || amount > 10000) {
		amount = 1;
	}
	const user = await Users.findOne({ where: { user_id: msg.author.id } });

	switch (item.name) {


		case 'Tea': {

			if (amount > 50) sentMessage.edit(embed.setDescription('☕You drink an enormous amount of tea☕\nYou die of tea poisoning!'));
			else if (amount > 10) sentMessage.edit(embed.setDescription('☕You drink a shit ton of tea☕\nAre you ok?'));
			else if (amount > 3) sentMessage.edit(embed.setDescription(`☕You drink ${amount} cups of tea☕\nYour teeth begin to ache.`));
			else sentMessage.edit(embed.setDescription('☕You drink a cup of tea☕\nYou enjoy it.'));

			await user.removeItem(item, amount);
			break;
		}


		case 'Cake': {

			if (amount > 10) sentMessage.edit(embed.setDescription('🎂THE CAKE HAS RIPPED A HOLE IN REALITY🎂\nNot even The Avengers can fix this...'));
			else if (amount > 5) sentMessage.edit(embed.setDescription('🎂THE CAKE IS EVOLVING🎂\nYou are not gonna be ok.'));
			else if (amount > 2) sentMessage.edit(embed.setDescription('🎂THE CAKE IS BULLYING YOU🎂\nYour mental state deteriorates.'));
			else sentMessage.edit(embed.setDescription('🎂THE CAkE IS A LIE🎂\nYou feel deceived!'));

			await user.removeItem(item, amount);
			break;
		}


		case 'Coffee': {

			if (amount > 9000) sentMessage.edit(embed.setDescription(`${msg.author.username}'s power increased by ${amount}%\nIT'S OVER 9000`));
			else if (amount == 69) sentMessage.edit(embed.setDescription(`${msg.author.username}'s power increased by ${amount}%\n👁️👄👁️`));
			else sentMessage.edit(embed.setDescription(`${msg.author.username}'s power increased by ${amount}%`));

			await user.removeItem(item, amount);
			break;
		}


		case 'Custom Role': {

			sentMessage.edit(embed.setDescription('Specify the role name you want.')).then(() => {
				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(async collected => {
						const name = collected.first().content;
						const author = msg.guild.members.cache.get(msg.author.id);
						collected.first().delete();

						sentMessage.edit(embed.setDescription('Specify the colour you want for your role in the format #0099ff\n(look up hex color on google to get a colour chooser)')).then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									const colour = collected.first().content;
									try {
										const role = await msg.guild.roles.create({
											data: {
												name: name,
												color: colour,
												mentionable: true,
											},
											reason: `${msg.author.tag} bought a role`,
										});

										author.roles.add(role);
										sentMessage.edit(embed.setDescription(`You have created the role "${name}" with color ${colour}!`));

										collected.first().delete();
									}
									catch { return sentMessage.edit(embed.setDescription('Something went wrong with creating the role')); }


									await user.removeItem(item, 1);
								})
								.catch(e => {
									msg.reply('you didn\'t answer in time or something went wrong.');
								});
						});
					})
					.catch(e => {
						msg.reply('you didn\'t answer in time or something went wrong.');
					});
			});
			break;
		}


		case 'Profile Colour': {

			sentMessage.edit(embed.setDescription('Specify the colour you want for your profile in the format #0099ff\n[hex colour picker](https://www.color-hex.com/)')).then(() => {
				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						const colour = collected.first().content;
						try {
							profile.setPColour(msg.author.id, colour);
						}
						catch { return sentMessage.edit(embed.setDescription('Thats not a valid Hex code')); }
						sentMessage.edit(embed.setDescription('Profile colour succesfully changed'));

						await user.removeItem(item, 1);
					})
					.catch(e => {
						msg.reply('you didn\'t answer in time or something went wrong.');
					});
			});
			break;
		}


		case 'Gun': {
			sentMessage.edit(embed.setDescription('To use a gun please use the **-steal** command'));
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
			sentMessage.edit(embed.setDescription(`You have activated steal protection.\nIt will last untill ${protection}`));

			await profile.setProtection(msg.author.id, prot);
			await user.removeItem(item, amount);
			break;
		}

		default: {
			return sentMessage.edit(embed.setDescription(`There is no use for ${item.name}(s) yet, the item was not used.`));
		}
	}
}