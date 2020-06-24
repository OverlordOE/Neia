const Sequelize = require('sequelize');
const moment = require('moment');
const Discord = require('discord.js');
const profile = new Discord.Collection();

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const CurrencyShop = sequelize.import('models/CurrencyShop');
const UserItems = sequelize.import('models/UserItems');

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Users.prototype.addItem = async function (item, amount) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	const add = parseInt(amount);
	if (userItem) {
		userItem.amount += add;
		return userItem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};

Users.prototype.removeItem = async function (item, amount) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	const remove = parseInt(amount);
	if (userItem.amount >= remove) {
		userItem.amount -= remove;
		return userItem.save();
	}

	throw Error('User doesnt have that item');
};

Users.prototype.getItems = function () {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

// Add db commands
Reflect.defineProperty(profile, 'addMoney', {
	value: async function addMoney(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.balance += Number(amount);
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getBalance', {
	value: async function getBalance(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.balance) : 0;
	},
});


Reflect.defineProperty(profile, 'getDaily', {
	value: async function getDaily(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.lastDaily : 0;
	},

});

Reflect.defineProperty(profile, 'setDaily', {
	value: async function setDaily(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const currentDay = moment();
		user.lastDaily = currentDay;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'getHourly', {
	value: async function getHourly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.lastHourly : 0;
	},

});

Reflect.defineProperty(profile, 'setHourly', {
	value: async function setHourly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const day = moment();
		user.lastHourly = day;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'getWeekly', {
	value: async function getWeekly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.lastWeekly : 0;
	},

});

Reflect.defineProperty(profile, 'setWeekly', {
	value: async function setWeekly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const day = moment();
		user.lastWeekly = day;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'addCount', {
	value: async function addCount(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.msgCount += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getCount', {
	value: async function getCount(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.msgCount) : 0;
	},
});


Reflect.defineProperty(profile, 'getProtection', {
	value: async function getProtection(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.protection : 0;
	},

});

Reflect.defineProperty(profile, 'setProtection', {
	value: async function setProtection(id, day) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.protection = day;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'getPColour', {
	value: async function getPColour(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.pColour : 0;
	},

});

Reflect.defineProperty(profile, 'setPColour', {
	value: async function setPColour(id, colour) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		if (!colour.startsWith('#')) throw 'not a valid colour!';

		user.pColour = colour;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'getVote', {
	value: async function getVote(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.hasVoted : 0;
	},

});

Reflect.defineProperty(profile, 'setVote', {
	value: async function setVote(id, vote) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.hasVoted = vote;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'addTotalEarned', {
	value: async function addTotalEarned(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.totalEarned += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getTotalEarned', {
	value: async function getTotalEarned(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.totalEarned) : 0;
	},
});


Reflect.defineProperty(profile, 'addTotalSpent', {
	value: async function addTotalSpent(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.totalSpent += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getTotalSpent', {
	value: async function getTotalSpent(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.totalSpent) : 0;
	},
});


Reflect.defineProperty(profile, 'addGamblingSpent', {
	value: async function addGamblingSpent(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.gamblingSpent += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getGamblingSpent', {
	value: async function getGamblingSpent(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.gamblingSpent) : 0;
	},
});


Reflect.defineProperty(profile, 'addGamblingEarned', {
	value: async function addGamblingEarned(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.gamblingEarned += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getGamblingEarned', {
	value: async function getGamblingEarned(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.gamblingEarned) : 0;
	},
});


Reflect.defineProperty(profile, 'addStealingEarned', {
	value: async function addStealingEarned(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.stealingEarned += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getStealingEarned', {
	value: async function getStealingEarned(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.stealingEarned) : 0;
	},
});


Reflect.defineProperty(profile, 'addShopSpent', {
	value: async function addShopSpent(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.shopSpent += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getShopSpent', {
	value: async function getShopSpent(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.shopSpent) : 0;
	},
});


Reflect.defineProperty(profile, 'addBotUsage', {
	value: async function addBotUsage(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.botUsage += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getBotUsage', {
	value: async function getBotUsage(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.botUsage) : 0;
	},
});


Reflect.defineProperty(profile, 'newUser', {
	value: async function newUser(id) {
		const user = await Users.create({
			user_id: id,
			balance: 1,
			lastDaily: 0,
			lastHourly: 0,
			lastWeekly: 0,
			protection: 0,
			pColour: '#ffffff',
			hasVoted: false,
			msgCount: 1,
			gamblingEarned: 0,
			gamblingSpent: 0,
			stealingEarned: 0,
			shopSpent: 0,
			botUsage: 0,
			totalSpent: 0,
			totalEarned: 0,
		});
		profile.set(id, user);
		return user;
	},
});

module.exports = { Users, CurrencyShop, UserItems, profile };