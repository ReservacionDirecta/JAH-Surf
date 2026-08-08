import { useState, useMemo, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Check, Calendar, Users, MessageCircle, User, Phone, Zap, Waves } from 'lucide-react';
import { PRICE_TABLES } from '../constants';
import { formatLatinDateInput, parseLatinDate } from '../utils/date';
import { toWhatsAppNumber } from '../utils/whatsapp';

type Category = 'grupales' | 'individuales' | 'paddle' | 'otras';
type Step = 1 | 2 | 3;

const TIME_OPTIONS = ['9hs a 11hs', '12hs a 2pm', '3pm a 5pm'];

const CATEGORY_CONFIG: { id: Category; label: string; icon: typeof Users }[] = [
  { id: 'grupales', label: 'Grupales', icon: Users },
  { id: 'individuales', label: 'Individuales', icon: User },
  { id: 'paddle', label: 'Paddle', icon: Waves },
  { id: 'otras', label: 'Otras', icon: Zap },
];

interface BookingEngineProps {
  defaultCategory?: Category;
  defaultPlanIndex?: number;
  onClose?: () => void;
}

const FormField = ({ icon: Icon, label, children }: { icon: typeof User; label: string; children: ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-colors">
      <Icon size={18} className="text-slate-400 shrink-0" />
      {children}
    </div>
  </div>
);

const StepOne = ({ category, setCategory, planIndex, setPlanIndex, numPeople, setNumPeople, plans, totalPrice }: {
  category: Category; setCategory: (c: Category) => void;
  planIndex: number; setPlanIndex: (i: number) => void;
  numPeople: number; setNumPeople: (n: number) => void;
  plans: readonly { name: string; price: number; classesPerMonth?: number }[]; totalPrice: number;
}) => {
  const selectedPlan = plans[planIndex] || plans[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Tipo de clase</p>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORY_CONFIG.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setCategory(id); setPlanIndex(0); }}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-xs font-bold transition-colors ${
                category === id ? 'bg-primary text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}>
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700 mb-3">Selecciona un plan</p>
        <div className="grid gap-2">
          {plans.map((plan, i) => (
            <button key={`${plan.name}-${i}`} onClick={() => setPlanIndex(i)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                i === planIndex ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{plan.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {plan.classesPerMonth ? `${plan.classesPerMonth} clases por mes` : 'Clase individual'}
                  </p>
                </div>
                <p className="font-bold text-slate-900 text-lg">S/ {plan.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700 mb-3">Personas</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
              className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-bold">
              −
            </button>
            <span className="w-10 text-center font-bold text-slate-900 text-lg">{numPeople}</span>
            <button onClick={() => setNumPeople(numPeople + 1)}
              className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors font-bold">
              +
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-primary">S/ {totalPrice}</p>
          <p className="text-xs text-slate-400">{selectedPlan.name}</p>
        </div>
      </div>
    </div>
  );
};

const StepTwo = ({ name, setName, whatsapp, setWhatsapp, date, setDate, time, setTime }: {
  name: string; setName: (v: string) => void;
  whatsapp: string; setWhatsapp: (v: string) => void;
  date: string; setDate: (v: string) => void;
  time: string; setTime: (v: string) => void;
}) => (
  <div className="grid gap-5">
    <div className="grid sm:grid-cols-2 gap-5">
      <FormField icon={User} label="Nombre completo">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="flex-1 bg-transparent outline-none text-sm" />
      </FormField>
      <FormField icon={Phone} label="WhatsApp">
        <input type="tel" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+51 900 000 000" className="flex-1 bg-transparent outline-none text-sm" />
      </FormField>
    </div>
    <div className="grid sm:grid-cols-2 gap-5">
      <FormField icon={Calendar} label="Fecha">
        <input type="text" inputMode="numeric" autoComplete="off" maxLength={10} value={date}
          onChange={(e) => setDate(formatLatinDateInput(e.target.value))} placeholder="dd/mm/aaaa" className="flex-1 bg-transparent outline-none text-sm" />
      </FormField>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Horario</label>
        <div className="flex gap-2">
          {TIME_OPTIONS.map((t) => (
            <button key={t} onClick={() => setTime(t)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-colors ${
                time === t ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StepThree = ({ category, planName, numPeople, date, time, totalPrice, name, whatsapp }: {
  category: Category; planName: string; numPeople: number; date: string; time: string; totalPrice: number; name: string; whatsapp: string;
}) => {
  const categoryLabel = CATEGORY_CONFIG.find(c => c.id === category)?.label ?? category;

  return (
    <div className="space-y-5">
      <div className="bg-slate-50 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Resumen</p>
            <p className="font-bold text-slate-900">{planName}</p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">{categoryLabel}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Users size={18} className="mx-auto text-slate-400 mb-1" />
            <p className="font-bold text-slate-900">{numPeople}</p>
            <p className="text-xs text-slate-400">personas</p>
          </div>
          <div>
            <Calendar size={18} className="mx-auto text-slate-400 mb-1" />
            <p className="font-bold text-slate-900">{date}</p>
            <p className="text-xs text-slate-400">fecha</p>
          </div>
          <div>
            <Zap size={18} className="mx-auto text-slate-400 mb-1" />
            <p className="font-bold text-slate-900">{time}</p>
            <p className="text-xs text-slate-400">horario</p>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Total a pagar</span>
          <span className="text-2xl font-bold text-primary">S/ {totalPrice}</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Contacto</span>
          <span className="font-medium text-slate-900">{name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">WhatsApp</span>
          <span className="font-medium text-slate-900">{whatsapp}</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">* Sujeto a disponibilidad y condiciones climáticas</p>
    </div>
  );
};

export const BookingEngine = ({ defaultCategory, defaultPlanIndex, onClose }: BookingEngineProps) => {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<Category>(defaultCategory || 'grupales');
  const [planIndex, setPlanIndex] = useState(defaultPlanIndex ?? 0);
  const [numPeople, setNumPeople] = useState(1);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_OPTIONS[0]);
  const [whatsapp, setWhatsapp] = useState('');

  const plans = PRICE_TABLES[category];
  const selectedPlan = plans[planIndex] || plans[0];
  const totalPrice = selectedPlan.price * numPeople;

  const canAdvance = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return Boolean(name.trim() && date.trim() && whatsapp.trim());
    return true;
  }, [step, name, date, whatsapp]);

  const handleNext = () => {
    if (step === 2) {
      const parsed = parseLatinDate(date);
      if (!parsed) { alert('Fecha inválida (dd/mm/aaaa)'); return; }
      if (parsed < new Date(new Date().setHours(0, 0, 0, 0))) { alert('La fecha no puede ser en el pasado'); return; }
    }
    if (step < 3) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => { if (step > 1) setStep((s) => (s - 1) as Step); };

  const handleSubmit = async () => {
    const booking = { activity: category, plan: selectedPlan.name, name: name.trim(), numPeople, date, time, totalPrice, whatsapp: whatsapp.trim() };
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: booking }) });
      if (!res.ok) throw new Error(`${res.status}`);
    } catch { alert('No se pudo guardar la reserva. Intenta más tarde.'); return; }

    const waNum = toWhatsAppNumber();
    const categoryLabel = CATEGORY_CONFIG.find(c => c.id === category)?.label ?? category;
    const msg = `Hola JAH SURF Peru, quiero reservar:\n- Clase: ${categoryLabel}\n- Plan: ${selectedPlan.name}\n- Nombre: ${booking.name}\n- Personas: ${numPeople}\n- Fecha: ${date}\n- Horario: ${time}\n- Total: S/ ${totalPrice}\n- Mi WhatsApp: ${whatsapp}`;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
    onClose?.();
  };

  const onNextHandler = () => { if (step === 3) handleSubmit(); else handleNext(); };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        {onClose && <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Cerrar</button>}
        <div className="flex items-center gap-3 mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                s < step ? 'bg-primary text-white' : s === step ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {s < step ? <Check size={14} /> : s}
              </div>
              {s < 3 && <div className={`w-10 h-0.5 ${s < step ? 'bg-primary' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {step === 1 && <StepOne category={category} setCategory={setCategory} planIndex={planIndex} setPlanIndex={setPlanIndex} numPeople={numPeople} setNumPeople={setNumPeople} plans={plans} totalPrice={totalPrice} />}
        {step === 2 && <StepTwo name={name} setName={setName} whatsapp={whatsapp} setWhatsapp={setWhatsapp} date={date} setDate={setDate} time={time} setTime={setTime} />}
        {step === 3 && <StepThree category={category} planName={selectedPlan.name} numPeople={numPeople} date={date} time={time} totalPrice={totalPrice} name={name} whatsapp={whatsapp} />}
      </div>

      <div className="px-6 pb-6 flex gap-3">
        {step > 1 && (
          <button onClick={handleBack} className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={16} /> Atrás
          </button>
        )}
        <button onClick={onNextHandler} disabled={!canAdvance}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {step === 3 ? (<><MessageCircle size={16} /> Reservar por WhatsApp</>) : (<>Siguiente <ChevronRight size={16} /></>)}
        </button>
      </div>
    </div>
  );
};
