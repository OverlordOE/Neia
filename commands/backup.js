const fs = require('fs');
const users = require('../users');
module.exports = {
	name: 'backup',
	description: 'Makes a backup of the database',
	admin: true,
	owner: true,
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		let total = 0;

		if (args[0] == 'all') {
			let rawdata = fs.readFileSync('users.json');
			let data = JSON.parse(rawdata);

			for (let i = 0; i < data.length; i++) {
				try {
					profile.addMoney(data[i].user_id, data[i].balance);
					profile.setDaily(data[i].user_id);
					profile.addCount(data[i].user_id, data[i].msgCount);
				
				} catch (error) {
					logger.log('warn', 'something went wrong');
				}
			}

			return msg.channel.send('backup restored');

		}


		profile.map((u) => {
			let user = {
				user_id: u.user_id,
				balance: u.balance,
				lastDaily: u.lastDaily,
				lastHourly: u.lastHourly,
				msgCount: u.msgCount,
			};
			users.push(user);
			total++;
		});

		fs.writeFile('users.json', JSON.stringify(users), err => {

			// Checking for errors
			if (err) throw err;
			msg.channel.send(`Backup succesfull, backed up ${total} users!`);
			logger.log('info', 'Done writing'); // Success
		});
	},
};

