const fs = require("fs"); 
const users = require("../users");
module.exports = {
	name: 'backup',
	description: 'Makes a backup of the database',
	admin: true,
	owner: true,
	async execute(msg, args, profile, bot, options, ytAPI, logger) {
		let total = 0;

		profile.map((u) => {
			let user = {
				user_id: u.user_id,
				balance: u.balance,
				lastDaily: u.lastDaily,
				level: u.level,
				exp: u.exp,
				msgCount: u.msgCount
			}
			users.push(user);
			total++;
		});

		fs.writeFile("users.json", JSON.stringify(users), err => {

			// Checking for errors 
			if (err) throw err;
			msg.channel.send(`Backup succesfull, backed up ${total} users!`)
			logger.log('info',"Done writing"); // Success 
		});
	},
};

