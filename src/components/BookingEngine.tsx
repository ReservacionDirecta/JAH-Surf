import { useState, useMemo, type ReactNode } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Users,
  MessageCircle,
  User,
  Phone,
  Zap,
  Waves,
  CreditCard,
  QrCode,
  Building2,
  Copy,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PRICE_TABLES } from '../constants';
import { formatLatinDateInput, parseLatinDate } from '../utils/date';
import { toWhatsAppNumber } from '../utils/whatsapp';
import { useLanguage, formatDualPrice, toUsd, type Language } from '../i18n';

type Category = 'grupales' | 'individuales' | 'paddle' | 'otras';
type Step = 1 | 2 | 3;
type PaymentMethod = 'link' | 'qr' | 'transfer';

const TIME_OPTIONS = ['9hs a 11hs', '12hs a 2pm', '3pm a 5pm'];

const COPY = {
  es: {
    steps: ['Clase y fecha', 'Tus datos', 'Pago'],
    categories: {
      grupales: 'Grupales',
      individuales: 'Individuales',
      paddle: 'Paddle',
      otras: 'Otras',
    },
    step1Title1: '1. Tipo de clase',
    step1Title2: '2. Selecciona tu plan',
    classesPerMonth: (n: number) => `${n} clases al mes`,
    singleSession: 'Sesión única',
    startDate: '3. Fecha de inicio',
    datePlaceholder: 'dd/mm/aaaa',
    preferredTime: 'Horario preferido',
    participants: 'Participantes',
    estimatedTotal: 'Total estimado',
    invalidDate: 'Fecha inválida. Usa el formato dd/mm/aaaa.',
    pastDate: 'La fecha no puede ser en el pasado.',
    person: 'persona',
    people: 'personas',
    total: 'Total',
    fullName: 'Nombre completo',
    namePlaceholder: 'Ej. Valeria Mendoza',
    whatsappLabel: 'WhatsApp de contacto',
    privacyNote: 'Tus datos se usan únicamente para coordinar tu clase en San Bartolo, Lima y enviarte la confirmación por WhatsApp.',
    summaryTitle: 'Resumen de reserva',
    dateLabel: 'fecha',
    timeLabel: 'horario',
    choosePayment: 'Elige tu método de pago',
    paymentMethods: {
      link: { label: 'Link de Pago', subtitle: 'Culqi / Niubiz / Tarjeta' },
      qr: { label: 'QR Yape / Plin', subtitle: 'Pago instantáneo' },
      transfer: { label: 'Transferencia', subtitle: 'BCP / Interbank / BBVA' },
    },
    linkTitle: 'Link de Pago Seguro',
    linkDesc: 'Paga con tarjeta de crédito o débito (Visa, Mastercard, Amex) vía Culqi / MercadoPago / Niubiz.',
    linkCta: (soles: number) => `Ir al Link de Pago (${formatDualPrice(soles)})`,
    qrNumberLabel: 'Número Yape / Plin',
    qrAmountLabel: 'Monto exacto',
    copyAmount: 'Copiar monto',
    copy: 'Copiar',
    copied: 'Copiado',
    accountLabel: 'N° de Cuenta',
    cciLabel: 'CCI',
    copyCci: 'Copiar CCI',
    disclaimer: '* Sujeto a disponibilidad y condiciones del mar en San Bartolo. Envía tu comprobante por WhatsApp para confirmar.',
    confirmedBadge: 'Reserva registrada',
    codeLabel: 'Código',
    sendVoucher: 'Enviar comprobante por WhatsApp',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    confirmBooking: 'Confirmar reserva',
    processing: 'Procesando...',
    promoBadge: '10% OFF',
    promoText: '10% OFF en matrículas de verano (reservas anticipadas)',
    promoCta: 'Reservar por WhatsApp',
    promoWaMsg: 'Hola JAH SURF Peru, quiero aprovechar el 10% OFF en matrículas de verano (reserva anticipada).',
  },
  en: {
    steps: ['Session & Swell', 'Your Info', 'Lock It In'],
    categories: {
      grupales: 'Group Crew',
      individuales: '1-on-1 Coaching',
      paddle: 'SUP / Paddle',
      otras: 'Quiver & Extras',
    },
    step1Title1: '1. Pick your session',
    step1Title2: '2. Choose your pack',
    classesPerMonth: (n: number) => `${n} sessions / month`,
    singleSession: 'Single drop-in session',
    startDate: '3. Paddle-out date',
    datePlaceholder: 'dd/mm/yyyy',
    preferredTime: 'Preferred tide / time',
    participants: 'Surfers',
    estimatedTotal: 'Estimated total',
    invalidDate: 'Invalid date. Use dd/mm/yyyy format.',
    pastDate: 'Date cannot be in the past.',
    person: 'surfer',
    people: 'surfers',
    total: 'Total',
    fullName: 'Full name',
    namePlaceholder: 'e.g. Alex Morgan',
    whatsappLabel: 'WhatsApp number',
    privacyNote: 'We only use your info to coordinate your San Bartolo lineup session and send your WhatsApp confirmation.',
    summaryTitle: 'Session summary',
    dateLabel: 'date',
    timeLabel: 'session',
    choosePayment: 'Choose how to lock it in',
    paymentMethods: {
      link: { label: 'Payment Link', subtitle: 'Culqi / Niubiz / Card' },
      qr: { label: 'Yape / Plin QR', subtitle: 'Instant transfer' },
      transfer: { label: 'Bank Transfer', subtitle: 'BCP / Interbank / BBVA' },
    },
    linkTitle: 'Secure Payment Link',
    linkDesc: 'Pay by credit or debit card (Visa, Mastercard, Amex) via Culqi / MercadoPago / Niubiz.',
    linkCta: (soles: number) => `Pay Now (${formatDualPrice(soles)})`,
    qrNumberLabel: 'Yape / Plin Number',
    qrAmountLabel: 'Exact amount',
    copyAmount: 'Copy amount',
    copy: 'Copy',
    copied: 'Copied!',
    accountLabel: 'Account Number',
    cciLabel: 'CCI',
    copyCci: 'Copy CCI',
    disclaimer: '* Subject to swell & ocean conditions in San Bartolo. Send your receipt on WhatsApp to hit the lineup.',
    confirmedBadge: 'Stoked — Session locked in!',
    codeLabel: 'Booking Code',
    sendVoucher: 'Send receipt on WhatsApp',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    confirmBooking: 'Lock in my session',
    processing: 'Locking in...',
    promoBadge: '10% OFF',
    promoText: '10% OFF summer enrollments — early bird dawn patrol',
    promoCta: 'Book on WhatsApp',
    promoWaMsg: 'Hey JAH SURF Peru! Stoked to claim the 10% OFF summer early-bird enrollment.',
  },
} as const;

