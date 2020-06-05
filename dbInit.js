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

// Execute node dbInit.js --force or node dbInit.js -f to force update the tables (this resets the db but removes unused tables).
// Execute node dbInit.js --sync or node dbInit.js -s to force update the tables (this doesnt reset the db but keeps unused tables).
const alter = process.argv.includes('--sync') || process.argv.includes('-s');
const force = process.argv.includes('--force') || process.argv.includes('-f');

// Create tags
sequelize.sync({ force: true }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Tea', cost: 2 }),
		CurrencyShop.upsert({ name: 'Coffee', cost: 3 }),
		CurrencyShop.upsert({ name: 'Cake', cost: 6 }),
		CurrencyShop.upsert({ name: 'Gun', cost: 30 }),
		CurrencyShop.upsert({ name: 'Steal Protection', cost: 80 }),
		CurrencyShop.upsert({ name: 'Custom Role', cost: 200 }),
		CurrencyShop.upsert({ name: 'Text Channel', cost: 500 }),
		CurrencyShop.upsert({ name: 'Profile Colour', cost: 40 }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
