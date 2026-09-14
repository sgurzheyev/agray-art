"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { productVideoPath } from "@/lib/products";
import type { Product } from "@/lib/types";

export function VideoProof({ product }: { product: Product }) {
  const src = productVideoPath(product);
  const remote = src.startsWith("http://") || src.startsWith("https://");
  const [ready, setReady] = useState(remote);

  useEffect(() => {
    if (remote) return;
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setReady(true);
      })
      .catch(() => {
        /* slot stays empty until the mp4 is uploaded */
      });
    return () => {
      cancelled = true;
    };
  }, [src, remote]);

  return (
    <section className="mt-10 border border-gold/20 bg-ink-soft p-4 sm:p-6">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Видеодоказательство</p>
      <p className="mt-2 text-sm text-muted">
        Короткий ролик изделия при живом свете. Положите файл в{" "}
        <code className="text-ivory/70">{src}</code>
      </p>
      <div className="relative mt-4 aspect-video overflow-hidden bg-black">
        {ready ? (
          <video className="h-full w-full object-cover" controls playsInline preload="metadata">
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Play className="size-10 text-gold/50" strokeWidth={1} />
            <p className="max-w-xs text-sm text-muted">
              Слот готов. Файл появится здесь автоматически после загрузки.
            </p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/15 ring-inset" />
      </div>
    </section>
  );
}
