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
		lastProtection: {
			type: DataTypes.DATE,
			defaultValue: moment().subtract(1, 'days').toDate(),
			allowNull: false,
		},

		// Stats
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
		gamblingDone: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		gamblingMoneyLost: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		gamblingMoneyGained: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},


		// MISC
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