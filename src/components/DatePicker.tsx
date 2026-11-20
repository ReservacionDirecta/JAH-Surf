import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { parseLatinDate } from '../utils/date';
import type { Language } from '../i18n';

interface DatePickerProps {
  value: string; // dd/mm/yyyy
  onChange: (val: string) => void;
  lang: Language;
  error?: string;
  placeholder?: string;
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS_ES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const DAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const toLatin = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const DatePicker = ({ value, onChange, lang, error, placeholder }: DatePickerProps) => {
  const today = startOfDay(new Date());
  const parsed = parseLatinDate(value);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState((parsed || today).getFullYear());
  const [viewMonth, setViewMonth] = useState((parsed || today).getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const months = lang === 'es' ? MONTHS_ES : MONTHS_EN;
  const daysHeader = lang === 'es' ? DAYS_ES : DAYS_EN;

  // Quick-pick dates
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextSaturday = new Date(today);
  const diffSat = (6 - today.getDay() + 7) % 7 || 7;
  nextSaturday.setDate(today.getDate() + diffSat);

  const quickPicks = [
    { label: lang === 'es' ? 'Hoy' : 'Today', date: today },
    { label: lang === 'es' ? 'Mañana' : 'Tomorrow', date: tomorrow },
    { label: lang === 'es' ? 'Sábado' : 'Saturday', date: nextSaturday },
  ];

  // Calendar grid calculations (Monday-first)
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDate = (d: Date) => {
    onChange(toLatin(d));
    setOpen(false);
  };

  const displayLabel = parsed
    ? parsed.toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`w-full min-h-[48px] flex items-center justify-between gap-3 bg-slate-50/80 border rounded-2xl px-4 py-3 text-left transition-all touch-manipulation ${
          open
            ? 'bg-white border-primary ring-4 ring-primary/10'
            : error
            ? 'border-red-400 bg-red-50/30'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Calendar size={18} className={open ? 'text-primary shrink-0' : 'text-slate-400 shrink-0'} />
          <span className={`text-base sm:text-sm font-medium truncate ${displayLabel ? 'text-slate-900 capitalize' : 'text-slate-400'}`}>
            {displayLabel || placeholder || 'dd/mm/aaaa'}
          </span>
        </div>
      </button>

      {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}

      {/* Calendar panel (in-flow so parent container never clips it) */}
      {open && (
        <div className="mt-2 w-full sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-lg p-4">
          <div className="flex gap-1.5 mb-3 pb-3 border-b border-slate-100">
            {quickPicks.map((qp) => {
              const qpVal = toLatin(qp.date);
              const isSelected = value === qpVal;
              return (
                <button
                  key={qp.label}
                  type="button"
                  onClick={() => {
                    selectDate(qp.date);
                    setViewYear(qp.date.getFullYear());
                    setViewMonth(qp.date.getMonth());
                  }}
                  className={`flex-1 min-h-[36px] px-2 py-1 rounded-xl text-xs font-bold transition-all touch-manipulation ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {qp.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold text-slate-900">
              {months[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysHeader.map((d) => (
              <span key={d} className="text-[11px] font-bold uppercase text-slate-400 py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const cellDate = new Date(viewYear, viewMonth, dayNum);
              const isPast = cellDate < today;
              const isToday = cellDate.getTime() === today.getTime();
              const isSelected = parsed && cellDate.getTime() === startOfDay(parsed).getTime();

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDate(cellDate)}
                  className={`min-h-[40px] rounded-xl text-xs font-bold transition-all touch-manipulation ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : isPast
                      ? 'text-slate-300 cursor-not-allowed'
                      : isToday
                      ? 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
