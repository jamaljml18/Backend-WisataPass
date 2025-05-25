# recomendation.py
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import json
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split

app = FastAPI()

# Load data once
with open("data.json", "r") as f:
    data_loaded = json.load(f)

df = pd.DataFrame(data_loaded)
reader = Reader(rating_scale=(1, 5))
dataset = Dataset.load_from_df(df[["userID", "itemID", "rating"]], reader)
trainset, _ = train_test_split(dataset, test_size=0.2)

# Train model once
model = SVD()
model.fit(trainset)

all_wisata = ['Bali', 'Lombok', 'Bandung', 'Yogyakarta', 'Raja Ampat']

# Define request schema
class RekomendasiRequest(BaseModel):
    userID: str

@app.post("/rekomendasi")
def rekomendasi(request_data: RekomendasiRequest):
    user_id = request_data.userID

    rated_items = df[df['userID'] == user_id]['itemID'].tolist()
    rekomendasi = []

    if rated_items:
        # User lama
        unrated_items = [item for item in all_wisata if item not in rated_items]
        for item in unrated_items:
            pred = model.predict(user_id, item)
            # Cari info wisata di data_loaded
            info = next((d for d in data_loaded if d["itemID"] == item), {})
            rekomendasi.append({
                "item": item,
                "rating": round(pred.est, 2),
                "harga": info.get("harga", "-"),
                "deskripsi": info.get("deskripsi", "-")
            })
    else:
        # User baru
        for item in all_wisata:
            pred = model.predict(user_id, item)
            info = next((d for d in data_loaded if d["itemID"] == item), {})
            rekomendasi.append({
                "item": item,
                "rating": round(pred.est, 2),
                "harga": info.get("harga", "-"),
                "deskripsi": info.get("deskripsi", "-")
            })

    rekomendasi.sort(key=lambda x: x["rating"], reverse=True)
    return {"userID": user_id, "recommendations": rekomendasi}
# def rekomendasi(request_data: RekomendasiRequest):
#     user_id = request_data.userID

#     rated_items = df[df['userID'] == user_id]['itemID'].tolist()
#     rekomendasi = []

#     if rated_items:
#         # User lama
#         unrated_items = [item for item in all_wisata if item not in rated_items]
#         for item in unrated_items:
#             pred = model.predict(user_id, item)
#             rekomendasi.append({"item": item, "rating": round(pred.est, 2)})
#     else:
#         # User baru
#         for item in all_wisata:
#             pred = model.predict(user_id, item)
#             rekomendasi.append({"item": item, "rating": round(pred.est, 2)})

#     rekomendasi.sort(key=lambda x: x["rating"], reverse=True)
#     return {"userID": user_id, "recommendations": rekomendasi}
