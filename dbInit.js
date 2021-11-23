const Sequelize = require('sequelize');

// Initialize new DB
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// Import tables
require('./models/Users')(sequelize, Sequelize);
require('./models/Guilds')(sequelize, Sequelize);
require('./models/UserItems')(sequelize, Sequelize);
require('./models/UserAchievements')(sequelize, Sequelize);


// Execute node dbInit.js --force or node dbInit.js -f to force update the tables (this resets the db but removes unused tables).
const force = process.argv.includes('--force') || process.argv.includes('-f');
const alter = process.argv.includes('--alter') || process.argv.includes('-a');
// Create tags
sequelize
	.sync({ alter: alter, force: force })
	.then(async () => {
		console.log('DB synced');
		sequelize.close();
	})
	.catch(console.error);