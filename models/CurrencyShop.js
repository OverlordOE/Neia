module.exports = (sequelize, DataTypes) => {
	return sequelize.define('currency_shop', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		emoji: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		rarity: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		picture: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		ctg: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};