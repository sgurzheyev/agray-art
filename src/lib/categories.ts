import type { Category, CategorySlug } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "rings",
    name: "Кольца",
    nameEn: "Rings",
    blurb: "Печатки, солитеры и повседневные формы.",
  },
  {
    slug: "bracelets",
    name: "Браслеты",
    nameEn: "Bracelets",
    blurb: "Жёсткие и мягкие линии, ручная пайка.",
  },
  {
    slug: "crosses",
    name: "Кресты",
    nameEn: "Crosses",
    blurb: "Православные и лаконичные нательные кресты.",
  },
  {
    slug: "earrings",
    name: "Серьги",
    nameEn: "Earrings",
    blurb: "Капли, кольца и вечерние пары.",
  },
  {
    slug: "pendants",
    name: "Подвески",
    nameEn: "Pendants",
    blurb: "Кулоны на цепь — символ, буква, камень.",
  },
  {
    slug: "icons",
    name: "Иконы",
    nameEn: "Icons",
    blurb: "Нательные иконки, чеканка и эмаль.",
  },
  {
    slug: "chains",
    name: "Цепи",
    nameEn: "Chains",
    blurb: "Бисмарк, якорь, box — разный характер звена.",
  },
  {
    slug: "wedding",
    name: "Обручальные",
    nameEn: "Wedding",
    blurb: "Парные кольца: классика, сатин, comfort fit.",
  },
  {
    slug: "sport",
    name: "SPORT",
    nameEn: "Sport",
    blurb: "Мужская спортивная линия: каучук, золото, геометрия.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((c) => c.slug === value);
}
