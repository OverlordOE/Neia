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
		msgCount: {
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
		
	},
	{
		timestamps: false,
	});
};