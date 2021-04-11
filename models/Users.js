module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},

		lastVote: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},
		
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		numbersCounted: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		streaksRuined: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},

		// MISC
		firstCommand: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
		{
			timestamps: false,
		});
};