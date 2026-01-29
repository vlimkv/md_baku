import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPPORTED = ["az", "ru"] as const;
type Lang = (typeof SUPPORTED)[number];

function isAdmin(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

// function fromAcceptLanguage(req: NextRequest): Lang {
//   const al = (req.headers.get("accept-language") || "").toLowerCase();
//   return al.includes("ru") ? "ru" : "az";
// }

function fromAcceptLanguage(req: NextRequest): Lang {
  return "az"; 
}

function fromCookie(req: NextRequest): Lang | null {
  const v = req.cookies.get("lang")?.value;
  return v === "ru" || v === "az" ? v : null;
}

function isPublicFile(pathname: string) {
  return pathname.includes(".");
}

async function refreshSupabaseSession(req: NextRequest, res: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // пропускаем next, api и файлы
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || isPublicFile(pathname)) {
    return NextResponse.next();
  }

  // ✅ Админка: НЕ языковой редирект, но сессии Supabase обновляем
  if (isAdmin(pathname)) {
    const res = NextResponse.next();
    await refreshSupabaseSession(req, res);
    return res;
  }

  // --- дальше твоя языковая логика 1-в-1 ---
  const seg = pathname.split("/")[1] as Lang | undefined;

  if (seg && SUPPORTED.includes(seg)) {
    const res = NextResponse.next();
    res.cookies.set("lang", seg, { path: "/", sameSite: "lax" });
    return res;
  }

  const lang = fromCookie(req) ?? fromAcceptLanguage(req);

  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(url);
  res.cookies.set("lang", lang, { path: "/", sameSite: "lax" });
  return res;
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};