const { Pool } = require('pg');

// Buat koneksi pool ke database PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wisatapass',
  password: 'postgres',
  port: 5432,
});

// Handler untuk endpoint login
const loginHandler = async (request, h) => {
  const { nama, password } = request.payload;

  try {
    const result = await pool.query(
      'SELECT id, password FROM users WHERE nama = $1',
      [nama],
    );

    if (result.rowCount === 0) {
      return h.response({ message: 'User tidak ditemukan' }).code(404);
    }

    const storedPassword = result.rows[0].password;
    const userId = result.rows[0].id;

    if (password === storedPassword) {
      return h.response({ message: 'Login berhasil', userId: userId });
    } else {
      return h.response({ message: 'Password salah' }).code(401);
    }
  } catch (err) {
    console.error('Login error:', err);
    return h.response({ message: 'Server error' }).code(500);
  }
};

// Handler untuk endpoint register
const registerHandler = async (request, h) => {
  const { nama, password1, password2 } = request.payload;

  if (password1 !== password2) {
    return h.response({ message: 'Password tidak cocok' }).code(400);
  }

  try {
    // Cek apakah user dengan nama yang sama sudah ada
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE nama = $1',
      [nama],
    );
    if (existingUser.rowCount > 0) {
      return h.response({ message: 'Nama pengguna sudah terdaftar' }).code(409);
    }

    // Ambil ID terakhir
    const result = await pool.query(
      'SELECT id FROM users ORDER BY id DESC LIMIT 1',
    );
    let newId = '1';
    if (result.rowCount > 0) {
      const lastId = parseInt(result.rows[0].id, 10);
      newId = String(lastId + 1);
    }

    // Simpan user baru
    await pool.query(
      'INSERT INTO users (id, nama, password) VALUES ($1, $2, $3)',
      [newId, nama, password1],
    );

    return h.response({ message: 'Registrasi berhasil' }).code(201);
  } catch (err) {
    console.error('Register error:', err);
    return h.response({ message: 'Server error' }).code(500);
  }
};

module.exports = { loginHandler, registerHandler };
