const fs = require('fs');
const backup = require('../backup');
const iBackup = require('../ibackup');
const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
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

		if (args[0] == 'restore') {
			const rawdata = fs.readFileSync('backup.json');
			const rawIdata = fs.readFileSync('ibackup.json');
			const data = JSON.parse(rawdata);
			const iData = JSON.parse(rawIdata);

			for (let i = 0; i < data.length; i++) {
				try {
					logger.info(data[i].user_id);
					const id = data[i].user_id;
					profile.setUser(id, data[i]);
					total++;
				}
				catch (error) {
					return logger.error(error.stack);
				}
			}

			for (let i = 0; i < iData.length; i++) {
				try {
					const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: iData[i].itemName } } });
					const user = await Users.findOne({ where: { user_id: iData[i].user_id } });

					await user.addItem(item, iData[i].amount);
					total++;
				}
				catch (error) {
					return logger.error(error.stack);
				}
			}

			return msg.channel.send(`backup of ${total} users restored`);

		}

		try {
			profile.map(async (u) => {
				const userItems = await Users.findOne({ where: { user_id: u.user_id } });
				const items = await userItems.getItems();
				await backup.push(u);
				await iBackup.push(items);
				total++;
			});
		} catch (error) {
			return logger.error(error.stack);
		}

		fs.writeFile('ibackup.json', JSON.stringify(iBackup), e => {

			// Checking for errors
			if (e) return logger.error(e.stack);
			logger.log('info', 'Done writing items'); // Success
		});

		fs.writeFile('backup.json', JSON.stringify(backup), e => {

			// Checking for errors
			if (e) return logger.error(e.stack);
			msg.channel.send(`Backup succesfull, backed up ${total} users!`);
			logger.log('info', 'Done writing profiles'); // Success
		});
	},
};

