import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  RefreshCcw, Mail, Phone, CheckCircle2, XCircle, 
  AlertTriangle, ChevronLeft, FileText, HelpCircle 
} from "lucide-react";
import type { Lang } from "@/lib/data";

type Props = {
  params: Promise<{ lang: string }>;
};

// --- КОНТЕНТ (RU/AZ) ---
const CONTENT = {
  ru: {
    metaTitle: "Возврат и обмен | MD Baku",
    metaDesc: "Условия возврата и обмена товаров. Правила, сроки и инструкции.",
    back: "На главную",
    header: {
      title: "Условия возврата и обмена",
      subtitle: "Ознакомьтесь с правилами обращения при возврате товаров."
    },
    contact: {
      title: "Куда обращаться?",
      desc: "Обращения клиентов принимаются только в письменной форме.",
      emailLabel: "Email для заявок:",
      email: "detektorbaku@gmail.com",
      phoneLabel: "Для справок:",
      phones: ["+994 55 267 78 11", "+994 70 266 78 11"],
      requirementsTitle: "В письме укажите:",
      requirements: [
        "Номер заказа (в теме письма)",
        "Суть обращения (обмен, возврат, жалоба)",
        "Причину обращения",
        "Для обмена: марку и модель нового товара"
      ]
    },
    sections: [
      {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        title: "Товары надлежащего качества",
        subtitle: "Если товар вам не подошел",
        text: "Согласно ст. 15 Закона АР «О защите прав потребителей», вы можете вернуть или обменять товар в течение 14 дней.",
        list: [
          "Товар не использовался",
          "Сохранены упаковка, пломбы и документы",
          "Есть чек или квитанция о покупке"
        ],
        note: "Расходы на доставку оплачивает покупатель."
      },
      {
        icon: XCircle,
        color: "text-rose-600",
        bg: "bg-rose-50",
        title: "Товары ненадлежащего качества",
        subtitle: "Если обнаружен брак",
        text: "Если товар неисправен из-за производственного дефекта, вы имеете право на:",
        list: [
          "Замену на ту же модель",
          "Замену на другую модель с перерасчетом",
          "Бесплатный ремонт",
          "Полный возврат денег"
        ],
        note: "Незначительные отличия в дизайне не являются браком."
      }
    ],
    process: {
      title: "Процесс возврата",
      steps: [
        { title: "Заявка", text: "Напишите нам на email или позвоните." },
        { title: "Форма", text: "Заполните форму возврата (вышлем на email)." },
        { title: "Отправка", text: "Отправьте товар почтой или курьером вместе с чеком." },
      ]
    },
    exceptions: {
      title: "⚠️ Товары, не подлежащие возврату",
      text: "Согласно постановлению Кабинета Министров АР №114, возврату не подлежат:",
      items: [
        "Сложная техника (металлоискатели, электроника)",
        "Программное обеспечение и карты памяти",
        "Средства личной гигиены и косметика",
        "Текстиль и нижнее бельё"
      ]
    },
    footerInfo: "Все обращения рассматриваются в течение 3 рабочих дней."
  },
  az: {
    metaTitle: "Qaytarılma və Dəyişdirilmə | MD Baku",
    metaDesc: "Malların qaytarılması və dəyişdirilməsi şərtləri. Qaydalar və müddətlər.",
    back: "Ana səhifəyə",
    header: {
      title: "Qaytarılma və Dəyişdirilmə",
      subtitle: "Malların qaytarılması zamanı müraciət qaydaları ilə tanış olun."
    },
    contact: {
      title: "Hara müraciət etməli?",
      desc: "Müştəri müraciətləri yalnız yazılı formada qəbul edilir.",
      emailLabel: "Müraciət üçün Email:",
      email: "detektorbaku@gmail.com",
      phoneLabel: "Məlumat üçün:",
      phones: ["+994 55 267 78 11", "+994 70 266 78 11"],
      requirementsTitle: "Məktubda qeyd edin:",
      requirements: [
        "Sifariş nömrəsi (mövzu hissəsində)",
        "Müraciətin mahiyyəti (dəyişdirmə, qaytarma, şikayət)",
        "Müraciət səbəbi",
        "Dəyişdirmə üçün: yeni məhsulun marka və modeli"
      ]
    },
    sections: [
      {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        title: "Keyfiyyətli malların qaytarılması",
        subtitle: "Əgər məhsul sizə uyğun gəlmədisə",
        text: "AR «İstehlakçıların hüquqlarının müdafiəsi haqqında» Qanunun 15-ci maddəsinə əsasən, 14 gün ərzində malı qaytara və ya dəyişdirə bilərsiniz.",
        list: [
          "Məhsul istifadə olunmayıb",
          "Qablaşdırma, sənədlər və əmtəə görünüşü qorunub",
          "Çek və ya qəbz təqdim olunub"
        ],
        note: "Qaytarılma zamanı çatdırılma xərcləri alıcı tərəfindən ödənilir."
      },
      {
        icon: XCircle,
        color: "text-rose-600",
        bg: "bg-rose-50",
        title: "Qüsurlu malların qaytarılması",
        subtitle: "İstehsalat xətası aşkarlandığı halda",
        text: "Əgər məhsul istehsalat qüsuruna görə istifadəyə yararsızdırsa, hüquqlarınız:",
        list: [
          "Eyni model ilə əvəzlənmə",
          "Başqa model ilə əvəzlənmə (qiymət fərqi ilə)",
          "Ödənişsiz təmir",
          "Tam geri ödəniş"
        ],
        note: "Dizayndakı cüzi fərqlər qüsur hesab edilmir."
      }
    ],
    process: {
      title: "Qaytarılma prosesi",
      steps: [
        { title: "Müraciət", text: "Email və ya telefon vasitəsilə əlaqə saxlayın." },
        { title: "Forma", text: "Qaytarılma formasını doldurun (email ilə göndərilir)." },
        { title: "Göndərilmə", text: "Məhsulu çeklə birlikdə poçt və ya kuryerlə göndərin." },
      ]
    },
    exceptions: {
      title: "⚠️ Qaytarılmayan mallar",
      text: "AR Nazirlər Kabinetinin 114 saylı qərarına əsasən, aşağıdakılar qaytarılmır:",
      items: [
        "Mürəkkəb texniki cihazlar (metal detektorlar, elektronika)",
        "Proqram təminatı və yaddaş kartları",
        "Şəxsi gigiyena vasitələri və kosmetika",
        "Tekstil və alt geyimləri"
      ]
    },
    footerInfo: "Bütün müraciətlərə 3 iş günü ərzində baxılır."
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = CONTENT[lang as Lang] || CONTENT.ru;
  return {
    title: t.metaTitle,
    description: t.metaDesc,
  };
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;

  if (lang !== "ru" && lang !== "az") notFound();

  const t = CONTENT[lang as Lang];

  return (
    <div className="min-h-[100dvh] bg-[#F8F9FA] pb-20">
      
      {/* HEADER: Убрал белый фон и границы, чтобы не было "обрыва" */}
      <div className="pt-12 pb-12 md:pt-20 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Иконка теперь имеет белый фон и тень, чтобы выделяться */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-blue-600 rounded-[2rem] mb-8 shadow-md shadow-slate-200">
            <RefreshCcw size={40} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t.header.title}
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed mb-4 max-w-2xl mx-auto">
            {t.header.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-4 space-y-8">
        
        {/* --- 1. CONTACT INFO CARD --- */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex flex-col md:flex-row gap-10 relative z-10">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Mail className="text-amber-600" size={20} /> {t.contact.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 font-medium">{t.contact.desc}</p>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.contact.emailLabel}</div>
                            <a href={`mailto:${t.contact.email}`} className="text-lg font-bold text-amber-600 hover:underline">{t.contact.email}</a>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.contact.phoneLabel}</div>
                            <div className="flex flex-col gap-1">
                                {t.contact.phones.map(p => (
                                    <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="text-slate-900 font-bold hover:text-amber-600 transition">{p}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        {t.contact.requirementsTitle}
                    </h4>
                    <ul className="space-y-3">
                        {t.contact.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                                {req}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* --- 2. RULES GRID (Good vs Bad) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.sections.map((sec, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col">
                    <div className={`w-12 h-12 ${sec.bg} ${sec.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <sec.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{sec.title}</h3>
                    <p className="text-sm text-slate-400 font-bold mb-4">{sec.subtitle}</p>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        {sec.text}
                    </p>
                    
                    <ul className="space-y-3 mb-6 flex-1">
                        {sec.list.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                                <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${sec.color}`} />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="bg-slate-50 p-3 rounded-xl text-xs font-medium text-slate-500 flex items-start gap-2">
                        <HelpCircle size={14} className="mt-0.5 shrink-0" />
                        {sec.note}
                    </div>
                </div>
            ))}
        </div>

        {/* --- 3. PROCESS STEPS --- */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 text-center">{t.process.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>

                {t.process.steps.map((step, i) => (
                    <div key={i} className="text-center relative z-10 bg-white md:bg-transparent">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-lg shadow-slate-900/20">
                            {i + 1}
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-slate-500 px-4">{step.text}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* --- 4. EXCEPTIONS (Warning) --- */}
        <div className="bg-amber-50 rounded-3xl border border-amber-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
                <AlertTriangle className="text-amber-600" size={32} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">{t.exceptions.title}</h3>
                <p className="text-sm text-amber-800/80 mb-4 font-medium leading-relaxed">
                    {t.exceptions.text}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {t.exceptions.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-white/50 px-3 py-2 rounded-lg">
                            <XCircle size={12} className="text-amber-600/60" /> {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="text-center text-slate-400 text-xs font-medium pb-8">
            {t.footerInfo}
        </div>
      </div>
    </div>
  );
}