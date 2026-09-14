export const CATEGORY_SLUGS = [
  "rings",
  "bracelets",
  "crosses",
  "earrings",
  "pendants",
  "icons",
  "chains",
  "wedding",
  "sport",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number] | string;

export type Category = {
  id?: string;
  slug: string;
  name: string;
  nameEn: string;
  blurb: string;
  visible?: boolean;
  sortOrder?: number;
};

export type ProductStatus = "draft" | "published" | "hidden";

export type Product = {
  id?: string;
  slug: string;
  sku: string;
  name: string;
  category: string;
  categoryName?: string;
  price: number;
  metal: string;
  assay: string;
  weightGrams: number;
  sizes: string[];
  sizeLabel?: string;
  stone?: string;
  description: string;
  featured?: boolean;
  imageCount: number;
  images?: string[];
  videoUrl?: string;
  status?: ProductStatus;
  leadDays?: number;
};

export type ProductMedia = {
  id: string;
  productId: string;
  kind: "photo" | "video";
  url: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type SiteButton = {
  id?: string;
  key: string;
  label: string;
  href: string;
  visible: boolean;
  sortOrder: number;
  meta?: Record<string, unknown>;
};

export type CartItem = {
  slug: string;
  sku: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  image: string;
};
