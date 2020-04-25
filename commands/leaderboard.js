const { Users, CurrencyShop } = require('../dbObjects');
module.exports = {
	name: 'leaderboard',
	description: 'Shows leaderboard.',
	admin: false,
	aliases: ['lead', 'top', 'ranking'],
	args: false,
	usage: '',
	owner: false,
	music: false,


	execute(msg, args, profile, bot) {
		return msg.channel.send(
			profile.sort((a, b) => b.balance - a.balance)
				.filter(user => bot.users.cache.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(bot.users.cache.get(user.user_id).tag)}: ${Math.floor(user.balance)}💰, ${user.msgCount} msgs`)
				.join('\n'),
			{ code: true },
		);
	},
};