const LootTable = require('loot-table');
module.exports = {
	common() {
		// cost 700
		const loot = new LootTable();
		loot.add({ name: 'Rare Chest', amount: [1, 0] }, 0.1);
		loot.add({ name: 'Spiky Rock', amount: [1, 0] }, 1);
		loot.add({ name: 'Scooter', amount: [3, 3] }, 1);
		loot.add({ name: 'Car', amount: [1, 1] }, 1);
		loot.add({ name: 'Motorcycle', amount: [1, 1] }, 1);
		loot.add({ name: 'Profile Colour', amount: [1, 1] }, 1);
		loot.add({ name: 'Sailboat', amount: [1, 0] }, 0.2);
		loot.add({ name: 'Motorboat', amount: [1, 0] }, 0.4);
		loot.add({ name: 'Wooden Club', amount: [1, 0] }, 1);
		return loot.choose();
	},

	rare() {
		// cost 3.5k
		const loot = new LootTable();
		loot.add({ name: 'Wooden Club', amount: [3, 1] }, 1);
		loot.add({ name: 'Common Chest', amount: [4, 2] }, 0.5);
		loot.add({ name: 'Gun', amount: [1, 0] }, 0.3);
		loot.add({ name: 'Healing Potion', amount: [1, 0] }, 1);
		loot.add({ name: 'Healing Potion', amount: [2, 0] }, 0.6);
		loot.add({ name: 'Motorcycle', amount: [7, 3] }, 1);
		loot.add({ name: 'Car', amount: [4, 2] }, 1);
		loot.add({ name: 'Sailboat', amount: [1, 1] }, 1);
		loot.add({ name: 'Motorboat', amount: [3, 1] }, 1);
		loot.add({ name: 'Prop plane', amount: [1, 1] }, 1);
		loot.add({ name: 'Ship', amount: [1, 0] }, 1);
		loot.add({ name: 'Jet plane', amount: [1, 0] }, 0.3);
		loot.add({ name: 'Protection', amount: [1, 0] }, 0.5);
		loot.add({ name: 'Shortbow', amount: [1, 0] }, 0.6);
		loot.add({ name: 'Training Sword', amount: [1, 1] }, 1);
		loot.add({ name: 'Training Staff', amount: [1, 0] }, 1);
		return loot.choose();
	},

	epic() {
		// cost 14k
		const loot = new LootTable();
		loot.add({ name: 'Rare Chest', amount: [3, 2] }, 0.5);
		loot.add({ name: 'Shortbow', amount: [2, 1] }, 1);
		loot.add({ name: 'Healing Potion', amount: [5, 2] }, 1);
		loot.add({ name: 'Water', amount: [1, 0] }, 0.7);
		loot.add({ name: 'Enchanted Waraxe', amount: [1, 0] }, 1);
		loot.add({ name: 'Sailboat', amount: [5, 3] }, 1);
		loot.add({ name: 'Training Sword', amount: [4, 1] }, 1);
		loot.add({ name: 'Training Staff', amount: [4, 1] }, 1);
		loot.add({ name: 'Gun', amount: [2, 0] }, 1);
		loot.add({ name: 'Gun', amount: [2, 1] }, 0.5);
		loot.add({ name: 'Motorboat', amount: [9, 4] }, 1);
		loot.add({ name: 'Ship', amount: [2, 1] }, 0.5);
		loot.add({ name: 'Jet Plane', amount: [2, 0] }, 1);
		loot.add({ name: 'Prop Plane', amount: [3, 3] }, 1);
		loot.add({ name: 'House', amount: [1, 0] }, 1);
		loot.add({ name: 'House', amount: [2, 0] }, 0.4);
		loot.add({ name: 'Protection', amount: [2, 0] }, 1);
		loot.add({ name: 'Museum', amount: [1, 0] }, 0.2);
		loot.add({ name: 'Star', amount: [1, 0] }, 0.1);
		loot.add({ name: 'Rijkszwaard', amount: [1, 0] }, 0.1);
		loot.add({ name: 'Castle', amount: [1, 0] }, 0.09);
		loot.add({ name: 'Office', amount: [1, 0] }, 0.15);
		loot.add({ name: 'Stadium', amount: [1, 0] }, 0.05);
		return loot.choose();
	},

	legendary() {
		// cost 130k
		const loot = new LootTable();
		loot.add({ name: 'Epic Chest', amount: [9, 2] }, 0.5);
		loot.add({ name: 'Rijkszwaard', amount: [1, 0] }, 0.15);
		loot.add({ name: 'Water', amount: [5, 2] }, 1);
		loot.add({ name: 'Jet Plane', amount: [17, 3] }, 1);
		loot.add({ name: 'House', amount: [11, 4] }, 1);
		loot.add({ name: 'Museum', amount: [2, 1] }, 1);
		loot.add({ name: 'Star', amount: [1, 0] }, 1);
		loot.add({ name: 'Star', amount: [2, 0] }, 0.7);
		loot.add({ name: 'Office', amount: [1, 0] }, 0.3);
		loot.add({ name: 'Castle', amount: [1, 0] }, 0.2);
		loot.add({ name: 'Stadium', amount: [1, 0] }, 0.1);
		return loot.choose();
	},

	mystery() {
		// cost 5k
		const loot = new LootTable();
		loot.add({ name: 'Epic Chest', amount: [1, 0] }, 1);
		loot.add({ name: 'Rare Chest', amount: [1, 0] }, 1);
		loot.add({ name: 'Protection', amount: [1, 0] }, 1);
		loot.add({ name: 'Healing Potion', amount: [1, 0] }, 1);
		loot.add({ name: 'House', amount: [1, 0] }, 1);
		loot.add({ name: 'Car', amount: [1, 0] }, 1);
		loot.add({ name: 'Jet Plane', amount: [1, 0] }, 1);
		loot.add({ name: 'Prop Plane', amount: [1, 0] }, 1);
		loot.add({ name: 'Sailboat', amount: [1, 0] }, 1);
		loot.add({ name: 'Museum', amount: [1, 0] }, 0.4);
		loot.add({ name: 'Motorcycle', amount: [1, 0] }, 0.4);
		loot.add({ name: 'Ship', amount: [1, 0] }, 1);
		loot.add({ name: 'Sailboat', amount: [2, 0] }, 1);
		return loot.choose();
	},

};