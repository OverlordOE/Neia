const Discord = require('discord.js');
const DBL = require('dblapi.js');
const dblToken = process.env.DBL_TOKEN;
const dbl = new DBL(dblToken);
module.exports = {
	name: 'vote',
	summary: 'vote for the client to get an extra daily',
	description: 'vote for the client to get a reward.',
	category: 'money',
	aliases: ['v'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const vote = await profile.getVote(message.author.id);
		const embed = new Discord.MessageEmbed()
			.setTitle('Vote Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', client.user.displayAvatarURL());

		let reward = 0;
		let chest;

		const luck = Math.floor(Math.random() * 10);
		if (luck >= 1) chest = 'Rare chest';
		else chest = 'Epic chest';
		chest = await profile.getItem(chest);

		const items = await profile.getInventory(message.author.id);
		items.map(i => {
			if (i.amount < 1) return;
			const item = profile.getItem(i.name);
			if (item.ctg == 'collectable') reward += i.amount * (item.cost / 100);
		});

		dbl.hasVoted(message.author.id).then(async voted => {
			if (voted) {
				if (vote === true) {
					if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
						.setImage(`attachment://${chest.picture}`);

					profile.addMoney(message.author.id, reward);
					profile.addItem(message.author.id, chest, 1);
					profile.setVote(message.author.id);

					return message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your daily 🎁 and **${profile.formatNumber(reward)}💰** from your collectables.\nCome back in a day for more!\n\nYour current balance is **${profile.formatNumber(await profile.getBalance(message.author.id))}💰**`));
				}
				else return message.channel.send(embed.setDescription(`You have already voted in the last 12 hours.\nNext vote available at __${vote}__`));
			}
			else return message.channel.send(embed.setDescription('Vote for Neia and get up to **2 extra daily\'s** a day.\nTo get the daily\'s just vote [here](https://top.gg/bot/684458276129079320/vote) and then use this command again (this usually takes about 2-3 mins to update), you can do this every 12 hours!'));
		});
	},
};