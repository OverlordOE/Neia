module.exports = {
	name: 'queue',
	description: 'Shows the song queue',
	admin: false,
	aliases: ["list"],
	args: false,
	usage: '',
	async execute(msg, args, currency, bot, songQueue) {
		var message;
		for(var i = 0; i < songQueue.length; i++) {
			let video = songQueue[i];
			message += `${i+1}: ${video.title} (${video.duration.minutes}min ${video.duration.seconds} secs)\n`;
		}
		

		return msg.channel.send(message);

	
	},
};