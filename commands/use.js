const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'use',
	description: 'Use an item from your inventory.',
	admin: false,
	args: false,
	usage: 'item\n -use Custom-role (colour in hex code(#0099ff)) (role name)\n -use Text-Channel (name)',
	async execute(msg, args, profile) {

		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();
		const filter = m => m.author.id === msg.author.id
		var hasItem = false;

		msg.channel.send(`What item do you want to use?`).then(() => {
			msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
				.then(async collected => {

					const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: collected.first().content } } });
					if (!item) return msg.channel.send(`That item doesn't exist.`);

					uitems.map(i => {
						if (i.item.name == item.name && i.amount >= 1) {
							hasItem = true;
						}
					})
					if (!hasItem) {
						return msg.channel.send(`You don't have ${item.name}!`);
					}

					msg.reply(`you choose ${item.name}`);


					switch (item.name) {

						case 'Tea':
							msg.channel.send(`How much do you wanna use?`).then(() => {
								msg.channel.awaitMessages(filter, { max: 1, time: 60000 })
									.then(async collected => {
										const amount = parseInt(collected.first().content)

										if (amount > 50) msg.channel.send("☕You drink an enormous amount of tea☕\nYou die of tea poisoning!");
										else if (amount > 10) msg.channel.send("☕You drink a shit ton of tea☕\nAre you ok?");
										else if (amount > 2) msg.channel.send("☕You drink some tea☕\nYour teeth begin to ache.");
										else msg.channel.send("☕You drink some tea☕\nYou enjoy it.");

										for (var i = 0; i < amount; i++)  await user.removeItem(item)
									})
									.catch(e => {
										console.error(e);
										msg.channel.send(`You didn't answer in time.`);
									});

							})

							
							break;






					}

				})
				.catch(e => {
					console.error(e);
					msg.channel.send(`You didn't answer in time.`);
				});
		})
















		// 	const author = msg.guild.members.cache.get(msg.author.id);



		// 	switch (item.name) {



		// 		case 'Cake':
		// 			msg.channel.send("🎂THE CAkE IS A LIE");
		// 			break;

		// 		case 'Coffee':
		// 			msg.channel.send(`${msg.author.username}'s power increased by 1%`);
		// 			break;

		// 		case 'Custom-Role':
		// 			const name = args[2];
		// 			const colour = args[1];
		// 			const role = await msg.guild.roles.create({
		// 				data: {
		// 					name: name,
		// 					color: colour,
		// 					mentionable: true
		// 				},
		// 				reason: `${msg.author.tag} bought a role`
		// 			});
		// 			author.roles.add(role);
		// 			msg.channel.send(`You have created the role "${name}" with color ${colour}!`);
		// 			break;

		// 		case 'Text-Channel':
		// 			if (!args[1]) return msg.channel.send("please give the channel a name, try again.")
		// 			const cname = args[1];
		// 			msg.guild.channels.create(cname, {
		// 				permissionOverwrites: [
		// 					{
		// 						id: msg.author.id,
		// 						allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'MANAGE_MESSAGES'],
		// 					},
		// 					{
		// 						id: msg.guild.id,
		// 						deny: ['VIEW_CHANNEL'],
		// 					},
		// 				],
		// 			});
		// 			msg.channel.send(`You have created channel ${cname}`);
		// 			break;
		// 		default:
		// 			return msg.channel.send(`No use for this yet, the item was not used.`);
		// 	}

		// 	await user.removeItem(item)
	},
};