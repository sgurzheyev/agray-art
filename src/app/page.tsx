import { Suspense } from "react";
import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { getFeatured, getSiteButtons, getVisibleCategories, loadCatalog } from "@/lib/catalog";
import { categoryCover } from "@/lib/products";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Suspense fallback={null}>
        <HomeBelowFold />
      </Suspense>
    </>
  );
}

async function HomeBelowFold() {
  const [{ products }, featured, categories, homeButtons] = await Promise.all([
    loadCatalog(),
    getFeatured(),
    getVisibleCategories(),
    getSiteButtons("home"),
  ]);
  const workshop = homeButtons.find((b) => b.key === "home.workshop_cta") ?? homeButtons[2];

  return (
    <div className="relative z-10">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <HeaderBlock kicker="Категории" title="Коллекция" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/catalog/${c.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={categoryCover(c.slug, products)}
                alt={c.name}
                className="h-full w-full bg-black object-contain object-center transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 product-chrome" />
              <div className="absolute inset-x-0 bottom-0">
                <div className="glass-caption p-4">
                  <p className="font-serif text-xl text-ivory sm:text-2xl">{c.name}</p>
                  <p className="mt-1 hidden text-[10px] tracking-[0.2em] text-silver uppercase sm:block">
                    {c.nameEn}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <HeaderBlock kicker="Избранное" title="В витрине" />
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 border border-silver/20 bg-ink-soft md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/atelier/workbench.svg" alt="Ателье A.GRAY" className="h-full min-h-72 w-full object-cover" />
          <div className="px-6 py-10 sm:px-10">
            <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Мастерская</p>
            <h2 className="mt-3 font-serif text-4xl text-ivory">Ателье</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Воск, отливка, закрепка, полировка. Сюда приходят за размером, гравировкой и вещью,
              которой нет в витрине. Короткий визит — лучше длинной переписки.
            </p>
            {workshop && (
              <Link
                href={workshop.href}
                className="btn-glass-ghost mt-8 px-6 py-3 text-xs tracking-[0.28em] uppercase"
              >
                {workshop.label}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeaderBlock({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.28em] text-silver uppercase">{kicker}</p>
      <h2 className="mt-2 font-serif text-4xl text-ivory">{title}</h2>
      <div className="mt-4 h-px w-16 bg-gradient-to-r from-silver-bright/80 to-transparent" />
    </div>
  );
}
