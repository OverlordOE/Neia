module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_character', {
		user_id: DataTypes.STRING,
		character_id: DataTypes.STRING,
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
		hp: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1,
		},
		mp: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1,
		},
		str: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1,
		},
		dex: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1,
		},
		con: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1,
		},
		int: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 1,
		},
	}, 
	{
		timestamps: false,
	});
};