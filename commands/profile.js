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


	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		const target = msg.mentions.users.first() || msg.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();
		const filter = (reaction, user) => {
			return ['💰', '🗒️', '📦'].includes(reaction.emoji.name) && user.id === msg.author.id;
		};


		const bAvatar = bot.user.displayAvatarURL();
		const avatar = target.displayAvatarURL();
		const balance = await profile.getBalance(target.id);
		const msgCount = await profile.getCount(target.id);
		const prot = moment(await profile.getProtection(target.id));
		const pColour = await profile.getPColour(target.id);
		const hasVoted = await profile.getVote(target.id);
		const gamblingSpent = await profile.getGamblingSpent(target.id);
		const gamblingEarned = await profile.getGamblingEarned(target.id);
		const stealingEarned = await profile.getStealingEarned(target.id);
		const shopSpent = await profile.getShopSpent(target.id);
		const botUsage = await profile.getBotUsage(target.id);
		const totalSpent = await profile.getTotalSpent(target.id);
		const totalEarned = await profile.getTotalEarned(target.id);

		let lastDaily;
		let lastHourly;
		let lastWeekly;

		try {
			lastDaily = moment(await profile.getDaily(target.id));
			lastHourly = moment(await profile.getHourly(target.id));
			lastWeekly = moment(await profile.getWeekly(target.id));
		} catch (error) {
			logger.error(error);
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
			.addField('Balance:', `${balance}💰`, true)
			.addField('Message Count:', msgCount, true)
			.addField('Next weekly:', weekly)
			.addField('Next daily:', daily, true)
			.addField('Next hourly:', hourly, true)
			.addField('Can vote', !hasVoted)
			.setTimestamp()
			.setFooter('Neija', bAvatar);

		const invEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.setTimestamp()
			.setFooter('Neija', bAvatar);

		const statEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.addField('Total Spent:', totalSpent, true)
			.addField('Total Earned:', totalEarned, true)
			.addField('Earned with Gambling:', gamblingEarned, true)
			.addField('Spent at Gambling:', gamblingSpent, true)
			.addField('Earned with Stealing:', stealingEarned, true)
			.addField('Spent at Shop:', shopSpent, true)
			.addField('Total Bot Usage:', botUsage, true)

			.setTimestamp()
			.setFooter('Neija', bAvatar);

		if (!pCheck) { moneyEmbed.addField('Steal protection untill:', protection); }


		items.map(i => {
			if (i.amount < 1) return;
			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					assets += `${i.item.name}`;
					networth += i.item.cost;
				}
				collectables = true;
			}
		});
		if (collectables) {
			const pIncome = (networth / 20) + ((networth / 200) * 24);
			invEmbed.addField('Assets', assets);
			invEmbed.addField('Max passive income', `${pIncome.toFixed(1)}💰`);
			invEmbed.addField('Networth', `${networth}💰`, true);
		}

		items.map(i => {
			if (i.amount < 1) return;
			if (i.item.ctg == 'collectables') return;
			inventory += `${i.item.name}: x${i.amount}\n`;
			invEmbed.setDescription(inventory);
		});
		if (!items.length) { invEmbed.addField('Inventory:', `${target.tag} has nothing!`); }


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
