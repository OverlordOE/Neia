const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'use',
	description: 'use an item from your inventory.',
	admin: false,
	args: true,
	usage: '<item>\n -use Custom-role [colour in hex code(#0099ff)] "role name"\n -use Text-Channel [name]',
	cooldown: 5,
	async execute(msg, args, currency) {
		const author = msg.guild.members.get(msg.author.id);
		var hasItem = false;
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args[0] } } });
		if (!item) return msg.channel.send(`That item doesn't exist.`);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const uitems = await user.getItems();

		uitems.map(i => {
			if (i.item.name == item.name && i.amount >= 1) {
				hasItem = true;
			}
		})
		if (!hasItem) {
			return msg.channel.send(`You don't have ${item.name}!`);
		}

		switch (item.name) {

			case 'Tea':
				msg.channel.send("☕You enjoy the tea☕");
				break;

			case 'Cake':
				msg.channel.send("🎂THE CASE IS A LIE DONT TRUST IT🎂");
				break;
			
			case 'Coffee':
				msg.channel.send(`${msg.author.tag}'s power increased by 1%`);
				break;

			case 'Custom-Role':
				const name = args[2];
				const colour = args[1];
				msg.guild.createRole({ name: name, color: colour, mentionable: true });
				const role = msg.guild.roles.find('name', name);
				author.addRole(role);
				msg.channel.send(`You have created the role "${name}" with color ${colour}!`);
				break;

			case 'Text-Channel':
				const cname = args[0];
				msg.guild.channels.create(cname , {
					permissionOverwrites: [
						{
							id: message.author.id,
							allow: ['VIEW_CHANNEL', 'MANAGE_CHANNEL'],
						},
						{
							id: message.guild.id,
							deny: ['VIEW_CHANNEL'],
						},
					],
				}).catch(console.error);
				msg.channel.send(`You have created channel ${cname}`);
				break;
			default:
				return msg.channel.send(`No use for this yet, the item was not used.`);
		}

		await user.removeItem(item)
	},
};