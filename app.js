const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user');
const todoRoutes = require('./routes/todo');
const taskRoutes = require('./routes/task');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});
