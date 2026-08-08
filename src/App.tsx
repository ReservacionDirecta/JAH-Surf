import React, { useState, useEffect } from 'react';
import { Menu, X, Waves, Instagram, Facebook, MessageCircle, MapPin, Clock, Mail, Shield, Heart, Zap, Users, Dumbbell, Leaf } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { toEmbedUrl } from './utils/video';
import { toWhatsAppNumber } from './utils/whatsapp';
import { useContent } from './hooks/useContent';
import { useSettings } from './hooks/useSettings';

import { BookingEngine } from './components/BookingEngine';
import { AdminPanel } from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Logo } from './components/logo';

const DEFAULT_WHATSAPP_DISPLAY = '+51 952 641 118';
const DEFAULT_EMAIL = 'jahsamba@hotmail.com';


const Navbar = () => {
  const prefersReducedMotion = useReducedMotion();
  const { content } = useContent();
  const waNumber = toWhatsAppNumber(content.contactWhatsApp);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['inicio', 'nosotros', 'experiencia', 'galeria', 'equipos', 'clases', 'beneficios', 'contacto'];
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
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (isMobileMenuOpen) {
      setIsScrolled(true);
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isMobileMenuOpen]);

  const handleMobileNavigate = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const target = document.querySelector(href);
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '#inicio', id: 'inicio' },
    { name: 'Nosotros', href: '#nosotros', id: 'nosotros' },
    { name: 'Experiencia', href: '#experiencia', id: 'experiencia' },
    { name: 'Galeria', href: '#galeria', id: 'galeria' },
    { name: 'Equipos', href: '#equipos', id: 'equipos' },
    { name: 'Clases', href: '#clases', id: 'clases' },
    { name: 'Beneficios', href: '#beneficios', id: 'beneficios' },
    { name: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  const menuListMotion = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 12 },
      };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'glass py-3 shadow-xl shadow-slate-900/5' : 'bg-transparent py-5 md:py-8'}`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <a href="#inicio" aria-label="Ir al inicio de JAH SURF Peru" title="JAH SURF Peru" className="transition-all duration-300 hover:scale-[1.02] min-w-[48px] min-h-[48px]">
            <Logo size="sm" shape="circle" className="w-12 h-12 text-[11px]" />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs font-black uppercase tracking-[0.16em] transition-all hover:text-secondary relative group ${
                  activeSection === link.id 
                    ? 'text-secondary' 
                    : isScrolled ? 'text-slate-800' : 'text-white/85'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-secondary transition-transform duration-300 origin-left ${activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </a>
            ))}
            <a 
              href={`https://wa.me/${waNumber}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-white px-7 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              RESERVAR
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            aria-label={isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            className={`md:hidden p-3 rounded-2xl transition-colors ${isScrolled || isMobileMenuOpen ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] md:hidden overflow-y-auto bg-slate-950"
          >
            <motion.button 
              aria-label="Cerrar menu"
              className="fixed top-4 right-4 p-3 text-white/90 hover:text-white transition-colors bg-white/10 rounded-xl border border-white/20 z-[10001]"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            >
              <X size={30} />
            </motion.button>
            <motion.div
              className="relative z-[10000] w-full flex flex-col items-stretch gap-3 px-6 pt-24 pb-10"
              initial={menuListMotion.initial}
              animate={menuListMotion.animate}
              exit={menuListMotion.exit}
              transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: 'easeOut' }}
            >
              <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.2em] mb-3">Menú</p>
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={handleMobileNavigate(link.href)}
                  className="block w-full text-left text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight hover:text-primary transition-colors py-3 border-b border-white/10"
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2, delay: prefersReducedMotion ? 0 : index * 0.03 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a 
                href={`https://wa.me/${waNumber}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-primary text-white px-8 py-4 rounded-[2rem] text-base sm:text-lg font-black uppercase tracking-widest mt-5 shadow-2xl shadow-primary/40 text-center"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.22, delay: prefersReducedMotion ? 0 : 0.12 }}
              >
                RESERVAR AHORA
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { content } = useContent();

  return (
    <section id="inicio" className="relative min-h-[600px] md:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={content.heroImageUrl || "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1920"}
          alt="Surf en San Bartolo"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center py-20 md:py-32">
        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-6 sm:mb-8 rounded-full border border-white/20">
          San Bartolo, Perú
        </span>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black text-white mb-6 leading-[0.9] uppercase tracking-tight">
          {content.heroTitle || "JAH SURF"}.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
          {content.heroSubtitle || "Conecta con el mar, respeta su fuerza y vive el surf como estilo de vida."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#clases" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-primary/90 transition-colors">
            RESERVAR CLASE
          </a>
          <a href="#nosotros" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 transition-colors border border-white/20">
            CONÓCENOS
          </a>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { content } = useContent();

  const pillars = [
    { icon: <Shield className="w-12 h-12 text-primary" />, title: "Seguridad", desc: "Ponemos atención a cuidados y precauciones. Contamos con certificaciones de primeros auxilios y plan de contingencia." },
    { icon: <Heart className="w-12 h-12 text-secondary" />, title: "Buena Onda", desc: "Nuestro estilo de instrucción es relajado y cercano, enfocado en crear una relación positiva con el mar." },
    { icon: <Zap className="w-12 h-12 text-accent" />, title: "Profesionalismo", desc: "Respetamos los tiempos y procesos de cada alumno con enseñanza clara para todos los niveles." },
  ];

  return (
    <section id="nosotros" className="py-20 md:py-32 section-paper section-divider overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
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
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 mb-8 md:mb-10 leading-[0.92] uppercase tracking-tighter">
              {content.aboutTitle || "Más que una escuela, una filosofía"}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-10 md:mb-12 leading-relaxed font-medium">
              {content.aboutText || "En JAH Surf nuestra prioridad es crear primero un vínculo real con el mar y la Naturaleza. Enseñamos a respetar su poder, mantener la calma frente a lo que no controlamos y aprender técnicas para correr tabla en una experiencia segura, satisfactoria y profunda."}
            </p>
            <div className="grid gap-6 md:gap-8 lg:gap-10">
              {pillars.map((p, i) => (
                <div key={i} className="flex gap-4 md:gap-6 lg:gap-8 items-start group">
                  <div className="bg-slate-50 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] group-hover:bg-primary/10 transition-colors duration-300">
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
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={content.aboutImageUrl || "https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&q=80&w=1000"}
                alt="Surf lesson"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const { content } = useContent();
  const experiencePhotos = content.experienceImages || [];
  const videos = content.videoLinks || [];

  return (
    <>
    <section id="experiencia" className="py-20 md:py-32 section-sand section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 uppercase tracking-tighter mb-10 md:mb-14 text-center">
          Nuestra <span className="text-primary">Experiencia</span>
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {experiencePhotos.filter(p => p.src).map((photo, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <img src={photo.src} alt={photo.alt} className="w-full h-64 sm:h-72 object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="galeria" className="py-20 md:py-28 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 uppercase tracking-tighter mb-10 md:mb-14 text-center">
          Galeria <span className="text-primary">Multimedia</span>
        </h2>

        {videos.filter((v) => v.url).length > 0 && (
          <div>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 uppercase tracking-tight mb-6">Videos</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {videos.filter((v) => v.url).map((video, i) => (
                <div
                  key={video.id || `video-${i}`}
                  className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px]"
                >
                  <div className="rounded-xl overflow-hidden bg-slate-900 aspect-[9/16]">
                    <iframe
                      src={toEmbedUrl(video.url)}
                      title={video.title || `Video ${i + 1}`}
                      className="w-full h-full"
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {video.title && (
                    <p className="mt-2 text-sm font-medium text-slate-700 text-center truncate">{video.title}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
};

const Equipment = () => {
  return (
    <section id="equipos" className="py-20 md:py-32 section-mint section-divider relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 md:mb-20 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary"></div>
              <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Equipamiento</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.92] uppercase tracking-tighter">
              Listos para <span className="text-primary">fluir</span>
            </h2>
          </div>
          <p className="text-slate-500 text-base sm:text-lg md:text-xl max-w-md font-medium">
            No te preocupes por nada. Contamos con equipos de última generación para tu seguridad.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Waves className="text-primary w-7 h-7" />
              Kit de Aventura
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { t: "Tablas Soft", d: "Diseñadas para máxima estabilidad." },
                { t: "Pitas Pro", d: "Elásticas y ultra resistentes." },
                { t: "Wetsuits", d: "Todas las tallas, máxima flexibilidad." },
                { t: "Instructores", d: "Certificados con pasión por el mar." }
              ].map((item, i) => (
                <div key={i}>
                  <h4 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-tight">{item.t}</h4>
                  <p className="text-slate-500 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 md:p-12 rounded-2xl">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Clock className="text-secondary w-7 h-7" />
              La Sesión
            </h3>
            <div className="mb-10">
              <span className="text-6xl md:text-7xl font-display font-black leading-none tracking-tight">1H 20M</span>
              <p className="text-secondary font-bold uppercase tracking-[0.2em] text-sm mt-3">Aprendizaje Puro</p>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <span className="text-3xl font-display font-bold text-white/20">01</span>
                <div>
                  <h4 className="text-lg font-bold uppercase tracking-tight mb-1">Teoría & Calentamiento</h4>
                  <p className="text-white/60 leading-relaxed">20 minutos de fundamentos y movilidad en la arena.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl font-display font-bold text-white/20">02</span>
                <div>
                  <h4 className="text-lg font-bold uppercase tracking-tight mb-1">Acción en el Mar</h4>
                  <p className="text-white/60 leading-relaxed">60 minutos de práctica guiada por tu instructor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos M.",
      text: "Mi primera vez en surf y fue increíble. Los instructores son muy pacientes y te hacen sentir seguro desde el primer minuto. ¡Volví 3 veces más!",
      rating: 5,
    },
    {
      name: "Ana L.",
      text: "Llevo 2 meses en clases grupales y ya puedo pararme en la tabla. El ambiente es genial, es como una familia. Súper recomendado.",
      rating: 5,
    },
    {
      name: "Miguel R.",
      text: "Hice un surf camp con amigos y fue la mejor experiencia de nuestro viaje a Lima. Todo perfecto, las tablas, los wetsuits, la ubicación.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 section-sand section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary"></div>
            <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Testimonios</span>
            <div className="w-12 h-px bg-primary"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Lo que dicen <span className="text-primary">nuestros alumnos</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-xl border border-slate-100">
              <div className="text-secondary mb-4 text-sm tracking-widest">{'★'.repeat(t.rating)}</div>
              <p className="text-slate-600 text-base leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{t.name.charAt(0)}</span>
                </div>
                <span className="font-bold text-slate-900 uppercase tracking-tight text-sm">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

type Category = 'grupales' | 'individuales' | 'paddle' | 'otras';

const Pricing = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { settings } = useSettings();

  const categoryIdToType: Record<string, Category> = {
    grupales: 'grupales',
    individuales: 'individuales',
    paddle: 'paddle',
    otras: 'otras',
  };

  const pricingCategories: { id: string; title: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'grupales', title: 'Clases Grupales', icon: <Users className="w-6 h-6" />, desc: 'Aprende con amigos en un ambiente dinámico.' },
    { id: 'individuales', title: 'Clases Individuales', icon: <Zap className="w-6 h-6" />, desc: 'Atención 100% personalizada.' },
    { id: 'paddle', title: 'Paddle Surf', icon: <Waves className="w-6 h-6" />, desc: 'Paseos y clases de paddle.' },
    { id: 'otras', title: 'Otras Actividades', icon: <Waves className="w-6 h-6" />, desc: 'Surf camps, eventos y alquiler.' },
  ];

  const openType = openCategory ? categoryIdToType[openCategory] : undefined;

  return (
    <section id="clases" className="py-20 md:py-28 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter">
            Elige tu <span className="text-primary">Ritmo</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Planes flexibles para que el surf se convierta en tu estilo de vida.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {pricingCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => settings.reservationsEnabled && setOpenCategory(cat.id)}
              className={`bg-white p-6 rounded-xl border transition-shadow ${settings.reservationsEnabled ? 'border-slate-100 hover:shadow-md cursor-pointer' : 'border-slate-100 opacity-50 cursor-not-allowed'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{cat.title}</h3>
              </div>
              <p className="text-slate-500 text-sm mb-4">{cat.desc}</p>
              <button
                disabled={!settings.reservationsEnabled}
                className="w-full py-3 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors disabled:cursor-not-allowed"
              >
                {settings.reservationsEnabled ? 'RESERVAR' : 'NO DISPONIBLE'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {openCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setOpenCategory(null)} />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <BookingEngine
              defaultCategory={openType}
              onClose={() => setOpenCategory(null)}
            />
          </div>
        </div>
      )}
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
    <section id="beneficios" className="py-20 md:py-32 section-ink text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 uppercase tracking-tighter">Beneficios del <span className="text-secondary">Surf</span></h2>
          <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Mucho más que un deporte, una medicina natural para tu cuerpo y mente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white/5 p-8 rounded-xl border border-white/10">
              <div className="text-secondary mb-6">{b.icon}</div>
              <h4 className="text-xl font-bold mb-3 uppercase tracking-tight">{b.title}</h4>
              <p className="text-white/70 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { content } = useContent();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [interest, setInterest] = useState('Clases Grupales');
  const [message, setMessage] = useState('');

  const displayWhatsApp = typeof content.contactWhatsApp === 'string' && content.contactWhatsApp
    ? content.contactWhatsApp
    : DEFAULT_WHATSAPP_DISPLAY;
  const displayEmail = typeof content.contactEmail === 'string' && content.contactEmail
    ? content.contactEmail
    : DEFAULT_EMAIL;
  const waNumber = toWhatsAppNumber(content.contactWhatsApp);

  const handleSubmit = () => {
    if (!name || !message) {
      alert('Por favor, completa tu nombre y el mensaje.');
      return;
    }
    const text = `Hola JAH SURF Peru, me comunico desde su web:\n- Nombre: ${name}\n- WhatsApp: ${whatsapp || 'No proporcionado'}\n- Interés: ${interest}\n- Mensaje: ${message}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contacto" className="py-20 md:py-28 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter">
            ¿Listo para tu <span className="text-primary">primera ola?</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Escríbenos o visítanos. Estamos en San Bartolo todos los días.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {[
                { icon: <MapPin className="w-5 h-5" />, label: "Ubicación", value: "Malecón Rivera Norte 636, San Bartolo, Lima" },
                { icon: <Clock className="w-5 h-5" />, label: "Horarios", value: "Todos los días, 7:00 AM – 7:00 PM" },
                { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", value: displayWhatsApp },
                { icon: <Mail className="w-5 h-5" />, label: "Email", value: displayEmail },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-slate-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <a href="https://www.instagram.com/jahsurfperu/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/jahsurfperu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 h-48">
              <iframe
                src="https://maps.google.com/maps?q=Malecon+Rivera+Norte+636+San+Bartolo+Lima+Peru&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación JAH SURF Peru - San Bartolo"
              />
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Envíanos un mensaje</h3>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp</label>
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="+51 900 000 000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Interés</label>
                <div className="flex gap-2">
                  {['Clases Grupales', 'Clases Individuales', 'Eventos / Otros'].map((opt) => (
                    <button key={opt} type="button" onClick={() => setInterest(opt)}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-colors ${
                        interest === opt ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensaje</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors h-28 resize-none" placeholder="¿En qué podemos ayudarte?" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                ENVIAR MENSAJE
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" shape="circle" className="w-10 h-10 text-[9px]" />
            <span className="text-white text-xl font-bold uppercase tracking-tight">JAH SURF Peru</span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm">
              © 2026 JAH SURF Peru. Todos los derechos reservados.
            </p>
          </div>

          <div className="flex gap-6">
            <a href="/terms" className="text-slate-500 hover:text-white transition-colors text-sm">Términos</a>
            <a href="/privacy" className="text-slate-500 hover:text-white transition-colors text-sm">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingWhatsApp = () => {
  const { content } = useContent();
  const waNumber = toWhatsAppNumber(content.contactWhatsApp);
  return (
    <a
      href={`https://wa.me/${waNumber}?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20clases%20de%20surf`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle size={24} />
    </a>
  );
};



const Booking = () => {
  const { settings } = useSettings();

  if (!settings.reservationsEnabled) {
    return (
      <section id="reserva" className="py-20 md:py-28 section-sand section-divider">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter">
            Reservas <span className="text-primary">Cerradas</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Estamos actualizando la agenda. Escríbenos por WhatsApp para más información.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="reserva" className="py-20 md:py-28 section-sand section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter">
            Reserva tu <span className="text-primary">Aventura</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Elige tu clase y asegura tu lugar en el mar.
          </p>
        </div>
        <BookingEngine />
      </div>
    </section>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/" element={
              <div className="relative theme-handmade">
                <Navbar />
                <main>
                  <Hero />
                  <About />
                  <Benefits />
                  <Equipment />
                  <Gallery />
                  <Testimonials />
                  <Pricing />
                  <Booking />
                  <Contact />
                </main>
                <Footer />
                <FloatingWhatsApp />
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
