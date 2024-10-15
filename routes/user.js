const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(404).send('User not found');
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid password');
  }

  // Hasilkan token JWT setelah verifikasi berhasil
  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
  res.json({ auth: true, token });  // Kirim token kembali ke client
});

module.exports = router;
