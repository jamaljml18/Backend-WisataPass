const jwt = require('jsonwebtoken');
const SECRET_KEY = 'rahasia';
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
      const token_id = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '2m' });
      const token_nama = jwt.sign({ nama }, SECRET_KEY, { expiresIn: '2m' });

      return h.response({
        message: 'Login berhasil',
        token_id,
        token_nama,
        userId,
      }); // Kirim token dan userId,
      // return h.response({ message: 'Login berhasil', userId: userId }); // Kirim userId
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

// Handler untuk endpoint add-favorite
const addToFavoriteHandler = async (request, h) => {
  const {
    id_user,
    nama_user,
    id_tempat,
    nama_tempat,
    gambar,
    kategori,
    kota,
    koordinat,
    lat,
    long,
    harga,
    rating,
    waktu,
    deskripsi,
  } = request.payload;

  try {
    // Cek apakah data sudah ada di tabel likes
    const existing = await pool.query(
      'SELECT * FROM likes WHERE id_user = $1 AND id_tempat = $2',
      [id_user, id_tempat],
    );

    if (existing.rowCount > 0) {
      return h
        .response({ message: 'Tempat ini sudah ada di favorit Anda.' })
        .code(409);
    }

    await pool.query(
      `INSERT INTO likes (
        id_user,
        nama_user,
        id_tempat,
        nama_tempat,
        gambar,
        kategori,
        kota,
        koordinat,
        lat,
        long,
        harga,
        rating,
        waktu,
        deskripsi
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        id_user,
        nama_user,
        id_tempat,
        nama_tempat,
        gambar,
        kategori,
        kota,
        koordinat,
        lat,
        long,
        harga,
        rating,
        waktu,
        deskripsi,
      ],
    );

    return h
      .response({ message: 'Tempat berhasil ditambahkan ke favorit.' })
      .code(201);
  } catch (err) {
    console.error('Add to favorite error:', err);
    return h.response({ message: 'Server error' }).code(500);
  }
};

// Handler untuk endpoint favorites/$user
const userFavoritePlace = async (request, h) => {
  try {
    const { id_user } = request.params;
    console.log(id_user);
    const favorites = await pool.query(
      'SELECT * FROM likes WHERE id_user = $1',
      [id_user],
    );

    return h.response(favorites.rows).code(200);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return h.response({ message: 'Server error' }).code(500);
  }
};

// Handler untuk endpoint favorites/delete
const deleteFavoriteHandler = async (request, h) => {
  const { id_user, nama_user, id_tempat, nama_tempat } = request.payload;
  console.log('DELETE FAVORITE PAYLOAD:', {
    id_user,
    nama_user,
    id_tempat,
    nama_tempat,
  });

  try {
    // Hapus dari database
    const result = await pool.query(
      `DELETE FROM likes WHERE id_user = $1 AND nama_user = $2 AND id_tempat = $3 AND nama_tempat = $4`,
      [id_user, nama_user, id_tempat, nama_tempat],
    );

    if (result.rowCount === 0) {
      return h.response({ message: 'Data favorit tidak ditemukan' }).code(404);
    }

    return h.response({ message: 'Tempat favorit berhasil dihapus' }).code(200);
  } catch (error) {
    console.error('Delete favorite error:', error);
    return h.response({ message: 'Server error' }).code(500);
  }
};

module.exports = {
  loginHandler,
  registerHandler,
  addToFavoriteHandler,
  userFavoritePlace,
  deleteFavoriteHandler,
};
