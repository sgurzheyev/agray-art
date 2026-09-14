import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Кольца, браслеты, кресты, серьги, подвески, иконы, цепи, обручальные, SPORT.",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Каталог</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory sm:text-5xl">Все изделия</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Выборка v1. Фото — плейсхолдеры на чёрном; боевые кадры приедут импортом из Telegram.
      </p>
      <div className="mt-10">
        <CatalogBrowser products={products} categories={categories} />
      </div>
    </div>
  );
}
