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

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {

		const pColour = await profile.getPColour(msg.author.id);
		const bAvatar = bot.user.displayAvatarURL();
		let target;
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
						collected.first().delete().catch(e => logger.error(e.stack));

						if (mention.startsWith('<@') && mention.endsWith('>')) {
							mention = mention.slice(2, -1);

							if (mention.startsWith('!')) {
								mention = mention.slice(1);
							}

							target = bot.users.cache.get(mention);
							const avatar = target.displayAvatarURL();
							embed.setThumbnail(avatar);
						}
						else { return sentMessage.edit(embed.setDescription(`${mention} is not a valid response`)); }


						sentMessage.edit(embed.setDescription(`Trading with **${target.username}**\n\nWhat do you want to send (answer with a number to send money)?`))
							.then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const goods = collected.first().content.toLowerCase();
										collected.first().delete().catch(e => logger.error(e.stack));

										// item trade
										if (isNaN(goods)) {

											const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: goods } } });
											if (!item) return sentMessage.edit(embed.setDescription(`${item} doesn't exist.`));

											// item trade
											let hasItem = false;



											sentMessage.edit(embed.setDescription(`Trading with **${target.username}**\n\nHow much ${item.name} do you want to send?`)).then(() => {
												msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

													.then(async collected => {
														const amount = collected.first().content;
														const userTarget = await Users.findOne({ where: { user_id: target.id } });
														const uitems = await user.getItems();
														collected.first().delete().catch(e => logger.error(e.stack));
														uitems.map(i => {
															if (i.item.name == item.name && i.amount >= amount) {
																hasItem = true;
															}
														});
														if (!hasItem) {
															return sentMessage.edit(embed.setDescription(`You don't have ${amount} ${item.name}(s)!`));
														}

														await user.removeItem(item, amount);
														await userTarget.addItem(item, amount);

														sentMessage.edit(embed.setDescription(`Trade with **${target.username}** succesfull!\n\nTraded ${amount} ${item.name} to **${target.username}**.`));

													})
													.catch(e => {
														logger.error(e.stack);
														msg.reply('you didn\'t answer in time.');
													});
											});

										}

										else {
											const balance = await profile.getBalance(msg.author.id);

											if (!goods || isNaN(goods)) return sentMessage.edit(embed.setDescription(`Sorry ${msg.author}, that's an invalid amount.`));
											if (goods > balance) return sentMessage.edit(embed.setDescription(`Sorry ${msg.author}, you only have **${balance}💰**.`));
											if (goods <= 0) return sentMessage.edit(embed.setDescription(`Please enter an amount greater than zero, ${msg.author}.`));

											profile.addMoney(msg.author.id, -goods);
											profile.addMoney(target.id, goods);
											const balance2 = await profile.getBalance(msg.author.id);
											return sentMessage.edit(embed.setDescription(`Trade with **${target.username}** succesfull!\n\nTransferred **${goods}💰** to **${target.username}**.\nYour current balance is **${balance2}💰**`));

										}
									})
									.catch(e => {
										logger.error(e.stack);
										msg.reply('you didn\'t answer in time.');
									});
							})
							.catch(e => {
								logger.error(e.stack);
								msg.reply('you didn\'t answer in time.');
							});
					});
			});
	},
};
