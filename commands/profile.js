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



		const avatar = target.displayAvatarURL();
		const userProfile = await profile.getUser(target.id);
		const pColour = userProfile.pColour;

		const prot = await profile.getProtection(target.id);
		let daily = await profile.getDaily(target.id);
		let hourly = await profile.getHourly(target.id);
		let weekly = await profile.getWeekly(target.id);
		let vote = await profile.getVote(target.id);

		if (daily === true) daily = 'now';
		if (hourly === true) hourly = 'now';
		if (weekly === true) weekly = 'now';
		if (vote === true) vote = 'now';


		let assets = '';
		let networth = 0;
		let collectables = false;
		let inventory = '__**Inventory:**__\n';


		const moneyEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Stats`)
			.setThumbnail(avatar)
			.addField('Balance:', `${userProfile.balance.toFixed(1)}💰`, true)
			.addField('Message Count:', userProfile.msgCount, true)
			.addField('Next Vote', vote)
			.addField('Next daily:', daily, true)
			.addField('Next hourly:', hourly, true)
			.addField('Next weekly:', weekly, true)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());

		const invEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());

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
			.setFooter('Neia', bot.user.displayAvatarURL());

		if (prot !== false) moneyEmbed.addField('Steal protection untill:', prot);
		else moneyEmbed.addField('Steal protection untill:', 'none');

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
				const pIncome = (networth / 33) + ((networth / 400) * 24);
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
		else { invEmbed.addField('Inventory:', `*${target.tag}* has nothing!`); }


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
