const Discord = require('discord.js');
const { Users } = require('../dbObjects');
const moment = require('moment');
module.exports = {
	name: 'profile',
	description: 'Shows inventory of tagged user or the sender if noone was tagged.',
	admin: false,
	aliases: ['inv', 'items', 'prof', 'inventory', 'balance', 'money', 'p'],
	args: false,
	usage: 'user',
	owner: false,
	music: false,


	async execute(msg, args, profile) {
		const target = msg.mentions.users.first() || msg.author;
		const balance = await profile.getBalance(target.id);
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		const avatar = target.displayAvatarURL();
		const count = await profile.getCount(target.id);
		const lastDaily = moment(await profile.getDaily(target.id));
		const lastHourly = moment(await profile.getHourly(target.id));
		
		const now = moment();
		const dCheck = moment(lastDaily, 'DDD H').add(1, 'd');
		const hCheck = moment(lastHourly, 'DDD H').add(1, 'h');
		
		let daily = dCheck.format('dddd HH:mm');
		let hourly = hCheck.format('dddd HH:mm');
		if (moment(dCheck).isBefore(now)) daily = 'now';
		if (moment(hCheck).isBefore(now)) hourly = 'now';
		
		const embed = new Discord.MessageEmbed()
			.setTitle(`${target.tag}'s Profile`)
			.setColor('#42f548')
			.setThumbnail(avatar)
			.addField('Balance:', `${balance}💰`, true)
			.addField('Message Count:', count, true)
			.addField('Next daily:', daily)
			.addField('Next hourly:', hourly, true)
			.setTimestamp();

		if (!items.length) { embed.addField('Inventory:', `${target.tag} has nothing!`); }
		else {
			embed.addField('Inventory:', '-----------------------------');
			items.map(i => embed.addField(`${i.item.name}: `, `${i.amount}`, true));
		}
		msg.channel.send(embed);
	},
};