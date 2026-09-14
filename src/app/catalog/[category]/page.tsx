import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/catalog-browser";
import { categories, getCategory, isCategorySlug } from "@/lib/categories";
import { productsByCategory } from "@/lib/products";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return {
    title: cat?.name ?? "Каталог",
    description: cat?.blurb,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategorySlug(category)) notFound();
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">{cat.nameEn}</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory sm:text-5xl">{cat.name}</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">{cat.blurb}</p>
      <div className="mt-10">
        <CatalogBrowser
          products={productsByCategory(cat.slug)}
          categories={categories}
          active={cat.slug}
        />
      </div>
    </div>
  );
}
