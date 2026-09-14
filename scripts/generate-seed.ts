import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { categories } from "../src/lib/categories";
import { productImage, products } from "../src/lib/products";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "seed.sql");

function sqlText(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlJson(value: unknown) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const catRows = categories
  .map((c, i) => {
    return `  (${sqlText(c.slug)}, ${sqlText(c.name)}, ${sqlText(c.nameEn)}, ${sqlText(c.blurb)}, ${i + 1}, true)`;
  })
  .join(",\n");

const productRows = products
  .map((p) => {
    const sizeLabel = p.sizeLabel ? sqlText(p.sizeLabel) : "null";
    const stone = p.stone ? sqlText(p.stone) : "null";
    return `  (
    (select id from public.categories where slug = ${sqlText(p.category)}),
    ${sqlText(p.slug)},
    ${sqlText(p.name)},
    ${sqlText(p.description)},
    ${p.price * 100},
    'RUB',
    ${sqlText(p.metal)},
    ${sqlText(p.assay)},
    ${p.weightGrams},
    ${sizeLabel},
    ${sqlJson(p.sizes)},
    ${sqlText(p.sku)},
    ${stone},
    14,
    'published',
    ${p.featured ? "true" : "false"}
  )`;
  })
  .join(",\n");

const mediaRows = products
  .flatMap((p) =>
    Array.from({ length: p.imageCount }, (_, i) => {
      const n = i + 1;
      return `  ((select id from public.products where sku = ${sqlText(p.sku)}), 'photo', ${sqlText(productImage(p, n))}, ${n}, ${n === 1 ? "true" : "false"})`;
    }),
  )
  .join(",\n");

const sql = `-- A.GRAY seed: categories, sample products, local placeholder media, homepage/nav buttons.
-- Run AFTER 001_schema.sql. Re-runnable: upserts by slug/key; media inserted only if product has none.

insert into public.categories (slug, name_ru, name_en, blurb_ru, sort_order, visible)
values
${catRows}
on conflict (slug) do update set
  name_ru = excluded.name_ru,
  name_en = excluded.name_en,
  blurb_ru = excluded.blurb_ru,
  sort_order = excluded.sort_order,
  visible = excluded.visible;

insert into public.products (
  category_id, slug, title_ru, description_ru, price_cents, currency,
  metal, assay, weight_g, size_label, sizes, sku, stone, lead_days, status, featured
)
values
${productRows}
on conflict (slug) do update set
  category_id = excluded.category_id,
  title_ru = excluded.title_ru,
  description_ru = excluded.description_ru,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  metal = excluded.metal,
  assay = excluded.assay,
  weight_g = excluded.weight_g,
  size_label = excluded.size_label,
  sizes = excluded.sizes,
  sku = excluded.sku,
  stone = excluded.stone,
  featured = excluded.featured;

insert into public.product_media (product_id, kind, url, sort_order, is_primary)
select x.product_id, x.kind::public.media_kind, x.url, x.sort_order, x.is_primary
from (values
${mediaRows}
) as x(product_id, kind, url, sort_order, is_primary)
where not exists (
  select 1 from public.product_media pm where pm.product_id = x.product_id
);

insert into public.site_settings (key, label_ru, href, visible, sort_order, meta)
values
  ('nav.catalog', 'Каталог', '/catalog', true, 10, '{"group":"nav"}'::jsonb),
  ('nav.atelier', 'Ателье', '/atelier', true, 20, '{"group":"nav"}'::jsonb),
  ('home.cta_primary', 'Смотреть коллекцию', '/catalog', true, 10, '{"group":"home"}'::jsonb),
  ('home.cta_secondary', 'Ателье', '/atelier', true, 20, '{"group":"home"}'::jsonb),
  ('home.workshop_cta', 'Как попасть', '/atelier', true, 30, '{"group":"home"}'::jsonb)
on conflict (key) do update set
  label_ru = excluded.label_ru,
  href = excluded.href,
  visible = excluded.visible,
  sort_order = excluded.sort_order,
  meta = excluded.meta;
`;

writeFileSync(out, sql);
console.log("wrote", out);
