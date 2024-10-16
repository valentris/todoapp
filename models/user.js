module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users', // Explicitly set the correct table name (lowercase 'users')
    timestamps: true,   // If you want createdAt and updatedAt fields to be automatically managed
  });

  return User;
};
