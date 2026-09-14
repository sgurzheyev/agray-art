import { AdminFrame } from "@/components/admin/frame";
import { NotAdmin } from "@/components/admin/not-admin";
import { CategoriesEditor } from "@/components/admin/categories-editor";
import { ensureAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await ensureAdmin();
  if (!session.admin) {
    return <NotAdmin uuid={session.user!.id} email={session.user!.email} />;
  }
  return (
    <AdminFrame email={session.user!.email}>
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Витрина</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Категории</h1>
      <p className="mt-2 text-sm text-muted">Переименование, порядок, скрытие. Slug лучше не менять у уже открытых ссылок.</p>
      <div className="mt-8">
        <CategoriesEditor />
      </div>
    </AdminFrame>
  );
}
