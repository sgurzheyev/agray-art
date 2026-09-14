import Link from "next/link";
import { HeroMedia } from "@/components/hero-media";
import { ProductCard } from "@/components/product-card";
import { getFeatured, getSiteButtons, getVisibleCategories, loadCatalog } from "@/lib/catalog";
import { categoryCover } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ products }, featured, categories, homeButtons] = await Promise.all([
    loadCatalog(),
    getFeatured(),
    getVisibleCategories(),
    getSiteButtons("home"),
  ]);
  const primary = homeButtons.find((b) => b.key === "home.cta_primary") ?? homeButtons[0];
  const secondary = homeButtons.find((b) => b.key === "home.cta_secondary") ?? homeButtons[1];
  const workshop = homeButtons.find((b) => b.key === "home.workshop_cta") ?? homeButtons[2];

  return (
    <div>
      <section className="relative min-h-[88dvh] overflow-hidden">
        <HeroMedia />
        <div className="relative z-10 mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-4 pb-16 sm:px-6 sm:pb-24">
          <p className="text-[11px] tracking-[0.42em] text-gold uppercase">Ювелирный дом · Москва</p>
          <h1 className="mt-4 font-serif text-5xl leading-none text-ivory sm:text-7xl">A.GRAY</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/75 sm:text-lg">
            Авторские украшения на чёрном. Золото, тишина, точная работа ателье Андрея.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {primary && (
              <Link
                href={primary.href}
                className="bg-gold px-8 py-3.5 text-center text-xs tracking-[0.28em] text-ink uppercase"
              >
                {primary.label}
              </Link>
            )}
            {secondary && (
              <Link
                href={secondary.href}
                className="border border-gold/60 px-8 py-3.5 text-center text-xs tracking-[0.28em] text-gold uppercase"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <HeaderBlock kicker="Категории" title="Коллекция" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/catalog/${c.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={categoryCover(c.slug, products)}
                alt={c.name}
                className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-serif text-xl text-ivory sm:text-2xl">{c.name}</p>
                <p className="mt-1 hidden text-[10px] tracking-[0.2em] text-gold uppercase sm:block">
                  {c.nameEn}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/15 ring-inset" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <HeaderBlock kicker="Избранное" title="В витрине" />
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 border border-gold/20 bg-ink-soft md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/atelier/workbench.svg" alt="Ателье A.GRAY" className="h-full min-h-72 w-full object-cover" />
          <div className="px-6 py-10 sm:px-10">
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Мастерская</p>
            <h2 className="mt-3 font-serif text-4xl text-ivory">Ателье Андрея</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Воск, отливка, закрепка, полировка. Сюда приходят за размером, гравировкой и вещью,
              которой нет в витрине. Короткий визит — лучше длинной переписки.
            </p>
            {workshop && (
              <Link
                href={workshop.href}
                className="mt-8 inline-block border border-gold px-6 py-3 text-xs tracking-[0.28em] text-gold uppercase"
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
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">{kicker}</p>
      <h2 className="mt-2 font-serif text-4xl text-ivory">{title}</h2>
      <div className="mt-4 h-px w-16 bg-gold" />
    </div>
  );
}
