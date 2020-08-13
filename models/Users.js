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
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},
		lastHourly: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},
		lastWeekly: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},
		lastVote: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},
		protection: {
			type: DataTypes.STRING,
			defaultValue: '',
			allowNull: false,
		},


		// MISC
		pColour: {
			type: DataTypes.STRING,
			defaultValue: '#fcfcfc',
			allowNull: false,
		},
		totalEarned: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},


	},
		{
			timestamps: false,
		});
};