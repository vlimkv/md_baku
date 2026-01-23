import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const sb = await supabaseServer();
  await sb.auth.signOut();

  const url = new URL("/admin/login", req.url);
  return NextResponse.redirect(url, { status: 303 });
}