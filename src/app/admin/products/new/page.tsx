import { AdminFrame } from "@/components/admin/frame";
import { NotAdmin } from "@/components/admin/not-admin";
import { ProductForm } from "@/components/admin/product-form";
import { ensureAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await ensureAdmin();
  if (!session.admin) {
    return <NotAdmin uuid={session.user!.id} email={session.user!.email} />;
  }
  return (
    <AdminFrame email={session.user!.email}>
      <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Каталог</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Новое изделие</h1>
      <p className="mt-2 text-sm text-muted">После создания откроется загрузка фото и видео.</p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </AdminFrame>
  );
}
