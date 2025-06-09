# pip install fastapi uvicorn pandas numpy tensorflow scikit-learn joblib
import tensorflow as tf
from tensorflow.keras import layers

import pandas as pd
import numpy as np
import joblib

from fastapi import FastAPI, Request  # Tambahkan ini
from IPython.display import display

app = FastAPI() 

@tf.keras.utils.register_keras_serializable()
class RecommenderNet(tf.keras.Model):
    def __init__(self, num_users, num_places, embedding_size, dropout_rate, **kwargs):
        super().__init__(**kwargs)

        self.num_users = num_users
        self.num_places = num_places
        self.embedding_size = embedding_size
        self.dropout_rate = dropout_rate

        self.user_embedding = layers.Embedding(
            num_users,
            embedding_size,
            embeddings_initializer='he_normal',
            embeddings_regularizer=tf.keras.regularizers.l2(1e-4)
        )
        self.user_bias = layers.Embedding(num_users, 1)

        self.place_embedding = layers.Embedding(
            num_places,
            embedding_size,
            embeddings_initializer='he_normal',
            embeddings_regularizer=tf.keras.regularizers.l2(1e-4)
        )
        self.place_bias = layers.Embedding(num_places, 1)

        self.dropout = layers.Dropout(dropout_rate)

    def call(self, inputs):
        user_vector = self.user_embedding(inputs[:, 0])
        user_vector = self.dropout(user_vector)

        user_bias = self.user_bias(inputs[:, 0])
        place_vector = self.place_embedding(inputs[:, 1])
        place_vector = self.dropout(place_vector)

        place_bias = self.place_bias(inputs[:, 1])

        dot_user_place = tf.reduce_sum(user_vector * place_vector, axis=1, keepdims=True)
        x = dot_user_place + user_bias + place_bias
        return tf.squeeze(x, axis=1)

    def get_config(self):
        config = super().get_config()
        config.update({
            'num_users': self.num_users,
            'num_places': self.num_places,
            'embedding_size': self.embedding_size,
            'dropout_rate': self.dropout_rate,
        })
        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)
    
#Content-Based Filtering
cosine_sim_df = joblib.load('models/cosine_sim_df.pkl')
cb_df = pd.read_csv('data/cb_df.csv')

#Collaborative Filtering
model = tf.keras.models.load_model(
    'models/collab_model.keras',
    custom_objects={'RecommenderNet': RecommenderNet}
)

user_to_user_encoded = joblib.load('models/user_to_user_encoded.pkl')
place_to_place_encoded = joblib.load('models/place_to_place_encoded.pkl')

destinasi_df = pd.read_csv('data/destinasi_df.csv')
train_data = pd.read_csv('data/train_data.csv')
rating_df = pd.read_csv('data/rating_df.csv')
val_data = pd.read_csv('data/val_data.csv')

def content_based_recommendations(place_name, similarity_data=cosine_sim_df, items=cb_df, k=5):
    # Validasi input
    if place_name not in items['Place_Name'].values:
        return pd.DataFrame()

    # Ambil index tempat
    index = items[items['Place_Name'] == place_name].index[0]

    # Ambil similarity scores
    sim_scores = list(enumerate(similarity_data.iloc[index]))

    # Urutkan tempat berdasarkan similarity
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Ambil top-k tempat (skip tempat pertama karena itu tempat itu sendiri)
    sim_scores = sim_scores[1:k+1]

    # Ambil Place_Id
    place_indices = [i[0] for i in sim_scores]
    place_ids = items.iloc[place_indices]['Place_Id'].tolist()

    return place_ids

def collaborative_filtering_recommendations(user_id, n=5):
    # Validasi user
    if user_id not in user_to_user_encoded:
        return pd.DataFrame()

    # Encode user ID
    user_encoded = user_to_user_encoded[user_id]

    # Generate semua tempat
    place_ids = rating_df['Place_Id'].unique()

    # Filter tempat yang belum dikunjungi
    visited_places = rating_df[rating_df['User_Id'] == user_id]['Place_Id']
    place_ids_unvisited = [p for p in place_ids if p not in visited_places]

    # Encode tempat yang belum dikunjungi
    place_encoded_unvisited = [
        place_to_place_encoded[p] for p in place_ids_unvisited
        if p in place_to_place_encoded
    ]

    # Buat input model
    user_place_array = np.array([[user_encoded, p_enc] for p_enc in place_encoded_unvisited])

    # Prediksi rating
    ratings = model.predict(user_place_array).flatten()

    # Ambil top-n rating tertinggi
    top_ratings_indices = ratings.argsort()[-n:][::-1]
    recommended_place_ids = [place_ids_unvisited[i] for i in top_ratings_indices]

    return recommended_place_ids

