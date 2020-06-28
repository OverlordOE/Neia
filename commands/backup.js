const fs = require('fs');
const backup = require('../backup');
module.exports = {
	name: 'backup',
	description: 'Makes a backup of the database.',
	owner: true,
	admin: true,
	aliases: ['b'],
	args: false,
	usage: '<modifier>',
	music: false,

	async execute(msg, args, profile, guildProfile, bot, options, ytAPI, logger, cooldowns) {
		let total = 0;

		if (args[0] == 'restore') {
			const rawdata = fs.readFileSync('backup.json');
			const data = JSON.parse(rawdata);

			for (let i = 0; i < data.length; i++) {
				try {
					const id = data[i].user_id;

					await profile.addMoney(id, data[i].balance);
					await profile.setPColour(id, data[i].pColour);
					await profile.setOptIn(id, data[i].optIn);
					await profile.setProtection(id, data[i].protection);
					total++;
				}
				catch (error) {
					return logger.error(error.stack);
				}
			}

			return msg.channel.send(`backup of ${total} users restored`);
		}

		try {
			profile.map(async (u) => await backup.push(u));
		} catch (error) {
			return logger.error(error.stack);
		}

		fs.writeFile('backup.json', JSON.stringify(backup), e => {

			// Checking for errors
			if (e) return logger.error(e.stack);
			msg.channel.send(`Backup succesfull, backed up ${total} users!`);
			logger.log('info', 'Done writing profiles'); // Success
		});
	},
};

