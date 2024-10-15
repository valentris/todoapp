const express = require('express');
const router = express.Router();
const { Task, Todo } = require('../models');
const { verifyToken } = require('../middlewares/auth');

// Set task done
router.put('/:taskId/done', verifyToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isDone = true;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Tambah task
router.post('/:todoId', verifyToken, async (req, res) => {
  const { description } = req.body;
  const { todoId } = req.params;

  try {
    const task = await Task.create({ description, todoId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

// Edit task
router.put('/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;  // Ambil taskId dari URL
  const { description, isDone } = req.body;  // Ambil data yang akan diupdate

  try {
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update hanya properti yang dikirim
    if (description !== undefined) task.description = description;
    if (isDone !== undefined) task.isDone = isDone;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});


// Hapus task
router.delete('/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  console.log('Deleting Task with ID:', taskId); // Log taskId yang ingin dihapus
  console.log('UserID from token:', req.userId);  // Log userId dari token

  try {
    // Cari task berdasarkan ID
    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verifikasi apakah user yang mencoba menghapus task adalah pemilik todo terkait
    const todo = await Todo.findOne({ where: { id: task.todoId, userId: req.userId } });
    console.log('Associated Todo:', todo);  // Log todo terkait task

    if (!todo) {
      return res.status(403).json({ message: 'You are not authorized to delete this task.' });
    }

    // Hapus task
    await task.destroy();
    console.log('Task deleted successfully:', taskId); // Konfirmasi task dihapus
    res.json({ message: 'Task deleted successfully' });

  } catch (error) {
    console.error('Error deleting task:', error);  // Log detail error
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;
