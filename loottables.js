const LootTable = require('loot-table');
module.exports = {
	common() {
		// cost 50
		const loot = new LootTable();
		loot.add({ name: 'Tea', amount: [10, 20] }, 20);
		loot.add({ name: 'Coffee', amount: [7, 15] }, 20);
		loot.add({ name: 'Cake', amount: [5, 10] }, 20);
		loot.add({ name: 'Car', amount: [1, 1] }, 8);
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
		// cost 300
		const loot = new LootTable();
		loot.add({ name: 'Lesser Mana Potion', amount: [5, 10] }, 15);
		loot.add({ name: 'Lesser Healing Potion', amount: [5, 10] }, 15);
		loot.add({ name: 'Healing Potion', amount: [1, 3] }, 15);
		loot.add({ name: 'Healing Potion', amount: [1, 3] }, 15);
		loot.add({ name: 'Sailboat', amount: [1, 2] }, 10);
		loot.add({ name: 'Motorboat', amount: [1, 3] }, 10);
		loot.add({ name: 'Prop plane', amount: [1, 1] }, 8);
		loot.add({ name: 'Jet plane', amount: [1, 1] }, 2);
		loot.add({ name: 'Steal Protection', amount: [2, 4] }, 10);
		return loot.choose();
	},

	epic() {
		// cost 1200
		const loot = new LootTable();
		loot.add({ name: 'Greater Mana Potion', amount: [1, 3] }, 18);
		loot.add({ name: 'Greater Healing Potion', amount: [1, 3] }, 18);
		loot.add({ name: 'Jet Plane', amount: [1, 3] }, 18);
		loot.add({ name: 'Prop Plane', amount: [3, 4] }, 18);
		loot.add({ name: 'House', amount: [1, 3] }, 18);
		loot.add({ name: 'Museum', amount: [1, 1] }, 7);
		loot.add({ name: 'Star', amount: [1, 1] }, 2);
		loot.add({ name: 'Office', amount: [1, 1] }, 1);
		return loot.choose();
	},

	legendary() {
		// cost 8000
		const loot = new LootTable();
		loot.add({ name: 'Greater Mana Potion', amount: [5, 10] }, 15);
		loot.add({ name: 'Greater Healing Potion', amount: [5, 10] }, 15);
		loot.add({ name: 'Jet Plane', amount: [9, 6] }, 15);
		loot.add({ name: 'House', amount: [7, 6] }, 20);
		loot.add({ name: 'Museum', amount: [2, 2] }, 15);
		loot.add({ name: 'Star', amount: [1, 1] }, 15);
		loot.add({ name: 'Office', amount: [1, 1] }, 5);
		return loot.choose();
	},

};