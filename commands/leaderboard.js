const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
    name: 'leaderboard',
    description: 'Shows leaderboard.',
    admin: false,
    aliases: ["lead", "top", "ranking"],
    args: false,
    usage: '',
    execute(msg, args, currency, bot) {
        return msg.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                .filter(user => bot.users.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(bot.users.get(user.user_id).tag)}: ${Math.floor(user.balance)}💰`)
                .join('\n'),
            { code: true }
        );

    },
};