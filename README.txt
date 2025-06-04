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

[ Search ]
-URL
    /search
-Method
    POST
-Request Body
    searchInput as string
    category as string
    location as string


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
    - npm install
    - npm run start

4. (Hanya Test) buka index.html jalankan open with live server
