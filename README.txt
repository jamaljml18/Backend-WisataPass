🛍 Travel Recommendation API Documentation

-- [ 🌐 Base URL ] --

http://localhost:5000


-- [ 📌 API Endpoint ] --

[1] /recommendations (Hybrid & Collaborative Filtering)

URL:
 /recommendations

Method:
 POST

Request Body (JSON):
  {
    "user_id": "3",            // Didapat dari session storage setelah user login
    "favorite_place": "Monumen Nasional"  // Diambil dari lokasi favorit yang diklik di Section 2
  }
Response: Daftar rekomendasi destinasi untuk user.

[2] /search (Content-Based Filtering)

URL:
/search

Method:
`POST`

Request Body (JSON):
  {
    "searchInput": "taman air",       // Diambil dari input teks
    "category": "Taman Hiburan",      // Diambil dari dropdown kategori
    "location": "DKI Jakarta"         // Diambil dari dropdown lokasi
  }
  ```

- Kategori (Category) Tersedia:

  * Budaya
  * Taman Hiburan
  * Cagar Alam
  * Bahari
  * Pusat Perbelanjaan
  * Tempat Ibadah

- Lokasi (Location) Tersedia:

  * Jawa Tengah
  * Jawa Barat
  * DKI Jakarta
  * Jawa Timur
  * DIY
  * Banten

-- [ 📝 Catatan Tambahan ] --

- `favorite_place` bisa kosong jika user tidak memilih apapun di Section 2.
- Jika `favorite_place` kosong, sistem hanya akan menggunakan collaborative filtering.


-- [ Integrasi Frontend ] --

(Section 1 – Search Section)

- Komponen:

  a. Input teks pencarian
  b. Dropdown kategori
  c. Dropdown lokasi
  d. Tombol "Search"
    Hasil: Menampilkan rekomendasi berdasarkan content-based filtering.

(Section 2 – Favorite Locations)

- Menampilkan beberapa lokasi populer.
- Ketika salah satu diklik:

  a. Disimpan sebagai `favorite_place`
  b. Hanya satu lokasi yang bisa dipilih (tidak multi-select)

(Section 3 – ML-Based Recommendations)

- Menggunakan `user_id` dari session storage (setelah login).
- Menampilkan gambar rekomendasi berdasarkan:

  a. Collaborative filtering
  b. Hybrid (Collaborative + Content-Based, jika `favorite_place` ada)


-- [ Python Environment ] --

- Install Dependencies
pip install fastapi uvicorn pandas numpy tensorflow scikit-learn joblib


-- [ Backend - Cara Menjalankan ] --

1. Buka 2 Terminal

2. Terminal 1 (Python Backend):

   cd src
   uvicorn api_inference:app

3. Terminal 2 (Frontend):

   - npm install       # Lewati jika sudah ada node_modules
   - npm run start

4. (Opsional - Testing HTML Langsung)

   - Buka `index.html`
   - Jalankan dengan fitur **"Open with Live Server"**
