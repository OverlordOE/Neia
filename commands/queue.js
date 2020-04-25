module.exports = {
	name: 'queue',
	description: 'Shows the song queue.',
	admin: false,
	aliases: ['list'],
	args: false,
	usage: '',
	owner: false,
	music: true,


	async execute(msg, args, profile, bot, ops) {
		// Ophalen van het ID van de server voor de data.
		const guildIDData = ops.active.get(msg.guild.id);

		// Nakijken als er al liedjes gepsleet worden in deze server.
		if (!guildIDData) return msg.channel.send('No music queued at the moment.');

		// Data ophalen.
		const queue = guildIDData.queue;
		const nowPlaying = queue[0];

		// Eerst een lijn met het liedje dat al speelt.
		let response = `Now playing: ${nowPlaying.songTitle}\nDuration: ${nowPlaying.duration}\nRequested by ${nowPlaying.requester}\n\nQueue: \n`;

		// Voor ieder liedje in de lijst gaan we deze toevoegen aan het bericht.
		for (let i = 1; i < queue.length; i++) {
			response += `${i}: ${queue[i].songTitle}\nDuration: ${queue[i].duration}\nRequested by: ${queue[i].requester}\n\n`;

		}

		// Zenden van het bericht.
		msg.channel.send(response, { code: true });

	
	},
};