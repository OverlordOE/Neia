const fs = require('fs');
const backup = require('../backup');
const { Users } = require('../dbObjects');
module.exports = {
	name: 'backup',
	description: 'Makes a backup of the database',
	admin: true,
	owner: true,
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		let total = 0;

		if (args[0] == 'all') {
			const rawdata = fs.readFileSync('backup.json');
			const data = JSON.parse(rawdata);

			for (let i = 0; i < data.length; i++) {
				try {
					profile.addMoney(data[i].user_id, data[i].balance);
					profile.setDaily(data[i].user_id);
					profile.setHourly(data[i].user_id);
					profile.addCount(data[i].user_id, data[i].msgCount);

				}
				catch (error) {
					logger.log('warn', 'something went wrong');
				}
			}

			return msg.channel.send('backup restored');

		}

		if (args[0] == 'inv') {
			profile.map(async (u) => {
				const userInfo = await Users.findOne({ where: { user_id: u.user_id } });
				const items = await userInfo.getItems();
				items.map(i =>
					msg.channel.send(`${u.user_id}, ${i.item.name}: ${i.amount}`)
				);


			});
			return msg.channel.send('Done sending all inventories');

		}

		profile.map((u) => {

			const user = {
				user_id: u.user_id,
				balance: u.balance,
				lastDaily: u.lastDaily,
				lastHourly: u.lastHourly,
				msgCount: u.msgCount,
			};
			backup.push(user);
			total++;
		});

		fs.writeFile('backup.json', JSON.stringify(backup), err => {

			// Checking for errors
			if (err) throw err;
			msg.channel.send(`Backup succesfull, backed up ${total} users!`);
			logger.log('info', 'Done writing'); // Success
		});
	},
};

