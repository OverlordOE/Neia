module.exports = {
	name: 'hack',
	aliases: ['hackedandbanned', 'ban', 'hackandban'],
	category: 'misc',
	description: 'HACK AND BAN OTHER PEOPLE.',
	args: true,
	usage: '<targets>',

	execute(msg) {

		
		const hacked = msg.mentions.users.map(user => {
			return `${user.username} imma be nice to you this time but next time you are gonna get HACKED AND BANNED`;
		});								

		msg.channel.send(hacked);
		msg.delete();
	},
};