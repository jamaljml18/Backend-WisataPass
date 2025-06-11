const jwt = require('jsonwebtoken');
const SECRET_KEY = 'rahasia';

// Handler untuk endpoint auth - verifikasi token JWT (getAuthToLogin)
const getAuthToLoginHandler = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return h.response({ message: 'Token tidak ditemukan' }).code(401);
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return h
      .response({ message: 'Token valid', userId: decoded.userId })
      .code(200);
  } catch (err) {
    console.error('Auth error:', err);
    return h
      .response({ message: 'Token tidak valid atau kedaluwarsa' })
      .code(401);
  }
};

const checkUserHandler = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return h.response({ message: 'Token tidak ditemukan' }).code(401);
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return h.response({ message: 'Token valid', nama: decoded.nama }).code(200);
  } catch (err) {
    console.error('Auth error:', err);
    return h
      .response({ message: 'Token tidak valid atau kedaluwarsa' })
      .code(401);
  }
};

module.exports = { getAuthToLoginHandler, checkUserHandler };
