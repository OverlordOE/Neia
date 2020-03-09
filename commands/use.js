const { Users, CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
module.exports = {
	name: 'use',
	description: 'use an item from your inventory.',
	admin: false,
	args: true,
	usage: '<item>\n -use Custom-role [colour in hex code(#0099ff)] "role name"',
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

			case 'Custom-Role':
				msg.guild.createRole({ name: args[2], color: args[1], mentionable: true });
				const role = msg.guild.roles.find('name', args[2]);
				author.addRole(role);
				msg.channel.send(`You have created the role "${args[2]}" with color ${args[1]}!`);
				break;

			default:
				return msg.channel.send(`No use for this yet, the item was not used.`);
		}

		await user.removeItem(item)
	},
};