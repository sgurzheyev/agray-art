"use client";

import { useEffect, useRef } from "react";
import { subscribeScrollSpin } from "@/lib/scroll-spin";

const LAYERS = 7;
const DEPTH_PX = 8;

export function HeroMedia() {
  const stageRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeScrollSpin((deg) => {
      const stage = stageRef.current;
      if (stage) {
        stage.style.transform = `rotateX(12deg) rotateY(${deg}deg)`;
        stage.style.setProperty("--ag-spin", String(deg));
      }
      if (glintRef.current) {
        const rad = (deg * Math.PI) / 180;
        glintRef.current.style.left = `${50 + Math.sin(rad) * 16}%`;
        glintRef.current.style.top = `${38 - Math.cos(rad) * 9}%`;
        const flare = Math.pow(Math.max(0, Math.cos(rad * 2 + 0.35)), 12);
        glintRef.current.style.opacity = String(0.2 + flare * 0.75);
      }
    });
  }, []);

  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-backdrop-scene">
        <div ref={stageRef} className="hero-logo-3d">
          {Array.from({ length: LAYERS }, (_, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src="/brand/ag-logo.webp"
              alt=""
              width={800}
              height={800}
              decoding="async"
              {...(i === 0 ? { fetchPriority: "high" as const } : {})}
              className={i === 0 ? "hero-logo-3d-layer hero-logo-3d-face" : "hero-logo-3d-layer"}
              style={{
                transform: `translateZ(${-i * DEPTH_PX}px)`,
                opacity: i === 0 ? 1 : 0.18,
                filter: i === 0 ? undefined : `brightness(${0.32 + i * 0.07})`,
              }}
            />
          ))}
          <div className="hero-logo-shine" />
          <div className="hero-logo-shine hero-logo-shine-soft" />
          <div ref={glintRef} className="hero-logo-glint" />
        </div>
      </div>
      <div className="hero-backdrop-veil" />
    </div>
  );
}
