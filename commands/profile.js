const Discord = require('discord.js');
const { Users } = require('../dbObjects');
const moment = require('moment');
module.exports = {
	name: 'profile',
	summary: 'Shows profile of you or the tagger user',
	description: 'Shows profile of you or the tagger user.',
	category: 'info',
	aliases: ['inv', 'items', 'prof', 'inventory', 'balance', 'money', 'p'],
	args: false,
	usage: '<user>',


	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {
		const target = msg.mentions.users.first() || msg.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		const filter = (reaction, user) => {
			return ['💰', '🗒️', '📦'].includes(reaction.emoji.name) && user.id === msg.author.id;
		};


		const bAvatar = bot.user.displayAvatarURL();
		const avatar = target.displayAvatarURL();
		const userProfile = await profile.getUser(target.id);
		const pColour = userProfile.pColour;
		const prot = moment(userProfile.protection);

		let lastDaily;
		let lastHourly;
		let lastWeekly;

		try {
			lastDaily = moment(await userProfile.lastDaily);
			lastHourly = moment(await userProfile.lastHourly);
			lastWeekly = moment(await userProfile.lastWeekly);
		} catch (e) {
			return logger.error(e.stack);
		}


		let assets = '';
		let networth = 0;
		let collectables = false;
		let inventory = `__**Inventory:**__\n`;

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

		const moneyEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Stats`)
			.setThumbnail(avatar)
			.addField('Balance:', `${userProfile.balance.toFixed(1)}💰`, true)
			.addField('Message Count:', userProfile.msgCount, true)
			.addField('Next weekly:', weekly)
			.addField('Next daily:', daily, true)
			.addField('Next hourly:', hourly, true)
			.setTimestamp()
			.setFooter('Neia', bAvatar);

		const invEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.setTimestamp()
			.setFooter('Neia', bAvatar);

		const statEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`*${target.tag}'s* Inventory`)
			.setThumbnail(avatar)
			.addField('Total Spent:', userProfile.totalSpent.toFixed(1), true)
			.addField('Total Earned:', userProfile.totalEarned.toFixed(1), true)
			.addField('Earned with Gambling:', userProfile.gamblingEarned.toFixed(1), true)
			.addField('Spent at Gambling:', userProfile.gamblingSpent.toFixed(1), true)
			.addField('Earned with Stealing:', userProfile.stealingEarned.toFixed(1), true)
			.addField('Spent at Shop:', userProfile.shopSpent.toFixed(1), true)
			.addField('Total Bot Usage:', userProfile.botUsage, true)

			.setTimestamp()
			.setFooter('Neia', bAvatar);

		if (!pCheck) { moneyEmbed.addField('Steal protection untill:', protection); }


		if (items.length) {

			items.map(i => {
				if (i.amount < 1) return;
				if (i.item.ctg == 'collectables') {
					for (let j = 0; j < i.amount; j++) {
						assets += `${i.item.emoji}`;
						networth += i.item.cost;
					}
					collectables = true;
				}
			});
			if (collectables) {
				const pIncome = (networth / 20) + ((networth / 200) * 24);
				invEmbed.addField('Assets', assets);
				invEmbed.addField('Max passive income', `**${pIncome.toFixed(1)}💰**`);
				invEmbed.addField('Networth', `**${networth}💰**`, true);
			}

			items.map(i => {
				if (i.amount < 1) return;
				if (i.item.ctg == 'collectables') return;
				inventory += `${i.item.emoji}__${i.item.name}__: **x${i.amount}**\n`;
				invEmbed.setDescription(inventory);
			});
		}
		else invEmbed.addField('Inventory:', `*${target.tag}* has nothing!`);


		msg.channel.send(moneyEmbed)
			.then(sentMessage => {
				sentMessage.react('💰');
				sentMessage.react('📦');
				sentMessage.react('🗒️');
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(msg.author.id);
					if (reaction.emoji.name == '💰') { sentMessage.edit(moneyEmbed); }
					else if (reaction.emoji.name == '📦') { sentMessage.edit(invEmbed); }
					else if (reaction.emoji.name == '🗒️') { sentMessage.edit(statEmbed); }
				});
			});
	},
};
