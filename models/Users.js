module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		

		// COOLDOWNS
		lastDaily: {
			type: DataTypes.DATE,
			defaultValue: 0,
			allowNull: false,
		},
		lastHourly: {
			type: DataTypes.DATE,
			defaultValue: 0,
			allowNull: false,
		},
		lastWeekly: {
			type: DataTypes.DATE,
			defaultValue: 0,
			allowNull: false,
		},
		lastVote: {
			type: DataTypes.DATE,
			defaultValue: 0,
			allowNull: false,
		},
		protection: {
			type: DataTypes.DATE,
			defaultValue: 0,
			allowNull: false,
		},
		

		// MISC
		pColour: {
			type: DataTypes.STRING,
			defaultValue: '#fcfcfc',
			allowNull: false,
		},


	},
		{
			timestamps: false,
		});
};