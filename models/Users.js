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
		lastDaily: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		lastHourly: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		lastWeekly: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		protection: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		pColour: {
			type: DataTypes.STRING,
			defaultValue: '#fffb00',
			allowNull: false,
		},
		hasVoted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		msgCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		totalEarned: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		totalSpent: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		gamblingEarned: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		gamblingSpent: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		stealingEarned: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		shopSpent: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		botUsage: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},


	},
		{
			timestamps: false,
		});
};