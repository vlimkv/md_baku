// app/[lang]/layout.tsx
import { notFound } from "next/navigation";
import type { Lang } from "@/lib/data";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  if (lang !== "az" && lang !== "ru") notFound();

  return <>{children}</>;
}
