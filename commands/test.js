module.exports = {
	name: 'test',
	aliases: ['t'],

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
	
		const reward = await profile.calculateIncome(message.author.id).daily;

		console.log(reward);
	},
};