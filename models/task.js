module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    todoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'tasks',  // Specify the correct table name here (lowercase 'task')
    timestamps: true,   // If you have `createdAt` and `updatedAt` in your table
  });

  // Relasi: Task belongs to a Todo
  Task.associate = (models) => {
    Task.belongsTo(models.Todo, {
      foreignKey: 'todoId',
      onDelete: 'CASCADE'
    });
  };

  return Task;
};
