const moment = require('moment');
module.exports = {
	name: 'daily',
	description: 'Get a daily gift.',
	admin: false,
	aliases: ['day', 'd'],
	args: false,
	cooldown: 5,
	owner: false,
	usage: '',
	music: false,
	
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		const lastDaily = moment(await profile.getDaily(msg.author.id));
		const now = moment();
		const check = moment(lastDaily, 'DDD H').add(1, 'd');
		const reward = 20 + (Math.random() * 10);

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, reward);
			await profile.setDaily(msg.author.id);
			msg.reply(`You got ${Math.floor(reward)}💰 from your daily 🎁, come back in a day for more`);
		}
		else { msg.reply(`you have already gotten your daily 🎁, you can get you next daily in ${check.diff(now, 'hours')} hours`); }
	},
};