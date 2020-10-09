const fs = require('fs');
const backup = require('../data/backup.json');
module.exports = {
	name: 'backup',
	description: 'Makes a backup of the database.',
	category: 'debug',
	aliases: ['b'],
	args: false,
	usage: '<modifier>',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		let total = 0;

		if (args[0] == 'restore') {
			const rawdata = fs.readFileSync('backup.json');
			const data = JSON.parse(rawdata);

			for (let i = 0; i < data.length; i++) {
				try {
					const id = data[i].user_id;

					await profile.addMoney(id, data[i].balance);
					await profile.setPColour(id, data[i].pColour);
					await profile.setOpt(id, data[i].opt);
					await profile.addProtection(id, data[i].protection);
					total++;
				}
				catch (error) {
					return logger.error(error.stack);
				}
			}

			return message.channel.send(`backup of __**${total}**__ users restored`);
		}

		try {
			profile.map(async (u) => await backup.push(u));
		} catch (error) {
			return logger.error(error.stack);
		}

		fs.writeFile('backup.json', JSON.stringify(backup), e => {

			// Checking for errors
			if (e) return logger.error(e.stack);
			message.channel.send(`Backup succesfull, backed up __**${total}**__ users!`);
			logger.log('info', 'Done writing profiles'); // Success
		});
	},
};

