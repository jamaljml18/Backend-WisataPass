// const { nanoid } = require('nanoid');
// const notes = require('./notes');
const fetch = require('node-fetch');

const getRecommendationHandler = async (request, h) => {
  const { username } = request.payload;

  try {
    const res = await fetch('http://127.0.0.1:8000/rekomendasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: username }),
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil rekomendasi');
    }

    const data = await res.json();
    return h
      .response({
        status: 'success',
        recommendations: data.recommendations,
        userID: data.userID,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h
      .response({
        status: 'fail',
        message: 'Gagal mengambil rekomendasi dari sistem',
      })
      .code(500);
  }
};

module.exports = { getRecommendationHandler };
