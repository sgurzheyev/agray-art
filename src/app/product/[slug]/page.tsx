import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel } from "@/components/buy-panel";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { VideoProof } from "@/components/video-proof";
import { formatWeight } from "@/lib/format";
import { categoryName, getProduct, productImages, products, relatedProducts } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Изделие" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(product);
  const specs = [
    ["Артикул", product.sku],
    ["Металл", product.metal],
    ["Проба", product.assay],
    ["Вес", formatWeight(product.weightGrams)],
    product.stone ? ["Вставка", product.stone] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-[11px] tracking-[0.22em] text-muted uppercase">
        <Link href="/catalog" className="hover:text-gold">
          Каталог
        </Link>
        {" / "}
        <Link href={`/catalog/${product.category}`} className="hover:text-gold">
          {categoryName(product.category)}
        </Link>
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={productImages(product)} alt={product.name} />
        <div>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">
            {categoryName(product.category)}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ivory sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>
          <dl className="mt-8 divide-y divide-gold/15 border-y border-gold/15">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="tracking-widest text-muted uppercase">{k}</dt>
                <dd className="text-ivory">{v}</dd>
              </div>
            ))}
          </dl>
          <BuyPanel product={product} />
        </div>
      </div>
      <VideoProof product={product} />
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl text-ivory">Рядом в категории</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
