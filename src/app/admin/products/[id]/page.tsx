import { notFound } from "next/navigation";
import { AdminFrame } from "@/components/admin/frame";
import { NotAdmin } from "@/components/admin/not-admin";
import { ProductForm } from "@/components/admin/product-form";
import { ensureAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const session = await ensureAdmin();
  if (!session.admin || !session.supabase) {
    return <NotAdmin uuid={session.user!.id} email={session.user!.email} />;
  }
  const { data } = await session.supabase.from("products").select("id, title_ru").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <AdminFrame email={session.user!.email}>
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Каталог</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">{data.title_ru}</h1>
      <p className="mt-2 text-sm text-muted">Цена в рублях. Фото — в хранилище product-media или локальный URL.</p>
      <div className="mt-8">
        <ProductForm productId={id} />
      </div>
    </AdminFrame>
  );
}
