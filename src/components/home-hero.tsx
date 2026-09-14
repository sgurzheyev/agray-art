import Link from "next/link";
import { HeroMedia } from "@/components/hero-media";

export function HomeHero({
  primaryHref = "/catalog",
  primaryLabel = "Смотреть коллекцию",
  secondaryHref = "/atelier",
  secondaryLabel = "Ателье",
}: {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative isolate min-h-[88dvh] overflow-hidden bg-ink">
      <HeroMedia />
      <div className="relative z-10 mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-24">
        <p className="text-[11px] tracking-[0.42em] text-silver uppercase">Ювелирный дом · Москва</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-ivory sm:text-7xl">A.GRAY</h1>
        <p className="mt-5 max-w-md font-serif text-xl leading-snug text-ivory/80 sm:text-2xl">
          Свет. Тишина. Форма.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={primaryHref} className="btn-glass px-8 py-3.5 text-center text-xs tracking-[0.28em] uppercase">
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="btn-glass-ghost px-8 py-3.5 text-center text-xs tracking-[0.28em] uppercase"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
