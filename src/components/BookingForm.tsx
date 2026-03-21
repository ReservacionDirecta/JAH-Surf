import React, { useState, useMemo } from 'react';
import { PRICE_TABLES } from '../constants';
import { Calendar, Users, MessageCircle, Phone } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

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

    // Save to Firestore
    try {
      await addDoc(collection(db, "bookings"), bookingData);
      console.log('Reserva guardada en Firestore');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "bookings");
    }

    // Fallback: Save to local storage on server (/store)
    try {
      const bookingKey = `booking_${Date.now()}`;
      await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: bookingKey,
          data: bookingData
        }),
      });
      console.log('Reserva guardada en el servidor (/store)');
    } catch (error) {
      console.error('Error al guardar en el servidor:', error);
    }

    const message = `Hola JAH SURF Peru, quiero reservar una clase:
- Tipo: ${classType}
- Plan: ${selectedPlan.name}
- Personas: ${numPeople}
- Fecha: ${date}
- Horario: ${time}
- Total a pagar: S/ ${totalPrice}
- Mi WhatsApp: ${whatsapp}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/51904060670?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="glass p-8 rounded-[2rem] shadow-xl border border-white/20">
      <h3 className="text-3xl font-display font-black text-slate-900 mb-8 uppercase tracking-tighter">Reserva tu Clase</h3>
      
      <div className="grid gap-6">
        {/* Class Type */}
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

        {/* Plan Selection */}
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

        {/* Number of People */}
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

        {/* Date */}
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

        {/* Time */}
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

        {/* WhatsApp */}
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

        {/* Price Display */}
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
