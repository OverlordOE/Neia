module.exports = {
	name: 'hackedandbanned',
	aliases: ['hacked', 'banned', 'hackandban'],
	description: 'GET HACKED AND BANNED',
	args: true,
	usage: '<user>',
	execute(msg, args) {
		

		const hacked = msg.mentions.users.map(user => {
			return `${user.username} imma be nice to you this time but next time you gonna get HACKED AND BANNED`;
		});

		msg.channel.send(hacked);
	},
};