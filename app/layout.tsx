import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

import ClientLayout from "../components/layout/ClientLayout";
import { LangProvider } from "@/components/layout/LangProvider";
import { cookies } from "next/headers";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
});

export const metadata: Metadata = {
  title: "Metallodetektor Baku | MD Baku - Azər Manafov",
  description: "Bakıda ən müasir metal axtaran cihazlar, icarə və satış.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await cookies();
  const lang = c.get("lang")?.value === "ru" ? "ru" : "az";

  return (
    <html lang={lang}>
      <body className={`${montserrat.variable} ${openSans.variable} font-sans`}>
        <LangProvider>
          <ClientLayout>{children}</ClientLayout>
        </LangProvider>
      </body>
    </html>
  );
}