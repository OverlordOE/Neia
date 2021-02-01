module.exports = {
	name: 'kick',
	summary: 'Kick the mentioned user',
	description: 'Kick the mentioned user, you can add a reason after the mention.',
	category: 'admin',
	aliases: [''],
	args: true,
	usage: '<user> (reason)',
	permissions: 'KICK_MEMBERS',

	execute(message, args, msgUser, client, logger) {
		const kickTarget = message.mentions.users.first();
		if (!kickTarget) return message.reply('you need to tag the user you want to kick!');

		const kickTargetGuildUser = message.guild.member(kickTarget);
		if (!kickTargetGuildUser.kickable) return message.reply(`Neia can't kick ${kickTarget}!`);

		let kickReason1 = `kicked by user ${message.author.tag}, for reason: `;
		let kickReason2 = '';
		for (let i = 0; i < args.length; i++) {
			if (!(args[i].startsWith('<@') && args[i].endsWith('>'))) {
				if (kickReason2.length > 2) kickReason2 += ` ${args[i]}`;
				else kickReason2 += `${args[i]}`;
			}
		}
		if (!kickReason2) kickReason1 += 'No reason given';
		else kickReason1 += kickReason2;

		kickTargetGuildUser.kick(kickReason1);

		return message.channel.send(`${kickTarget.username} was ${kickReason1}`);
	},
};