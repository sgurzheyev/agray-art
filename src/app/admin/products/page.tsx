import Link from "next/link";
import { AdminFrame } from "@/components/admin/frame";
import { NotAdmin } from "@/components/admin/not-admin";
import { ProductsTable } from "@/components/admin/products-table";
import { ensureAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await ensureAdmin();
  if (!session.admin) {
    return <NotAdmin uuid={session.user!.id} email={session.user!.email} />;
  }
  return (
    <AdminFrame email={session.user!.email}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Каталог</p>
          <h1 className="mt-2 font-serif text-4xl text-ivory">Изделия</h1>
        </div>
        <Link href="/admin/products/new" className="text-xs tracking-[0.2em] text-silver uppercase">
          + новое
        </Link>
      </div>
      <div className="mt-8">
        <ProductsTable />
      </div>
    </AdminFrame>
  );
}
