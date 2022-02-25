module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_Collectables', {
		user_id: DataTypes.STRING,
		name: DataTypes.STRING,
	}, {
		timestamps: false,
	});
};