const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'inventory',
    description: 'This command is outdated use "-profile" instead',
    admin: false,
    args: false,
    usage: '',
    async execute(msg, args, currency) {
        msg.channel.send(`This command is outdated use "-profile" instead`);
    },
};