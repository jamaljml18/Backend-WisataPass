-- ((API)) --
http://localhost:5000

[ Recommendation ]
-URL
    /recommendations
-Method 
    POST
-Request Body
    user_id as string, 
    favorite_place as string

user_id nanti diambil dari session storage setelah user login
favorite_place diambil dari div yang berada di section favorite
- section 1 (search input, category dropdown, dan location dropdown, dan button search setelah button search di klik muncul rekomendasinya berdasarkan hasil search)
- section 2 (Menampilkan beberapa lokasi favorit, jika salah satu lokasi di klik, favorite_place akan berisi lokasi itu, tidak bisa mengelike lebih dari satu)
- section 3 (karena user_id sudah diambil dari setelah login, maka section 3 berisi gambar rekomendasi dari fitur ml collaborative dan hybrid)

[ Search ]
-URL
    /search
-Method
    POST
-Request Body
    searchInput as string
    category as string
    location as string
searchInput diambil dari input
category diambil dari dropdown dengan pilihan pilihan:
    - Budaya
    - Taman Hiburan
    - Cagar Alam
    - Bahari
    - Pusat Perbelanjaan
    - Tempat Ibadah
locatin diambil dari dropdown
    - Jawa Tengah
    - Jawa Barat
    - DKI Jakarta
    - Jawa Timur
    - DIY
    - Banten


-- ((Python)) -- 
[ install ]
pip install fastapi uvicorn pandas numpy tensorflow scikit-learn joblib


-- ((Backend)) --
[ Cara Menjalankan ]
1. Buka 2 terminal
2. Buka Terminal ke 1 untuk Python
    - cd src
    - uvicorn api_inference:app

3. Buka Terminal ke 2 untuk js
    - npm install - jika sudah ada node_modules tidak perlu
    - npm run start

4. (Hanya Test) buka index.html jalankan open with live server
