from fastapi import FastAPI, File, UploadFile
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
import io
import faiss
from google import genai
from pydantic import BaseModel
import os
from dotenv import load_dotenv

app = FastAPI()

# 1. Load the ResNet50 model (removing the final layer to get raw features)
base_model = resnet50(weights=ResNet50_Weights.DEFAULT)
model = torch.nn.Sequential(*(list(base_model.children())[:-1]))
model.eval()

# 2. Setup Image processing rules
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 3. Setup the FAISS index (The memory bank)
dimension = 2048
index = faiss.IndexFlatIP(dimension)
product_ids_map = []

def get_image_features(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        return model(tensor).squeeze().numpy()

@app.post("/index-product")
async def index_product(product_id: int, file: UploadFile = File(...)):
    """Saves a product image into the AI's memory bank."""
    image_bytes = await file.read()
    features = get_image_features(image_bytes)

    faiss.normalize_L2(features.reshape(1, -1))
    index.add(features.reshape(1, -1))
    product_ids_map.append(product_id)

    return {"status": "indexed", "product_id": product_id}

@app.post("/search")
async def search_similar(file: UploadFile = File(...)):
    """Looks at an uploaded image and finds similar product IDs."""
    if index.ntotal == 0:
        return {"similar_product_ids": []}

    image_bytes = await file.read()
    features = get_image_features(image_bytes)
    faiss.normalize_L2(features.reshape(1, -1))

    # Find the top 5 closest matches
    distances, indices = index.search(features.reshape(1, -1), 5)

    results = []
    for idx in indices[0]:
        if idx != -1 and idx < len(product_ids_map):
            results.append(product_ids_map[idx])

    return {"similar_product_ids": results}

# --- NEW CUSTOMER SUPPORT CHATBOT CODE ---
load_dotenv(dotenv_path="../.env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env file!")

client = genai.Client(api_key=GEMINI_API_KEY)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def customer_support_chat(request: ChatRequest):
    system_context = """
    You are a friendly, helpful customer support agent for an online e-commerce store.
    Store Rules:
    - Standard shipping takes 3-5 business days. Express takes 1-2 days.
    - We offer a 30-day return policy for unused items in original packaging.
    - If you don't know the answer, politely ask the user to email support@ecommerce.com.
    - Keep your answers concise, professional, and friendly.

    Customer message:
    """

    full_prompt = system_context + request.message

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt,
        )
        return {"reply": response.text}
    except Exception as e:
        print(f"AI Error: {e}")
        return {"reply": "I'm sorry, our support system is currently experiencing issues. Please try again later."}