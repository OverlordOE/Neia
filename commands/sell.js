/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'sell',
	description: 'Sell items to get 80% of your money back.',
	aliases: ['refund'],
	admin: false,
	args: false,
	usage: '',
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, ops, ytAPI, logger) {

		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const filter = m => m.author.id === msg.author.id;


		msg.channel.send('What do you want to refund? (you\'ll get 80% of the original price back)').then(() => {
			msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

				.then(async collected => {
					const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
					if (!item) return msg.channel.send('That item doesn\'t exist.');

					let hasItem = false;
					const uitems = await user.getItems();


					msg.channel.send('How much do you want to sell?').then(() => {
						msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

							.then(async collected => {
								const amount = collected.first().content;

								uitems.map(i => {
									if (i.item.name == item.name && i.amount >= amount) {
										hasItem = true;
									}
								});

								if (!hasItem) {
									return msg.channel.send(`You don't have enough ${item.name}!`);
								}

								const refundAmount = 0.8 * item.cost;
								let totalRefund = 0;
								for (let i = 0; i < amount; i++) {
									await user.removeItem(item);
									await profile.addMoney(msg.author.id, refundAmount);
									totalRefund += refundAmount;
									logger.log('info', `Handled refund ${i} out of ${amount} for item: ${item.name}`);
								}
								const balance = await profile.getBalance(msg.author.id);
								msg.channel.send(`You've refunded ${amount} ${item.name} and received ${totalRefund} back.\nYour balance is ${balance}💰!`);

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
	},
};
