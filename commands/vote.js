const Discord = require('discord.js');
const { Users } = require('../dbObjects');
const DBL = require('dblapi.js');
const dblToken = process.env.DBL_TOKEN;
const dbl = new DBL(dblToken);
module.exports = {
	name: 'vote',
	description: 'Get a daily gift.',
	admin: false,
	aliases: ['v'],
	args: false,
	cooldown: 5,
	owner: false,
	usage: '',
	music: false,

	async execute(msg, args, profile, bot, options, ytAPI, logger, cooldowns) {
		
		
		const bAvatar = bot.user.displayAvatarURL();
		const avatar = msg.author.displayAvatarURL();

		const pColour = await profile.getPColour(msg.author.id);
		const user = await Users.findOne({ where: { user_id: msg.author.id } });
		const items = await user.getItems();
		const hasVoted = await profile.getVote(msg.author.id);
		let cReward = 0;

		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(avatar)
			.setColor(pColour)
			.setTimestamp()
			.setFooter('Neija', bAvatar);


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
				if (hasVoted) { return msg.channel.send(embed.setDescription('You have already voted in the last 12 hours.')); }
				else {
					profile.addMoney(msg.author.id, finalReward);
					const balance = await profile.getBalance(msg.author.id);
					profile.setVote(msg.author.id, true);
					return msg.channel.send(embed.setDescription(`Thank you for voting!!!\nYou got ${dReward.toFixed(1)}💰 from your vote 🎁 and ${cReward.toFixed(1)}💰 from your collectables for a total of ${finalReward.toFixed(1)}💰\n\nCome back in 12 hours for more!\nYour current balance is ${balance}💰`));
				}
			}
			else {
				profile.setVote(msg.author.id, false);
				return msg.channel.send(embed.setDescription('Vote for Neija and get up to 2 extra daily\'s a day.\nTo get the daily\'s just vote [here](https://top.gg/bot/684458276129079320/vote) and then use this command again, you can do this every 12 hours!'));
			}
		});


	},
};