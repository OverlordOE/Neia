const Discord = require('discord.js');
module.exports = {
	name: 'dice',
	description: 'Roll any amount of any sided die.',
	admin: false,
	aliases: ['roll'],
	args: true,
	usage: 'sides (amount of roles)',
	owner: false,
	music: false,

	async execute(msg, args, profile, bot, ops, ytAPI, logger, cooldowns) {

		const pColour = await profile.getPColour(msg.author.id);

		const embed = new Discord.MessageEmbed()
			.setColor(pColour);

		const sides = args[0];
		let amount;
		if (args[1]) amount = args[1];
		else amount = 1;

		if (amount > 100 || isNaN(amount) || amount < 0) { return msg.reply('input a number between 1 and 100'); }

		let total = 0;
		let message = '';


		const firstRoll = Math.floor((Math.random() * sides) + 1);
		total += firstRoll;
		if (firstRoll == sides || firstRoll == 1) message += ` + **${firstRoll}**`;
		else message += ` + ${firstRoll}`;

		for (let i = 1; i < amount; i++) {
			const roll = Math.floor((Math.random() * sides) + 1);
			if (roll == sides || roll == 1) message += ` + **${roll}**`;
			else message += ` + ${roll}`;
			total += roll;
		}

		msg.channel.send(embed.setDescription(`You rolled a D${sides} ${amount} times, these are the results: \n${message}\n= __**${total}**__`));
	},
};