const CATEGORY_ICONS: { id: Category; icon: typeof Users }[] = [
  { id: 'grupales', icon: Users },
  { id: 'individuales', icon: User },
  { id: 'paddle', icon: Waves },
  { id: 'otras', icon: Zap },
];

const PAYMENT_ICONS: { id: PaymentMethod; icon: typeof CreditCard }[] = [
  { id: 'link', icon: CreditCard },
  { id: 'qr', icon: QrCode },
  { id: 'transfer', icon: Building2 },
];

const YAPE_PLIN_NUMBER = '987 654 321';
const YAPE_PLIN_HOLDER = 'JAH SURF PERU S.A.C.';

const BANK_ACCOUNTS = [
  {
    bank: 'BCP',
    type: 'Cuenta Corriente Soles',
    account: '193-2456789-0-12',
    cci: '00219300245678901215',
  },
  {
    bank: 'Interbank',
    type: 'Cuenta Simple Soles',
    account: '200-3004567891',
    cci: '00320001300456789132',
  },
  {
    bank: 'BBVA',
    type: 'Cuenta Ahorros Soles',
    account: '0011-0123-0200456789',
    cci: '01112300020045678901',
  },
];

interface BookingEngineProps {
  defaultCategory?: Category;
  defaultPlanIndex?: number;
  onClose?: () => void;
}

