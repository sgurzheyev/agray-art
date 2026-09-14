import { cache } from "react";
import { categories as localCategories } from "@/lib/categories";
import { featuredProducts, products as localProducts, productImages } from "@/lib/products";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Category, Product, ProductStatus, SiteButton } from "@/lib/types";

export const DEFAULT_NAV_BUTTONS: SiteButton[] = [
  { key: "nav.catalog", label: "Каталог", href: "/catalog", visible: true, sortOrder: 10 },
  { key: "nav.atelier", label: "Ателье", href: "/atelier", visible: true, sortOrder: 20 },
];

export const DEFAULT_HOME_BUTTONS: SiteButton[] = [
  { key: "home.cta_primary", label: "Смотреть коллекцию", href: "/catalog", visible: true, sortOrder: 10 },
  { key: "home.cta_secondary", label: "Ателье", href: "/atelier", visible: true, sortOrder: 20 },
  { key: "home.workshop_cta", label: "Как попасть", href: "/atelier", visible: true, sortOrder: 30 },
];

type MediaRow = {
  id: string;
  kind: "photo" | "video";
  url: string;
  sort_order: number;
  is_primary: boolean;
};

type CategoryRow = {
  id: string;
  slug: string;
  name_ru: string;
  name_en: string;
  blurb_ru: string;
  sort_order: number;
  visible: boolean;
};

type ProductRow = {
  id: string;
  slug: string;
  title_ru: string;
  description_ru: string;
  price_cents: number;
  metal: string;
  assay: string;
  weight_g: number | string;
  size_label: string | null;
  sizes: string[] | null;
  sku: string;
  stone: string | null;
  lead_days: number;
  status: ProductStatus;
  featured: boolean;
  category_id: string;
  categories: CategoryRow | CategoryRow[] | null;
  product_media: MediaRow[] | null;
};

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name_ru,
    nameEn: row.name_en,
    blurb: row.blurb_ru,
    visible: row.visible,
    sortOrder: row.sort_order,
  };
}

function mapProduct(row: ProductRow): Product {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const media = [...(row.product_media ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  const photos = media.filter((m) => m.kind === "photo").map((m) => m.url);
  const video = media.find((m) => m.kind === "video")?.url;
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.title_ru,
    category: cat?.slug ?? "",
    categoryName: cat?.name_ru,
    price: Math.round(Number(row.price_cents) / 100),
    metal: row.metal,
    assay: row.assay,
    weightGrams: Number(row.weight_g),
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    sizeLabel: row.size_label ?? undefined,
    stone: row.stone ?? undefined,
    description: row.description_ru,
    featured: row.featured,
    imageCount: photos.length,
    images: photos,
    videoUrl: video,
    status: row.status,
    leadDays: row.lead_days,
  };
}

function hydrateLocal(product: Product): Product {
  const images = productImages(product);
  return {
    ...product,
    images,
    imageCount: images.length,
    categoryName: product.categoryName ?? localCategories.find((c) => c.slug === product.category)?.name,
  };
}

async function fetchFromSupabase() {
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const [cats, prods, settings] = await Promise.all([
    supabase.from("categories").select("*").eq("visible", true).order("sort_order"),
    supabase
      .from("products")
      .select("*, categories(*), product_media(*)")
      .eq("status", "published")
      .order("created_at", { ascending: true }),
    supabase.from("site_settings").select("*").eq("visible", true).order("sort_order"),
  ]);

  if (cats.error || prods.error) {
    console.error("Supabase catalog error", cats.error ?? prods.error);
    return null;
  }

  const categories = (cats.data as CategoryRow[]).map(mapCategory);
  const products = (prods.data as ProductRow[]).map(mapProduct);
  const buttons: SiteButton[] = (settings.data ?? []).map((row) => ({
    id: row.id as string,
    key: row.key as string,
    label: row.label_ru as string,
    href: row.href as string,
    visible: row.visible as boolean,
    sortOrder: row.sort_order as number,
    meta: (row.meta as Record<string, unknown>) ?? {},
  }));

  return { categories, products, buttons, source: "supabase" as const };
}

export const loadCatalog = cache(async () => {
  if (isSupabaseConfigured()) {
    const remote = await fetchFromSupabase();
    if (remote) {
      return {
        ...remote,
        categories: remote.categories.length ? remote.categories : localCategories,
      };
    }
  }
  return {
    categories: localCategories,
    products: localProducts.map(hydrateLocal),
    buttons: [...DEFAULT_NAV_BUTTONS, ...DEFAULT_HOME_BUTTONS],
    source: "local" as const,
  };
});

export async function getPublishedProducts(): Promise<Product[]> {
  const { products } = await loadCatalog();
  return products;
}

export async function getVisibleCategories(): Promise<Category[]> {
  const { categories } = await loadCatalog();
  return categories;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { products } = await loadCatalog();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategorySlug(slug: string): Promise<Product[]> {
  const { products } = await loadCatalog();
  return products.filter((p) => p.category === slug);
}

export async function getFeatured(): Promise<Product[]> {
  const { products } = await loadCatalog();
  const featured = products.filter((p) => p.featured);
  return featured.length ? featured : products.slice(0, 6);
}

export async function getRelated(product: Product, limit = 4): Promise<Product[]> {
  const { products } = await loadCatalog();
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, limit);
}

export async function getSiteButtons(group?: string): Promise<SiteButton[]> {
  const { buttons } = await loadCatalog();
  const filtered = group
    ? buttons.filter((b) => b.key.startsWith(`${group}.`) || b.meta?.group === group)
    : buttons;
  if (filtered.length) return filtered.filter((b) => b.visible);
  if (group === "nav") return DEFAULT_NAV_BUTTONS;
  if (group === "home") return DEFAULT_HOME_BUTTONS;
  return [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const { categories } = await loadCatalog();
  return categories.find((c) => c.slug === slug);
}

export { featuredProducts };
