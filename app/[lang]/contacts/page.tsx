"use client";

import React, { useMemo, useState, useEffect } from "react";
import { sendToTelegram } from "@/lib/actions/contacts";
import { useParams } from "next/navigation";
import {
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  Navigation,
  CheckCircle2,
  Instagram,
  Facebook,
} from "lucide-react";

import { siteContent, Lang } from "@/lib/data";

/* eslint-disable @next/next/no-img-element */

// --- TYPES & UI COMPONENTS ---

const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-10 md:mb-14">
    <div className="flex items-center justify-center gap-3 mb-4">
      <span className="h-px w-10 bg-amber-500/30" />
      <span className="text-[10px] md:text-xs font-semibold text-amber-700 tracking-[0.18em] uppercase px-3 py-1 rounded-full border border-amber-200/60 bg-amber-50/60">
        {subtitle}
      </span>
      <span className="h-px w-10 bg-amber-500/30" />
    </div>

    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight text-center leading-[1.05]">
      {title}
    </h2>
  </div>
);

const InfoCard = ({
  icon: Icon,
  title,
  value,
  sub,
  tone = "neutral",
  onClick,
}: {
  icon: any;
  title: string;
  value: string;
  sub: string;
  tone?: "neutral" | "accent" | "success";
  onClick?: () => void;
}) => {
  const toneStyles =
    tone === "success"
      ? "border-emerald-200/60 bg-emerald-50/30"
      : tone === "accent"
      ? "border-amber-200/60 bg-amber-50/30"
      : "border-gray-200/60 bg-white";

  const iconStyles =
    tone === "success"
      ? "text-emerald-700 bg-emerald-100/60"
      : tone === "accent"
      ? "text-amber-700 bg-amber-100/60"
      : "text-gray-700 bg-gray-100/70";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left",
        "rounded-2xl border",
        toneStyles,
        "p-6 md:p-7",
        "shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)]",
        "transition",
        "hover:shadow-[0_16px_38px_-22px_rgba(0,0,0,0.30)] hover:-translate-y-[1px]",
        "active:translate-y-0",
        "focus:outline-none focus:ring-4 focus:ring-amber-500/10",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconStyles}`}>
          <Icon size={20} strokeWidth={1.75} />
        </div>

        <div className="flex-1">
          <div className="text-[11px] font-semibold text-gray-500 tracking-[0.14em] uppercase">
            {title}
          </div>
          <div className="mt-2 text-lg md:text-xl font-extrabold text-gray-900 leading-tight">
            {value}
          </div>
          <div className="mt-2 text-xs text-gray-500">{sub}</div>
        </div>
      </div>
    </button>
  );
};

const SocialButton = ({
  icon: Icon,
  href,
  label,
  variant = "dark",
}: {
  icon: any;
  href: string;
  label: string;
  variant?: "dark" | "instagram" | "facebook" | "whatsapp";
}) => {
  const styles =
    variant === "instagram"
      ? "bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]"
      : variant === "facebook"
      ? "bg-[#1877F2]"
      : variant === "whatsapp"
      ? "bg-[#25D366]"
      : "bg-gray-900";

  return (
    <a
      href={href}
      target="_blank"
      className={[
        "h-12 rounded-xl",
        "px-4",
        "flex items-center justify-center gap-2",
        "text-white text-xs font-semibold tracking-[0.14em] uppercase",
        "shadow-[0_10px_26px_-18px_rgba(0,0,0,0.35)]",
        "transition",
        "hover:brightness-110 hover:-translate-y-[1px]",
        "active:translate-y-0",
        styles,
      ].join(" ")}
      rel="noreferrer"
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
};
// --- MAIN PAGE COMPONENT ---

export default function ContactPage() {
  const params = useParams();
  // Безопасное получение языка
  const lang = (params?.lang as Lang) || "ru";

  const t = useMemo(() => {
    return (siteContent as any)[lang] ?? siteContent.ru;
  }, [lang]);

  // Ссылки
  const instagramUrl = "https://www.instagram.com/detektorbaku";
  const facebookUrl = "https://facebook.com";
  const mapRouteUrl = "https://www.google.com/maps/dir//Baku,+Azerbaijan"; 

  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    const formData = new FormData(e.currentTarget);
    const result = await sendToTelegram(formData);

    if (result.success) {
      setFormStatus("sent");
    } else {
      setFormStatus("idle");
      alert("Ошибка отправки. Попробуйте позже.");
    }
  };
  
  if (!t || !t.contact) return null;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:pt-14">
        {/* Soft background accents */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className="relative">
              <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[90px]" />
              <div className="absolute top-28 right-10 h-[240px] w-[240px] rounded-full bg-gray-900/5 blur-[70px]" />
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="relative mb-10 md:mb-14">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-[34px] md:text-[64px] font-extrabold text-gray-900 tracking-tight leading-[1.02]">
              {t.contact.hero.title1}
              <span className="block text-amber-600">{t.contact.hero.title2}</span>
            </h1>

            <p className="mt-5 text-sm md:text-lg text-gray-600 leading-relaxed">
              {t.contact.hero.desc}
            </p>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
          <InfoCard
            icon={Phone}
            title={t.contact.cards.phone.title}
            value={t.contact.cards.phone.value}
            sub={t.contact.cards.phone.sub}
            tone="neutral"
            onClick={() => window.open("tel:+994552677811")}
          />
          <InfoCard
            icon={MessageCircle}
            title={t.contact.cards.whatsapp.title}
            value={t.contact.cards.whatsapp.value}
            sub={t.contact.cards.whatsapp.sub}
            tone="success"
            onClick={() => window.open("https://wa.me/994552677811", "_blank")}
          />
          <InfoCard
            icon={MapPin}
            title={t.contact.cards.office.title}
            value={t.contact.cards.office.value}
            sub={t.contact.cards.office.sub}
            tone="accent"
          />
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-7 items-start">
          {/* FORM */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_24px_70px_-55px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute -top-24 -right-24 h-[260px] w-[260px] rounded-full bg-amber-500/10 blur-[60px]" />

              <div className="p-6 md:p-10">
                <div className="mb-8">
                  <div className="text-[11px] font-semibold text-gray-500 tracking-[0.18em] uppercase">
                    {t.contact.form.kicker}
                  </div>
                  <div className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {t.contact.form.title}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{t.contact.form.hint}</div>
                </div>

                {formStatus === "sent" ? (
                  <div className="py-10 md:py-14 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="mt-5 text-xl md:text-2xl font-extrabold text-gray-900">
                      {t.contact.form.sentTitle}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 max-w-sm">
                      {t.contact.form.sentDesc}
                    </div>
                    <button
                      onClick={() => setFormStatus("idle")}
                      className="mt-8 text-xs font-semibold tracking-[0.18em] uppercase text-amber-700 border-b border-amber-200 hover:border-amber-600 transition"
                    >
                      {t.contact.form.sendAgain}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 tracking-[0.16em] uppercase mb-2">
                          {t.contact.form.nameLabel}
                        </label>
                        <input
                          name="name"
                          required
                          type="text"
                          placeholder={t.contact.form.namePlaceholder}
                          className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/60 px-4 text-sm font-semibold text-gray-900 outline-none transition focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 tracking-[0.16em] uppercase mb-2">
                          {t.contact.form.phoneLabel}
                        </label>
                        <input
                          name="phone"
                          required
                          type="tel"
                          placeholder={t.contact.form.phonePlaceholder}
                          className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/60 px-4 text-sm font-semibold text-gray-900 outline-none transition focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 tracking-[0.16em] uppercase mb-2">
                        {t.contact.form.messageLabel}
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder={t.contact.form.messagePlaceholder}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/60 p-4 text-sm font-semibold text-gray-900 outline-none transition focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 resize-none"
                      />
                    </div>

                    <button
                      disabled={formStatus === "sending"}
                      className={[
                        "w-full h-14 rounded-xl",
                        "bg-gray-900 text-white",
                        "text-xs font-semibold tracking-[0.2em] uppercase",
                        "flex items-center justify-center gap-3",
                        "shadow-[0_18px_40px_-26px_rgba(0,0,0,0.6)]",
                        "transition",
                        "hover:bg-amber-600 hover:-translate-y-[1px]",
                        "active:translate-y-0",
                        "disabled:opacity-60 disabled:pointer-events-none",
                      ].join(" ")}
                    >
                      {formStatus === "sending" ? (
                        <span className="animate-pulse">{t.contact.form.sending}</span>
                      ) : (
                        <>
                          {t.contact.form.submit} <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <div className="text-[12px] text-gray-500 leading-relaxed">
                      {t.contact.form.consent}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* MAP */}
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white shadow-[0_24px_70px_-55px_rgba(0,0,0,0.45)] min-h-[320px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.428674403756!2d49.86709241539662!3d40.40926167936601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d40a880b8bd%3A0x981d3f9f3b8b6e6!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2s!4v1646738927426!5m2!1sen!2s"
                className="absolute inset-0 w-full h-full grayscale-[0.9] contrast-125"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="absolute left-4 right-4 top-4">
                <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur px-4 py-3 shadow-[0_12px_28px_-22px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-600 tracking-[0.16em] uppercase">
                        {t.contact.map.label}
                      </div>
                      <div className="text-sm font-extrabold text-gray-900">
                        {t.contact.map.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.open(mapRouteUrl, "_blank")}
                className="absolute bottom-4 right-4 rounded-xl bg-gray-900 text-white px-4 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase shadow-[0_18px_44px_-28px_rgba(0,0,0,0.7)] hover:bg-amber-600 transition flex items-center gap-2"
              >
                <Navigation size={14} /> {t.contact.map.route}
              </button>
            </div>

            {/* SOCIALS */}
            <div className="rounded-3xl border border-gray-200/70 bg-white p-6 md:p-7 shadow-[0_24px_70px_-55px_rgba(0,0,0,0.45)]">
              <div className="text-center">
                <div className="text-[11px] font-semibold text-gray-500 tracking-[0.18em] uppercase">
                  {t.contact.socials.kicker}
                </div>
                <div className="mt-2 text-lg font-extrabold text-gray-900">
                  {t.contact.socials.title}
                </div>
                <div className="mt-2 text-sm text-gray-600">{t.contact.socials.desc}</div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <SocialButton
                  icon={Instagram}
                  href={instagramUrl}
                  label={t.contact.socials.instagram}
                  variant="instagram"
                />
                <SocialButton
                  icon={Facebook}
                  href={facebookUrl}
                  label={t.contact.socials.facebook}
                  variant="facebook"
                />
                <SocialButton
                  icon={MessageCircle}
                  href="https://wa.me/994552677811"
                  label={t.contact.socials.whatsapp}
                  variant="whatsapp"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-14 md:mt-20">
          <SectionHeading title={t.contact.bottom.title} subtitle={t.contact.bottom.subtitle} />
        </div>
      </div>
    </div>
  );
}