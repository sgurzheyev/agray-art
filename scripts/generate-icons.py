#!/usr/bin/env python3
"""Export PWA / favicon sizes from the chrome AG monogram."""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "brand" / "ag-logo.png"
ICONS = ROOT / "public" / "icons"
APP = ROOT / "src" / "app"


def ffmpeg(*args: str) -> None:
    subprocess.check_call(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args])


def resize(dest: Path, size: int) -> None:
    ffmpeg(
        "-i",
        str(SOURCE),
        "-vf",
        f"scale={size}:{size}:flags=lanczos",
        "-frames:v",
        "1",
        str(dest),
    )


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
    ICONS.mkdir(parents=True, exist_ok=True)
    resize(ICONS / "favicon-32.png", 32)
    resize(ICONS / "apple-touch-icon.png", 180)
    resize(ICONS / "icon-192.png", 192)
    resize(ICONS / "icon-512.png", 512)
    maskable(ICONS / "icon-maskable-512.png")

    shutil.copyfile(ICONS / "icon-192.png", APP / "icon.png")
    shutil.copyfile(ICONS / "apple-touch-icon.png", APP / "apple-icon.png")
    ffmpeg("-i", str(ICONS / "favicon-32.png"), str(APP / "favicon.ico"))
    print("AG monogram icons written")


if __name__ == "__main__":
    main()
