import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Waves, Instagram, Facebook, MessageCircle, MapPin, Clock, Mail, Shield, Heart, Zap, Users, Dumbbell, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { FirebaseProvider } from './FirebaseProvider';

import { BookingForm } from './components/BookingForm';
import { BrandName } from './components/BrandName';
import { AdminPanel } from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['inicio', 'nosotros', 'equipos', 'clases', 'beneficios', 'contacto'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio', id: 'inicio' },
    { name: 'Nosotros', href: '#nosotros', id: 'nosotros' },
    { name: 'Experiencia', href: '#experiencia', id: 'experiencia' },
    { name: 'Equipos', href: '#equipos', id: 'equipos' },
    { name: 'Clases', href: '#clases', id: 'clases' },
    { name: 'Beneficios', href: '#beneficios', id: 'beneficios' },
    { name: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-4 shadow-xl shadow-slate-900/5' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className={`p-2 rounded-xl transition-colors ${isScrolled ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>
            <Waves className="w-6 h-6" />
          </div>
          <BrandName 
            className={`text-2xl ${isScrolled ? 'text-slate-900' : 'text-white'}`} 
            surfColor={isScrolled ? 'text-green-600' : 'text-white'} 
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-secondary relative group ${
                activeSection === link.id 
                  ? 'text-secondary' 
                  : isScrolled ? 'text-slate-500' : 'text-white/70'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-secondary transition-transform duration-300 origin-left ${activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </a>
          ))}
          <a 
            href="https://wa.me/51900000000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            RESERVAR
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-3 rounded-2xl transition-colors ${isScrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 glass-dark z-[60] flex flex-col items-center justify-center gap-10 md:hidden"
          >
            <button 
              className="absolute top-8 right-8 p-4 text-white/50 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={40} />
            </button>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-display font-black text-white uppercase tracking-tighter hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/51900000000" 
              className="bg-primary text-white px-12 py-5 rounded-[2rem] text-xl font-black uppercase tracking-widest mt-6 shadow-2xl shadow-primary/40"
            >
              RESERVAR AHORA
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const [content, setContent] = useState<any>({
    heroTitle: "JAH SURF",
    heroSubtitle: "Donde el mar se encuentra con tu espíritu."
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "content", "main"), (doc) => {
      if (doc.exists()) {
        setContent(doc.data());
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1920" 
          alt="Surf background" 
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-white"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 glass text-white text-xs font-black uppercase tracking-[0.3em] mb-8 rounded-full">
            San Bartolo, Perú
          </span>
          <h1 className="text-6xl md:text-[10rem] font-display font-black text-white mb-8 leading-[0.85] uppercase tracking-tighter">
            {content.heroTitle || "JAH SURF"}.
          </h1>
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-8 h-1 bg-primary rounded-full"></div>
            <div className="w-8 h-1 bg-secondary rounded-full"></div>
            <div className="w-8 h-1 bg-accent rounded-full"></div>
          </div>
          <p className="text-xl md:text-3xl text-white mb-12 max-w-3xl mx-auto font-medium leading-relaxed [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="#clases" className="group relative bg-primary text-white px-12 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-primary/40 overflow-hidden">
              <span className="relative z-10">RESERVAR CLASE</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
            <a href="#nosotros" className="glass text-coal px-12 py-5 rounded-2xl font-black text-xl transition-all hover:bg-white/20 border-2 border-white/30">
              CONÓCENOS
            </a>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

const About = () => {
  const pillars = [
    { icon: <Shield className="w-12 h-12 text-primary" />, title: "Seguridad", desc: "Protocolos internacionales de rescate y supervisión constante." },
    { icon: <Heart className="w-12 h-12 text-secondary" />, title: "Buena Onda", desc: "Comunidad vibrante donde cada sesión es una celebración." },
    { icon: <Zap className="w-12 h-12 text-accent" />, title: "Profesionalismo", desc: "Metodología probada para todos los niveles de habilidad." },
  ];

  return (
    <section id="nosotros" className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary"></div>
              <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Nuestra Esencia</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-10 leading-[0.9] uppercase tracking-tighter">
              Más que una escuela, una <span className="text-primary">filosofía</span>
            </h2>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
              En <BrandName /> Peru, el surf es el puente para reconectar con tu ser interior. Fomentamos el respeto al mar, la salud mental y el crecimiento espiritual en cada ola.
            </p>
            <div className="grid gap-10">
              {pillars.map((p, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <div className="bg-slate-50 p-5 rounded-[2rem] group-hover:bg-primary/10 transition-colors duration-300">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{p.title}</h4>
                    <p className="text-slate-500 leading-relaxed max-w-md">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
              <img 
                src="https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&q=80&w=1000" 
                alt="Surf lesson" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 glass p-10 rounded-[2.5rem] shadow-2xl hidden xl:block max-w-sm z-20 border-2 border-white/30">
              <p className="text-xl italic text-slate-900 font-display leading-relaxed">
                "El mar es el mejor maestro de paciencia y humildad que existe."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Waves className="text-primary w-5 h-5" />
                </div>
                <p className="font-black text-primary uppercase tracking-widest text-sm"><BrandName /> Team</p>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  // Las imágenes han sido extraídas y hardcodeadas para evitar consumo de API.
  const photos = [
    { src: "https://aistudio.google.com/_/upload/543bf123-3fb9-4789-be81-98cc9daf6bb3/attachment/1774017559.433184000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::3c6976c9d7415070:000001f316d018bc:00064d75a670731f", alt: "Surf en San Bartolo" },
    { src: "https://aistudio.google.com/_/upload/543bf123-3fb9-4789-be81-98cc9daf6bb3/attachment/1774017559.433184000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::dea9602fca005901:000001f316d018bc:00064d75a670731f", alt: "Clase de surf" },
    { src: "https://aistudio.google.com/_/upload/543bf123-3fb9-4789-be81-98cc9daf6bb3/attachment/1774017559.433184000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::f8e5438df1c36153:000001f316d018bc:00064d75a670731f", alt: "Olas en San Bartolo" },
    { src: "https://aistudio.google.com/_/upload/543bf123-3fb9-4789-be81-98cc9daf6bb3/attachment/1774017559.433184000/blobstore/prod/makersuite/spanner_managed/global::000054e2ea70026d:0000015f:2:000054e2ea70026d:0000000000000001::1b25ad2be08669a2:000001f316d018bc:00064d75a670731f", alt: "Aprendiendo a surfear" },
  ];

  return (
    <section id="experiencia" className="py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 uppercase tracking-tighter mb-16 text-center">
          Nuestra <span className="text-primary">Experiencia</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img src={photo.src} alt={photo.alt} className="w-full h-80 object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Equipment = () => {
  return (
    <section id="equipos" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary"></div>
              <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Equipamiento</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">
              Listos para <span className="text-primary">fluir</span>
            </h2>
          </div>
          <p className="text-slate-500 text-xl max-w-md font-medium">
            No te preocupes por nada. Contamos con equipos de última generación para tu seguridad.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 glass p-12 md:p-16 rounded-[3rem] shadow-sm flex flex-col justify-center">
            <h3 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-tight">
              <div className="bg-primary/10 p-3 rounded-2xl"><Waves className="text-primary" /></div> 
              Kit de Aventura
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { t: "Tablas Soft", d: "Diseñadas para máxima estabilidad." },
                { t: "Pitas Pro", d: "Elásticas y ultra resistentes." },
                { t: "Wetsuits", d: "Todas las tallas, máxima flexibilidad." },
                { t: "Instructores", d: "Certificados con pasión por el mar." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">{item.t}</h4>
                  <p className="text-slate-500 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 glass-dark text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-tight">
                <div className="bg-white/10 p-3 rounded-2xl"><Clock className="text-secondary" /></div>
                La Sesión
              </h3>
              <div className="mb-12">
                <span className="text-7xl md:text-8xl font-display font-black leading-none tracking-tighter">1H 20M</span>
                <p className="text-secondary font-black uppercase tracking-[0.3em] text-sm mt-4">Aprendizaje Puro</p>
              </div>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <span className="text-4xl font-display font-black text-white/20">01</span>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Teoría & Calentamiento</h4>
                    <p className="text-white/50 leading-relaxed">20 minutos de fundamentos y movilidad en la arena.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="text-4xl font-display font-black text-white/20">02</span>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">Acción en el Mar</h4>
                    <p className="text-white/50 leading-relaxed">60 minutos de práctica guiada por tu instructor.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingModal = ({ isOpen, onClose, title, packages, color }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('9hs a 11hs');
  const [whatsapp, setWhatsapp] = useState('');
  const timeOptions = ['9hs a 11hs', '12hs a 2pm', '3pm a 5pm'];

  const colorClasses = {
    primary: {
      border: 'hover:border-primary/30',
      shadow: 'hover:shadow-primary/5',
      text: 'group-hover:text-primary',
      badge: 'text-primary bg-primary/10',
      button: 'bg-primary hover:bg-primary/90 shadow-primary/20'
    },
    secondary: {
      border: 'hover:border-secondary/30',
      shadow: 'hover:shadow-secondary/5',
      text: 'group-hover:text-secondary',
      badge: 'text-secondary bg-secondary/10',
      button: 'bg-secondary hover:bg-secondary/90 shadow-secondary/20'
    },
    accent: {
      border: 'hover:border-accent/30',
      shadow: 'hover:shadow-accent/5',
      text: 'group-hover:text-amber-700',
      badge: 'text-amber-900 bg-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
    }
  }[color || 'primary'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative glass-modal w-full max-w-2xl rounded-[2rem] overflow-hidden"
      >
        <div className="p-8 md:p-10 border-b border-white/20 flex justify-between items-center bg-white/30">
          <div>
            <h3 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Planes Mensuales</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-all active:scale-90">
            <X className="w-6 h-6 text-slate-900" />
          </button>
        </div>
        <div className="p-8 md:p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid gap-6">
            <div className="space-y-4">
              <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4" />
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4">
                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="tel" placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4" />
            </div>
            
            <div className="grid gap-6">
              {packages.map((pkg, i) => (
                <div key={i} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 rounded-3xl bg-white/50 border-2 border-white/20 ${colorClasses.border} ${colorClasses.shadow} transition-all duration-300 group`}>
                  <div className="mb-4 sm:mb-0">
                    <h4 className={`font-bold text-xl text-slate-900 ${colorClasses.text} transition-colors`}>{pkg.name}</h4>
                    <p className="text-slate-500 font-medium">{pkg.desc}</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-slate-900 leading-none">{pkg.price}</span>
                      {pkg.perClass && (
                        <span className={`font-bold text-sm mt-1 ${colorClasses.badge} px-3 py-1 rounded-full inline-block w-fit sm:ml-auto`}>
                          {pkg.perClass} <span className="text-[10px] opacity-70 uppercase">por clase</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-8 md:p-10 bg-white/40 border-t border-white/20">
          <button 
            onClick={async () => {
              if (!name || !date || !whatsapp) {
                alert('Por favor, completa nombre, fecha y WhatsApp.');
                return;
              }

              const bookingData = {
                activity: title,
                name,
                date,
                time,
                whatsapp,
                timestamp: new Date().toISOString()
              };

              // Fallback: Save to local storage on server (/store)
              try {
                const bookingKey = `booking_modal_${Date.now()}`;
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

              const message = `Hola JAH SURF Peru, quiero reservar:
- Actividad: ${title}
- Nombre: ${name}
- Fecha: ${date}
- Horario: ${time}
- Mi WhatsApp: ${whatsapp}`;
              window.open(`https://wa.me/51904060670?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className={`flex items-center justify-center gap-3 w-full ${colorClasses.button} text-white text-center py-5 rounded-2xl font-black text-lg transition-all shadow-xl hover:-translate-y-1 active:translate-y-0`}
          >
            <MessageCircle className="w-6 h-6" />
            RESERVAR POR WHATSAPP
          </button>
          <p className="text-center text-slate-400 text-xs mt-6 font-bold uppercase tracking-widest">
            * Sujeto a condiciones climáticas y disponibilidad
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Pricing = () => {
  const [modalData, setModalData] = useState(null);

  const pricingCategories = [
    {
      id: 'grupales',
      title: "Clases Grupales",
      icon: <Users className="w-12 h-12" />,
      color: "primary",
      desc: "Aprende con amigos o conoce gente nueva en un ambiente dinámico.",
      packages: [
        { name: "1 Clase x Semana", desc: "4 clases al mes", price: "S/ 384", perClass: "S/ 96" },
        { name: "2 Clases x Semana", desc: "8 clases al mes", price: "S/ 696", perClass: "S/ 87" },
        { name: "3 Clases x Semana", desc: "12 clases al mes", price: "S/ 984", perClass: "S/ 82" },
        { name: "Clase Suelta", desc: "Sesión única de prueba", price: "S/ 108", perClass: "S/ 108" },
      ]
    },
    {
      id: 'individuales',
      title: "Clases Individuales",
      icon: <Zap className="w-12 h-12" />,
      color: "secondary",
      desc: "Atención 100% personalizada para perfeccionar tu técnica rápidamente.",
      packages: [
        { name: "1 Clase x Semana", desc: "4 clases al mes", price: "S/ 576", perClass: "S/ 144" },
        { name: "2 Clases x Semana", desc: "8 clases al mes", price: "S/ 1056", perClass: "S/ 132" },
        { name: "3 Clases x Semana", desc: "12 clases al mes", price: "S/ 1440", perClass: "S/ 120" },
        { name: "Clase Suelta", desc: "Sesión única intensiva", price: "S/ 156", perClass: "S/ 156" },
      ]
    },
    {
      id: 'otras',
      title: "Otras Actividades",
      icon: <Waves className="w-12 h-12" />,
      color: "accent",
      desc: "Experiencias grupales, viajes y eventos diseñados para la comunidad.",
      packages: [
        { name: "Paseos de Surf", desc: "Día completo en otras playas", price: "Desde S/ 240" },
        { name: "Surf Camps", desc: "Fin de semana inmersivo", price: "Consultar" },
        { name: "Eventos Corporativos", desc: "Team building en el mar", price: "Consultar" },
        { name: "Alquiler de Equipo", desc: "Tabla + Wetsuit (2h)", price: "S/ 60" },
      ]
    }
  ];

  return (
    <section id="clases" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary"></div>
            <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Membresías</span>
            <div className="w-12 h-px bg-primary"></div>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Elige tu <span className="text-primary">Ritmo</span>
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
            Planes flexibles diseñados para que el surf se convierta en tu nuevo estilo de vida.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {pricingCategories.map((cat) => (
            <motion.div 
              key={cat.id}
              whileHover={{ y: -15 }}
              className="glass p-12 rounded-[3rem] flex flex-col items-center text-center group cursor-pointer transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:bg-white/80"
              onClick={() => setModalData(cat)}
            >
              <div className={`bg-white p-8 rounded-[2rem] shadow-sm mb-10 group-hover:scale-110 transition-all duration-500 ${
                cat.color === 'primary' ? 'text-primary group-hover:bg-primary group-hover:text-white' :
                cat.color === 'secondary' ? 'text-secondary group-hover:bg-secondary group-hover:text-white' :
                'text-accent group-hover:bg-accent group-hover:text-white'
              }`}>
                {cat.icon}
              </div>
              <h3 className="text-3xl font-display font-black text-slate-900 mb-6 uppercase tracking-tight">{cat.title}</h3>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium">{cat.desc}</p>
              <button className={`mt-auto w-full py-5 rounded-2xl border-2 font-black text-lg transition-all duration-300 uppercase tracking-widest ${
                cat.color === 'primary' ? 'border-primary text-primary group-hover:bg-primary group-hover:text-white' :
                cat.color === 'secondary' ? 'border-secondary text-secondary group-hover:bg-secondary group-hover:text-white' :
                'border-accent text-accent group-hover:bg-accent group-hover:text-white'
              }`}>
                VER DETALLES
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalData && (
          <PricingModal 
            isOpen={!!modalData} 
            onClose={() => setModalData(null)} 
            title={modalData.title}
            packages={modalData.packages}
            color={modalData.color}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    { icon: <Heart size={48} />, title: "Corazón Fuerte", desc: "Mejora la salud cardiovascular con el remo constante y rítmico." },
    { icon: <Dumbbell size={48} />, title: "Cuerpo Atlético", desc: "Entrenamiento funcional que tonifica cada músculo de tu cuerpo." },
    { icon: <Zap size={48} />, title: "Mente en Calma", desc: "El contacto con el mar reduce el cortisol y libera endorfinas." },
    { icon: <Users size={48} />, title: "Tribu Global", desc: "Conecta con una comunidad mundial apasionada por el océano." },
    { icon: <Dumbbell size={48} />, title: "Core & Balance", desc: "Desarrolla un equilibrio excepcional y una postura perfecta." },
    { icon: <Leaf size={48} />, title: "Eco Conciencia", desc: "Vive en armonía con el mar y protege nuestro entorno natural." },
  ];

  return (
    <section id="beneficios" className="py-32 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(2,132,199,0.3),transparent_70%)]"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-secondary"></div>
            <span className="text-secondary font-black uppercase tracking-[0.2em] text-xs">Transformación</span>
            <div className="w-12 h-px bg-secondary"></div>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black mb-6 uppercase tracking-tighter">Beneficios del <span className="text-secondary">Surf</span></h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto font-medium">
            Mucho más que un deporte, una medicina natural para tu cuerpo y mente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {benefits.map((b, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-dark p-10 rounded-[2.5rem] hover:bg-white/15 transition-all duration-500 group border-white/10"
            >
              <div className="text-secondary mb-8 group-hover:scale-110 transition-transform duration-500">
                {b.icon}
              </div>
              <h4 className="text-2xl font-black mb-4 uppercase tracking-tight">{b.title}</h4>
              <p className="text-white/80 leading-relaxed font-medium">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contacto" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary"></div>
              <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Hablemos</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-12 leading-[0.9] uppercase tracking-tighter">
              ¿Listo para tu <span className="text-primary">primera ola?</span>
            </h2>
            
            <div className="space-y-10">
              {[
                { icon: <MapPin />, t: "Ubicación", d: "Playa San Bartolo, Lima, Perú", color: "text-primary" },
                { icon: <Clock />, t: "Horarios", d: "Lunes a Domingo: 7:00 AM — 7:00 PM", color: "text-secondary" },
                { icon: <MessageCircle />, t: "WhatsApp", d: "+51 900 000 000", color: "text-accent" },
                { icon: <Mail />, t: "Email", d: "hola@jahsurfperu.com", color: "text-primary" }
              ].map((item, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <div className={`bg-slate-50 p-5 rounded-2xl ${item.color} group-hover:bg-slate-900 group-hover:text-white transition-all duration-300`}>
                    {React.cloneElement(item.icon, { size: 32 })}
                  </div>
                  <div>
                    <h4 className="font-black text-xl uppercase tracking-tight mb-1">{item.t}</h4>
                    <p className="text-slate-500 text-lg font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex gap-6">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="bg-slate-900 text-white p-5 rounded-[1.5rem] hover:bg-primary hover:scale-110 transition-all duration-300 shadow-xl shadow-slate-900/10">
                  <Icon size={28} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-12 md:p-16 rounded-[3.5rem] shadow-2xl shadow-slate-900/5"
          >
            <h3 className="text-3xl font-black mb-10 uppercase tracking-tight">Envíanos un mensaje</h3>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nombre</label>
                  <input type="text" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="Tu nombre" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">WhatsApp</label>
                  <input type="tel" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="Tu número" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Interés</label>
                <select className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium appearance-none">
                  <option>Clases Grupales</option>
                  <option>Clases Individuales</option>
                  <option>Eventos / Otros</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Mensaje</label>
                <textarea className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium h-40 resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              <button className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest">
                ENVIAR MENSAJE
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="glass-dark py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Waves className="text-white w-8 h-8" />
            </div>
            <BrandName className="text-white text-2xl" /> <span className="text-accent text-2xl font-display font-black uppercase tracking-tighter">Peru</span>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-white/70 text-sm font-medium">
              © 2026 <BrandName /> Peru. Todos los derechos reservados.
            </p>
            <p className="text-white/60 text-[10px] uppercase font-black tracking-[0.2em] mt-2">
              Diseñado por <a href="#" className="text-white/80 hover:text-primary transition-colors">ChambaDigital.la</a>
            </p>
          </div>
          
          <div className="flex gap-10">
            <a href="#" className="text-white/30 hover:text-white transition-colors text-xs uppercase font-black tracking-[0.3em]">Términos</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors text-xs uppercase font-black tracking-[0.3em]">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ... (Navbar, Hero, About, Equipment, PricingModal, Pricing, Benefits, Contact, Footer components)

const Booking = () => {
  return (
    <section id="reserva" className="py-32 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Reserva tu <span className="text-primary">Aventura</span>
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
            Elige tu clase, indica cuántas personas asistirán y asegura tu lugar en el mar.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <BookingForm />
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/" element={
              <div className="relative">
                <Navbar />
                <main>
                  <Hero />
                  <About />
                  <Gallery />
                  <Equipment />
                  <Pricing />
                  <Booking />
                  <Benefits />
                  <Contact />
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
