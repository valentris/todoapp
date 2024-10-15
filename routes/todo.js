const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { Todo, Task } = require('../models');

// GET all todos with tasks
router.get('/', verifyToken, async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { userId: req.userId },  // Ambil todos berdasarkan userId
      include: [{ model: Task, as: 'Tasks' }]  // Sertakan tasks yang terkait
    });
    
    console.log('Todos with tasks from DB:', todos);  // Tambahkan log ini
    res.json(todos);  // Kirim data ke frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
});

// Create new todo with tasks
router.post('/', verifyToken, async (req, res) => {
  const { title, tasks } = req.body;  // Ambil title dan tasks dari request body

  try {
    // Simpan todo baru dengan userId yang disertakan
    const todo = await Todo.create({ 
      title, 
      userId: req.userId  // Ambil userId dari req.userId
    });

    // Jika ada tasks, simpan ke database
    if (tasks && tasks.length > 0) {
      const taskPromises = tasks.map(task =>
        Task.create({ description: task.description, todoId: todo.id })
      );
      await Promise.all(taskPromises);
    }

    // Kembalikan todo beserta tasks-nya sebagai respons
    const todoWithTasks = await Todo.findOne({ 
      where: { id: todo.id }, 
      include: [{ model: Task, as: 'Tasks' }] 
    });

    res.status(201).json(todoWithTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo', error });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const { title, isCompleted } = req.body;

    const todo = await Todo.findOne({ where: { id: todoId, userId: req.userId }, include: [{ model: Task, as: 'Tasks' }] });
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update title dan isCompleted
    todo.title = title;
    
    // Update kolom isCompleted jika semua task selesai
    if (isCompleted !== undefined) {
      todo.isCompleted = isCompleted;
    } else {
      const allTasksDone = todo.Tasks.every(task => task.isDone);
      todo.isCompleted = allTasksDone ? 1 : 0;
    }

    await todo.save();

    // Ambil todo yang baru saja diupdate beserta tasks-nya
    const updatedTodo = await Todo.findOne({
      where: { id: todoId },
      include: [{ model: Task, as: 'Tasks' }]
    });

    res.json(updatedTodo); // Kembalikan todo beserta tasks yang diperbarui
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findOne({ where: { id: todoId, userId: req.userId } });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await todo.destroy();
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

module.exports = router;
