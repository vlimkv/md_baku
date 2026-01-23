import "server-only";
import { supabaseServer } from "@/lib/supabase/server";

export async function requireAdminOrEditor() {
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();

  if (!data.user) throw new Error("UNAUTHORIZED");

  const { data: profile, error } = await sb
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (error) throw new Error(error.message);

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    throw new Error("FORBIDDEN");
  }

  return { user: data.user, role: profile.role as "admin" | "editor" };
}