"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/types";
import { classNames } from "@/lib/format";

export function CatalogBrowser({
  products,
  categories,
  active,
}: {
  products: Product[];
  categories: Category[];
  active?: string;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    let next = products.filter((p) => {
      if (!query) return true;
      return [p.name, p.sku, p.metal, p.description].join(" ").toLowerCase().includes(query);
    });
    if (sort === "price-asc") next = [...next].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") next = [...next].sort((a, b) => b.price - a.price);
    return next;
  }, [products, q, sort]);

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <Chip href="/catalog" current={!active}>
          Все
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} href={`/catalog/${c.slug}`} current={active === c.slug}>
            {c.name}
          </Chip>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск: артикул, металл, название"
          className="w-full border border-silver/20 bg-transparent px-3 py-2.5 text-sm text-ivory outline-none placeholder:text-muted focus:border-silver sm:max-w-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="border border-silver/20 bg-ink px-3 py-2.5 text-sm text-ivory outline-none"
        >
          <option value="new">По каталогу</option>
          <option value="price-asc">Сначала доступнее</option>
          <option value="price-desc">Сначала выше цена</option>
        </select>
      </div>
      <p className="mt-4 text-xs tracking-widest text-muted uppercase">{list.length} изделий</p>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={classNames(
        "shrink-0 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase",
        current ? "btn-glass" : "border border-silver/25 text-muted hover:text-silver",
      )}
    >
      {children}
    </Link>
  );
}
