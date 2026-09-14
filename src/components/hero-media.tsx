"use client";

import { useEffect, useState } from "react";

const HERO_VIDEO = "/media/hero/atelier.mp4";

export function HeroMedia() {
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(HERO_VIDEO, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setHasVideo(true);
      })
      .catch(() => {
        /* poster only until atelier.mp4 is uploaded */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/hero/poster.svg"
        alt=""
        className="h-full w-full object-cover opacity-80"
      />
      {hasVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero/poster.svg"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
    </div>
  );
}
