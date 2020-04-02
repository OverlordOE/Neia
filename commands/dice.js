
module.exports = {
	name: 'dice',
	description: 'rolls a dice',
	admin: false,
	aliases: ["roll"],
	args: true,
	usage: 'sides (amount of roles)',
	execute(msg, args, profile) {

		const sides = args[0];
		let amount;
		if (args[1]) amount = args[1];
		else amount = 1;
		
		if (!(amount < 100 && !isNaN(amount) && amount > 0)) {return msg.reply('input a number between 1 and 100');}
		
		var total = 0;
		var message = '';
		

		var firstRoll = Math.floor((Math.random() * sides) + 1);
		total += firstRoll;
		message += `${firstRoll}`

		for (var i = 1; i < amount; i++) {
			var roll = Math.floor((Math.random() * sides) + 1);
			message += ` + ${roll}`
			total += roll;
		}

		msg.channel.send(`You rolled a ${sides} sided die ${amount} times, these are the results: \n${message} = ${total}`);
	},
};