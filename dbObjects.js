const Sequelize = require('sequelize');
const moment = require('moment');
const Discord = require('discord.js');
const profile = new Discord.Collection();
const guildProfile = new Discord.Collection();
require('dotenv').config();
const prefix = process.env.PREFIX;

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const Guilds = sequelize.import('models/Guilds');
const UserItems = sequelize.import('models/UserItems');
const items = require('./data/items');


// ITEMS
Reflect.defineProperty(profile, 'addItem', {
	value: async function addItem(id, item, amount) {
		const userItem = await UserItems.findOne({
			where: { user_id: id, name: item.name },
		});

		const user = profile.get(id);
		user.networth += item.value * parseInt(amount);
		user.save();

		if (userItem) {
			userItem.amount += parseInt(amount);
			return userItem.save();
		}

		return UserItems.create({
			user_id: id,
			name: item.name,
			amount: parseInt(amount),
		});
	},
});
Reflect.defineProperty(profile, 'removeItem', {
	value: async function removeItem(id, item, amount) {
		const userItem = await UserItems.findOne({
			where: { user_id: id, name: item.name },
		});

		const removeAmount = parseInt(amount);
		if (userItem.amount >= removeAmount) {
			const user = profile.get(id);
			user.networth -= item.value * removeAmount;
			if (item.ctg == 'equipment' && userItem.amount - removeAmount == 0) {
				const equipment = JSON.parse(user.equipment);
				if (equipment[item.slot] == item.name) equipment[item.slot] = null;
				user.equipment = JSON.stringify(equipment);
			}

			userItem.amount -= removeAmount;
			return userItem.save();
		}

		throw Error(`User doesn't have the item: ${item.name}`);
	},
});

Reflect.defineProperty(profile, 'hasItem', {
	value: async function hasItem(id, item, amount) {
		const userItem = await UserItems.findOne({
			where: { user_id: id, name: item.name },
		});
		const check = parseInt(amount);
		if (userItem.amount >= check && check > 0) return true;
		return false;
	},
});

Reflect.defineProperty(profile, 'getInventory', {
	value: async function getInventory(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return UserItems.findAll({
			where: { user_id: id },
		});
	},
});
Reflect.defineProperty(profile, 'getItem', {
	value: function getItem(itemName) {
		const item = itemName.toLowerCase();
		if (items[item]) return items[item];
		return false;
	},
});


// USERS
Reflect.defineProperty(profile, 'newUser', {
	value: async function newUser(id) {
		const now = moment();
		const user = await Users.create({
			user_id: id,
			balance: 0,
			totalEarned: 0,
			networth: 0,
			hp: 1000,
			equipment: JSON.stringify({ weapon: null, offhand: null }),
			lastDaily: now.subtract(2, 'days').toString(),
			lastHourly: now.subtract(1, 'days').toString(),
			lastVote: now.subtract(1, 'days').toString(),
			lastHeal: now.subtract(1, 'days').toString(),
			lastAttack: now.subtract(1, 'days').toString(),
			protection: now.toString(),
			pColour: '#fcfcfc',
			firstCommand: true,
		});
		profile.set(id, user);
		return user;
	},
});
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

		if (isNaN(amount)) throw Error(`${amount} is not a valid number.`);

		user.balance += Number(amount);
		if (amount > 0) user.totalEarned += Number(amount);

		user.save();
		return Math.floor(user.balance);
	},
});
Reflect.defineProperty(profile, 'getBalance', {
	value: async function getBalance(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return Math.floor(user.balance);
	},
});

Reflect.defineProperty(profile, 'getEquipment', {
	value: async function getEquipment(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return JSON.parse(user.equipment);
	},
});

Reflect.defineProperty(profile, 'equip', {
	value: async function equip(id, equipment) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const userEquipment = await UserItems.findOne({
			where: { user_id: id, name: equipment.name },
		});

		if (userEquipment) {
			const equipped = JSON.parse(user.equipment);

			equipped[equipment.slot] = equipment.name;
			user.equipment = JSON.stringify(equipped);
			return user.save();
		}
		return false;
	},
});

