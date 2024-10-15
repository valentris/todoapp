const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user');
const todoRoutes = require('./routes/todo');
const taskRoutes = require('./routes/task');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});