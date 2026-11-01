"""Training + evaluasi MobileNetV2 (3 kelas). Jalankan dari folder ml/: python src/train.py"""
import json, time
from pathlib import Path
import torch, torch.nn as nn
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt, seaborn as sns
from torchvision import datasets, models, transforms as T
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix

torch.manual_seed(42)
ROOT = Path(__file__).resolve().parents[1]
DATA, RES, MODEL = ROOT / "data", ROOT / "results", ROOT / "models" / "model.pth"
RES.mkdir(exist_ok=True)
dev = "cuda" if torch.cuda.is_available() else "cpu"
norm = T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
tf_train = T.Compose([T.Resize((224, 224)), T.RandomHorizontalFlip(), T.RandomRotation(15),
                      T.ColorJitter(.2, .2), T.ToTensor(), norm])
tf_eval = T.Compose([T.Resize((224, 224)), T.ToTensor(), norm])
ds = {s: datasets.ImageFolder(DATA / s, tf_train if s == "train" else tf_eval) for s in ("train", "val", "test")}
dl = {s: DataLoader(d, batch_size=32, shuffle=(s == "train"), num_workers=2) for s, d in ds.items()}
classes = ds["train"].classes  # urut alfabet: organic, paper, plastic -> dipakai juga di API

m = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
m.classifier = nn.Sequential(nn.Dropout(.3), nn.Linear(m.last_channel, 128), nn.ReLU(),
                             nn.Dropout(.2), nn.Linear(128, len(classes)))
m.to(dev)
opt = torch.optim.AdamW(m.parameters(), lr=1e-4, weight_decay=1e-4)
loss_fn = nn.CrossEntropyLoss()

def run(split, train=False):
    m.train(train); tot = correct = n = 0
    with torch.set_grad_enabled(train):
        for x, y in dl[split]:
            x, y = x.to(dev), y.to(dev)
            out = m(x); loss = loss_fn(out, y)
            if train: opt.zero_grad(); loss.backward(); opt.step()
            tot += loss.item() * len(y); correct += (out.argmax(1) == y).sum().item(); n += len(y)
    return tot / n, correct / n

hist = {"tl": [], "vl": [], "ta": [], "va": []}
best, bad = 1e9, 0
for ep in range(20):
    tl, ta = run("train", True); vl, va = run("val")
    for k, v in zip(hist, (tl, vl, ta, va)): hist[k].append(v)
    print(f"ep{ep+1} loss {tl:.3f}/{vl:.3f} acc {ta:.3f}/{va:.3f}")
    if vl < best: best, bad = vl, 0; torch.save({"state": m.state_dict(), "classes": classes}, MODEL)
    else:
        bad += 1
        if bad >= 4: break  # early stopping patience=4

m.load_state_dict(torch.load(MODEL)["state"]); m.eval()
ys, ps = [], []
with torch.no_grad():
    for x, y in dl["test"]: ps += m(x.to(dev)).argmax(1).cpu().tolist(); ys += y.tolist()
acc = sum(a == b for a, b in zip(ys, ps)) / len(ys)
rep = classification_report(ys, ps, target_names=classes, output_dict=True)
(RES / "classification_report.json").write_text(json.dumps(rep, indent=2))
cm = confusion_matrix(ys, ps)
plt.figure(figsize=(5, 4)); sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=classes, yticklabels=classes)
plt.xlabel("Prediksi"); plt.ylabel("Aktual"); plt.tight_layout(); plt.savefig(RES / "confusion_matrix.png", dpi=150)
fig, ax = plt.subplots(1, 2, figsize=(10, 4))
ax[0].plot(hist["tl"], label="train"); ax[0].plot(hist["vl"], label="val"); ax[0].set_title("Loss"); ax[0].legend()
ax[1].plot(hist["ta"], label="train"); ax[1].plot(hist["va"], label="val"); ax[1].set_title("Accuracy"); ax[1].legend()
plt.tight_layout(); plt.savefig(RES / "training_curves.png", dpi=150)
(RES / "eval_summary.md").write_text(f"# Evaluasi\n\nTest accuracy: **{acc:.4f}** ({len(ys)} gambar)\n\nKelas: {classes}\n")
print(f"TEST ACCURACY {acc:.4f}")
