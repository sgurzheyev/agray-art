import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return { configured: false, user: null, admin: false, supabase: null };
  }
  const supabase = await createServerSupabase();
  if (!supabase) {
    return { configured: false, user: null, admin: false, supabase: null };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { configured: true, user: null, admin: false, supabase };
  }
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return { configured: true, user, admin: Boolean(data), supabase };
}

export async function ensureAdmin() {
  const session = await getAdminSession();
  if (!session.configured) {
    redirect("/admin/login");
  }
  if (!session.user) redirect("/admin/login");
  return session;
}
