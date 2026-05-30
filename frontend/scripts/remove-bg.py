#!/usr/bin/env python3
"""
Remove the background from a folder of frames.

Used for the /about 360-degree face-rotation backdrop: it reads the
opaque WebP frames and writes transparent (RGBA) WebP cutouts, so the
portrait floats over the page's dark void instead of sitting on a solid
plate. Originals in --in are never modified — output goes to --out.

Requires: rembg + onnxruntime + Pillow
  python -m pip install "rembg[cpu]" pillow

Usage:
  python scripts/remove-bg.py --in public/about/frames --out .cutout
  python scripts/remove-bg.py --in public/about/frames --out .cutout --alpha-matting
"""
import argparse
import glob
import os
import sys


def main() -> None:
    ap = argparse.ArgumentParser(description="Batch background removal.")
    ap.add_argument("--in", dest="inp", required=True, help="input folder")
    ap.add_argument("--out", dest="out", required=True, help="output folder")
    ap.add_argument(
        "--model",
        default="isnet-general-use",
        help="rembg model (isnet-general-use | u2net | u2net_human_seg)",
    )
    ap.add_argument(
        "--alpha-matting",
        action="store_true",
        help="slower, softer edges (better for hair)",
    )
    ap.add_argument("--quality", type=int, default=92)
    args = ap.parse_args()

    try:
        from rembg import remove, new_session
        from PIL import Image
    except Exception as exc:  # noqa: BLE001
        print("Missing dependencies:", exc)
        print('Install with:  python -m pip install "rembg[cpu]" pillow')
        sys.exit(1)

    patterns = ("*.webp", "*.png", "*.jpg", "*.jpeg")
    files = sorted(
        f for p in patterns for f in glob.glob(os.path.join(args.inp, p))
    )
    if not files:
        print("No input frames found in", args.inp)
        sys.exit(1)

    os.makedirs(args.out, exist_ok=True)
    print(f"Loading model '{args.model}' (first run downloads it)...")
    session = new_session(args.model)

    total = len(files)
    for i, f in enumerate(files, 1):
        name = os.path.splitext(os.path.basename(f))[0] + ".webp"
        dst = os.path.join(args.out, name)
        img = Image.open(f).convert("RGBA")
        cut = remove(
            img,
            session=session,
            post_process_mask=True,
            alpha_matting=args.alpha_matting,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10,
        )
        cut.save(dst, "WEBP", quality=args.quality, method=6)
        if i == 1 or i % 10 == 0 or i == total:
            print(f"  {i}/{total}  {name}")

    print(f"Done: {total} cutouts -> {args.out}")


if __name__ == "__main__":
    main()
