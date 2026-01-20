// app/not-found.tsx
import { cookies, headers } from "next/headers";
import NotFoundClient from "@/components/NotFoundClient";
import { siteContent, type Lang } from "@/lib/data";

function safeLang(v?: string | null): Lang {
  return v === "ru" ? "ru" : "az";
}

function langFromReferer(referer: string): Lang {
  const m = referer.match(/\/(ru|az)(\/|$)/);
  return safeLang(m?.[1]);
}

export default async function NotFound() {
  const c = await cookies();
  const h = await headers();

  const cookieLang = c.get("lang")?.value;
  const ref = h.get("referer") || "";

  const lang = safeLang(cookieLang) || langFromReferer(ref);

  return <NotFoundClient lang={lang} t={siteContent[lang].notFound} />;
}