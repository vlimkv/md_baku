// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED = ["az", "ru"] as const;
type Lang = (typeof SUPPORTED)[number];

function fromAcceptLanguage(req: NextRequest): Lang {
  const al = (req.headers.get("accept-language") || "").toLowerCase();
  return al.includes("ru") ? "ru" : "az";
}

function fromCookie(req: NextRequest): Lang | null {
  const v = req.cookies.get("lang")?.value;
  return v === "ru" || v === "az" ? v : null;
}

function isPublicFile(pathname: string) {
  return pathname.includes("."); // /favicon.ico, /robots.txt, /images/.. etc
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // пропускаем next, api и файлы
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || isPublicFile(pathname)) {
    return NextResponse.next();
  }

  const seg = pathname.split("/")[1] as Lang | undefined;

  // если URL уже с языком — просто обновим cookie lang и пропускаем дальше
  if (seg && SUPPORTED.includes(seg)) {
    const res = NextResponse.next();
    res.cookies.set("lang", seg, { path: "/", sameSite: "lax" });
    return res;
  }

  // иначе выбираем язык: cookie -> accept-language
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