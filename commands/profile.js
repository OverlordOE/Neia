const Discord = require('discord.js');
const itemInfo = require('../data/items');
module.exports = {
	name: 'profile',
	summary: 'Shows profile of you or the tagger user',
	description: 'Shows profile of you or the tagger user.',
	category: 'info',
	aliases: ['inv', 'items', 'prof', 'inventory', 'balance', 'money', 'p'],
	args: false,
	usage: '<user>',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const target = message.mentions.users.first() || message.author;
		const items = await profile.getInventory(target.id);
		const filter = (reaction, user) => {
			return ['💰', '📦'].includes(reaction.emoji.name) && user.id === message.author.id;
		};


		const avatar = target.displayAvatarURL();
		const userProfile = await profile.getUser(target.id);
		const pColour = userProfile.pColour;

		const prot = await profile.getProtection(target.id);
		let daily = await profile.getDaily(target.id);
		let hourly = await profile.getHourly(target.id);
		let vote = await profile.getVote(target.id);

		if (daily === true) daily = 'now';
		if (hourly === true) hourly = 'now';
		if (vote === true) vote = 'now';


		const moneyEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s General Stats`)
			.setThumbnail(avatar)
			.addField('Balance:', `${profile.formatNumber(userProfile.balance)}💰`)
			.addField('Next hourly:', hourly, true)
			.addField('Next daily:', daily, true)
			.addField('Next Vote', vote, true)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());

		const invEmbed = new Discord.MessageEmbed()
			.setColor(pColour)
			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());


		if (prot !== false) moneyEmbed.addField('Steal protection:', prot);
		else moneyEmbed.addField('Steal protection:', 'none');


		let inventory = '__**Inventory:**__\n\n';
		if (items.length) {
			items.map(i => {
				if (i.amount < 1) return;
				const item = itemInfo[i.name.toLowerCase()];
				inventory += `${item.emoji}${item.name}: **${profile.formatNumber(i.amount)}x**\n`;
			});

			const income = await profile.calculateIncome(target.id);
			invEmbed.addField('Max passive income', `**${profile.formatNumber(income.income)}💰**`);
			invEmbed.addField('Networth', `**${profile.formatNumber(income.networth)}💰**`, true);

			invEmbed.setDescription(inventory);
		}
		else invEmbed.addField('Inventory:', `*${target.tag}* has nothing!`);


		message.channel.send(moneyEmbed)
			.then(sentMessage => {
				sentMessage.react('💰');
				sentMessage.react('📦');
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(message.author.id);
					if (reaction.emoji.name == '💰') { sentMessage.edit(moneyEmbed); }
					else if (reaction.emoji.name == '📦') { sentMessage.edit(invEmbed); }
				});
				collector.on('end', () => sentMessage.reactions.removeAll());
			});
	},
};