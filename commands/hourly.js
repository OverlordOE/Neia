const moment = require('moment');
module.exports = {
	name: 'hourly',
	description: 'Get an hourly gift.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',
	cooldown: 5,
	owner: false,
	admin: false,
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const lastHourly = moment(await profile.getHourly(msg.author.id));
		const check = moment(lastHourly).add(1, 'h');

		const hourly = check.format('dddd HH:mm');
		const now = moment();
		const reward = 3 + (Math.random() * 5);

		if (moment(check).isBefore(now)) {
			profile.addMoney(msg.author.id, reward);
			await profile.setHourly(msg.author.id);
			const balance = await profile.getBalance(msg.author.id);
			msg.reply(`You got ${Math.floor(reward)}💰 from your hourly 🎁, come back in an hour for more!\nYour current balance is ${balance}💰`);
		}
		else { msg.reply(`you have already gotten your hourly 🎁, you can get you next hourly ${hourly}.`); }


	},
};