#!/usr/bin/env python3
"""Silver-on-black PWA icons for A.GRAY."""

from __future__ import annotations

import math
import os
import struct
import zlib

SILVER = (201, 208, 219, 255)
SILVER_SOFT = (238, 242, 247, 255)
BLACK = (5, 5, 5, 255)
TRANSPARENT = (0, 0, 0, 0)

A = [
    "0011100",
    "0110110",
    "1100011",
    "1100011",
    "1111111",
    "1100011",
    "1100011",
    "1100011",
]
G = [
    "0011110",
    "0110011",
    "1100000",
    "1100000",
    "1101111",
    "1100011",
    "0110011",
    "0011110",
]


def chunk(tag: bytes, data: bytes) -> bytes:
    crc = zlib.crc32(tag + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)


def write_png(path: str, w: int, h: int, pixels: list[tuple[int, int, int, int]]) -> None:
    raw = bytearray()
    i = 0
    for _y in range(h):
        raw.append(0)
        for _x in range(w):
            raw.extend(pixels[i])
            i += 1
    compressed = zlib.compress(bytes(raw), 9)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)


def blend(dst: tuple[int, int, int, int], src: tuple[int, int, int, int], a: float) -> tuple[int, int, int, int]:
    a = max(0.0, min(1.0, a))
    return (
        int(dst[0] + (src[0] - dst[0]) * a),
        int(dst[1] + (src[1] - dst[1]) * a),
        int(dst[2] + (src[2] - dst[2]) * a),
        255,
    )


def stamp_glyph(
    px: list[tuple[int, int, int, int]],
    w: int,
    h: int,
    glyph: list[str],
    ox: float,
    oy: float,
    scale: float,
    color: tuple[int, int, int, int],
) -> None:
    rows, cols = len(glyph), len(glyph[0])
    for gy in range(rows):
        for gx in range(cols):
            if glyph[gy][gx] != "1":
                continue
            x0 = ox + gx * scale
            y0 = oy + gy * scale
            for yy in range(int(scale) + 2):
                for xx in range(int(scale) + 2):
                    x = int(x0 + xx)
                    y = int(y0 + yy)
                    if 0 <= x < w and 0 <= y < h:
                        px[y * w + x] = color


def paint_icon(size: int, maskable: bool = False) -> list[tuple[int, int, int, int]]:
    px = [BLACK] * (size * size)
    cx = cy = size / 2
    pad = size * 0.18 if maskable else size * 0.08
    outer = size / 2 - pad
    ring_w = size * 0.018

    for y in range(size):
        for x in range(size):
            d = math.hypot(x + 0.5 - cx, y + 0.5 - cy)
            i = y * size + x
            # outer ring
            ring = abs(d - outer + ring_w * 2)
            if ring < ring_w:
                a = 1 - abs(ring / ring_w)
                px[i] = blend(px[i], SILVER, a)
            # inner diamond
            dx = abs(x + 0.5 - cx) / (size * 0.055)
            dy = abs(y + 0.5 - cy + size * 0.18) / (size * 0.08)
            diamond = dx + dy
            if diamond < 1:
                a = 1 - diamond
                px[i] = blend(px[i], SILVER_SOFT, min(1, a * 1.6))

    scale = size * 0.055
    letter_w = 7 * scale
    gap = size * 0.04
    total = letter_w * 2 + gap
    ax = cx - total / 2
    ay = cy - (8 * scale) / 2 - size * 0.04
    stamp_glyph(px, size, size, A, ax, ay, scale, SILVER)
    stamp_glyph(px, size, size, G, ax + letter_w + gap, ay, scale, SILVER)
    return px


def main() -> None:
    root = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
    os.makedirs(root, exist_ok=True)
    for size in (192, 512):
        write_png(os.path.join(root, f"icon-{size}.png"), size, size, paint_icon(size))
    write_png(os.path.join(root, "icon-maskable-512.png"), 512, 512, paint_icon(512, maskable=True))
    write_png(os.path.join(root, "apple-touch-icon.png"), 180, 180, paint_icon(180))
    write_png(os.path.join(root, "favicon-32.png"), 32, 32, paint_icon(32))
    print("icons written")


if __name__ == "__main__":
    main()
