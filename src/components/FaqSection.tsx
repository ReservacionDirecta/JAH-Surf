import { useState } from 'react';
import { ChevronDown, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n';

const FAQ_DATA = {
  es: {
    badge: 'Dudas frecuentes',
    title: 'Preguntas y',
    titleAccent: 'Políticas',
    subtitle: 'Todo lo que necesitas saber antes de entrar al agua en San Bartolo.',
    faqs: [
      {
        q: '¿Necesito experiencia previa o saber nadar?',
        a: 'No necesitas experiencia previa en surf. Para principiantes trabajamos en espuma de poca profundidad con acompañamiento constante. Sí recomendamos sentirte cómodo flotando en el agua.',
      },
      {
        q: '¿Qué incluye la clase o el surf guiding?',
        a: 'Todas las clases incluyen tabla acorde a tu nivel, wetsuit, pita (leash), cera e instrucción técnica dentro y fuera del agua con instructores locales certificados.',
      },
      {
        q: '¿Qué pasa si el mar está muy grande o movido?',
        a: 'La seguridad es prioridad. Si las condiciones del mar en San Bartolo no son seguras para tu nivel, reprogramamos tu sesión sin costo adicional para otro día u horario.',
      },
      {
        q: '¿Dónde es el punto de encuentro?',
        a: 'Nos encontramos en nuestro local en el Malecón de San Bartolo, Lima (a pasos de la orilla). Al confirmar tu reserva te enviamos la ubicación exacta por WhatsApp.',
      },
    ],
    policiesTitle: 'Políticas de Reserva',
    policies: [
      {
        icon: RefreshCw,
        title: 'Reprogramación',
        desc: 'Puedes reprogramar sin costo avisando por WhatsApp con al menos 12 horas de anticipación.',
      },
      {
        icon: Clock,
        title: 'Puntualidad',
        desc: 'Te pedimos llegar 15 minutos antes para probarte el wetsuit, elegir tabla y hacer el calentamiento.',
      },
      {
        icon: ShieldCheck,
        title: 'Seguridad en el mar',
        desc: 'Nos reservamos el derecho de ajustar el horario o spot si el oleaje o corriente representan riesgo.',
      },
    ],
  },
  en: {
    badge: 'FAQ & Info',
    title: 'Questions &',
    titleAccent: 'Policies',
    subtitle: 'Everything you need to know before paddling out in San Bartolo.',
    faqs: [
      {
        q: 'Do I need prior surfing experience or swimming skills?',
        a: 'No prior surfing experience is required. Beginners start in shallow whitewater with constant coach support. Basic comfort in the water is recommended.',
      },
      {
        q: 'What is included in a lesson or surf guiding?',
        a: 'All lessons include a surfboard suited to your level, wetsuit, leash, wax, and certified local coaching in and out of the water.',
      },
      {
        q: 'What happens if ocean conditions are unsafe?',
        a: 'Safety comes first. If swell or tide conditions in San Bartolo are not suitable for your level, we reschedule your session at no extra cost.',
      },
      {
        q: 'Where is the meeting point?',
        a: 'We meet at our surf house on Malecón San Bartolo, Lima — steps from the beach. Once booked, we send you the exact pin via WhatsApp.',
      },
    ],
    policiesTitle: 'Booking Policies',
    policies: [
      {
        icon: RefreshCw,
        title: 'Rescheduling',
        desc: 'Free rescheduling when you notify us via WhatsApp at least 12 hours before your session.',
      },
      {
        icon: Clock,
        title: 'Arrival Time',
        desc: 'Please arrive 15 minutes early for wetsuit fitting, board selection, and safety briefing.',
      },
      {
        icon: ShieldCheck,
        title: 'Ocean Safety',
        desc: 'We reserve the right to adjust the schedule or break if swell or currents pose a safety risk.',
      },
    ],
  },
} as const;

export const FaqSection = () => {
  const { lang } = useLanguage();
  const t = FAQ_DATA[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-24 bg-white section-divider">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 mt-2 mb-3 uppercase tracking-tight">
            {t.title} <span className="text-primary">{t.titleAccent}</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="space-y-3 mb-12">
          {t.faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[52px] flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-100/70 transition-colors touch-manipulation"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-slate-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 text-center mb-5">
            {t.policiesTitle}
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {t.policies.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Icon size={17} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
