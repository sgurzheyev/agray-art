#!/usr/bin/env python3
"""Key the black plate out of the chrome AG so the header can use the same mark as the hero."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "brand" / "ag-logo.webp"
CLEAR_PNG = ROOT / "public" / "brand" / "ag-logo-clear.png"
CLEAR_WEBP = ROOT / "public" / "brand" / "ag-logo-clear.webp"

# Soft luma key: field black becomes alpha 0; chrome stays opaque.
BLACK = 8.0
SOFT = 36.0
PAD = 12


def punch(rgb: np.ndarray) -> np.ndarray:
    r = rgb[:, :, 0].astype(np.float32)
    g = rgb[:, :, 1].astype(np.float32)
    b = rgb[:, :, 2].astype(np.float32)
    luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    alpha = np.clip((luma - BLACK) / (SOFT - BLACK), 0.0, 1.0)
    rgba = np.dstack([rgb, np.round(alpha * 255.0)]).astype(np.uint8)
    return rgba


def crop_square(rgba: np.ndarray) -> np.ndarray:
    alpha = rgba[:, :, 3]
    ys, xs = np.where(alpha > 12)
    if xs.size == 0:
        return rgba
    y0, y1 = max(0, int(ys.min()) - PAD), min(rgba.shape[0], int(ys.max()) + PAD + 1)
    x0, x1 = max(0, int(xs.min()) - PAD), min(rgba.shape[1], int(xs.max()) + PAD + 1)
    cropped = rgba[y0:y1, x0:x1]
    h, w = cropped.shape[:2]
    side = max(h, w)
    canvas = np.zeros((side, side, 4), dtype=np.uint8)
    oy, ox = (side - h) // 2, (side - w) // 2
    canvas[oy : oy + h, ox : ox + w] = cropped
    return canvas


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"missing source mark: {SOURCE}")
    rgb = np.array(Image.open(SOURCE).convert("RGB"))
    rgba = crop_square(punch(rgb))
    image = Image.fromarray(rgba, "RGBA")
    image.save(CLEAR_PNG, "PNG")
    image.save(CLEAR_WEBP, "WEBP", lossless=True, quality=100)
    print(f"punched chrome AG {tuple(rgba.shape[1::-1])} -> {CLEAR_WEBP.name}")


if __name__ == "__main__":
    main()
