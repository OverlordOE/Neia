module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_character', {
		user_id: DataTypes.STRING,
		name: DataTypes.STRING,
		nickname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lvl: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1,
		},
		exp: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	},
		{
			timestamps: false,
		});
};