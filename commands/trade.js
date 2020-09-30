/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
module.exports = {
	name: 'trade',
	summary: 'Trade money or items to other people',
	description: 'Trade money and items to other people.',
	aliases: ['give', 'donate', 'transfer'],
	category: 'economy',
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		let target;
		const filter = m => m.author.id === message.author.id;

		const embed = new Discord.MessageEmbed()
			.setTitle('Neia Trading Center')
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());


		message.channel.send(embed.setDescription('Who do you want to trade with? __mention the user__\n'))
			.then(sentMessage => {
				message.channel.awaitMessages(filter, { max: 1, time: 60000 })

					.then(async collected => {
						let mention = collected.first().content;
						collected.first().delete();

						if (mention.startsWith('<@') && mention.endsWith('>')) {
							mention = mention.slice(2, -1);

							if (mention.startsWith('!')) {
								mention = mention.slice(1);
							}

							target = client.users.cache.get(mention);
							const avatar = target.displayAvatarURL();
							embed.setThumbnail(avatar);
						}
						else { return sentMessage.edit(embed.setDescription(`${mention} is not a valid response`)); }


						sentMessage.edit(embed.setDescription(`Trading with *${target.username}*\n\nWhat do you want to send (answer with a number to send money)?`))
							.then(() => {
								message.channel.awaitMessages(filter, { max: 1, time: 60000 })

									.then(async collected => {
										const goods = collected.first().content.toLowerCase();
										collected.first().delete();

										// item trade
										if (isNaN(goods)) {

											const item = await profile.getItem(goods);
											if (!item) return sentMessage.edit(embed.setDescription(`${item} doesn't exist.`));

											// item trade
											sentMessage.edit(embed.setDescription(`Trading with *${target.username}*\n\nHow much __${item.name}(s)__ do you want to send?`)).then(() => {
												message.channel.awaitMessages(filter, { max: 1, time: 60000 })

													.then(async collected => {
														const amount = collected.first().content;
														collected.first().delete();
														if (await profile.hasItem(message.author.id, item, amount)) {
															await profile.addItem(target.id, item, amount);
															await profile.removeItem(message.author.id, item, amount);
															sentMessage.edit(embed.setDescription(`Trade with *${target.username}* succesfull!\n\nTraded **${amount}** __${item.name}__ to *${target.username}*.`));
														}
														else return sentMessage.edit(embed.setDescription(`You don't have enough __${item.name}(s)__!`));

													})
													.catch(e => {
														logger.error(e.stack);
														message.reply('you didn\'t answer in time.');
													});
											});

										}

										else {
											const balance = msgUser.balance;

											if (!goods || isNaN(goods)) return sentMessage.edit(embed.setDescription(`Sorry *${message.author}*, that's an invalid amount.`));
											if (goods > balance) return sentMessage.edit(embed.setDescription(`You only have **${profile.formatNumber(balance)}💰** but need **${profile.formatNumber(goods)}**.`));
											if (goods <= 0) return sentMessage.edit(embed.setDescription(`Please enter an amount greater than zero, *${message.author}*.`));

											profile.addMoney(message.author.id, -goods);
											profile.addMoney(target.id, goods);
											return sentMessage.edit(embed.setDescription(`Trade with *${target.username}* succesfull!\n\nTransferred **${profile.formatNumber(goods)}💰** to *${target.username}*.\nYour current balance is **${profile.formatNumber(await profile.getBalance(message.author.id))}💰**`));

										}
									})
									.catch(e => {
										logger.error(e.stack);
										message.reply('you didn\'t answer in time.');
									});
							})
							.catch(e => {
								logger.error(e.stack);
								message.reply('you didn\'t answer in time.');
							});
					});
			});
	},
};
