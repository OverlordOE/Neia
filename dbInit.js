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


// Execute node dbInit.js --force or node dbInit.js -f to force update the tables (this resets the db but removes unused tables).

// Create tags
sequelize
	.sync({ force: true })
	.then(async () => {
		console.log('DB synced');
		sequelize.close();
	})
	.catch(console.error);