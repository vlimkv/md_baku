"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function logoutAction() {
  const sb = await supabaseServer();
  
  // 1. Удаляем сессию на сервере (очищает куки)
  await sb.auth.signOut();

  // 2. Делаем редирект на страницу входа
  redirect("/admin/login");
}