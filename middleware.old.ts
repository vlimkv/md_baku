// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED = ["az", "ru"] as const;

function pickLang(req: NextRequest) {
  const al = (req.headers.get("accept-language") || "").toLowerCase();
  return al.includes("ru") ? "ru" : "az";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // пропускаем next, api и файлы
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const seg = pathname.split("/")[1];
  if (SUPPORTED.includes(seg as any)) return NextResponse.next();

  const lang = pickLang(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};