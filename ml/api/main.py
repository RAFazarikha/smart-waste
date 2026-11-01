import io, time
from pathlib import Path
import torch, torch.nn as nn
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image
from torchvision import models, transforms as T

MODEL = Path(__file__).resolve().parents[1] / "models" / "model.pth"
LABELS = {"organic": "Organic Waste", "paper": "Paper Waste", "plastic": "Plastic Waste"}
tf = T.Compose([T.Resize((224, 224)), T.ToTensor(), T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])
app = FastAPI(title="Smart Waste ML")
net = classes = None

@app.on_event("startup")
def load():
    global net, classes
    if not MODEL.exists(): return  # /health akan melaporkan model_loaded=false
    ck = torch.load(MODEL, map_location="cpu")
    classes = ck["classes"]
    net = models.mobilenet_v2()
    net.classifier = nn.Sequential(nn.Dropout(.3), nn.Linear(net.last_channel, 128), nn.ReLU(),
                                   nn.Dropout(.2), nn.Linear(128, len(classes)))
    net.load_state_dict(ck["state"]); net.eval()

@app.get("/health")
def health(): return {"status": "ok", "model_loaded": net is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if net is None: raise HTTPException(503, "Model belum dimuat")
    if file.content_type not in ("image/jpeg", "image/png"): raise HTTPException(415, "Hanya JPEG/PNG")
    try: img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    except Exception: raise HTTPException(400, "Gambar tidak valid")
    t0 = time.perf_counter()
    with torch.no_grad(): p = torch.softmax(net(tf(img).unsqueeze(0)), 1)[0]
    i = int(p.argmax())
    return {"success": True,
            "prediction": {"class_id": i, "category": classes[i], "label": LABELS[classes[i]],
                           "confidence": round(float(p[i]), 4),
                           "probabilities": {LABELS[c]: round(float(p[j]), 4) for j, c in enumerate(classes)}},
            "inference_time_ms": round((time.perf_counter() - t0) * 1000, 1)}
