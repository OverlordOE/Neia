const Sequelize = require('sequelize');

// Initialize new DB
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// Import tables
const CurrencyShop = sequelize.import('models/CurrencyShop');
sequelize.import('models/Users');
sequelize.import('models/UserItems');
sequelize.import('models/Guilds');

// Execute node dbInit.js --force or node dbInit.js -f to force update the tables (this resets the db but removes unused tables).
// Execute node dbInit.js --sync or node dbInit.js -s to force update the tables (this doesnt reset the db but keeps unused tables).

// Create tags
sequelize
	.sync({ force: true })
	.then(async () => {
		
		const shop = [
			
			// Loot Boxes
			CurrencyShop.upsert({
				name: 'Common Chest',
				cost: 50,
				emoji: '<:CommonBox:727513141260583031>',
				rarity: 'common',
				picture: 'common_closed.png',
				ctg: 'chests',
				description: 'Common Chest.',
			}),
			CurrencyShop.upsert({
				name: 'Rare Chest',
				cost: 200,
				emoji: '<:RareBox:727513141243805776>',
				rarity: 'rare',
				picture: 'rare_closed.png',
				ctg: 'chests',
				description: 'Rare Chest.',
			}),
			CurrencyShop.upsert({
				name: 'Epic Chest',
				cost: 800,
				emoji: '<:EpicBox:727513140849410090>',
				rarity: 'epic',
				picture: 'epic_closed.png',
				ctg: 'chests',
				description: 'Epic Chest.',
			}),
			CurrencyShop.upsert({
				name: 'Legendary Chest',
				cost: 5000,
				emoji: '<:LegendaryBox:727513140836827247>',
				rarity: 'legendary',
				picture: 'legendary_closed.png',
				ctg: 'chests',
				description: 'Legendary Chest.',
			}),

			// Consumables
			CurrencyShop.upsert({
				name: 'Mana Potion',
				cost: null,
				emoji: '<:Manapotion:727508079469396028>',
				rarity: 'rare',
				picture: 'mp.png',
				ctg: 'consumable',
				description: 'Mana Potion.',
			}),
			CurrencyShop.upsert({
				name: 'Lesser Mana Potion',
				cost: null,
				emoji: '<:Lessermanapotion:727508079578710178>',
				rarity: 'uncommon',
				picture: 'lmp.png',
				ctg: 'consumable',
				description: 'Lesser Mana Potion.',
			}),
			CurrencyShop.upsert({
				name: 'Greater Mana potion',
				cost: null,
				emoji: '<:Greatermanapotion:727508080316907561>',
				rarity: 'epic',
				picture: 'gmp.png',
				ctg: 'consumable',
				description: 'Greater Mana potion.',
			}),
			CurrencyShop.upsert({
				name: 'Healing Potion',
				cost: null,
				emoji: '<:Healingpotion:727508079498756246>',
				rarity: 'rare',
				picture: 'hp.png',
				ctg: 'consumable',
				description: 'Healing Potion.',
			}),
			CurrencyShop.upsert({
				name: 'Lesser Healing Potion',
				cost: null,
				emoji: '<:Lesserhealingpotion:727508079448686622>',
				rarity: 'uncommon',
				picture: 'lhp.png',
				ctg: 'consumable',
				description: 'Lesser Healing Potion.',
			}),
			CurrencyShop.upsert({
				name: 'Greater Healing Potion',
				cost: null,
				emoji: '<:GreaterHealingpotion:727508079494692914>',
				rarity: 'epic',
				picture: 'ghp.png',
				ctg: 'consumable',
				description: 'Greater Healing Potion.',
			}),

			CurrencyShop.upsert({
				name: 'Tea',
				cost: 2,
				emoji: '🍵',
				rarity: 'common',
				picture: null,
				ctg: 'consumable',
				description: 'its tea innit.',
			}),
			CurrencyShop.upsert({
				name: 'Coffee',
				cost: 3,
				emoji: '☕',
				rarity: 'common',
				picture: null,
				ctg: 'consumable',
				description: 'its Coffee innit.',
			}),
			CurrencyShop.upsert({
				name: 'Cake',
				cost: 6,
				emoji: '🍰',
				rarity: 'common',
				picture: null,
				ctg: 'consumable',
				description: 'its Cake innit.',
			}),
			CurrencyShop.upsert({
				name: 'Gun',
				cost: 30,
				emoji: '<:gun:727585753818857563>',
				rarity: 'uncommon',
				picture: 'gun.png',
				ctg: 'consumable',
				description: 'You can use this with the __steal__ command to steal money from other users.',
			}),
			CurrencyShop.upsert({
				name: 'Steal Protection',
				emoji: '🛡️',
				rarity: 'rare',
				picture: null,
				cost: 80,
				ctg: 'consumable',
				description: 'You can use this to gain 8 hours of protection against stealing.\nThis item stacks.',
			}),
			CurrencyShop.upsert({
				name: 'Profile Colour',
				cost: 40,
				emoji: '🌈',
				rarity: 'uncommon',
				picture: null,
				ctg: 'consumable',
				description: 'Use this to alter the white border on the left of all your commands.',
			}),

			// Collectables
			CurrencyShop.upsert({
				name: 'Star',
				cost: 10000,
				emoji: '⭐',
				rarity: 'legendary',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Museum',
				cost: 5000,
				emoji: '🏛️',
				rarity: 'epic',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'House',
				cost: 1000,
				emoji: '🏡',
				rarity: 'epic',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Car',
				cost: 65,
				emoji: '🚗',
				rarity: 'common',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Motorcycle',
				cost: 40,
				emoji: '🏍️',
				rarity: 'common',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Jet plane',
				cost: 700,
				emoji: '✈️',
				rarity: 'rare',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Prop plane',
				cost: 300,
				emoji: '🛩️',
				rarity: 'rare',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Sailboat',
				cost: 200,
				emoji: '⛵',
				rarity: 'uncommon',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Motorboat',
				cost: 125,
				emoji: '🚤',
				rarity: 'uncommon',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
			CurrencyShop.upsert({
				name: 'Office',
				cost: 50000,
				emoji: '🏢',
				rarity: 'legendary',
				picture: null,
				ctg: 'collectables',
				description: 'Gives you passive income.',
			}),
		];

		await Promise.all(shop);
		console.log('Database synced');
		sequelize.close();
	})
	.catch(console.error);
