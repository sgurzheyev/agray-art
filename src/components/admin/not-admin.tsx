import Link from "next/link";

export function NotAdmin({ uuid, email }: { uuid: string; email?: string | null }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <p className="text-[11px] tracking-[0.28em] text-silver uppercase">Доступ</p>
      <h1 className="mt-3 font-serif text-3xl text-ivory">Пользователь не в admin_users</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Аккаунт {email} вошёл, но не назначен администратором. В SQL editor проекта agray.art:
      </p>
      <pre className="mt-4 overflow-auto border border-silver/20 bg-black p-4 text-xs text-silver">
        {`insert into public.admin_users (user_id, email)
values ('${uuid}', '${email ?? ""}');`}
      </pre>
      <Link href="/admin/login" className="mt-8 inline-block text-xs tracking-[0.2em] text-silver uppercase">
        К входу
      </Link>
    </div>
  );
}
