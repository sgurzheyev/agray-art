import { AdminFrame } from "@/components/admin/frame";
import { NotAdmin } from "@/components/admin/not-admin";
import { MediaLibrary } from "@/components/admin/media-library";
import { ensureAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const session = await ensureAdmin();
  if (!session.admin) {
    return <NotAdmin uuid={session.user!.id} email={session.user!.email} />;
  }
  return (
    <AdminFrame email={session.user!.email}>
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Файлы</p>
      <h1 className="mt-2 font-serif text-4xl text-ivory">Медиатека</h1>
      <p className="mt-2 text-sm text-muted">
        Снимки и ролики изделий. Загрузка новых — в карточке изделия. Bucket: product-media.
      </p>
      <div className="mt-8">
        <MediaLibrary />
      </div>
    </AdminFrame>
  );
}
