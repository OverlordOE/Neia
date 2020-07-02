const Sequelize = require('sequelize');
const moment = require('moment');
const Discord = require('discord.js');
const profile = new Discord.Collection();
const guildProfile = new Discord.Collection();


const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const Guilds = sequelize.import('models/Guilds');
const CurrencyShop = sequelize.import('models/CurrencyShop');
const UserItems = sequelize.import('models/UserItems');

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Users.prototype.addItem = async function (item, amount) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (userItem) {
		userItem.amount += parseInt(amount);
		return userItem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: parseInt(amount) });
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
Reflect.defineProperty(profile, 'getUser', {
	value: async function getUser(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user;
	},
});


Reflect.defineProperty(profile, 'addMoney', {
	value: async function addMoney(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.balance += Number(amount);
		if (amount < 0) user.totalSpent -= Number(amount);
		else user.totalEarned += Number(amount);
		return user.save();
	},
});
Reflect.defineProperty(profile, 'getBalance', {
	value: async function getBalance(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.balance.toFixed(1) : 0;
	},
});


Reflect.defineProperty(profile, 'getDaily', {
	value: async function getDaily(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const dCheck = moment(user.lastDaily).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('dddd HH:mm');
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
		const now = moment();

		const hCheck = moment(user.lastHourly).add(1, 'h');
		if (moment(hCheck).isBefore(now)) return true;
		else return hCheck.format('dddd HH:mm');
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
		const now = moment();

		const wCheck = moment(user.lastWeekly).add(1, 'w');
		if (moment(wCheck).isBefore(now)) return true;
		else return wCheck.format('dddd HH:mm');
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


Reflect.defineProperty(profile, 'setVote', {
	value: async function setVote(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const day = moment();
		user.lastVote = day;
		return user.save();
	},
});
Reflect.defineProperty(profile, 'getVote', {
	value: async function getVote(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('dddd HH:mm');
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


Reflect.defineProperty(profile, 'getProtection', {
	value: async function getProtection(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const prot = moment(user.protection);
		if (prot.isAfter(now)) return prot.format('dddd HH:mm');
		else return false;
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
		return user ? user.pColour : '#fcfcfc';
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


Reflect.defineProperty(profile, 'addGamblingSpent', {
	value: async function addGamblingSpent(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.gamblingSpent += amount;
		return user.save();
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

Reflect.defineProperty(profile, 'addStealingEarned', {
	value: async function addStealingEarned(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.stealingEarned += amount;
		return user.save();
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


Reflect.defineProperty(profile, 'addBotUsage', {
	value: async function addBotUsage(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		user.botUsage += amount;
		return user.save();
	},
});

Reflect.defineProperty(profile, 'getOptIn', {
	value: async function getOptIn(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? user.opt : 0;
	},

});
Reflect.defineProperty(profile, 'setOpt', {
	value: async function setOpt(id, opt) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.opt = opt;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'newUser', {
	value: async function newUser(id) {
		const now = moment();
		const user = await Users.create({
			user_id: id,
			balance: 1,
			lastDaily: 0,
			lastHourly: 0,
			lastWeekly: 0,
			lastVote: 0,
			protection: now,
			pColour: '#fcfcfc',
			opt: false,
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

Reflect.defineProperty(guildProfile, 'newGuild', {
	value: async function newGuild(id) {
		const guild = await Guilds.create({
			guild_id: id,
			prefix: '-',
		});
		guildProfile.set(id, guild);
		return guild;
	},
});

Reflect.defineProperty(guildProfile, 'getPrefix', {
	value: async function getPrefix(id) {
		let guild = guildProfile.get(id);
		if (!guild) guild = await guildProfile.newGuild(id);
		return guild ? guild.prefix : 0;
	},

});
Reflect.defineProperty(guildProfile, 'setPrefix', {
	value: async function setPrefix(id, newPrefix) {
		let guild = guildProfile.get(id);
		if (!guild) guild = await guildProfile.newGuild(id);

		guild.prefix = newPrefix;
		return guild.save();
	},
});

module.exports = { Users, Guilds, CurrencyShop, UserItems, profile, guildProfile };