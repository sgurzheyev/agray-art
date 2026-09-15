"use client";

import { useEffect, useRef } from "react";
import { classNames } from "@/lib/format";
import { subscribeScrollSpin } from "@/lib/scroll-spin";

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
    return subscribeScrollSpin((deg) => {
      if (ref.current) {
        ref.current.style.transform = `perspective(640px) rotateX(8deg) rotateY(${deg}deg)`;
      }
    });
  }, []);

  return (
    <span className="brand-mark-wrap inline-flex shrink-0 bg-transparent">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src="/brand/ag-logo-clear.webp"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className={classNames("brand-mark bg-transparent object-contain", className)}
        style={{ background: "transparent" }}
      />
    </span>
  );
}
