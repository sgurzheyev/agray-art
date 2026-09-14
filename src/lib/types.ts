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

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type Category = {
  slug: CategorySlug;
  name: string;
  nameEn: string;
  blurb: string;
};

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
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
