import React, { useState, useMemo } from 'react';
import { PRICE_TABLES } from '../constants';
import { Calendar, Users, MessageCircle, Phone } from 'lucide-react';

const formatLatinDateInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const parseLatinDate = (value: string) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, dayString, monthString, yearString] = match;
  const day = Number(dayString);
  const month = Number(monthString);
  const year = Number(yearString);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

export const BookingForm = () => {
  const [classType, setClassType] = useState<'grupales' | 'individuales' | 'paddle' | 'otras'>('grupales');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [numPeople, setNumPeople] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('9hs a 11hs');
  const [whatsapp, setWhatsapp] = useState('');

  const plans = PRICE_TABLES[classType];
  const selectedPlan = plans[selectedPlanIndex];
  const timeOptions = ['9hs a 11hs', '12hs a 2pm', '3pm a 5pm'];
  const EXCHANGE_RATE = 3.6;

  const totalPrice = useMemo(() => {
    return selectedPlan.price * numPeople;
  }, [selectedPlan, numPeople]);
  const totalUsd = useMemo(() => Number((totalPrice / EXCHANGE_RATE).toFixed(2)), [totalPrice]);

  const handleConfirm = async () => {
    const parsedDate = parseLatinDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!date || !whatsapp) {
      alert('Por favor, completa la fecha y tu número de WhatsApp.');
      return;
    }

    if (!parsedDate) {
      alert('Ingresa la fecha con formato dd/mm/aaaa.');
      return;
    }

    if (parsedDate < today) {
      alert('La fecha de reserva no puede ser anterior a hoy.');
      return;
    }

    const bookingData = {
      activity: classType,
      plan: selectedPlan.name,
      numPeople,
      date,
      time,
      totalPrice,
      whatsapp,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'bookings', data: bookingData, append: true }),
      });
      if (!response.ok) {
        throw new Error('Error al guardar la reserva');
      }
      alert('Reserva guardada localmente y enviada a WhatsApp.');
    } catch (error) {
      console.error('Error al guardar en el servidor:', error);
      alert('No se pudo guardar la reserva en el servidor local. Intenta más tarde.');
    }

    const message = `Hola JAH SURF Peru, quiero reservar una clase:\n- Tipo: ${classType}\n- Plan: ${selectedPlan.name}\n- Personas: ${numPeople}\n- Fecha: ${date}\n- Horario: ${time}\n- Total a pagar: S/ ${totalPrice} (US$ ${totalUsd.toFixed(2)} aprox. con TC ${EXCHANGE_RATE})\n- Mi WhatsApp: ${whatsapp}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/51952641118?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="glass p-5 sm:p-8 rounded-[2rem] shadow-xl border border-white/20">
      <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mb-6 sm:mb-8 uppercase tracking-tighter">Reserva tu Clase</h3>
      <div className="grid gap-6">
        <div>
          <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em] mb-3">Tipo de Clase</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['grupales', 'individuales', 'paddle', 'otras'] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setClassType(type); setSelectedPlanIndex(0); }}
                className={`min-h-11 py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${classType === type ? 'bg-primary text-white' : 'bg-white text-slate-900 border border-slate-200'}`}
              >
                {type === 'paddle' ? 'Paddle' : type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em] mb-3">Plan (toca una tarjeta)</label>
          <div className="grid gap-3">
            {plans.map((plan, i) => {
              const selected = i === selectedPlanIndex;
              const perClass = plan.classesPerMonth ? Math.round(plan.price / plan.classesPerMonth) : plan.price;
              const usd = (plan.price / EXCHANGE_RATE).toFixed(2);
              return (
                <button
                  key={`${plan.name}-${i}`}
                  type="button"
                  onClick={() => setSelectedPlanIndex(i)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                    selected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-slate-200 bg-white hover:border-primary/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-black text-slate-900 uppercase tracking-wide text-sm sm:text-base">{plan.name}</p>
                      <p className="text-xs text-slate-500">{plan.classesPerMonth ? `${plan.classesPerMonth} clases al mes` : 'Clase individual'}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-black text-slate-900 text-xl leading-none">S/ {plan.price}</p>
                      <p className="text-xs font-bold text-slate-500">US$ {usd} aprox.</p>
                      <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full inline-block mt-1">S/ {perClass} por clase</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em] mb-3">Personas</label>
          <div className="flex items-center gap-4">
            <Users className="text-primary" />
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={numPeople}
              onChange={(e) => setNumPeople(Math.max(1, Number(e.target.value)))}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 sm:px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em] mb-3">Fecha</label>
          <div className="flex items-center gap-4">
            <Calendar className="text-primary" />
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              value={date}
              onChange={(e) => setDate(formatLatinDateInput(e.target.value))}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 sm:px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
              placeholder="dd/mm/aaaa"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em] mb-3">Horario</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 sm:px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em] mb-3">Tu WhatsApp</label>
          <div className="flex items-center gap-4">
            <Phone className="text-primary" />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 sm:px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
              placeholder="+51 900 000 000"
            />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center mt-4">
          <span className="font-black uppercase tracking-widest">Total</span>
          <div className="text-right">
            <p className="text-3xl font-black text-primary leading-none">S/ {totalPrice}</p>
            <p className="text-xs font-bold text-white/70 mt-1">US$ {totalUsd.toFixed(2)} (TC {EXCHANGE_RATE})</p>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
};
