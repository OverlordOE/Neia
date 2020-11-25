module.exports = {

	warrior: {
		name: 'Warrior',
		colour: '#7d6e33',
		description: 'The warrior uses its overwhelming strength to crush any enemies in its path.\nThis class is mainly focused on strength and melee weapons.',
		stats: {
			base: {
				maxHP: 44,
				maxMP: 36,
				str: 24,
				dex: 18,
				con: 23,
				int: 17,
			},
			growth: {
				maxHP: 13,
				maxMP: 8,
				str: 7,
				dex: 4,
				con: 6,
				int: 4,
			},
		},
		startSkills: ['slash', 'shield'],
		startEquipment: ['training sword', 'training shield'],
	},

	ranger: {
		name: 'Ranger',
		colour: '#28a85c',
		description: 'The ranger prefers to fight from a distance with a bow.\nThis class is mainly focused on dexterity.',
		stats: {
			base: {
				maxHP: 39,
				maxMP: 41,
				str: 19,
				dex: 24,
				con: 19,
				int: 20,
			},
			growth: {
				maxHP: 10,
				maxMP: 11,
				str: 5,
				dex: 7,
				con: 4,
				int: 5,
			},
		},
		startSkills: ['slash', 'shield'],
		startEquipment: ['training sword'],
	},

	wizard: {
		name: 'Wizard',
		colour: '#c515e8',
		description: 'The wizard is a master of the arcane and uses spells too annihilate the enemy.\nThis class is mainly focused on Intelligence.',
		stats: {
			base: {
				maxHP: 36,
				maxMP: 44,
				str: 18,
				dex: 21,
				con: 19,
				int: 24,
			},
			growth: {
				maxHP: 8,
				maxMP: 13,
				str: 4,
				dex: 5,
				con: 5,
				int: 7,
			},
		},
		startSkills: ['slash', 'shield'],
		startEquipment: ['training staff'],
	},


};