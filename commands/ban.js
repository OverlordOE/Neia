module.exports = {
	name: 'Ban',
	summary: 'Bans the mentioned user',
	description: 'Bans the mentioned user, you can add a reason after the mention.',
	category: 'admin',
	aliases: [''],
	args: true,
	usage: '<user> (reason)',
	example: '@OverlordOE tried to take over the server',
	permissions: 'BAN_MEMBERS',

	execute(message, args, msgUser, msgGuild, client, logger) {
		const banTarget = message.mentions.users.first();
		if (!banTarget) return message.reply('you need to tag the user you want to ban!');

		const banTargetGuildUser = message.guild.member(banTarget);
		if (!banTargetGuildUser.bannable) return message.reply(`Neia can't ban ${banTarget}!`);

		let banReason1 = `banned by user ${message.author.tag}, for reason: `;
		let banReason2 = '';
		for (let i = 0; i < args.length; i++) {
			if (!(args[i].startsWith('<@') && args[i].endsWith('>'))) {
				if (banReason2.length > 2) banReason2 += ` ${args[i]}`;
				else banReason2 += `${args[i]}`;
			}
		}
		if (!banReason2) banReason1 += 'No reason given';
		else banReason1 += banReason2;

		banTargetGuildUser.ban({ reason: banReason1 });

		return message.channel.send(`${banTarget.username} was ${banReason1}`);
	},
};