module.exports = {
	name: 'queue',
	description: 'Shows the song queue',
	admin: false,
	aliases: ["list"],
	args: false,
	usage: '',
	async execute(msg, args, currency, bot, ops) {
		// Ophalen van het ID van de server voor de data.
		var guildIDData = ops.active.get(msg.guild.id);

		// Nakijken als er al liedjes gepsleet worden in deze server.
		if (!guildIDData) return msg.channel.send("No music queued at the moment.");

		// Data ophalen.
		var queue = guildIDData.queue;
		var nowPlaying = queue[0];

		// Eerst een lijn met het liedje dat al speelt.
		var response = `Now playing ${nowPlaying.songTitle} - Requested by ${nowPlaying.requester}\n\nQueue: \n`;

		// Voor ieder liedje in de lijst gaan we deze toevoegen aan het bericht.
		for (var i = 1; i < queue.length; i++) {
			response += `${i}: ${queue[i].songTitle} - Requested by ${queue[i].requester}\n`;

		}

		// Zenden van het bericht.
		msg.channel.send(response);

	
	},
};