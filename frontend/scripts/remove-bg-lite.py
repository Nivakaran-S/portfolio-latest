#!/usr/bin/env python3
"""
Lean background removal — runs a U2Net ONNX model directly with only
onnxruntime + numpy + pillow (no rembg / opencv / scipy / scikit-image).
Built for slow connections: the U2Net-P model is ~4.5 MB.

Reads opaque frames from --in and writes transparent (RGBA) WebP cutouts
to --out. Originals are never modified.

Install (into an isolated, non-PlatformIO venv):
  py -3 -m venv c:\\tmp\\bgvenv
  c:\\tmp\\bgvenv\\Scripts\\python -m pip install onnxruntime numpy pillow

Model (U2Net-P, 4.5 MB):
  https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx

Usage:
  python scripts/remove-bg-lite.py --in public/about/frames --out .cutout \\
      --model c:/tmp/models/u2netp.onnx
"""
import argparse
import glob
import os
import sys

import numpy as np
from PIL import Image
import onnxruntime as ort

# ImageNet normalisation used by U2Net.
_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float64)
_STD = np.array([0.229, 0.224, 0.225], dtype=np.float64)
_SIZE = 320


def predict_mask(session: "ort.InferenceSession", inp_name: str, img: Image.Image) -> Image.Image:
    """Return a soft grayscale matte (L mode) at the image's native size."""
    small = img.convert("RGB").resize((_SIZE, _SIZE), Image.LANCZOS)
    arr = np.array(small).astype(np.float64)
    peak = arr.max()
    arr = arr / (peak if peak > 0 else 1.0)
    arr = (arr - _MEAN) / _STD
    arr = arr.transpose(2, 0, 1)[np.newaxis].astype(np.float32)

    out = session.run(None, {inp_name: arr})[0]
    pred = out[0, 0] if out.ndim == 4 else out[0]
    lo, hi = float(pred.min()), float(pred.max())
    pred = (pred - lo) / (hi - lo + 1e-8)

    mask = Image.fromarray((pred * 255).astype(np.uint8), mode="L")
    return mask.resize(img.size, Image.LANCZOS)


def main() -> None:
    ap = argparse.ArgumentParser(description="Lean U2Net background removal.")
    ap.add_argument("--in", dest="inp", required=True)
    ap.add_argument("--out", dest="out", required=True)
    ap.add_argument("--model", required=True, help="path to u2netp.onnx")
    ap.add_argument("--quality", type=int, default=92)
    args = ap.parse_args()

    if not os.path.isfile(args.model):
        print("Model not found:", args.model)
        sys.exit(1)

    patterns = ("*.webp", "*.png", "*.jpg", "*.jpeg")
    files = sorted(f for p in patterns for f in glob.glob(os.path.join(args.inp, p)))
    if not files:
        print("No input frames found in", args.inp)
        sys.exit(1)

    os.makedirs(args.out, exist_ok=True)
    session = ort.InferenceSession(args.model, providers=["CPUExecutionProvider"])
    inp_name = session.get_inputs()[0].name

    total = len(files)
    for i, f in enumerate(files, 1):
        img = Image.open(f).convert("RGBA")
        img.putalpha(predict_mask(session, inp_name, img))
        dst = os.path.join(args.out, os.path.splitext(os.path.basename(f))[0] + ".webp")
        img.save(dst, "WEBP", quality=args.quality, method=6)
        if i == 1 or i % 10 == 0 or i == total:
            print(f"  {i}/{total}")

    print(f"Done: {total} cutouts -> {args.out}")


if __name__ == "__main__":
    main()
