module.exports = {
	name: 'hackedandbanned',
	aliases: ['hack', 'ban', 'hackandban'],
	admin: false,
	description: 'GET HACKED AND BANNED',
	args: true,
	usage: 'user',
	execute(msg, args) {

		
		const hacked = msg.mentions.users.map(user => {
			if (user.id == 137920111754346496 || 684458276129079320) return `<@${msg.author.id}>, you cannot hack nor ban a supreme being.`;
			return `${user.username} imma be nice to you this time but next time you gonna get HACKED AND BANNED`;
		});

		msg.channel.send(hacked);
		msg.delete();
	},
};