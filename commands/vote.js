const Discord = require('discord.js');
const { Users } = require('../dbObjects');
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
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const items = await user.getItems();
		const vote = await profile.getVote(msg.author.id);
		let cReward = 0;

		const embed = new Discord.MessageEmbed()
			.setTitle('Vote Reward')
			.setThumbnail(avatar)
			.setColor(msgUser.pColour)
			.setTimestamp()
			.setFooter('Neia', bot.user.displayAvatarURL());


		items.map(i => {
			if (i.amount < 1) return;

			if (i.item.ctg == 'collectables') {
				for (let j = 0; j < i.amount; j++) {
					cReward += i.item.cost / 60;
				}
			}
		});


		const dReward = 20 + (Math.random() * 10);
		const finalReward = dReward + cReward;


		dbl.hasVoted(msg.author.id).then(async voted => {
			if (voted) {
				if (vote === true) {
					profile.addMoney(msg.author.id, finalReward);
					const balance = await profile.getBalance(msg.author.id);
					profile.setVote(msg.author.id, true);
					return msg.channel.send(embed.setDescription(`Thank you for voting!!!\nYou got **${dReward.toFixed(1)}💰** from your vote 🎁 and **${cReward.toFixed(1)}💰** from your collectables for a total of **${finalReward.toFixed(1)}💰**\n\nCome back in 12 hours for more!\nYour current balance is **${balance}💰**`));
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