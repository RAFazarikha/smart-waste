"""Ambil 400 gambar/kelas dari dataset Kaggle 'mostafaabla/garbage-classification',
petakan ke 3 kelas, split 70/15/15 (seed 42) ke ml/data/{train,val,test}/<kelas>/.
Pakai: python src/prepare_dataset.py <folder_dataset_mentah>"""
import random, shutil, sys
from pathlib import Path

SEED, PER_CLASS = 42, 400
MAP = {"organic": ["biological"], "plastic": ["plastic"], "paper": ["paper", "cardboard"]}
OUT = Path(__file__).resolve().parents[1] / "data"

def main(raw: Path):
    random.seed(SEED)
    for cls, srcs in MAP.items():
        files = sorted(f for s in srcs for f in (raw / s).glob("*") if f.suffix.lower() in {".jpg", ".jpeg", ".png"})
        assert len(files) >= PER_CLASS, f"{cls}: hanya {len(files)} gambar"
        files = random.sample(files, PER_CLASS)
        n_tr, n_va = int(PER_CLASS * .70), int(PER_CLASS * .15)
        parts = {"train": files[:n_tr], "val": files[n_tr:n_tr + n_va], "test": files[n_tr + n_va:]}
        for split, fs in parts.items():
            d = OUT / split / cls
            d.mkdir(parents=True, exist_ok=True)
            for i, f in enumerate(fs):
                shutil.copy(f, d / f"{cls}_{i:03d}{f.suffix.lower()}")
    for s in ("train", "val", "test"):
        print(s, {c: len(list((OUT / s / c).glob("*"))) for c in MAP})

if __name__ == "__main__":
    main(Path(sys.argv[1]))
