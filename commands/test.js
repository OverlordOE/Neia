var moment = require('moment');
module.exports = {
	name: 'test',
	description: 'Test command for new commands',
	owner: true,
	aliases: ["t"],
	args: false,
	usage: '',
	async execute(msg, args, profile, bot, options, ytAPI, logger) {

		const lastHourly = moment(await profile.getHourly(msg.author.id))
		const now = moment()
		const test = moment(lastHourly, 'DDD H').add(1, 'h')
		if (moment(test).isBefore(now)) msg.channel.send(`test complete`);

		msg.channel.send(`lastHourly: ${lastHourly}\nnow: ${now}\ntest: ${test} `);
		await profile.setHourly(msg.author.id)

	},
};