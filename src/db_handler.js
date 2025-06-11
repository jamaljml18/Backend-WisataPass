const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const SECRET_KEY = 'rahasia';

const supabaseUrl = 'https://uewsgcufnuwyobxsuozj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVld3NnY3VmbnV3eW9ieHN1b3pqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTYzMjY3NCwiZXhwIjoyMDY1MjA4Njc0fQ.f5FXBZxXmOgd9vS93mw3dY5V3GWsSzmqPVa4OYrpOww';
const supabase = createClient(supabaseUrl, supabaseKey);

const loginHandler = async (request, h) => {
  const { nama, password } = request.payload;

  const { data, error } = await supabase
    .from('users')
    .select('id, password')
    .eq('nama', nama)
    .single();

  if (error || !data) {
    return h.response({ message: 'User tidak ditemukan' }).code(404);
  }

  if (password === data.password) {
    const token_id = jwt.sign({ userId: data.id }, SECRET_KEY, {
      expiresIn: '20m',
    });
    const token_nama = jwt.sign({ nama }, SECRET_KEY, { expiresIn: '20m' });

    return h.response({
      message: 'Login berhasil',
      token_id,
      token_nama,
      userId: data.id,
    });
  } else {
    return h.response({ message: 'Password salah' }).code(401);
  }
};

const registerHandler = async (request, h) => {
  const { nama, password1, password2 } = request.payload;

  if (password1 !== password2) {
    return h.response({ message: 'Password tidak cocok' }).code(400);
  }

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('nama', nama)
    .single();

  if (existingUser) {
    return h.response({ message: 'Nama pengguna sudah terdaftar' }).code(409);
  }

  const { data: lastUser } = await supabase
    .from('users')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  const newId = lastUser ? String(parseInt(lastUser.id) + 1) : '1';

  const { error } = await supabase
    .from('users')
    .insert([{ id: newId, nama, password: password1 }]);

  if (error) {
    console.error('Register error:', error);
    return h.response({ message: 'Server error' }).code(500);
  }

  return h.response({ message: 'Registrasi berhasil' }).code(201);
};

const addToFavoriteHandler = async (request, h) => {
  const payload = request.payload;

  const { data: existing, error: findError } = await supabase
    .from('likes')
    .select('*')
    .eq('id_user', payload.id_user)
    .eq('id_tempat', payload.id_tempat)
    .maybeSingle();

  if (findError) {
    console.error('Find favorite error:', findError);
    return h.response({ message: 'Server error' }).code(500);
  }

  if (existing) {
    return h
      .response({ message: 'Tempat ini sudah ada di favorit Anda.' })
      .code(409);
  }

  const { error } = await supabase.from('likes').insert([payload]);

  if (error) {
    console.error('Add to favorite error:', error);
    return h.response({ message: 'Server error' }).code(500);
  }

  return h
    .response({ message: 'Tempat berhasil ditambahkan ke favorit.' })
    .code(201);
};

const userFavoritePlace = async (request, h) => {
  const { id_user } = request.params;

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('id_user', id_user);

  if (error) {
    console.error('Error fetching favorites:', error);
    return h.response({ message: 'Server error' }).code(500);
  }

  return h.response(data).code(200);
};

const deleteFavoriteHandler = async (request, h) => {
  const { id_user, nama_user, id_tempat, nama_tempat } = request.payload;

  const { error } = await supabase
    .from('likes')
    .delete()
    .match({ id_user, nama_user, id_tempat, nama_tempat });

  if (error) {
    console.error('Delete favorite error:', error);
    return h.response({ message: 'Server error' }).code(500);
  }

  return h.response({ message: 'Tempat favorit berhasil dihapus' }).code(200);
};

module.exports = {
  loginHandler,
  registerHandler,
  addToFavoriteHandler,
  userFavoritePlace,
  deleteFavoriteHandler,
};
