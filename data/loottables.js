const LootTable = require('loot-table');
module.exports = {
	common() {
		// cost 50
		const loot = new LootTable();
		loot.add({ name: 'Tea', amount: [10, 20] }, 21);
		loot.add({ name: 'Coffee', amount: [7, 15] }, 21);
		loot.add({ name: 'Cake', amount: [5, 10] }, 21);
		loot.add({ name: 'Car', amount: [1, 1] }, 8);
		loot.add({ name: 'Motorcycle', amount: [1, 2] }, 9);
		loot.add({ name: 'Gun', amount: [1, 3] }, 9);
		loot.add({ name: 'Profile Colour', amount: [1, 2] }, 9);
		loot.add({ name: 'Sailboat', amount: [1, 1] }, 1);
		loot.add({ name: 'Motorboat', amount: [1, 1] }, 1);

		return loot.choose();
	},

	rare() {
		// cost 300
		const loot = new LootTable();
		loot.add({ name: 'Motorcycle', amount: [6, 5] }, 21);
		loot.add({ name: 'Car', amount: [3, 3] }, 21);
		loot.add({ name: 'Sailboat', amount: [1, 1] }, 21);
		loot.add({ name: 'Motorboat', amount: [1, 3] }, 21);
		loot.add({ name: 'Prop plane', amount: [1, 1] }, 8);
		loot.add({ name: 'Jet plane', amount: [1, 0] }, 2);
		loot.add({ name: 'Steal Protection', amount: [1, 0] }, 4);
		loot.add({ name: 'Steal Protection', amount: [2, 0] }, 2);
		return loot.choose();
	},

	epic() {
		// cost 1200
		const loot = new LootTable();
		loot.add({ name: 'Sailboat', amount: [5, 4] }, 16);
		loot.add({ name: 'Motorboat', amount: [9, 5] }, 16);
		loot.add({ name: 'Jet Plane', amount: [1, 3] }, 16);
		loot.add({ name: 'Prop Plane', amount: [4, 2] }, 16);
		loot.add({ name: 'House', amount: [1, 1] }, 16);
		loot.add({ name: 'Steal Protection', amount: [2, 3] }, 12);
		loot.add({ name: 'Museum', amount: [1, 1] }, 7);
		loot.add({ name: 'Star', amount: [1, 1] }, 2);
		loot.add({ name: 'Office', amount: [1, 1] }, 1);
		return loot.choose();
	},

	legendary() {
		// cost 8000
		const loot = new LootTable();
		loot.add({ name: 'Jet Plane', amount: [9, 6] }, 25);
		loot.add({ name: 'House', amount: [6, 4] }, 25);
		loot.add({ name: 'Museum', amount: [2, 2] }, 25);
		loot.add({ name: 'Star', amount: [1, 0] }, 15);
		loot.add({ name: 'Star', amount: [2, 0] }, 5);
		loot.add({ name: 'Office', amount: [1, 0] }, 5);
		return loot.choose();
	},

};