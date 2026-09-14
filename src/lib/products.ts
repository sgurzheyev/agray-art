import { categories } from "@/lib/categories";
import type { CategorySlug, Product } from "@/lib/types";

const RING_SIZES = ["15", "15.5", "16", "16.5", "17", "17.5", "18", "18.5", "19", "20", "21"];
const CHAIN_LEN = ["45", "50", "55", "60", "65"];
const BRACELET_SIZES = ["17", "18", "19", "20", "21"];
const SPORT_SIZES = ["S", "M", "L"];

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
    slug: "solstice",
    sku: "AG-R-0208",
    name: "Кольцо Solstice",
    category: "rings",
    price: 124000,
    metal: "Золото белое",
    assay: "585",
    weightGrams: 4.2,
    sizes: RING_SIZES,
    sizeLabel: "Размер",
    stone: "Сапфир 0.40 ct",
    description:
      "Овальная оправа, сапфир глубокого тона. Боковые грани шинки отполированы в зеркало — свет скользит, не дробит форму.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "noir-signet",
    sku: "AG-R-0311",
    name: "Печатка Noir",
    category: "rings",
    price: 98000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 8.6,
    sizes: RING_SIZES,
    sizeLabel: "Размер",
    description:
      "Мужская печатка с площадкой под монограмму. Внутренняя поверхность — comfort fit. Гравировка в ателье по запросу.",
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
      "Жёсткий браслет с едва заметным замком. Линия непрерывная: золото читается как архитектура запястья, а не как декор.",
    imageCount: 2,
  },
  {
    slug: "venice",
    sku: "AG-B-1188",
    name: "Браслет Venice",
    category: "bracelets",
    price: 76000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 9.1,
    sizes: BRACELET_SIZES,
    sizeLabel: "Обхват, см",
    description:
      "Мягкое плетение, звенья плотные, замок-коробка с предохранителем. Носится поверх манжеты и на голую руку.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "cobra",
    sku: "AG-B-1210",
    name: "Браслет Cobra",
    category: "bracelets",
    price: 168000,
    metal: "Золото жёлтое",
    assay: "750",
    weightGrams: 18.2,
    sizes: BRACELET_SIZES,
    sizeLabel: "Обхват, см",
    description:
      "Плотное «кобра»-плетение, 750 проба. Тяжёлый ход по руке, глухой золотой цвет. Для тех, кто выбирает вес, а не блеск.",
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
    slug: "cross-minimal",
    sku: "AG-C-2099",
    name: "Крест Minimal",
    category: "crosses",
    price: 38000,
    metal: "Золото белое",
    assay: "585",
    weightGrams: 2.2,
    sizes: [],
    description:
      "Латинский крест без декора. Тонкое сечение, матовая грань и полированный торец — крест читается в профиль.",
    imageCount: 2,
  },
  {
    slug: "cross-on-chain",
    sku: "AG-C-2217",
    name: "Крест на цепи",
    category: "crosses",
    price: 89000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 7.4,
    sizes: CHAIN_LEN,
    sizeLabel: "Длина цепи, см",
    description:
      "Комплект: крест и якорная цепь 585. Узел соединения усилен. Готовый нательный набор без подбора «на глаз».",
    imageCount: 2,
  },
  {
    slug: "drops",
    sku: "AG-E-3302",
    name: "Серьги Drops",
    category: "earrings",
    price: 112000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 5.6,
    sizes: [],
    stone: "Цитрин",
    description:
      "Капли с подвижным камнем. Английский замок. Пара собрана так, чтобы серьга падала вертикально и не разворачивалась.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "hoops",
    sku: "AG-E-3375",
    name: "Серьги Hoops",
    category: "earrings",
    price: 64000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 4.8,
    sizes: [],
    description:
      "Средние кольца, сечение — мягкий овал. Застёжка скрыта в дуге. Дневной формат, который держит вечер.",
    imageCount: 2,
  },
  {
    slug: "stella",
    sku: "AG-E-3419",
    name: "Серьги Stella",
    category: "earrings",
    price: 79000,
    metal: "Золото белое",
    assay: "585",
    weightGrams: 3.9,
    sizes: [],
    stone: "Бриллиантовая крошка",
    description:
      "Небольшие звёзды с россыпью. Лёгкие, на каждый день, без театрального блеска — только точечный свет.",
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
    imageCount: 2,
  },
  {
    slug: "coeur",
    sku: "AG-P-4566",
    name: "Подвеска Cœur",
    category: "pendants",
    price: 52000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 3.0,
    sizes: [],
    description:
      "Сердце без сентиментальной толщины: тонкий объём, закрытый каст. Можно носить на цепи 45 или 50 см.",
    imageCount: 2,
  },
  {
    slug: "letter",
    sku: "AG-P-4612",
    name: "Подвеска Letter",
    category: "pendants",
    price: 41000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 2.4,
    sizes: [],
    description:
      "Буква на выбор — гравируется в ателье. Шрифт близкий к нашему логотипу. Заказ по артикулу с указанием литеры.",
    imageCount: 2,
  },
  {
    slug: "vladimir",
    sku: "AG-I-5703",
    name: "Икона Владимирская",
    category: "icons",
    price: 68000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 6.2,
    sizes: [],
    description:
      "Нательная икона, чеканный оклад, лик закрыт стеклом. Оборот — тропарь. Носится на отдельной тонкой цепи.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "angel",
    sku: "AG-I-5788",
    name: "Икона Ангел-хранитель",
    category: "icons",
    price: 59000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 5.1,
    sizes: [],
    description:
      "Небольшой образок. Контур крыла выведен одной линией, без лишней насечки. Подходит как крестильный подарок.",
    imageCount: 2,
  },
  {
    slug: "bismarck",
    sku: "AG-N-6804",
    name: "Цепь Bismarck",
    category: "chains",
    price: 210000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 28.0,
    sizes: CHAIN_LEN,
    sizeLabel: "Длина, см",
    description:
      "Классический бисмарк, плотное звено, замок-карабин с ответной коробкой. Вес указан для 55 см — другие длины пересчитываются в ателье.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "anchor",
    sku: "AG-N-6861",
    name: "Цепь Anchor",
    category: "chains",
    price: 96000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 14.6,
    sizes: CHAIN_LEN,
    sizeLabel: "Длина, см",
    description:
      "Якорное плетение среднего звена. Хорошо держит крест и икону, не перекручивается на 50–55 см.",
    imageCount: 2,
  },
  {
    slug: "box-chain",
    sku: "AG-N-6910",
    name: "Цепь Box",
    category: "chains",
    price: 72000,
    metal: "Золото белое",
    assay: "585",
    weightGrams: 8.8,
    sizes: CHAIN_LEN,
    sizeLabel: "Длина, см",
    description:
      "Квадратное звено, белый металл. Для кулона: цепь остаётся геометрией, подвеска — акцентом.",
    imageCount: 2,
  },
  {
    slug: "wedding-classic",
    sku: "AG-W-8001",
    name: "Обручальные Classic",
    category: "wedding",
    price: 154000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 8.4,
    sizes: RING_SIZES,
    sizeLabel: "Размер (пара уточняется)",
    description:
      "Парные кольца классического профиля, ширина 4 мм. Внутренняя гравировка даты и имён — в ателье. Цена за пару, вес суммарный ориентир.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "wedding-satin",
    sku: "AG-W-8044",
    name: "Обручальные Satin",
    category: "wedding",
    price: 168000,
    metal: "Золото жёлтое / белое",
    assay: "585",
    weightGrams: 9.0,
    sizes: RING_SIZES,
    sizeLabel: "Размер (пара уточняется)",
    description:
      "Сатинированная дорожка и полированные рёбра. Можно собрать пару в одном металле или контрастом жёлтое + белое.",
    imageCount: 2,
  },
  {
    slug: "wedding-comfort",
    sku: "AG-W-8112",
    name: "Обручальные Comfort",
    category: "wedding",
    price: 176000,
    metal: "Золото жёлтое",
    assay: "750",
    weightGrams: 10.2,
    sizes: RING_SIZES,
    sizeLabel: "Размер (пара уточняется)",
    description:
      "Comfort fit, 750 проба, ширина 5 мм. Кольцо не режет при суточной носке. Рекомендуем примерку в ателье перед отливкой пары.",
    imageCount: 2,
  },
  {
    slug: "pulse",
    sku: "AG-S-9007",
    name: "SPORT Pulse",
    category: "sport",
    price: 64000,
    metal: "Золото жёлтое / каучук",
    assay: "585",
    weightGrams: 6.5,
    sizes: SPORT_SIZES,
    sizeLabel: "Размер",
    description:
      "Каучуковый браслет с золотой вставкой. Замок скрытый. Линия SPORT — для зала и дороги, металл не на весь обхват.",
    featured: true,
    imageCount: 2,
  },
  {
    slug: "track",
    sku: "AG-S-9042",
    name: "SPORT Track",
    category: "sport",
    price: 48000,
    metal: "Золото жёлтое",
    assay: "585",
    weightGrams: 7.8,
    sizes: RING_SIZES,
    sizeLabel: "Размер",
    description:
      "Геометрическая печатка SPORT: скошенная площадка, чёрное покрытие граней. Держит удар повседневной носки.",
    imageCount: 2,
  },
  {
    slug: "grip",
    sku: "AG-S-9090",
    name: "SPORT Grip",
    category: "sport",
    price: 71000,
    metal: "Золото жёлтое / каучук",
    assay: "585",
    weightGrams: 8.1,
    sizes: SPORT_SIZES,
    sizeLabel: "Размер",
    description:
      "Более широкий SPORT-браслет, золотая планка с винтовым креплением. Каучук заменяется в ателье.",
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

export function categoryCover(slug: CategorySlug): string {
  const first = products.find((p) => p.category === slug);
  return first ? productImage(first, 1) : "/media/hero/poster.svg";
}

export function productImage(product: Product, index = 1): string {
  const n = String(Math.min(index, product.imageCount)).padStart(2, "0");
  return `/media/products/${product.sku}/${n}.svg`;
}

export function productImages(product: Product): string[] {
  return Array.from({ length: product.imageCount }, (_, i) => productImage(product, i + 1));
}

export function productVideoPath(product: Product): string {
  return `/media/products/${product.sku}/proof.mp4`;
}

export function categoryName(slug: CategorySlug): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
