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
	aliases: ["item"],
	args: false,
	usage: '',
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, ops, ytAPI, logger, cooldowns) {

		const bAvatar = bot.user.displayAvatarURL();
		const author = msg.guild.members.cache.get(msg.author.id);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();
		let iAmount = 0;
		const pColour = await profile.getPColour(msg.author.id);
		const filter = m => m.author.id === msg.author.id;
		let hasItem = false;

		const embed = new Discord.MessageEmbed()
			.setTitle('Use Command')
			.setDescription('What item do you want to use?')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);


		msg.channel.send(embed).then(sentMessage => {
			msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

				.then(async collected => {
					const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
					if (!item) return sentMessage.edit(embed.setDescription('That item doesn\'t exist.'));

					uitems.map(i => {
						if (i.item.name == item.name && i.amount >= 1) {
							hasItem = true;
							iAmount = i.amount;
						}
					});
					if (!hasItem) return sentMessage.edit(embed.setDescription(`You don't have ${item.name}!`));
					collected.first().delete().catch(e => logger.log('error', e));

					switch (item.name) {


						case 'Tea': {
							sentMessage.edit(embed.setDescription('How much tea do you want to use')).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
									.then(async collected => {
										const amount = parseInt(collected.first().content);
										if (amount > iAmount) return sentMessage.edit(embed.setDescription(`You only have ${iAmount} tea.`));

										if (amount > 50) sentMessage.edit(embed.setDescription('☕You drink an enormous amount of tea☕\nYou die of tea poisoning!'));
										else if (amount > 10) sentMessage.edit(embed.setDescription('☕You drink a shit ton of tea☕\nAre you ok?'));
										else if (amount > 3) sentMessage.edit(embed.setDescription(`☕You drink ${amount} cups of tea☕\nYour teeth begin to ache.`));
										else sentMessage.edit(embed.setDescription('☕You drink a cup of tea☕\nYou enjoy it.'));

										collected.first().delete().catch(e => logger.log('error', e));

										for (let i = 0; i < amount; i++) await user.removeItem(item);
									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});

							});
							break;
						}


						case 'Cake': {
							sentMessage.edit(embed.setDescription('How much cake do you want to use?')).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const amount = parseInt(collected.first().content);
										if (amount > iAmount) return sentMessage.edit(embed.setDescription(`You only have ${iAmount} cake.`));

										if (amount > 10) sentMessage.edit(embed.setDescription('🎂THE CAKE HAS RIPPED A HOLE IN REALITY🎂\nNot even The Avengers can fix this...'));
										else if (amount > 5) sentMessage.edit(embed.setDescription('🎂THE CAKE IS EVOLVING🎂\nYou are not gonna be ok.'));
										else if (amount > 2) sentMessage.edit(embed.setDescription('🎂THE CAKE IS BULLYING YOU🎂\nYour mental state deteriorates.'));
										else sentMessage.edit(embed.setDescription('🎂THE CAkE IS A LIE🎂\nYou feel deceived!'));

										collected.first().delete().catch(e => logger.log('error', e));

										for (let i = 0; i < amount; i++) await user.removeItem(item);
									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});
							});
							break;
						}


						case 'Coffee': {
							sentMessage.edit(embed.setDescription('How much coffee do you want to use?')).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const amount = parseInt(collected.first().content);
										if (amount > iAmount) return sentMessage.edit(embed.setDescription(`You only have ${iAmount} coffee.`));

										if (amount > 9000) sentMessage.edit(embed.setDescription(`${msg.author.username}'s power increased by ${amount}%\nIT'S OVER 9000`));
										else sentMessage.edit(embed.setDescription(`${msg.author.username}'s power increased by ${amount}%`));

										collected.first().delete().catch(e => logger.log('error', e));

										for (let i = 0; i < amount; i++) await user.removeItem(item);
									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});
							});
							break;
						}


						case 'Custom Role': {

							sentMessage.edit(embed.setDescription('Specify the role name you want.')).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
									.then(async collected => {
										const name = collected.first().content;

										collected.first().delete().catch(e => logger.log('error', e));

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

														collected.first().delete().catch(e => logger.log('error', e));
													}
													catch { return sentMessage.edit(embed.setDescription('Something went wrong with creating the role')); }



													await user.removeItem(item);
												})
												.catch(e => {
													logger.log('error', e);
													msg.reply('you didn\'t answer in time.');
												});
										});
									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});
							});
							break;
						}


						case 'Text Channel': {

							sentMessage.edit(embed.setDescription('Specify the channel name you want.')).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const name = collected.first().content;

										msg.guild.channels.create(name, {
											permissionOverwrites: [
												{
													id: msg.author.id,
													allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES'],
												},
												{
													id: msg.guild.id,
													deny: ['VIEW_CHANNEL'],
												},
											],
										});
										sentMessage.edit(embed.setDescription(`You have created channel ${name}`));

										collected.first().delete().catch(e => logger.log('error', e));

										await user.removeItem(item);
									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});
							});
							break;
						}


						case 'Profile Colour': {

							sentMessage.edit(embed.setDescription('Specify the colour you want for your profile in the format #0099ff\n(look up hex color on google to get a colour chooser)')).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const colour = collected.first().content;
										try {
											profile.setPColour(msg.author.id, colour);
										}
										catch { return sentMessage.edit(embed.setDescription('Thats not a valid Hex code')); }
										sentMessage.edit(embed.setDescription('Profile colour succesfully changed'));

										collected.first().delete().catch(e => logger.log('error', e));

										await user.removeItem(item);
									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});
							});
							break;
						}


						case 'Gun': {
							sentMessage.edit(embed.setDescription('To use a gun please use the **-steal** command'));
							collected.first().delete().catch(e => logger.log('error', e));
							break;
						}

						case 'Steal Protection': {
							sentMessage.edit(embed.setDescription('How much protection do you want to use?')).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const amount = parseInt(collected.first().content);
										if (amount > iAmount) return sentMessage.edit(embed.setDescription(`You only have ${iAmount} steal protection.`));
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
										collected.first().delete().catch(e => logger.log('error', e));

										for (let i = 0; i < amount; i++) await user.removeItem(item);
									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});
							});
							break;
						}

						default: {
							collected.first().delete().catch(e => logger.log('error', e));
							return sentMessage.edit(embed.setDescription('No use for this yet, the item was not used.'));
						}
					}
				})
				.catch(e => {
					logger.log('error', e);
					msg.reply('you didn\'t answer in time.');
				});
		});
	},
};