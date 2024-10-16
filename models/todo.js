module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER,  // userId disimpan sebagai foreign key
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'todos',  // Specify the correct table name here
    timestamps: true,   // If you want Sequelize to manage `createdAt` and `updatedAt`
  });

  Todo.associate = function(models) {
    Todo.hasMany(models.Task, { as: 'Tasks', foreignKey: 'todoId' });
  };

  return Todo;
};
