const moment = require('moment');
module.exports = {

	'common chest': {
		name: 'Common Chest',
		cost: 50,
		emoji: '<:CommonBox:727513141260583031>',
		rarity: 'common',
		picture: 'common_closed.png',
		ctg: 'chest',
		description: 'Common Chest.',
	},
	'rare chest': {
		name: 'Rare Chest',
		cost: 300,
		emoji: '<:RareBox:727513141243805776>',
		rarity: 'rare',
		picture: 'rare_closed.png',
		ctg: 'chest',
		description: 'Rare Chest.',
	},
	'epic chest': {
		name: 'Epic Chest',
		cost: 1400,
		emoji: '<:EpicBox:727513140849410090>',
		rarity: 'epic',
		picture: 'epic_closed.png',
		ctg: 'chest',
		description: 'Epic Chest.',
	},
	'legendary chest': {
		name: 'Legendary Chest',
		cost: 8000,
		emoji: '<:LegendaryBox:727513140836827247>',
		rarity: 'legendary',
		picture: 'legendary_closed.png',
		ctg: 'chest',
		description: 'Legendary Chest.',
	},
	'tea': {
		name: 'Tea',
		cost: 2,
		emoji: '🍵',
		rarity: 'common',
		picture: null,
		ctg: 'consumable',
		description: 'its tea innit.',
		use: async function (profile, sentMessage, amount) {
			if (amount > 50) return { succes: true, message: '☕You drink an enormous amount of tea☕\nYou die of tea poisoning!' };
			else if (amount > 10) return { succes: true, message: '☕You drink a shit ton of tea☕\nAre you ok?' };
			else if (amount > 3) return { succes: true, message: `☕You drink **${amount}** cups of tea☕\nYour teeth begin to ache.` };
			else return { succes: true, message: '☕You drink a cup of tea☕\nYou enjoy it.' };
		},
	},
	'coffee': {
		name: 'Coffee',
		cost: 3,
		emoji: '☕',
		rarity: 'common',
		picture: null,
		ctg: 'consumable',
		description: 'its Coffee innit.',
		use: async function (profile, sentMessage, amount) {
			if (amount > 10) return { succes: true, message: '🎂THE CAKE HAS RIPPED A HOLE IN REALITY🎂\nNot even The Avengers can fix this...' };
			else if (amount > 5) return { succes: true, message: '🎂THE CAKE IS EVOLVING🎂\nYou are not gonna be ok.' };
			else if (amount > 2) return { succes: true, message: '🎂THE CAKE IS BULLYING YOU🎂\nYour mental state deteriorates.' };
			else return { succes: true, message: '🎂THE CAkE IS A LIE🎂\nYou feel deceived!' };
		},
	},
	'cake': {
		name: 'Cake',
		cost: 6,
		emoji: '🍰',
		rarity: 'common',
		picture: null,
		ctg: 'consumable',
		description: 'its Cake innit.',
		use: async function (profile, sentMessage, amount) {
			if (amount > 9000) return { succes: true, message: `*your* power has increased by **${amount}**%\nIT'S OVER 9000` };
			else if (amount > 5) return { succes: true, message: `*your* power has increased by **${amount}**%\n👁️👄👁️` };
			else if (amount > 2) return { succes: true, message: '🎂THE CAKE IS BULLYING YOU🎂\nYour mental state deteriorates.' };
			else return { succes: true, message: `*your* power has increased by **${amount}**%` };
		},
	},

	'gun': {
		name: 'Gun',
		cost: 30,
		emoji: '<:gun:727585753818857563>',
		rarity: 'uncommon',
		picture: 'gun.png',
		ctg: 'consumable',
		description: 'You can use this with the __steal__ command to steal money from other users.',
	},
	'steal protection': {
		name: 'Steal Protection',
		cost: 120,
		emoji: '🛡️',
		rarity: 'rare',
		picture: null,
		ctg: 'consumable',
		description: 'You can use this to gain 8 hours of protection against stealing.\nThis item stacks.',
		use: async function (profile, sentMessage, amount, embed, item, msgUser) {
			let prot;
			const now = moment();
			const protTime = 8 * amount;
			const oldProtection = await profile.getProtection(msgUser.user_id);
			console.log(oldProtection);
			if (!oldProtection) prot = moment(now).add(protTime, 'h');
			else prot = moment(oldProtection, 'MMM Do HH:mm').add(protTime, 'h');
			console.log(prot);

			const protection = prot.format('MMM Do HH:mm');
			console.log(prot);

			await profile.setProtection(msgUser.user_id, prot);
			return { succes: true, message: `You have activated steal protection.\nIt will last untill __${protection}__` };

		},
	},
	'profile colour': {
		name: 'Profile Colour',
		cost: 40,
		emoji: '🌈',
		rarity: 'uncommon',
		picture: null,
		ctg: 'consumable',
		description: 'Use this to alter the white border on the left of all your commands.',
		use: function (profile, sentMessage, amount, embed, item, msgUser) {
			const filter = m => m.author.id === msgUser.user_id;
			sentMessage.edit(embed.setDescription('Specify the colour you want for your profile in the format **#0099ff**\n[hex colour picker](https://www.color-hex.com/)')).then(() => {
				sentMessage.channel.awaitMessages(filter, { max: 1, time: 60000 })
					.then(collected => {
						const colour = collected.first().content;
						try {
							profile.setPColour(msgUser.user_id, colour);
						}
						catch { return sentMessage.edit(embed.setDescription('Thats not a valid Hex code')); }
						profile.removeItem(msgUser.user_id, item, amount);
						return sentMessage.edit(embed.setDescription(`Profile colour succesfully changed to colour **${colour}**`));
					});
			});
		},
	},
	'star': {
		name: 'Star',
		cost: 10000,
		emoji: '⭐',
		rarity: 'legendary',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'museum': {
		name: 'Museum',
		cost: 5000,
		emoji: '🏛️',
		rarity: 'epic',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'house': {
		name: 'House',
		cost: 1000,
		emoji: '🏡',
		rarity: 'epic',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'car': {
		name: 'Car',
		cost: 65,
		emoji: '🚗',
		rarity: 'common',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'motorcycle': {
		name: 'Motorcycle',
		cost: 40,
		emoji: '🏍️',
		rarity: 'common',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'jet plane': {
		name: 'Jet plane',
		cost: 700,
		emoji: '✈️',
		rarity: 'rare',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'prop plane': {
		name: 'Prop plane',
		cost: 300,
		emoji: '🛩️',
		rarity: 'rare',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'sailboat': {
		name: 'Sailboat',
		cost: 200,
		emoji: '⛵',
		rarity: 'uncommon',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'motorboat': {
		name: 'Motorboat',
		cost: 125,
		emoji: '🚤',
		rarity: 'uncommon',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
	'office': {
		name: 'Office',
		cost: 50000,
		emoji: '🏢',
		rarity: 'legendary',
		picture: null,
		ctg: 'collectable',
		description: 'Gives you passive income.',
	},
};