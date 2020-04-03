module.exports = {
	name: 'delete',
	description: 'Delete messages in bulk',
	admin: true,
	aliases: ["remove"],
	args: false,
	usage: '(amount of messaged to delete)',
	execute(msg, args) {
		msg.delete();
		msg.channel.bulkDelete(args[0]);
	},
};
