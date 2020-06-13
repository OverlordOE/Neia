/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'trade',
	description: 'Trade money and items to other people.',
	aliases: ['give', 'donate', 'transfer'],
	admin: false,
	args: false,
	usage: '',
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, ops, ytAPI, logger, cooldowns) {

		const pColour = await profile.getPColour(msg.author.id);
		const bAvatar = bot.user.displayAvatarURL();
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const filter = m => m.author.id === msg.author.id;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neija Trading Center')
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);


		msg.channel.send(embed.setDescription('Who do you want to trade with? __mention the user__\n'))
			.then(sentMessage => {
				msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						let mention = collected.first().content;
						collected.first().delete().catch(e => logger.log('error', e));

						if (mention.startsWith('<@') && mention.endsWith('>')) {
							mention = mention.slice(2, -1);

							if (mention.startsWith('!')) {
								mention = mention.slice(1);
							}

							var target = bot.users.cache.get(mention);
							const avatar = target.displayAvatarURL();
							embed.setThumbnail(avatar);
						}
						else { return sentMessage.edit(embed.setDescription(`${mention} is not a valid response`)); }


						sentMessage.edit(embed.setDescription(`Trading with **${target.username}**\n\nDo you want to trade money or items?`))
							.then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const goods = collected.first().content.toLowerCase();
										collected.first().delete().catch(e => logger.log('error', e));

										if (goods == 'money') {
											sentMessage.edit(embed.setDescription(`Trading with **${target.username}**\n\nHow much money do you want to send?`)).then(() => {
												msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

													.then(async collected => {
														const balance = await profile.getBalance(msg.author.id);
														const transferAmount = collected.first().content;
														collected.first().delete().catch(e => logger.log('error', e));

														if (!transferAmount || isNaN(transferAmount)) return sentMessage.edit(embed.setDescription(`Sorry ${msg.author}, that's an invalid amount.`));
														if (transferAmount > balance) return sentMessage.edit(embed.setDescription(`Sorry ${msg.author}, you only have **${balance}💰**.`));
														if (transferAmount <= 0) return sentMessage.edit(embed.setDescription(`Please enter an amount greater than zero, ${msg.author}.`));

														profile.addMoney(msg.author.id, -transferAmount);
														profile.addMoney(target.id, transferAmount);
														const balance2 = await profile.getBalance(msg.author.id);
														return sentMessage.edit(embed.setDescription(`Trade with **${target.username}** succesfull!\n\nTransferred **${transferAmount}💰** to **${target.username}**.\nYour current balance is **${balance2}💰**`));


													})
													.catch(e => {
														logger.log('error', e);
														msg.reply('you didn\'t answer in time.');
													});
											});
										}

										// item trade
										else if (goods == 'item' || goods == 'items') {

											sentMessage.edit(embed.setDescription(`Trading with **${target.username}**\n\nWhat item do you want to send?`)).then(() => {
												msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

													.then(async collected => {
														const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
														collected.first().delete().catch(e => logger.log('error', e));
														if (!item) return sentMessage.edit(embed.setDescription(`${item} doesn't exist.`));

														// item trade
														let hasItem = false;
														const userTarget = await Users.findOne({ where: { user_id: target.id } });
														const uitems = await user.getItems();


														uitems.map(i => {
															if (i.item.name == item.name && i.amount >= 1) {
																hasItem = true;
															}
														});
														if (!hasItem) {
															return sentMessage.edit(embed.setDescription(`You don't have ${item.name}!`));
														}

														sentMessage.edit(embed.setDescription(`Trading with **${target.username}**\n\nHow much ${item.name} do you want to send?`)).then(() => {
															msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

																.then(async collected => {
																	const amount = collected.first().content;
																	collected.first().delete().catch(e => logger.log('error', e));

																	await user.removeItem(item, amount);
																	await userTarget.addItem(item, amount);

																	sentMessage.edit(embed.setDescription(`Trade with **${target.username}** succesfull!\n\nTraded ${amount} ${item.name} to **${target.username}**.`));

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
										}
										else { return sentMessage.edit(embed.setDescription(`${goods} is not a valid response`)); }

									})
									.catch(e => {
										logger.log('error', e);
										msg.reply('you didn\'t answer in time.');
									});
							})
							.catch(e => {
								logger.log('error', e);
								msg.reply('you didn\'t answer in time.');
							});
					});
			});
	},
};
