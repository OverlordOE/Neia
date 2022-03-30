const Discord = require('discord.js');
const util = new Discord.Collection();
const items = require('../data/items');
const collectables = require('../data/collectables');
const achievements = require('../data/achievements');

Reflect.defineProperty(util, 'formatNumber', {
	/**
	* Formats the given number to a compressed version with si symbols
	* @param {number} number - The number that needs to be formatted.
	*/
	value: function formatNumber(number) {
		const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
		const tier = Math.log10(number) / 3 | 0;

		if (tier == 0) return `**${Math.floor(number)}**`;

		const suffix = SI_SYMBOL[tier];
		const scale = Math.pow(10, tier * 3);

		const scaled = number / scale;
		return `**${(Math.floor(scaled * 100) / 100) + suffix}**`;
	},
});


Reflect.defineProperty(util, 'getItem', {
	value: function getItem(itemName) {
		const item = itemName.toLowerCase();
		if (items[item]) return items[item];
		else return false;
	},
});

Reflect.defineProperty(util, 'getAchievement', {
	value: function getAchievement(achievementName) {
		const achievement = achievementName.toLowerCase();
		if (achievements[achievement]) return achievements[achievement];
		else return false;
	},
});

Reflect.defineProperty(util, 'getCollectable', {
	value: function getCollectable(collectableName) {
		const collectable = collectableName.toLowerCase();
		if (collectables[collectable]) return collectables[collectable];
		else return false;
	},
});

Reflect.defineProperty(util, 'setEmbedRarity', {
	value: function setEmbedRarity(embed, rarity) {
		const r = rarity.toLowerCase();
		
		if (r == 'uncommon') embed.setColor('#1eff00');
		else if (r == 'rare') embed.setColor('#0070dd');
		else if (r == 'epic') embed.setColor('#a335ee');
		else if (r == 'legendary') embed.setColor('#ff8000');
		else embed.setColor('#eeeeee');
	},
});

module.exports = { util };