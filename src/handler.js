const { nanoid } = require('nanoid');
const notes = require('./notes');
const fetch = require('node-fetch'); // Import fetch untuk HTTP request

const addNoteHandler = async (request, h) => {
  const { title, tags, body } = request.payload;
  // const { body } = request.payload;

  // Kirim request ke FastAPI untuk menghasilkan teks
  let generatedText;
  try {
    const res = await fetch('http://127.0.0.1:8000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: body }),
    });

    const data = await res.json();
    // console.log(data.result);
    generatedText = data.result; // Ambil hasil generate dari FastAPI
  } catch (error) {
    console.error('Gagal terhubung ke API untuk generate teks:', error);
    const response = h.response({
      status: 'fail',
      message: 'Gagal menghasilkan teks dari model',
    });
    response.code(500);
    return response;
  }

  // Simpan hasil generatedText ke dalam catatan
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = {
    title,
    tags,
    body: generatedText, // Isi body dengan teks yang dihasilkan
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan dengan hasil dari AI',
      data: {
        noteId: id,
      },
      result: generatedText,
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

module.exports = { addNoteHandler };
