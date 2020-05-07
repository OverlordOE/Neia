const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'use',
	description: 'Use an item from your inventory.',
	admin: false,
	aliases: [],
	args: false,
	usage: '',
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, ops, ytAPI, logger, cooldowns) {
		
		const author = msg.guild.members.cache.get(msg.author.id);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();
		const filter = m => m.author.id === msg.author.id;
		let hasItem = false;

		msg.channel.send('What item do you want to use?').then(() => {
			msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

				.then(async collected => {
					const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
					if (!item) return msg.channel.send('That item doesn\'t exist.');

					uitems.map(i => {
						if (i.item.name == item.name && i.amount >= 1) {
							hasItem = true;
						}
					});
					if (!hasItem) return msg.channel.send(`You don't have ${item.name}!`);

					switch (item.name) {


					case 'Tea':
						msg.channel.send('How much tea do you want to use?').then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
								.then(async collected => {
									const amount = parseInt(collected.first().content);

									if (amount > 50) msg.channel.send('☕You drink an enormous amount of tea☕\nYou die of tea poisoning!');
									else if (amount > 10) msg.channel.send('☕You drink a shit ton of tea☕\nAre you ok?');
									else if (amount > 2) msg.channel.send('☕You drink some tea☕\nYour teeth begin to ache.');
									else msg.channel.send('☕You drink some tea☕\nYou enjoy it.');

									for (let i = 0; i < amount; i++) await user.removeItem(item);
								})
								.catch(e => {
									logger.log('error', e);
									msg.reply('you didn\'t answer in time.');
								});

						});
						break;


					case 'Cake':
						msg.channel.send('How much cake do you want to use?').then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									const amount = parseInt(collected.first().content);

									if (amount > 10) msg.channel.send('🎂THE CAKE HAS RIPPED A HOLE IN REALITY🎂\nNot even The Avengers can fix this...');
									else if (amount > 5) msg.channel.send('🎂THE CAKE IS EVOLVING🎂\nYou are not gonna be ok.');
									else if (amount > 2) msg.channel.send('🎂THE CAKE IS BULLYING YOU🎂\nYour mental state deteriorates.');
									else msg.channel.send('🎂THE CAkE IS A LIE🎂\nYou feel deceived!');

									for (let i = 0; i < amount; i++) await user.removeItem(item);
								})
								.catch(e => {
									logger.log('error', e);
									msg.reply('you didn\'t answer in time.');
								});
						});
						break;


					case 'Coffee':
						msg.channel.send('How much coffee do you want to use?').then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

								.then(async collected => {
									const amount = parseInt(collected.first().content);

									if (amount > 9000) msg.channel.send(`${msg.author.username}'s power increased by ${amount}%\nIT'S OVER 9000`);
									else msg.channel.send(`${msg.author.username}'s power increased by ${amount}%`);

									for (let i = 0; i < amount; i++) await user.removeItem(item);
								})
								.catch(e => {
									logger.log('error', e);
									msg.reply('you didn\'t answer in time.');
								});
						});
						break;


					case 'Custom Role':
						

						msg.channel.send('Specify the role name you want.').then(() => {
							msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
								.then(async collected => {
									const name = collected.first().content;

									msg.channel.send('Specify the colour you want for your role in the format #0099ff(look up hex colours if you dont know how)').then(() => {
										msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

											.then(async collected => {
												const colour = collected.first().content;
												const role = await msg.guild.roles.create({
													data: {
														name: name,
														color: colour,
														mentionable: true,
													},
													reason: `${msg.author.tag} bought a role`,
												});

												author.roles.add(role);
												msg.channel.send(`You have created the role "${name}" with color ${colour}!`);
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

						await user.removeItem(item);
						break;


					case 'Text Channel':

						msg.channel.send('Specify the channel name you want.').then(() => {
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
									msg.channel.send(`You have created channel ${name}`);

									await user.removeItem(item);
								})
								.catch(e => {
									logger.log('error', e);
									msg.reply('you didn\'t answer in time.');
								});
						});
						break;

					case 'Gun':
						msg.channel.send('To use a gun please use the **-steal** command');
						break;

					default:
						return msg.channel.send('No use for this yet, the item was not used.');
					}
				})
				.catch(e => {
					logger.log('error', e);
					msg.reply('you didn\'t answer in time.');
				});
		});
	},
};