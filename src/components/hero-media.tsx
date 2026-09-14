"use client";

import { useEffect, useRef } from "react";
import { subscribeScrollSpin } from "@/lib/scroll-spin";

const LAYERS = 8;
const DEPTH_PX = 7;

export function HeroMedia() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeScrollSpin((deg) => {
      if (stageRef.current) {
        stageRef.current.style.transform = `rotateX(12deg) rotateY(${deg}deg)`;
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
              className="hero-logo-3d-layer"
              style={{
                transform: `translateZ(${-i * DEPTH_PX}px)`,
                opacity: i === 0 ? 1 : 0.16,
                filter: i === 0 ? "none" : `brightness(${0.35 + i * 0.06})`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="hero-backdrop-veil" />
    </div>
  );
}
