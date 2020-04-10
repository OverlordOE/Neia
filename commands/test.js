module.exports = {
	name: 'test',
	description: 'Test command for new commands',
	owner: true,
	aliases: ['t'],
	args: false,
	usage: '',
	async execute(msg, args, profile, bot, options, ytAPI, logger) {

		const connection = await msg.member.voice.channel.join();

		const dispatcher = connection.play('HAH.baf.mp3');

		dispatcher.on('start', () => {
			console.log('now playing!');
		});

		dispatcher.on('finish', () => {
			console.log('finished playing!');
			connection.disconnect();
		});

		// Always remember to handle errors appropriately!
		dispatcher.on('error', logger.error());


	},
};