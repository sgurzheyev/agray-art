const DEG_PER_VIEWPORT = 180;

const subs = new Set<(deg: number) => void>();
let bound = false;
let raf = 0;

function spinDeg(): number {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  return (window.scrollY / Math.max(window.innerHeight, 1)) * DEG_PER_VIEWPORT;
}

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const tick = () => {
    const deg = spinDeg();
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

/** One full rotateY turn every two viewports. Scroll up reverses. */
export function subscribeScrollSpin(fn: (deg: number) => void): () => void {
  bind();
  fn(spinDeg());
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
