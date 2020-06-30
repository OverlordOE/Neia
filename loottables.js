const LootTable = require('loot-table');

module.exports = {
	common() {
		const loot = new LootTable();
		loot.add({ name: 'tea', amount: [10, 20] }, 20);
		loot.add({ name: 'coffee', amount: [7, 15] }, 20);
		loot.add({ name: 'cake', amount: [5, 10] }, 20);
		loot.add({ name: 'car', amount: [1, 1] }, 8);
		loot.add({ name: 'Motorcycle', amount: [1, 2] }, 8);
		loot.add({ name: 'Gun', amount: [1, 3] }, 8);
		loot.add({ name: 'Profile Colour', amount: [1, 2] }, 8);
		loot.add({ name: 'Sailboat', amount: [1, 1] }, 1);
		loot.add({ name: 'Motorboat', amount: [1, 1] }, 1);
		loot.add({ name: 'Lesser Mana Potion', amount: [1, 3] }, 3);
		loot.add({ name: 'Lesser Healing Potion', amount: [1, 3] }, 3);
		return loot.choose();
	},

	rare() {
		const loot = new LootTable();
		loot.add({ name: 'tea', amount: [10, 20] }, 20);
		loot.add({ name: 'coffee', amount: [7, 15] }, 20);
		loot.add({ name: 'cake', amount: [5, 10] }, 20);
		loot.add({ name: 'car', amount: [1, 1] }, 10);
		loot.add({ name: 'Motorcycle', amount: [1, 2] }, 10);
		loot.add({ name: 'Gun', amount: [1, 3] }, 10);
		loot.add({ name: 'Profile Colour', amount: [1, 2] }, 8);
		loot.add({ name: 'Sailboat', amount: [1, 1] }, 1);
		loot.add({ name: 'Motorboat', amount: [1, 1] }, 1);
		return loot.choose();
	},

};