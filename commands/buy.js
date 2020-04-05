const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
    name: 'buy',
    description: 'buy an item from the shop.',
    admin: false,
    aliases: ["get"],
    usage: '',
    cooldown: 5,
    async execute(msg, args, profile, bot, options, ytAPI, logger) {

        const user = await Users.findOne({ where: { user_id: msg.author.id } });
        const filter = m => m.author.id === msg.author.id

        msg.channel.send(`What item do you want to buy?`).then(() => {
            msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

                .then(async collected => {
                    const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
                    if (!item) return msg.channel.send(`That item doesn't exist.`);


                    msg.channel.send(`How many do you want to buy (max of 1000)?`).then(() => {
                        msg.channel.awaitMessages(filter, { max: 1, time: 60000 })

                            .then(async collected => {
                                const amount = parseInt(collected.first().content);


                                if (!Number.isInteger(amount)) {
                                    return msg.channel.send(`${amount} is not a number`);
                                } else if (amount < 1 || amount > 1000) {
                                    return msg.channel.send(`Enter a number between 1 and 1000`);
                                }


                                const balance = await profile.getBalance(msg.author.id);
                                const cost = amount * item.cost
                                if (cost > balance) {
                                    return msg.channel.send(`You currently have ${balance}, but ${amount} ${item.name} costs ${cost}💰!`);
                                }

                                profile.addMoney(msg.author.id, -cost);
                                const interupt = Math.round(amount / 100);
                                for (var i = 0; i < amount; i++) {
                                    await user.addItem(item);
                                    logger.log('info', 'info', `Handled purchase ${i} out of ${amount} for item: ${item.name}`);
                                    if (interupt != 0) {
                                        if (i >= amount / interupt && i < (amount / interupt) + 1) {
                                            msg.channel.send(`Handled purchase ${i} out of ${amount} for item: ${item.name}`);
                                        }
                                    }
                                }
                                msg.channel.send(`You've bought: ${amount} ${item.name}.`);

                            })
                            .catch(e => {
                                logger.log('error', e)
                                msg.reply(`you didn't answer in time.`);
                            });
                    })

                })
        })
            .catch(e => {
                logger.log('error', e);
                msg.reply(`you didn't answer in time.`);
            });

    },
};