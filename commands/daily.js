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

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const lastDaily = moment(await profile.getDaily(msg.author.id));
		const check = moment(lastDaily).add(1, 'd');

		const daily = check.format('dddd HH:mm');
		const now = moment();
		const reward = 20 + (Math.random() * 10);

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, reward);
			await profile.setDaily(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.reply(`You got ${Math.floor(reward)}💰 from your daily 🎁, come back in a day for more!\n Your current balance is ${balance}💰`);
		}
		else { msg.reply(`you have already gotten your daily 🎁, you can get you next daily ${daily}`); }
	},
};