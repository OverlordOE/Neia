const Discord = require('discord.js');
const { Users } = require('../dbObjects');
const moment = require('moment');
module.exports = {
	name: 'profile',
	description: 'Shows profile of you or the tagger user.',
	admin: false,
	aliases: ['inv', 'items', 'prof', 'inventory', 'balance', 'money', 'p'],
	args: false,
	usage: 'user',
	owner: false,
	music: false,


	async execute(msg, args, profile, bot, ops, ytAPI, logger, cooldowns) {
		const target = msg.mentions.users.first() || msg.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		const avatar = target.displayAvatarURL();
		const bAvatar = bot.user.displayAvatarURL();
		const balance = await profile.getBalance(target.id);
		const count = await profile.getCount(target.id);
		const prot = moment(await profile.getProtection(target.id));
		const pColour = await profile.getPColour(target.id);

		const lastDaily = moment(await profile.getDaily(target.id));
		const lastHourly = moment(await profile.getHourly(target.id));
		const lastWeekly = moment(await profile.getWeekly(target.id));

		let title = `${target.tag}'s Profile`;
		let assets = '';
		let networth = 0;

		const now = moment();
		const dCheck = moment(lastDaily).add(1, 'd');
		const hCheck = moment(lastHourly).add(1, 'h');
		const wCheck = moment(lastWeekly).add(1, 'w');
		const pCheck = moment(prot).isBefore(now);

		let daily = dCheck.format('dddd HH:mm');
		let hourly = hCheck.format('dddd HH:mm');
		let weekly = wCheck.format('dddd HH:mm');
		const protection = prot.format('dddd HH:mm');
		if (moment(dCheck).isBefore(now)) daily = 'now';
		if (moment(hCheck).isBefore(now)) hourly = 'now';
		if (moment(wCheck).isBefore(now)) weekly = 'now';

		const embed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setThumbnail(avatar)
			.addField('Balance:', `${balance}💰`, true)
			.addField('Message Count:', count, true)
			.addField('Next weekly:', weekly)
			.addField('Next daily:', daily, true)
			.addField('Next hourly:', hourly, true)
			.setTimestamp()
			.setFooter('Syndicate Imporium', bAvatar);

		if (!pCheck) { embed.addField('Steal protection untill:', protection); }
		if (!items.length) { embed.addField('Inventory:', `${target.tag} has nothing!`); }


		else {
			embed.addField('Miscellaneous:', '-----------------------------');
			items.map(i => {
				if (i.amount < 1) return;
				if (i.item.name == '⭐') {
					for (let j = 0; j < i.amount; j++) {
						title += '⭐';
						networth += i.item.cost;
					}
					return;
				}
				if (i.item.ctg == 'collectables') { 
					for (let j = 0; j < i.amount; j++) {
						assets += `${i.item.name}`;
						networth += i.item.cost;
					}
					
				}
			});

			embed.addField('Assets', assets);
			embed.addField('Networth', `${networth}💰`);

			embed.addField('Inventory:', '-----------------------------');
			items.map(i => {
				if (i.amount < 1) return;
				if (i.item.ctg == 'collectables') return;
				embed.addField(`${i.item.name}: `, `${i.amount}`, true);
			});

		}
		embed.setTitle(title);

		msg.channel.send(embed);
	},
};