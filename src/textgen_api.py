from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

app = FastAPI()

# CORS biar bisa diakses dari Node.js (localhost beda port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model 
generator = pipeline("text-generation", model="Salesforce/codegen-350M-multi")

@app.post("/generate")
async def generate_text(request: Request):
    body = await request.json()
    prompt = body.get("prompt", "")
    result = generator(prompt, max_length=100, do_sample=True)[0]["generated_text"]
    return {"result": result}
