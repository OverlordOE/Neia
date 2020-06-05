const fs = require('fs');
const backup = require('../backup');
const iBackup = require('../ibackup');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
const moment = require('moment');
module.exports = {
	name: 'backup',
	description: 'Makes a backup of the database.',
	owner: true,
	admin: true,
	aliases: ['b'],
	args: false,
	usage: 'modifier',
	music: false,
	
	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		let total = 0;
		const now = moment();

		if (args[0] == 'restore') {
			const rawdata = fs.readFileSync('backup.json');
			const rawIdata = fs.readFileSync('ibackup.json');
			const data = JSON.parse(rawdata);
			const iData = JSON.parse(rawIdata);

			for (let i = 0; i < data.length; i++) {
				try {
					profile.addMoney(data[i].user_id, data[i].balance);
					profile.setWeekly(data[i].user_id),
					profile.setDaily(data[i].user_id);
					profile.setHourly(data[i].user_id);
					profile.addCount(data[i].user_id, data[i].msgCount);
					profile.setProtection(data[i].user_id, now);
					profile.setPColour(data[i].user_id, data[i].pColour);
					total++;
				}
				catch (error) {
					logger.log('warn', 'something went wrong with applying the backup');
				}
			}

			for (let i = 0; i < iData.length; i++) {
				try {
					const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: iData[i].itemName } } });
					const user = await Users.findOne({ where: { user_id: iData[i].user_id } });
					for (let j = 0; j < iData[i].amount; j++) {
						await user.addItem(item);
						logger.log('info', `adding ${iData[i].itemName} ${j} of ${iData[i].amount} to user ${iData[i].user_id}`);
					}
				}
				catch (error) {
					logger.log('warn', 'something went wrong with applying the backup');
				}
			}

			return msg.channel.send(`backup of ${total} users restored`);

		}


		profile.map((u) => {

			const user = {
				user_id: u.user_id,
				balance: u.balance,
				msgCount: u.msgCount,
				pColour: u.pColour,

			};
			backup.push(user);
			total++;
		});


		profile.map(async (u) => {
			const userInfo = await Users.findOne({ where: { user_id: u.user_id } });
			const items = await userInfo.getItems();
			items.map(i => {
				if (i.amount < 1) return;
				const inv = {
					user_id: u.user_id,
					itemName: i.item.name,
					amount: i.amount,
				};
				iBackup.push(inv);
			});
		});


		fs.writeFile('ibackup.json', JSON.stringify(iBackup), err => {

			// Checking for errors
			if (err) return logger.log('error', err);
			logger.log('info', 'Done writing items'); // Success
		});

		fs.writeFile('backup.json', JSON.stringify(backup), err => {

			// Checking for errors
			if (err) return logger.log('error', err);
			msg.channel.send(`Backup succesfull, backed up ${total} users!`);
			logger.log('info', 'Done writing profiles'); // Success
		});
	},
};

