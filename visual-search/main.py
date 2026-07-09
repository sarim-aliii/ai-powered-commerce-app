from fastapi import FastAPI, File, UploadFile
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
import io
import faiss

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