module.exports = (sequelize, DataTypes) => {
	return sequelize.define('guilds', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		prefix: {
			type: DataTypes.STRING,
			defaultValue: process.env.PREFIX,
			allowNull: false,
		},
		numberGame: {
			type: DataTypes.JSON,
			defaultValue: JSON.stringify({
				lastUserId: null,
				channelId: null,
				currentNumber: 0,
				lastCheckpoint: 0,
				totalCounted: 0,
				streaksRuined: 0,
				highestStreak: 0,
			}),
			allowNull: true,
		},
	},
		{
			timestamps: false,
		});
};