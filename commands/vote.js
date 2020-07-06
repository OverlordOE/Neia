const Discord = require('discord.js');
const DBL = require('dblapi.js');
const dblToken = process.env.DBL_TOKEN;
const dbl = new DBL(dblToken);
module.exports = {
	name: 'vote',
	summary: 'vote for the bot to get an extra daily',
	description: 'vote for the bot to get a reward and part of your passive income from your collectables.',
	category: 'money',
	aliases: ['v'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(msg, args, msgUser, profile, guildProfile, bot, options, logger, cooldowns) {

		const avatar = msg.author.displayAvatarURL();
		const vote = await profile.getVote(msg.author.id);
		let reward = 0;
		let chest;

		const luck = Math.floor(Math.random() * 5);
		if (luck >= 1) chest = 'Rare chest';
		else chest = 'Epic chest';
		const item = await profile.getItem(chest);


		const embed = new Discord.MessageEmbed()
			.setTitle('Vote Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());


		const items = await profile.getInventory(msg.author.id);
		items.map(i => {
			if (i.amount < 1) return;
			if (i.base.ctg == 'collectables') reward += i.amount * (i.base.cost / 100);
		});


		dbl.hasVoted(msg.author.id).then(async voted => {
			if (voted) {
				if (vote === false) {
					if (item.picture) embed.attachFiles(`assets/items/${item.picture}`)
						.setImage(`attachment://${item.picture}`);
					profile.addMoney(msg.author.id, reward);
					await profile.addItem(msg.author.id, item, 1);
					const balance = await profile.getBalance(msg.author.id);
					profile.setVote(msg.author.id, true);
					return msg.channel.send(embed.setDescription(`Thank you for voting!!!\nYou got a ${item.emoji}${item.name} from your vote and **${reward.toFixed(1)}💰** from your collectables.\n\nCome back in 12 hours for more!\nYour current balance is **${balance}💰**`));
				}
				else return msg.channel.send(embed.setDescription(`You have already voted in the last 12 hours.\nNext vote available at __${vote}__`));

			}
			else {
				profile.setVote(msg.author.id, false);
				return msg.channel.send(embed.setDescription('Vote for Neia and get up to **2 extra daily\'s** a day.\nTo get the daily\'s just vote [here](https://top.gg/bot/684458276129079320/vote) and then use this command again (this usually takes about 2-3 mins to update), you can do this every 12 hours!'));
			}
		});


	},
};