const FormField = ({ icon: Icon, label, children }: { icon: typeof User; label: string; children: ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
    <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
      <Icon size={18} className="text-slate-400 shrink-0" />
      {children}
    </div>
  </div>
);

const CopyButton = ({ value, label, lang }: { value: string; label?: string; lang: Language }) => {
  const [copied, setCopied] = useState(false);
  const t = COPY[lang];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 touch-manipulation ${
        copied
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
      }`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? t.copied : label || t.copy}
    </button>
  );
};

const StepOne = ({
  lang,
  category,
  setCategory,
  planIndex,
  setPlanIndex,
  numPeople,
  setNumPeople,
  date,
  setDate,
  time,
  setTime,
  dateError,
  plans,
  totalPrice,
}: {
  lang: Language;
  category: Category;
  setCategory: (c: Category) => void;
  planIndex: number;
  setPlanIndex: (i: number) => void;
  numPeople: number;
  setNumPeople: (n: number) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  dateError: string;
  plans: readonly { name: string; price: number; classesPerMonth?: number }[];
  totalPrice: number;
}) => {
  const t = COPY[lang];
  const selectedPlan = plans[planIndex] || plans[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t.step1Title1}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CATEGORY_ICONS.map(({ id, icon: Icon }) => {
            const active = category === id;
            return (
              <button
                type="button"
                key={id}
                onClick={() => {
                  setCategory(id);
                  setPlanIndex(0);
                }}
                className={`relative flex flex-col items-center justify-center gap-2 min-h-[44px] py-3.5 px-3 rounded-2xl text-xs font-bold transition-all touch-manipulation ${
                  active
                    ? 'bg-primary text-white shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-1'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon size={20} />
                {t.categories[id]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t.step1Title2}</p>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {plans.map((plan, i) => {
            const selected = i === planIndex;
            return (
              <button
                type="button"
                key={`${plan.name}-${i}`}
                onClick={() => setPlanIndex(i)}
                className={`w-full text-left p-4 min-h-[44px] rounded-2xl border-2 transition-all flex items-center justify-between gap-3 touch-manipulation ${
                  selected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-slate-200/70 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selected ? 'border-primary bg-primary text-white' : 'border-slate-300'
                      }`}
                    >
                      {selected && <Check size={10} strokeWidth={3} />}
                    </span>
                    <p className="font-bold text-slate-900 text-sm truncate">{plan.name}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 pl-6">
                    {plan.classesPerMonth ? t.classesPerMonth(plan.classesPerMonth) : t.singleSession}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-slate-900 text-base">S/ {plan.price}</p>
                  <p className="text-[11px] font-semibold text-slate-400">~${toUsd(plan.price)} USD</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FormField icon={Calendar} label={t.startDate}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              value={date}
              onChange={(e) => setDate(formatLatinDateInput(e.target.value))}
              placeholder={t.datePlaceholder}
              className="flex-1 min-w-0 bg-transparent outline-none text-base sm:text-sm font-medium text-slate-900"
            />
          </FormField>
          {dateError && <p className="text-xs text-red-500 mt-1.5 font-medium">{dateError}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {t.preferredTime}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setTime(opt)}
                className={`min-h-[44px] py-3 px-2 rounded-2xl text-xs font-bold transition-all touch-manipulation ${
                  time === opt
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{t.participants}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors font-bold touch-manipulation"
            >
              −
            </button>
            <span className="w-7 text-center font-bold text-slate-900 text-base">{numPeople}</span>
            <button
              type="button"
              onClick={() => setNumPeople(numPeople + 1)}
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors font-bold touch-manipulation"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t.estimatedTotal}</p>
          <p className="text-xl sm:text-2xl font-extrabold text-primary">{formatDualPrice(totalPrice)}</p>
          <p className="text-xs text-slate-500">{selectedPlan.name}</p>
        </div>
      </div>
    </div>
  );
};

const StepTwo = ({
  lang,
  name,
  setName,
  whatsapp,
  setWhatsapp,
  category,
  planName,
  numPeople,
  date,
  time,
  totalPrice,
}: {
  lang: Language;
  name: string;
  setName: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
  category: Category;
  planName: string;
  numPeople: number;
  date: string;
  time: string;
  totalPrice: number;
}) => {
  const t = COPY[lang];
  const categoryLabel = t.categories[category];

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{categoryLabel}</p>
            <p className="text-sm font-bold text-slate-900">
              {planName} · {numPeople} {numPeople === 1 ? t.person : t.people}
            </p>
            <p className="text-xs text-slate-500">
              {date} · {time}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{t.total}</p>
          <p className="text-lg font-extrabold text-primary">{formatDualPrice(totalPrice)}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField icon={User} label={t.fullName}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-900"
          />
        </FormField>
        <FormField icon={Phone} label={t.whatsappLabel}>
          <input
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+51 900 000 000"
            className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-900"
          />
        </FormField>
      </div>

      <p className="text-xs text-slate-500 flex items-center gap-2">
        <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
        {t.privacyNote}
      </p>
    </div>
  );
};

const StepThree = ({
  lang,
  category,
  planName,
  numPeople,
  date,
  time,
  totalPrice,
  name,
  whatsapp,
  paymentMethod,
  setPaymentMethod,
}: {
  lang: Language;
  category: Category;
  planName: string;
  numPeople: number;
  date: string;
  time: string;
  totalPrice: number;
  name: string;
  whatsapp: string;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
}) => {
  const t = COPY[lang];
  const categoryLabel = t.categories[category];

  return (
    <div className="space-y-5">
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 space-y-3 border border-slate-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t.summaryTitle}</p>
            <p className="font-bold text-slate-900 text-base">{planName}</p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
            {categoryLabel}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center py-1">
          <div>
            <Users size={15} className="mx-auto text-slate-400 mb-1" />
            <p className="font-bold text-slate-900 text-sm">{numPeople}</p>
            <p className="text-[11px] text-slate-400">{t.people}</p>
          </div>
          <div>
            <Calendar size={15} className="mx-auto text-slate-400 mb-1" />
            <p className="font-bold text-slate-900 text-sm">{date}</p>
            <p className="text-[11px] text-slate-400">{t.dateLabel}</p>
          </div>
          <div>
            <Clock size={15} className="mx-auto text-slate-400 mb-1" />
            <p className="font-bold text-slate-900 text-sm">{time}</p>
            <p className="text-[11px] text-slate-400">{t.timeLabel}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-200/80 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500">
          <span>
            {name} · {whatsapp}
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-primary">
            {t.total}: {formatDualPrice(totalPrice)}
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">{t.choosePayment}</p>
        <div className="grid grid-cols-3 gap-2.5">
          {PAYMENT_ICONS.map(({ id, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setPaymentMethod(id)}
              className={`flex flex-col items-center justify-center text-center min-h-[44px] p-3 rounded-2xl border-2 transition-all touch-manipulation ${
                paymentMethod === id
                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                  : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Icon size={20} className="mb-1.5" />
              <span className="text-xs font-bold leading-tight">{t.paymentMethods[id].label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                {t.paymentMethods[id].subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === 'link' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">{t.linkTitle}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.linkDesc}</p>
            </div>
            <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
          </div>
          <a
            href={`https://pagos.jahsurfperu.com/checkout?amount=${totalPrice}&plan=${encodeURIComponent(planName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] bg-slate-900 text-white py-3 px-4 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors touch-manipulation"
          >
            <ExternalLink size={14} />
            {t.linkCta(totalPrice)}
          </a>
        </div>
      )}

      {paymentMethod === 'qr' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shrink-0 shadow-sm">
              <QrCode size={88} className="text-slate-900" strokeWidth={1.5} />
            </div>
            <div className="flex-1 w-full space-y-2.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-bold">
                  Yape
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-700 text-[11px] font-bold">
                  Plin
                </span>
                <span className="text-xs text-slate-500 font-medium">{YAPE_PLIN_HOLDER}</span>
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">
                <div className="text-left">
                  <p className="text-[11px] text-slate-400">{t.qrNumberLabel}</p>
                  <p className="text-sm font-bold text-slate-900">{YAPE_PLIN_NUMBER}</p>
                </div>
                <CopyButton value={YAPE_PLIN_NUMBER} lang={lang} />
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">
                <div className="text-left">
                  <p className="text-[11px] text-slate-400">{t.qrAmountLabel}</p>
                  <p className="text-sm font-bold text-primary">{formatDualPrice(totalPrice)}</p>
                </div>
                <CopyButton value={String(totalPrice)} label={t.copyAmount} lang={lang} />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'transfer' && (
        <div className="space-y-2.5">
          {BANK_ACCOUNTS.map((acc) => (
            <div key={acc.bank} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{acc.bank}</span>
                <span className="text-[11px] text-slate-500">{acc.type}</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400">{t.accountLabel}</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{acc.account}</p>
                </div>
                <CopyButton value={acc.account} lang={lang} />
              </div>
              <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400">{t.cciLabel}</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{acc.cci}</p>
                </div>
                <CopyButton value={acc.cci} label={t.copyCci} lang={lang} />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">{t.disclaimer}</p>
    </div>
  );
};

export const BookingEngine = ({ defaultCategory, defaultPlanIndex, onClose }: BookingEngineProps) => {
  const { lang } = useLanguage();
  const t = COPY[lang];

  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<Category>(defaultCategory || 'grupales');
  const [planIndex, setPlanIndex] = useState(defaultPlanIndex ?? 0);
  const [numPeople, setNumPeople] = useState(1);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_OPTIONS[0]);
  const [whatsapp, setWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [dateError, setDateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  const plans = PRICE_TABLES[category];
  const selectedPlan = plans[planIndex] || plans[0];
  const totalPrice = selectedPlan.price * numPeople;

  const canAdvance = useMemo(() => {
    if (step === 1) return Boolean(date.trim());
    if (step === 2) return Boolean(name.trim() && whatsapp.trim());
    return true;
  }, [step, name, date, whatsapp]);

  const handleNext = () => {
    if (step === 1) {
      const parsed = parseLatinDate(date);
      if (!parsed) {
        setDateError(t.invalidDate);
        return;
      }
      if (parsed < new Date(new Date().setHours(0, 0, 0, 0))) {
        setDateError(t.pastDate);
        return;
      }
      setDateError('');
    }
    if (step < 3) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const getWhatsAppUrl = (refCode: string) => {
    const waNum = toWhatsAppNumber();
    const categoryLabel = t.categories[category];
    const paymentLabel = t.paymentMethods[paymentMethod].label;
    const msg =
      lang === 'en'
        ? `Hi JAH SURF Peru (San Bartolo), I confirm my booking (${refCode}):\n- Class: ${categoryLabel}\n- Plan: ${selectedPlan.name}\n- Name: ${name.trim()}\n- Participants: ${numPeople}\n- Date: ${date}\n- Time: ${time}\n- Total: ${formatDualPrice(totalPrice)}\n- Payment: ${paymentLabel}\n- WhatsApp: ${whatsapp.trim()}`
        : `Hola JAH SURF Peru (San Bartolo), confirmo mi reserva (${refCode}):\n- Clase: ${categoryLabel}\n- Plan: ${selectedPlan.name}\n- Nombre: ${name.trim()}\n- Personas: ${numPeople}\n- Fecha: ${date}\n- Horario: ${time}\n- Total: ${formatDualPrice(totalPrice)}\n- Método de pago: ${paymentLabel}\n- Mi WhatsApp: ${whatsapp.trim()}`;
    return `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const booking = {
      activity: category,
      plan: selectedPlan.name,
      name: name.trim(),
      numPeople,
      date,
      time,
      totalPrice,
      whatsapp: whatsapp.trim(),
      paymentMethod,
    };
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: booking }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
    } catch {
      // Allow WhatsApp voucher fallback even if API is unavailable
    } finally {
      setIsSubmitting(false);
    }

    const refCode = `JAH-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedRef(refCode);
  };

  const onNextHandler = () => {
    if (step === 3) handleSubmit();
    else handleNext();
  };

  if (confirmedRef) {
    const paymentLabel = t.paymentMethods[paymentMethod].label;
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 p-6 sm:p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={34} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t.confirmedBadge}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {t.codeLabel}: {confirmedRef}
          </h3>
          <p className="text-sm text-slate-500 mt-1.5">
            {selectedPlan.name} · {date} ({time}) · {formatDualPrice(totalPrice)} ({paymentLabel})
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={getWhatsAppUrl(confirmedRef)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-5 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            <MessageCircle size={17} />
            {t.sendVoucher}
          </a>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {t.close}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 overflow-hidden">
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-medium"
          >
            {t.close}
          </button>
        )}
        <div className="flex items-center gap-2 sm:gap-4 mx-auto">
          {t.steps.map((label, idx) => {
            const s = (idx + 1) as Step;
            return (
              <div key={s} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      s <= step ? 'bg-primary text-white shadow-sm' : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    {s < step ? <Check size={13} /> : s}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      s === step ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < t.steps.length - 1 && (
                  <div className={`w-6 sm:w-8 h-0.5 ${s < step ? 'bg-primary' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-5 sm:mx-7 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold uppercase tracking-wider shrink-0">
            {t.promoBadge}
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800">{t.promoText}</p>
        </div>
        <a
          href={`https://wa.me/${toWhatsAppNumber()}?text=${encodeURIComponent(t.promoWaMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0"
        >
          <MessageCircle size={14} />
          {t.promoCta}
        </a>
      </div>

      <div className="p-5 sm:p-7">
        {step === 1 && (
          <StepOne
            lang={lang}
            category={category}
            setCategory={setCategory}
            planIndex={planIndex}
            setPlanIndex={setPlanIndex}
            numPeople={numPeople}
            setNumPeople={setNumPeople}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            dateError={dateError}
            plans={plans}
            totalPrice={totalPrice}
          />
        )}
        {step === 2 && (
          <StepTwo
            lang={lang}
            name={name}
            setName={setName}
            whatsapp={whatsapp}
            setWhatsapp={setWhatsapp}
            category={category}
            planName={selectedPlan.name}
            numPeople={numPeople}
            date={date}
            time={time}
            totalPrice={totalPrice}
          />
        )}
        {step === 3 && (
          <StepThree
            lang={lang}
            category={category}
            planName={selectedPlan.name}
            numPeople={numPeople}
            date={date}
            time={time}
            totalPrice={totalPrice}
            name={name}
            whatsapp={whatsapp}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        )}
      </div>

      <div className="px-5 sm:px-7 pb-6 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={16} /> {t.back}
          </button>
        )}
        <button
          type="button"
          onClick={onNextHandler}
          disabled={!canAdvance || isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 min-h-[44px] bg-primary text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none touch-manipulation"
        >
          {step === 3 ? (
            <>
              <CheckCircle2 size={17} /> {isSubmitting ? t.processing : t.confirmBooking}
            </>
          ) : (
            <>
              {t.next} <ChevronRight size={17} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
