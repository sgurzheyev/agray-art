import { categories } from "@/lib/categories";
import type { CategorySlug, Product } from "@/lib/types";

const RING_SIZES = ["15", "15.5", "16", "16.5", "17", "17.5", "18", "18.5", "19", "20", "21"];
const BRACELET_SIZES = ["17", "18", "19", "20", "21"];

/**
 * Tiny local fallback for `npm run dev` without Supabase keys.
 * Production catalog (≈35 curated Telegram stills) lives in Supabase
 * `products` + Storage `product-media` — do not expand this list.
 */
export const products: Product[] = [
  {
    slug: "aurora",
    sku: "AG-R-0142",
    name: "Кольцо Aurora",
    category: "rings",
    price: 186000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 3.8,
    sizes: RING_SIZES,
    sizeLabel: "Размер",
    stone: "Бриллиант 0.25 ct",
    description:
      "Солитер с тихой короной. Камень посажен низко, шинка мягко сужается к ладони — кольцо собрано для ежедневной носки, не только для витрины.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "linea",
    sku: "AG-B-1104",
    name: "Браслет Linea",
    category: "bracelets",
    price: 142000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 12.4,
    sizes: BRACELET_SIZES,
    sizeLabel: "Обхват, см",
    description:
      "Жёсткий браслет с едва заметным замком. Линия непрерывная: металл читается как архитектура запястья, а не как декор.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "orthodox-classic",
    sku: "AG-C-2041",
    name: "Крест Orthodox",
    category: "crosses",
    price: 54000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 3.1,
    sizes: [],
    description:
      "Православный нательный крест: косое подножие, титла, спокойный рельеф. Оборотная сторона — молитва. Цепь подбирается отдельно.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "lune",
    sku: "AG-P-4501",
    name: "Подвеска Lune",
    category: "pendants",
    price: 47000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 2.7,
    sizes: [],
    description:
      "Лунный кулон на тонкой петле. Внутренняя плоскость сатинирована, внешний контур — полировка. Цепь в комплект не входит.",
    featured: true,
    imageCount: 2,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku);
}

export function productsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

export function featuredProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export function categoryCover(slug: CategorySlug, list: Product[] = products): string {
  const first = list.find((p) => p.category === slug);
  return first ? productImage(first, 1) : "/media/hero/poster.svg";
}

export function productImage(product: Product, index = 1): string {
  const imgs = productImages(product);
  return imgs[Math.max(0, index - 1)] ?? "/media/hero/poster.svg";
}

export function productImages(product: Product): string[] {
  if (product.images && product.images.length > 0) return product.images;
  if (product.id) return ["/media/hero/poster.svg"];
  const count = Math.max(1, product.imageCount || 1);
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `/media/products/${product.sku}/${n}.svg`;
  });
}

export function productVideoPath(product: Product): string {
  return product.videoUrl || `/media/products/${product.sku}/proof.mp4`;
}

export function categoryName(slug: string, list?: { slug: string; name: string }[]): string {
  if (list) return list.find((c) => c.slug === slug)?.name ?? slug;
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
