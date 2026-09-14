"use client";

import { useEffect, useRef } from "react";
import { subscribeScrollSpin } from "@/lib/scroll-spin";

const LAYERS = 10;
const DEPTH_PX = 3.4;

export function HeroMedia() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeScrollSpin((deg) => {
      if (stageRef.current) {
        stageRef.current.style.transform = `rotateY(${deg}deg)`;
      }
    });
  }, []);

  const backZ = -((LAYERS - 1) * DEPTH_PX);

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
                opacity: i === 0 ? 0.95 : 0.12,
                filter: i === 0 ? "none" : `brightness(${0.26 + i * 0.04})`,
              }}
            />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/ag-logo.webp"
            alt=""
            width={800}
            height={800}
            decoding="async"
            className="hero-logo-3d-layer"
            style={{
              transform: `translateZ(${backZ}px) rotateY(180deg)`,
              opacity: 0.92,
            }}
          />
        </div>
      </div>
      <div className="hero-backdrop-veil" />
    </div>
  );
}
