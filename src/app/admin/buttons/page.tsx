import { AdminFrame } from "@/components/admin/frame";
import { NotAdmin } from "@/components/admin/not-admin";
import { ButtonsEditor } from "@/components/admin/buttons-editor";
import { ensureAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminButtonsPage() {
  const session = await ensureAdmin();
  if (!session.admin) {
    return <NotAdmin uuid={session.user!.id} email={session.user!.email} />;
  }
  return (
    <AdminFrame email={session.user!.email}>
      <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Сайт</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Кнопки</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Подписи и ссылки шапки и главной. Скройте кнопку — она пропадёт с витрины, код трогать не нужно.
      </p>
      <div className="mt-8">
        <ButtonsEditor />
      </div>
    </AdminFrame>
  );
}
