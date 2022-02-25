module.exports = (sequelize, DataTypes) => {
	return sequelize.define('guilds', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		numberGame: {
			type: DataTypes.JSON,
			defaultValue: JSON.stringify({
				lastUserId: null,
				channelId: null,
				currentNumber: 0,
				lastCheckpoint: 0,
				nextCheckpoint: 50,
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