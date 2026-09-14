"use client";

import { useEffect, useRef } from "react";
import { classNames } from "@/lib/format";

const subs = new Set<(deg: number) => void>();
let bound = false;
let raf = 0;

function bindScrollSpin() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const tick = () => {
    const deg = reduced.matches
      ? 0
      : (window.scrollY / Math.max(window.innerHeight, 1)) * 120;
    subs.forEach((fn) => fn(deg));
  };

  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  reduced.addEventListener("change", tick);
  tick();
}

export function BrandMark({
  className,
  size = 72,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    bindScrollSpin();
    const apply = (deg: number) => {
      if (ref.current) {
        ref.current.style.transform = `perspective(640px) rotateY(${deg}deg)`;
      }
    };
    subs.add(apply);
    apply((window.scrollY / Math.max(window.innerHeight, 1)) * 120);
    return () => {
      subs.delete(apply);
    };
  }, []);

  return (
    <span className="brand-mark-wrap inline-flex shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src="/brand/ag-logo.webp"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={classNames("brand-mark object-contain", className)}
      />
    </span>
  );
}
