🛍 Travel Recommendation API Documentation


--- [ 🌐 Base URL ] ---
http://localhost:5000


--- [ 📌 API Endpoint ] ---
[1] /recommendations (Hybrid & Collaborative Filtering)
URL:
 /recommendations
Method:
 POST
Request Body (JSON):
  {
    "user_id": "xnkxvohodhf",            // Didapat dari session storage setelah user login
    "favorite_place": "Monumen Nasional"  // Diambil dari lokasi favorit yang diklik di Section 2
  }
Response: Daftar rekomendasi destinasi untuk user.

[2] /search (Content-Based Filtering)
URL:
 /search
Method:
 POST
Request Body (JSON):
  {
    "searchInput": "taman air",       // Diambil dari input teks
    "category": "Taman Hiburan",      // Diambil dari dropdown kategori
    "location": "DKI Jakarta"         // Diambil dari dropdown lokasi
  }

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

[3] /login 
URL: 
 /login
Method:
 POST
Request Body (JSON)
  {
    "nama": "Sofyan",
    "Password": "Sofyan123"    
  }

[4] /register 
URL: 
 /register
Method:
 POST
Request Body (JSON)
  {
    "nama": "Sofyan",
    "Password1": "Sofyan123",    
    "Password2": "Sofyan123"    
  }

[5] /auth 
URL:
 /auth
Method:
 GET
Parameter
 headers: {
    Authorization: `Bearer ${token}`,
  },
Digunakan untuk mencegah id user memodfikasi session storage jika user melakukan maka user akan dipaksa logout 

[6] /check
URL:
 /auth
Method:
 GET
Parameter
 headers: {
    Authorization: `Bearer ${token}`,
  },
Digunakan untuk mencegah nama user memodfikasi session storage jika user melakukan maka user akan dipaksa logout 

[7] /add-favorite
URL:
 /add-favorit
Method :
 POST
Request Body (JSON)
  {
    id_user: --> membutuhkan fetch ke /auth
    nama_user: --> membutuhkan fetch ke /check
    id_tempat, ------|
    nama_tempat, ----|
    gambar, ---------|
    kategori, -------|
    kota, -----------|
    koordinat, ------|
    lat, ------------|-------> diambil dari elemen html
    long, -----------|
    harga, ----------|
    rating, ---------|
    waktu, ----------|
    deskripsi, ------|
  }

[8] /favorites/{id_user}
URL:
 /favorites/{id_user}
Method:
 GET
Parameter
 const response = await fetch(
    `http://localhost:5000/favorites/${idUser}`,
  );

[9] /delete-favorite
URL: 
 /delete-Favorite
Method: 
  DELETE
Parameter
{
  id_user, --> membutuhkan fetch ke /auth
  nama_user, --> membutuhkan fetch ke /check
  id_tempat, ----|
  nama_tempat, --|----Didapat dari elemen html
}

-- [ 📝 Catatan Tambahan ] --
- `favorite_place` bisa kosong jika user tidak memilih apapun di Section 2.
- Jika `favorite_place` kosong, sistem hanya akan menggunakan collaborative filtering.


-- [ Integrasi Frontend ] --
file destination.html
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
- Harus fecth ke http://localhost:5000/auth untuk mendapatkan nilai dari session storage `authToken`
- Menggunakan `authToken` dari session storage.
- Menampilkan gambar rekomendasi berdasarkan:
  a. Collaborative filtering
  b. Hybrid (Collaborative + Content-Based, jika `favorite_place` ada)

file login.html
- buat codingan seperti ini:
      if (res.ok && data.userId) {
          // sessionStorage.setItem('userId', data.userId);
          sessionStorage.setItem('authTokenNama', data.token_nama);
          sessionStorage.setItem('authTokenId', data.token_id);
          window.location.href = 'destination.html';
      }


--- [ Python Environment ] ---
- Install Dependencies
pip install fastapi uvicorn pandas numpy tensorflow scikit-learn joblib


--- [ Backend - Cara Menjalankan ] ---
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


--- [Database PostgresSQL] ---
user: 'postgres',
host: 'localhost',
database: 'wisatapass',
password: 'postgres',
port: 5432,

1. psql --username=postgres --> Masuk PostgresSQL
2. ...... --> Memasukkan password
3. CREATE DATABASE wisatapass --> Membuat database wisatapass
4. \c wisatapass; --> Menggunakan database wisatapass
5. CREATE TABLE users (
  id TEXT NOT NULL PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
  );
  --> Membuat tabel users
6. \d users --> Melihat detail tabel users 
                  Table "public.users"
      Column  | Type | Collation | Nullable | Default
    ----------+------+-----------+----------+---------
    id       | text |           | not null |
    nama     | text |           | not null |
    password | text |           | not null |
    Indexes:
        "users_pkey" PRIMARY KEY, btree (id)
        "unique_nama" UNIQUE CONSTRAINT, btree (nama)
  7. CREATE TABLE likes (
        id SERIAL PRIMARY KEY,
        id_user TEXT NOT NULL,
        nama_user TEXT NOT NULL,
        id_tempat TEXT NOT NULL,
        nama_tempat TEXT NOT NULL,
        gambar TEXT,
        kategori TEXT,
        kota TEXT,
        koordinat TEXT,
        lat TEXT,
        long TEXT,
        harga TEXT,
        rating TEXT,
        waktu TEXT,
        deskripsi TEXT
    );
    --> Membuat tabel likes
  8. \d likes --> Membuat tabel likes
                                 Table "public.likes"
      Column    |  Type   | Collation | Nullable |              Default
    -------------+---------+-----------+----------+-----------------------------------
    id          | integer |           | not null | nextval('likes_id_seq'::regclass)
    id_user     | text    |           | not null |
    nama_user   | text    |           | not null |
    id_tempat   | text    |           | not null |
    nama_tempat | text    |           | not null |
    gambar      | text    |           |          |
    kategori    | text    |           |          |
    kota        | text    |           |          |
    koordinat   | text    |           |          |
    lat         | text    |           |          |
    long        | text    |           |          |
    harga       | text    |           |          |
    rating      | text    |           |          |
    waktu       | text    |           |          |
    deskripsi   | text    |           |          |
    Indexes:
        "likes_pkey" PRIMARY KEY, btree (id)