Reflect.defineProperty(profile, 'calculateIncome', {
	value: async function calculateIncome(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const uItems = await profile.getInventory(id);
		let networth = 0;
		let income = 0;
		let daily = 0;
		let hourly = 0;

		if (uItems.length) {
			uItems.map(i => {
				if (i.amount < 1) return;
				const item = items[i.name.toLowerCase()];
				networth += item.value * i.amount;
				if (item.ctg == 'collectable') {
					income += Math.pow((item.value * 149) / 1650, 1.1) * i.amount;
					daily += Math.pow(item.value / 100, 1.1) * i.amount;
					hourly += Math.pow(item.value / 400, 1.1) * i.amount;
				}
			});
		}
		return { networth: networth, income: income, daily: daily, hourly: hourly };
	},
});

Reflect.defineProperty(profile, 'addHp', {
	value: async function addHp(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		if (isNaN(amount)) throw Error(`${amount} is not a valid number.`);

		const hp = Number(user.hp);
		if (hp >= 1000) return false;
		else if (hp > (1000 - amount)) {
			amount = 1000 - hp;
			user.hp = hp + Number(amount);
		}
		else user.hp = hp + Number(amount);

		user.save();
		return amount;
	},
});
Reflect.defineProperty(profile, 'getHp', {
	value: async function getHp(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user.hp;
	},
});

Reflect.defineProperty(profile, 'getDaily', {
	value: async function getDaily(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const dCheck = moment(user.lastDaily).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(profile, 'setDaily', {
	value: async function setDaily(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.lastDaily = moment().toString();
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
		else return hCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(profile, 'setHourly', {
	value: async function setHourly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.lastHourly = moment().toString();
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
		else return wCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(profile, 'setWeekly', {
	value: async function setWeekly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.lastWeekly = moment().toString();
		return user.save();
	},
});

Reflect.defineProperty(profile, 'setVote', {
	value: async function setVote(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.lastVote = moment().toString();
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
		else return vCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(profile, 'setHeal', {
	value: async function setHeal(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.lastHeal = moment().toString();
		return user.save();
	},
});
Reflect.defineProperty(profile, 'getHeal', {
	value: async function getHeal(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const healCheck = moment(user.lastHeal).add(2, 'h');
		if (moment(healCheck).isBefore(now)) return true;
		else return healCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(profile, 'setAttack', {
	value: async function setAttack(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.lastAttack = moment().toString();
		return user.save();
	},
});
Reflect.defineProperty(profile, 'getAttack', {
	value: async function getAttack(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const attackCheck = moment(user.lastAttack).add(1, 'h');
		if (moment(attackCheck).isBefore(now)) return true;
		else return attackCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(profile, 'getProtection', {
	value: async function getProtection(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const now = moment();
		const protection = moment(user.protection);
		if (protection.isAfter(now)) return protection.format('MMM Do HH:mm');
		else return false;
	},
});
Reflect.defineProperty(profile, 'addProtection', {
	/**
	* Add protection to target user
	* @param {string} id - The id of the user.
	* @param {number} hours - Total amount of hours to add to the protection.
	*/
	value: async function addProtection(id, hours) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		let protection;
		const oldProtection = await profile.getProtection(id);
		if (oldProtection) protection = moment(oldProtection, 'MMM Do HH:mm').add(hours, 'h');
		else protection = moment().add(hours, 'h');

		user.protection = moment(protection, 'MMM Do HH:mm').toString();
		user.save();
		return protection.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(profile, 'resetProtection', {
	value: async function resetProtection(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.protection = moment().toString();
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
		if (!colour.startsWith('#')) throw Error('not a valid colour!');

		user.pColour = colour;
		return user.save();
	},
});


// GUILDS
Reflect.defineProperty(guildProfile, 'newGuild', {
	value: async function newGuild(id) {
		const guild = await Guilds.create({
			guild_id: id,
			prefix: prefix,
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


// MISC
Reflect.defineProperty(profile, 'formatNumber', {
	value: function formatNumber(number) {
		const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
		const tier = Math.log10(number) / 3 | 0;

		if (tier == 0) return `**${Math.floor(number)}**`;

		const suffix = SI_SYMBOL[tier];
		const scale = Math.pow(10, tier * 3);

		const scaled = number / scale;
		return `**${scaled.toFixed(2) + suffix}**`;
	},
});

module.exports = { Users, Guilds, profile, guildProfile };