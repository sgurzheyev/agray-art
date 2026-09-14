#!/usr/bin/env python3
"""Export PWA / favicon sizes from the chrome AG monogram.

Small tab icons use the punched-alpha mark so they do not sit on a black plate.
Apple / maskable app icons stay on an opaque black field.
"""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "brand" / "ag-logo.png"
CLEAR = ROOT / "public" / "brand" / "ag-logo-clear.png"
ICONS = ROOT / "public" / "icons"
APP = ROOT / "src" / "app"


def ffmpeg(*args: str) -> None:
    subprocess.check_call(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args])


def resize(src: Path, dest: Path, size: int, *, keep_alpha: bool = False) -> None:
    vf = f"scale={size}:{size}:flags=lanczos"
    if keep_alpha:
        vf += ",format=rgba"
    ffmpeg("-i", str(src), "-vf", vf, "-frames:v", "1", str(dest))


def maskable(dest: Path, canvas: int = 512, mark_ratio: float = 0.8) -> None:
    inner = int(round(canvas * mark_ratio))
    pad = (canvas - inner) // 2
    ffmpeg(
        "-i",
        str(SOURCE),
        "-vf",
        f"scale={inner}:{inner}:flags=lanczos,pad={canvas}:{canvas}:{pad}:{pad}:black",
        "-frames:v",
        "1",
        str(dest),
    )


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"missing source mark: {SOURCE}")
    if not CLEAR.exists():
        raise SystemExit(f"missing clear mark: {CLEAR}")
    ICONS.mkdir(parents=True, exist_ok=True)
    resize(CLEAR, ICONS / "favicon-32.png", 32, keep_alpha=True)
    resize(SOURCE, ICONS / "apple-touch-icon.png", 180)
    resize(SOURCE, ICONS / "icon-192.png", 192)
    resize(SOURCE, ICONS / "icon-512.png", 512)
    maskable(ICONS / "icon-maskable-512.png")

    resize(CLEAR, APP / "icon.png", 192, keep_alpha=True)
    shutil.copyfile(ICONS / "apple-touch-icon.png", APP / "apple-icon.png")
    ffmpeg("-i", str(ICONS / "favicon-32.png"), str(APP / "favicon.ico"))
    print("AG monogram icons written")


if __name__ == "__main__":
    main()
