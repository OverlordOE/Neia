const moment = require('moment');
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


		// NumberGame
		reaction: {
			type: DataTypes.JSON,
			defaultValue: JSON.stringify({
				value: 1,
				emoji: '✅',
			}),
			allowNull: false,
		},
		powerCounting: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		lastPowerCounting: {
			type: DataTypes.DATE,
			defaultValue: moment().subtract(1, 'days').toDate(),
			allowNull: false,
		},
		countBoost: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		lastCountBoost: {
			type: DataTypes.DATE,
			defaultValue: moment().subtract(1, 'days').toDate(),
			allowNull: false,
		},
		lastDailyCount: {
			type: DataTypes.DATE,
			defaultValue: moment().subtract(1, 'days').toDate(),
			allowNull: false,
		},
		lastHourlyCount: {
			type: DataTypes.DATE,
			defaultValue: moment().subtract(1, 'days').toDate(),
			allowNull: false,
		},
		lastProtection: {
			type: DataTypes.DATE,
			defaultValue: moment().subtract(1, 'days').toDate(),
			allowNull: false,
		},


		// MISC
		stats: {
			type: DataTypes.JSON,
			defaultValue: JSON.stringify({
				numbersCounted: 0,
				streaksRuined: 0,
				gamblingDone: 0,
				gamblingMoneyLost: 0,
				gamblingMoneyGained: 0,
			}),
			allowNull: false,
		},
		firstCommand: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		lastVote: {
			type: DataTypes.DATE,
			defaultValue: moment().subtract(1, 'days').toDate(),
			allowNull: false,
		},
	},
		{
			timestamps: false,
		});
};