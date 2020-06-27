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
sequelize.sync({ force: true }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Tea', cost: 2, ctg: 'consumable' }),
		CurrencyShop.upsert({ name: 'Coffee', cost: 3, ctg: 'consumable' }),
		CurrencyShop.upsert({ name: 'Cake', cost: 6, ctg: 'consumable' }),
		CurrencyShop.upsert({ name: 'Gun', cost: 30, ctg: 'consumable' }),
		CurrencyShop.upsert({ name: 'Steal Protection', cost: 80, ctg: 'consumable' }),
		CurrencyShop.upsert({ name: 'Custom Role', cost: 200, ctg: 'discord' }),
		CurrencyShop.upsert({ name: 'Profile Colour', cost: 40, ctg: 'consumable' }),
		CurrencyShop.upsert({ name: '⭐', cost: 10000, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '🏛️', cost: 5000, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '🏡', cost: 1000, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '🚗', cost: 65, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '🏍️', cost: 40, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '✈️', cost: 700, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '🛩️', cost: 300, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '⛵', cost: 200, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '🚤', cost: 125, ctg: 'collectables' }),
		CurrencyShop.upsert({ name: '🏢', cost: 50000, ctg: 'collectables' }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);