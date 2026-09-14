"use client";

import { useState } from "react";
import { Minus, Plus, X, ZoomIn } from "lucide-react";
import { classNames } from "@/lib/format";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [open, setOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div>
      <div
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-black"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={onMove}
        onClick={() => {
          setOpen(true);
          setLightboxZoom(1);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") setOpen(true);
        }}
        aria-label="Увеличить фото"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={alt}
          className="h-full w-full bg-black object-contain transition-transform duration-200 ease-out"
          style={{
            transform: hover ? "scale(1.7)" : "scale(1)",
            transformOrigin: origin,
          }}
        />
        <div className="pointer-events-none absolute inset-0 product-chrome" />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 border border-silver/25 bg-ink/55 px-2 py-1 text-[10px] tracking-widest text-silver uppercase backdrop-blur-md">
          <ZoomIn className="size-3" />
          Zoom
        </span>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={classNames(
                "aspect-square overflow-hidden bg-black ring-1",
                i === active ? "ring-silver" : "ring-silver/15",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full bg-black object-contain" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Галерея"
        >
          <div className="flex items-center justify-between px-4 py-3 text-silver">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="border border-silver/30 p-2 hover:bg-silver/10"
                onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.4))}
                aria-label="Уменьшить"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                className="border border-silver/30 p-2 hover:bg-silver/10"
                onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.4))}
                aria-label="Увеличить"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              type="button"
              className="p-2"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={alt}
              className="max-h-none origin-center transition-transform"
              style={{ transform: `scale(${lightboxZoom})` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
