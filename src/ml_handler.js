const fetch = require('node-fetch');

// Handler untuk endpoint rekomendasi
const getRecommendationHandler = async (request, h) => {
  const { user_id, favorite_place } = request.payload;

  try {
    const res = await fetch('http://127.0.0.1:8000/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, favorite_place }),
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil rekomendasi');
    }

    const data = await res.json();
    return h
      .response({
        status: 'success',
        user_id: data.user_id,
        recommendations: data.recommendations,
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

// Handler untuk endpoint search
const searchPlaceHandler = async (request, h) => {
  const { searchInput, category, location } = request.payload;

  // Gabungkan ketiganya menjadi satu string
  const place = `${searchInput} ${category} ${location}`.trim();

  try {
    const res = await fetch('http://127.0.0.1:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ place }),
    });

    if (!res.ok) {
      throw new Error('Gagal melakukan pencarian');
    }

    const data = await res.json();
    return h
      .response({
        status: 'success',
        query: data.query,
        results: data.results,
      })
      .code(200);
  } catch (error) {
    console.error('Error:', error);
    return h
      .response({
        status: 'fail',
        message: 'Gagal mengambil hasil pencarian dari sistem',
      })
      .code(500);
  }
};

module.exports = {
  getRecommendationHandler,
  searchPlaceHandler,
};
