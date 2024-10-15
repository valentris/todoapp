const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  jwt.verify(token.split(' ')[1], 'secret', (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id; // Set userId dari token
    next();
  });
};

module.exports = {
  verifyToken
};