def get_travel_recommendations(user_id, favorite_place=None):
    # Daftar untuk menyimpan semua rekomendasi
    all_recommendations = []

    # 1. Dapatkan rekomendasi collaborative filtering
    cf_recs = collaborative_filtering_recommendations(user_id)
    all_recommendations.extend(cf_recs)

    # 2. Dapatkan rekomendasi content-based jika ada favorite_place
    if favorite_place:
        cb_recs = content_based_recommendations(favorite_place)
        all_recommendations.extend(cb_recs)

    # Hapus duplikat dan konversi ke set
    unique_recommendations = list(set(all_recommendations))

    # 3. Gabungkan dengan dataset utama menggunakan Place_Id
    recommendations_df = destinasi_df[
        destinasi_df['Place_Id'].isin(unique_recommendations)
    ]

    # 4. Tambahkan flag sumber rekomendasi
    recommendations_df['Recommendation_Source'] = 'Hybrid'
    recommendations_df.loc[
        recommendations_df['Place_Id'].isin(cf_recs), 'Recommendation_Source'
    ] = 'Collaborative'

    if favorite_place:
        recommendations_df.loc[
            recommendations_df['Place_Id'].isin(cb_recs), 'Recommendation_Source'
        ] = 'Content-Based'

    return recommendations_df

#IMPLEMENTASI DENGAN MENGGGABUNGKAN 2 PENDEKATAN YANG LEBIH FLEKSIBEL

# Untuk user baru tanpa favorite place
# new_user_recs = get_travel_recommendations(user_id=1)

# # Untuk user dengan favorite place
# user_recs = get_travel_recommendations(
#     user_id= 3,
#     favorite_place= "Monumen Nasional"
# )

# print("Rekomendasi untuk user dengan favorite place 'Monumen Nasional':")
# from IPython.display import display
# display(user_recs)

# print("Rekomendasi untuk user baru (tanpa favorite place):")
# display(new_user_recs)

#IMPLEMENTASI HANYA BERDASARKAN CONTENT DESTINASINYA DENGAN INPUT KATEGORI NAMA ATAU KOTA
def infer_cbf_search(query, top_k=10):
    """
    Fungsi inference Content-Based Filtering berdasarkan kata kunci yang boleh lebih dari satu kata,
    dicocokkan ke kolom nama tempat, kategori, atau kota secara individual.
    """
    keywords = query.lower().strip().split()

    # Buat mask boolean awal dengan False
    mask = pd.Series([False] * len(cb_df))

    for keyword in keywords:
        mask |= (
            cb_df['Place_Name'].str.lower().str.contains(keyword) |
            cb_df['Category'].str.lower().str.contains(keyword) |
            cb_df['City'].str.lower().str.contains(keyword)
        )

    relevant_places = cb_df[mask]

    if relevant_places.empty:
        return []

    recommendations = []
    for idx, place in relevant_places.iterrows():
        sim_scores = cosine_sim_df.iloc[idx]
        top_similar = sorted(
            enumerate(sim_scores),
            key=lambda x: x[1],
            reverse=True
        )[1:top_k + 1]

        for similar_idx, score in top_similar:
            recommended_place = cb_df.iloc[similar_idx][['Place_Id']].copy()
            recommended_place['Similarity_Score'] = round(score, 4)
            recommended_place['Search_Match'] = place['Place_Name']
            recommendations.append(recommended_place)

    rec_df = pd.DataFrame(recommendations)
    rec_df = rec_df.sort_values('Similarity_Score', ascending=False)
    rec_df = rec_df.drop_duplicates(subset=['Place_Id']).head(top_k)

    merged_df = pd.merge(rec_df, destinasi_df, on='Place_Id', how='left')

    return merged_df.to_dict(orient='records')
# place = "taman sungai mud budya jakrta"
# hasil = infer_cbf_search(place, top_k=5)
# display(hasil)

@app.post("/recommendations")
async def recommendations(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    favorite_place = body.get("favorite_place")
    print(user_id)
    print(favorite_place)

    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return {"user_id": user_id, "recommendations": []}

    result = get_travel_recommendations(user_id, favorite_place)
    return {"user_id": user_id, "recommendations": result.to_dict(orient='records')}

@app.post("/search")
async def search(request: Request):
    body = await request.json()
    place = body.get("place")
    result = infer_cbf_search(place)
    return {"query": place, "results": result}