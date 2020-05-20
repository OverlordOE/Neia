/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
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

		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const filter = m => m.author.id === msg.author.id;

		// const embed = new Discord.MessageEmbed()
		// 	.setTitle('Use Command')
		// 	.setDescription('What item do you want to use?')
		// 	.setColor(pColour)
		// 	.setTimestamp();


		msg.channel.send('Who do you want to trade with? (mention the user)').then(() => {
			msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

				.then(async collected => {
					let mention = collected.first().content;

					if (mention.startsWith('<@') && mention.endsWith('>')) {
						mention = mention.slice(2, -1);

						if (mention.startsWith('!')) {
							mention = mention.slice(1);
						}

						var target = bot.users.cache.get(mention);
					}
					else {return msg.channel.send(`${mention} is not a valid response`);}


					msg.channel.send('Do you want to trade money or items?').then(() => {
						msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

							.then(async collected => {
								const goods = collected.first().content.toLowerCase();


								if (goods == 'money') {
									msg.channel.send('How much do you want to send?').then(() => {
										msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

											.then(async collected => {

												const balance = await profile.getBalance(msg.author.id);
												const transferAmount = collected.first().content;
												if (!transferAmount || isNaN(transferAmount)) return msg.channel.send(`Sorry ${msg.author}, that's an invalid amount.`);
												if (transferAmount > balance) return msg.channel.send(`Sorry ${msg.author}, you only have ${balance}.`);
												if (transferAmount <= 0) return msg.channel.send(`Please enter an amount greater than zero, ${msg.author}.`);

												profile.addMoney(msg.author.id, -transferAmount);
												profile.addMoney(target.id, transferAmount);
												const balance2 = await profile.getBalance(msg.author.id);
												return msg.channel.send(`Successfully transferred ${transferAmount}💰 to ${target.tag}. Your current balance is ${balance2}💰`);


											})
											.catch(e => {
												logger.log('error', e);
												msg.reply('you didn\'t answer in time.');
											});
									});
								}

								// item trade
								else if (goods == 'item' || goods == 'items') {

									msg.channel.send('What do you want to send?').then(() => {
										msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

											.then(async collected => {
												const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
												if (!item) return msg.channel.send('That item doesn\'t exist.');

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
													return msg.channel.send(`You don't have ${item.name}!`);
												}

												msg.channel.send('How much do you want to send?').then(() => {
													msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

														.then(async collected => {
															const amount = collected.first().content;

															const interupt = Math.round(amount / 100);
															for (let i = 0; i < amount; i++) {
																await user.removeItem(item);
																await userTarget.addItem(item);
																logger.log('info', `Handled trade ${i} out of ${amount} for item: ${item.name}`);
																if (interupt != 0) {
																	if (i >= amount / interupt && i < (amount / interupt) + 1) {
																		msg.channel.send(`Handled trade ${i} out of ${amount} for item: ${item.name}`);
																	}
																}
															}

															msg.channel.send(`You've traded ${amount} ${item.name} too ${target.tag}.`);

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
								else {return msg.channel.send(`${amount} is not a valid response`);}

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
