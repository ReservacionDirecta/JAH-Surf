import React, { useState, useMemo } from 'react';
import { PRICE_TABLES } from '../constants';
import { Calendar, Users, MessageCircle, Phone } from 'lucide-react';

export const BookingForm = () => {
  const [classType, setClassType] = useState<'grupales' | 'individuales' | 'otras'>('grupales');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [numPeople, setNumPeople] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('9hs a 11hs');
  const [whatsapp, setWhatsapp] = useState('');

  const plans = PRICE_TABLES[classType];
  const selectedPlan = plans[selectedPlanIndex];
  const timeOptions = ['9hs a 11hs', '12hs a 2pm', '3pm a 5pm'];

  const totalPrice = useMemo(() => {
    return selectedPlan.price * numPeople;
  }, [selectedPlan, numPeople]);

  const handleConfirm = async () => {
    if (!date || !whatsapp) {
      alert('Por favor, completa la fecha y tu número de WhatsApp.');
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

    const message = `Hola JAH SURF Peru, quiero reservar una clase:\n- Tipo: ${classType}\n- Plan: ${selectedPlan.name}\n- Personas: ${numPeople}\n- Fecha: ${date}\n- Horario: ${time}\n- Total a pagar: S/ ${totalPrice}\n- Mi WhatsApp: ${whatsapp}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/51904060670?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="glass p-8 rounded-[2rem] shadow-xl border border-white/20">
      <h3 className="text-3xl font-display font-black text-slate-900 mb-8 uppercase tracking-tighter">Reserva tu Clase</h3>
      <div className="grid gap-6">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Tipo de Clase</label>
          <div className="grid grid-cols-3 gap-2">
            {(['grupales', 'individuales', 'otras'] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setClassType(type); setSelectedPlanIndex(0); }}
                className={`py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${classType === type ? 'bg-primary text-white' : 'bg-white text-slate-900 border border-slate-200'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Plan</label>
          <select
            value={selectedPlanIndex}
            onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
          >
            {plans.map((plan, i) => (
              <option key={i} value={i}>{plan.name} - S/ {plan.price}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Personas</label>
          <div className="flex items-center gap-4">
            <Users className="text-primary" />
            <input
              type="number"
              min="1"
              value={numPeople}
              onChange={(e) => setNumPeople(Math.max(1, Number(e.target.value)))}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Fecha</label>
          <div className="flex items-center gap-4">
            <Calendar className="text-primary" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Horario</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Tu WhatsApp</label>
          <div className="flex items-center gap-4">
            <Phone className="text-primary" />
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
              placeholder="+51 900 000 000"
            />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center mt-4">
          <span className="font-black uppercase tracking-widest">Total</span>
          <span className="text-3xl font-black text-primary">S/ {totalPrice}</span>
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
