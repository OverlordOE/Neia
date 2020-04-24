const moment = require('moment');
module.exports = {
	name: 'hourly',
	description: 'Get an hourly gift',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',
	cooldown: 5,
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		const lastHourly = moment(await profile.getHourly(msg.author.id));
		const now = moment();
		const check = moment(lastHourly, 'DDD H').add(1, 'h');
		const reward = 3 + (Math.random() * 5);

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, reward);
			await profile.setHourly(msg.author.id);
			msg.reply(`You got ${Math.floor(reward)}💰 from your hourly 🎁, come back in an hour for more`);
		}
		else { msg.reply(`you have already gotten your hourly 🎁, you can get you next hourly in ${check.diff(now, 'minutes')} minutes`); }


	},
};