module.exports = {
	name: 'hackedandbanned',
	aliases: ['hack', 'ban', 'hackandban'],
	admin: false,
	description: 'HACK AND BAN OTHER PEOPLE.',
	args: true,
	usage: 'user',
	owner: false,
	music: false,


	execute(msg, args) {

		
		const hacked = msg.mentions.users.map(user => {
			return `${user.username} imma be nice to you this time but next time you are gonna get HACKED AND BANNED`;
		});								

		msg.channel.send(hacked);
		msg.delete();
	},
};