import Link from "next/link";
import { AdminFrame } from "@/components/admin/frame";
import { NotAdmin } from "@/components/admin/not-admin";
import { ensureAdmin } from "@/lib/admin-session";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const session = await ensureAdmin();
  if (!session.admin || !session.supabase) {
    return <NotAdmin uuid={session.user!.id} email={session.user!.email} />;
  }

  const supabase = session.supabase;
  const [products, published, drafts, hidden, orders, categories] = await Promise.all([
    supabase.from("products").select("id, title_ru, sku, price_cents, status, featured").order("updated_at", { ascending: false }).limit(8),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "hidden"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    ["Опубликовано", published.count ?? 0],
    ["Черновики", drafts.count ?? 0],
    ["Скрыто", hidden.count ?? 0],
    ["Категории", categories.count ?? 0],
    ["Заказы", orders.count ?? 0],
  ] as const;

  return (
    <AdminFrame email={session.user!.email}>
      <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Ателье</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Обзор</h1>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(([label, n]) => (
          <div key={label} className="border border-silver/20 p-4">
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase">{label}</p>
            <p className="mt-2 font-serif text-3xl text-silver">{n}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex gap-3">
        <Link href="/admin/products/new" className="btn-glass px-5 py-2.5 text-xs tracking-[0.2em]">
          Новое изделие
        </Link>
        <Link href="/admin/buttons" className="btn-glass-ghost px-5 py-2.5 text-xs tracking-[0.2em]">
          Кнопки на сайте
        </Link>
      </div>
      <h2 className="mt-12 font-serif text-2xl text-ivory">Недавние</h2>
      <ul className="mt-4 divide-y divide-silver/15 border-y border-silver/15">
        {(products.data ?? []).map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
            <Link href={`/admin/products/${p.id}`} className="hover:text-silver">
              {p.title_ru}{" "}
              <span className="text-muted">{p.sku}</span>
            </Link>
            <span className="text-silver">
              {formatPrice(Math.round(Number(p.price_cents) / 100))}
              <span className="ml-3 text-xs text-muted uppercase">{p.status}</span>
            </span>
          </li>
        ))}
      </ul>
    </AdminFrame>
  );
}
