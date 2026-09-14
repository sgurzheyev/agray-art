"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!configured) return;
    setBusy(true);
    setError(null);
    const supabase = createBrowserSupabase();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError(err.message === "Invalid login credentials" ? "Неверный email или пароль" : err.message);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  if (!configured) {
    return (
      <p className="text-sm leading-relaxed text-muted">
        В <code className="text-ivory">.env.local</code> задайте{" "}
        <code className="text-ivory">NEXT_PUBLIC_SUPABASE_URL</code> и{" "}
        <code className="text-ivory">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Без них витрина работает на
        локальном каталоге, админка — нет.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[11px] tracking-[0.22em] text-gold uppercase">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-gold/25 bg-transparent px-3 py-3 text-ivory outline-none focus:border-gold"
        />
      </label>
      <label className="block">
        <span className="text-[11px] tracking-[0.22em] text-gold uppercase">Пароль</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-gold/25 bg-transparent px-3 py-3 text-ivory outline-none focus:border-gold"
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-gold py-3 text-xs tracking-[0.28em] text-ink uppercase disabled:opacity-60"
      >
        {busy ? "Вход…" : "Войти"}
      </button>
    </form>
  );
}
