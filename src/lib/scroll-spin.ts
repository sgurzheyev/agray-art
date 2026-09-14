const PX_TO_DEG = 0.55;
const IMPULSE = 1.15;
const FRICTION_SCROLL = 0.988;
const FRICTION_COAST = 0.91;
const COAST_CUTOFF = 0.003;
const SCROLL_IDLE_MS = 90;

type Listener = (deg: number) => void;

const subs = new Set<Listener>();
let bound = false;
let running = false;
let raf = 0;
let angle = 0;
let vel = 0;
let lastY = 0;
let lastTs = 0;
let lastScrollTs = 0;
let reducedMq: MediaQueryList | null = null;

function reduced(): boolean {
  return Boolean(reducedMq?.matches);
}

function emit() {
  subs.forEach((fn) => fn(angle));
}

function frame(now: number) {
  const dt = Math.min(48, Math.max(8, now - lastTs));
  lastTs = now;
  const scrolling = now - lastScrollTs < SCROLL_IDLE_MS;
  const friction = scrolling ? FRICTION_SCROLL : FRICTION_COAST;
  vel *= Math.pow(friction, dt / 16.67);
  angle += vel * dt;
  emit();
  if (!scrolling && Math.abs(vel) < COAST_CUTOFF) {
    vel = 0;
    running = false;
    return;
  }
  raf = requestAnimationFrame(frame);
}

function kick(now: number) {
  if (running) return;
  running = true;
  lastTs = now;
  raf = requestAnimationFrame(frame);
}

function onScroll() {
  if (reduced()) {
    angle = 0;
    vel = 0;
    emit();
    return;
  }
  const now = performance.now();
  const y = window.scrollY;
  const dt = Math.max(now - lastScrollTs, 8);
  const dy = y - lastY;
  lastY = y;
  lastScrollTs = now;
  // Displacement tracks the gesture; impulse keeps spinning after it ends.
  angle += dy * PX_TO_DEG;
  const pxPerMs = dy / dt;
  vel = pxPerMs * PX_TO_DEG * IMPULSE + vel * 0.35;
  emit();
  kick(now);
}

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  lastY = window.scrollY;
  lastScrollTs = performance.now();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  reducedMq.addEventListener("change", () => {
    if (reduced()) {
      angle = 0;
      vel = 0;
      emit();
    }
  });
  emit();
}

/**
 * rotateY driven by scroll velocity: faster flicks spin harder, then coast
 * with friction after scroll stops. Displacement still maps while moving.
 */
export function subscribeScrollSpin(fn: Listener): () => void {
  bind();
  fn(angle);
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
