import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Waves, Instagram, Facebook, MessageCircle, MapPin, Clock, Mail, Shield, Heart, Zap, Users, Dumbbell, Leaf } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';

import { BookingForm } from './components/BookingForm';
import { BrandName } from './components/BrandName';
import { AdminPanel } from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- Components ---

const Navbar = () => {
  const prefersReducedMotion = useReducedMotion();
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
          <a href="#inicio" className="brand-liquid group inline-flex items-center rounded-2xl px-3.5 py-2.5 transition-all duration-300 hover:scale-[1.02]">
            <BrandName 
              className="text-xl sm:text-2xl text-white" 
            />
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
              href="https://wa.me/51952641118" 
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
                href="https://wa.me/51952641118"
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
  const prefersReducedMotion = useReducedMotion();
  const [content, setContent] = useState<any>({
    heroTitle: "JAH SURF",
    heroSubtitle: "Conecta con el mar, respeta su fuerza y vive el surf como estilo de vida.",
    heroImageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1920"
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/api/store/content');
        if (res.ok) {
          const data = await res.json();
          if (data) setContent(data);
        }
      } catch (error) {
        console.warn('Content load failed:', error);
      }
    };

    loadContent();
  }, []);

  return (
    <section id="inicio" className="relative h-[100svh] min-h-[620px] md:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={content.heroImageUrl || "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1920"}
          alt="Surf background" 
          className="w-full h-full object-cover scale-105"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/45 to-slate-950/12 md:to-white"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 glass text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.26em] mb-6 sm:mb-8 rounded-full">
            San Bartolo, Perú
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-display font-black text-white mb-6 sm:mb-8 leading-[0.86] uppercase tracking-tighter">
            {(content.heroTitle || "JAH SURF").trim().toUpperCase() === "JAH SURF" ? (
              <>
                <span className="text-red-500">J</span>
                <span className="text-amber-300">A</span>
                <span className="text-emerald-400">H</span>
                <span className="text-sky-300"> SURF</span>
                <span className="text-sky-300">.</span>
              </>
            ) : (
              <>{content.heroTitle || "JAH SURF"}.</>
            )}
          </h1>
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-8 h-1 bg-primary rounded-full"></div>
            <div className="w-8 h-1 bg-secondary rounded-full"></div>
            <div className="w-8 h-1 bg-accent rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl md:text-3xl text-white mb-10 sm:mb-12 max-w-3xl mx-auto font-medium leading-relaxed [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <a href="#clases" className="group relative bg-primary text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/40 overflow-hidden">
              <span className="relative z-10">RESERVAR CLASE</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
            <a href="#nosotros" className="glass text-coal px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl transition-all hover:bg-white/20 active:scale-95 border-2 border-white/30">
              CONÓCENOS
            </a>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={prefersReducedMotion ? undefined : { y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

const About = () => {
  const [content, setContent] = useState<any>({
    aboutTitle: "Más que una escuela, una filosofía",
    aboutText: "En JAH Surf nuestra prioridad es crear primero un vínculo real con el mar y la Naturaleza. Enseñamos a respetar su poder, mantener la calma frente a lo que no controlamos y aprender técnicas para correr tabla en una experiencia segura, satisfactoria y profunda.",
    aboutImageUrl: "https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&q=80&w=1000",
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/api/store/content');
        if (res.ok) {
          const data = await res.json();
          if (data) setContent((prev: any) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.warn('About content load failed:', error);
      }
    };

    loadContent();
  }, []);

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
              {content.aboutText}
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
          
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
              <img 
                src={content.aboutImageUrl || "https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&q=80&w=1000"}
                alt="Surf lesson" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 glass p-10 rounded-[2.5rem] shadow-xl hidden xl:block max-w-sm z-20 border-2 border-white/30">
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
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_68%)] -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [experiencePhotos, setExperiencePhotos] = useState<{ src: string; alt: string }[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<{ src: string; alt: string }[]>([]);
  const [videos, setVideos] = useState<{ id: string; url: string; title?: string }[]>([]);

  const toEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return '';

    const safeUrl = rawUrl.trim();

    const ytWatch = safeUrl.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{6,})/i);
    if (ytWatch) {
      return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytWatch[1]}&controls=0&modestbranding=1&rel=0&playsinline=1`;
    }

    const ytShort = safeUrl.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{6,})/i);
    if (ytShort) {
      return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1&mute=1&loop=1&playlist=${ytShort[1]}&controls=0&modestbranding=1&rel=0&playsinline=1`;
    }

    const ytEmbed = safeUrl.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/i);
    if (ytEmbed) {
      return `https://www.youtube.com/embed/${ytEmbed[1]}?autoplay=1&mute=1&loop=1&playlist=${ytEmbed[1]}&controls=0&modestbranding=1&rel=0&playsinline=1`;
    }

    const vimeo = safeUrl.match(/vimeo\.com\/(\d{6,})/i);
    if (vimeo) {
      return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&autopause=0&background=1`;
    }

    return safeUrl;
  };

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await fetch('/api/store/content');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.experienceImages)) setExperiencePhotos(data.experienceImages);
          if (Array.isArray(data?.galleryImages)) setGalleryPhotos(data.galleryImages);
          if (Array.isArray(data?.videoLinks)) setVideos(data.videoLinks);
        }
      } catch (error) {
        console.warn('Gallery content load failed:', error);
      }
    };

    loadGallery();
  }, []);

  return (
    <>
    <section id="experiencia" className="py-20 md:py-32 section-sand section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 uppercase tracking-tighter mb-10 md:mb-16 text-center">
          Nuestra <span className="text-primary">Experiencia</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {experiencePhotos.filter(p => p.src).map((photo, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-3xl overflow-hidden shadow-lg"
            >
              <img src={photo.src} alt={photo.alt} className="w-full h-72 sm:h-80 object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section id="galeria" className="py-20 md:py-28 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 uppercase tracking-tighter mb-10 md:mb-14 text-center">
          Galeria <span className="text-primary">Multimedia</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
          {galleryPhotos.filter((p) => p.src).map((photo, i) => (
            <motion.div
              key={`gallery-${i}`}
              whileHover={{ scale: 1.03 }}
              className="rounded-3xl overflow-hidden shadow-lg bg-white"
            >
              <img src={photo.src} alt={photo.alt || 'Galeria'} className="w-full h-64 object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 uppercase tracking-tight mb-6 text-center">Videos</h3>
          <p className="text-slate-500 text-center mb-8">Reproduccion automatica en silencio. Grilla 3x2 adaptable.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {videos.filter((v) => v.url).map((video, i) => (
              <div key={video.id || `video-${i}`} className="rounded-3xl overflow-hidden shadow-lg bg-slate-900 aspect-video">
                <iframe
                  src={toEmbedUrl(video.url)}
                  title={video.title || `Video ${i + 1}`}
                  className="w-full h-full"
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
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

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-7 glass p-8 sm:p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col justify-center">
            <h3 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-tight">
              <div className="bg-primary/10 p-3 rounded-2xl"><Waves className="text-primary" /></div> 
              Kit de Aventura
            </h3>
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
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

          <div className="lg:col-span-5 glass-dark text-white p-8 sm:p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_70%)] -translate-y-1/2 translate-x-1/2 opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
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
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('9hs a 11hs');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [numPeople, setNumPeople] = useState(1);
  const prefersReducedMotion = useReducedMotion();
  const timeOptions = ['9hs a 11hs', '12hs a 2pm', '3pm a 5pm'];

  const extractPenAmount = (priceLabel: string) => {
    const penMatch = priceLabel.match(/S\/\s*([\d.,]+)/i);
    const rawValue = penMatch?.[1] ?? priceLabel.match(/([\d.,]+)/)?.[1] ?? '0';
    return Number(rawValue.replace(/,/g, '')) || 0;
  };

  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedPackageIndex(0);
    setNumPeople(1);
  }, [isOpen, title]);

  if (!isOpen) return null;

  const selectedPackage = packages[selectedPackageIndex] || packages[0];
  const selectedPackagePrice = selectedPackage ? extractPenAmount(selectedPackage.price) : 0;
  const totalPrice = selectedPackagePrice * numPeople;

  const colorClasses = {
    primary: {
      border: 'hover:border-primary/30',
      badge: 'text-primary bg-primary/10',
      selected: 'border-primary bg-primary/10 ring-2 ring-primary/15',
      button: 'bg-primary hover:bg-primary/90 shadow-primary/20'
    },
    secondary: {
      border: 'hover:border-secondary/30',
      badge: 'text-secondary bg-secondary/10',
      selected: 'border-secondary bg-secondary/10 ring-2 ring-secondary/15',
      button: 'bg-secondary hover:bg-secondary/90 shadow-secondary/20'
    },
    accent: {
      border: 'hover:border-accent/30',
      badge: 'text-amber-900 bg-amber-200',
      selected: 'border-accent bg-amber-50 ring-2 ring-accent/15',
      button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
    }
  }[color || 'primary'];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/88"
      />

      <div className="relative min-h-full flex items-start md:items-center justify-center p-4 md:p-6">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-5xl rounded-[2rem] overflow-hidden border border-white/60 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.42)]"
        >
          <div className="p-6 md:p-8 border-b border-slate-200 flex justify-between items-center bg-slate-50/95">
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900 uppercase tracking-tighter">{title}</h3>
              <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 uppercase tracking-widest">Planes mensuales</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full transition-colors" aria-label="Cerrar modal">
              <X className="w-6 h-6 text-slate-900" />
            </button>
          </div>

          <div className="grid lg:grid-cols-[1.25fr_0.85fr] gap-0">
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="grid gap-4">
                {packages.map((pkg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedPackageIndex(i)}
                    className={`w-full text-left flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 md:p-6 rounded-3xl bg-slate-50 border transition-colors duration-200 ${i === selectedPackageIndex ? colorClasses.selected : `border-slate-200 ${colorClasses.border}`}`}
                  >
                    <div className="mb-4 sm:mb-0">
                      <h4 className="font-bold text-lg md:text-xl text-slate-900">{pkg.name}</h4>
                      <p className="text-slate-500 font-medium">{pkg.desc}</p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{pkg.price}</span>
                        {pkg.perClass && (
                          <span className={`font-bold text-sm mt-2 ${colorClasses.badge} px-3 py-1 rounded-full inline-block w-fit sm:ml-auto`}>
                            {pkg.perClass} <span className="text-[10px] opacity-70 uppercase">por clase</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-50/60">
              <div className="space-y-4 md:sticky md:top-6">
                <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  value={date}
                  onChange={(e) => setDate(formatLatinDateInput(e.target.value))}
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4"
                  placeholder="dd/mm/aaaa"
                />
                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4">
                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em]">Personas</label>
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3">
                    <Users className="w-5 h-5 text-primary" />
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={numPeople}
                      onChange={(e) => setNumPeople(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
                <input type="tel" placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4" />

                <div className="rounded-2xl bg-slate-900 text-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-2">Reserva seleccionada</p>
                  <p className="font-black text-lg leading-tight">{selectedPackage?.name || 'Selecciona un paquete'}</p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-white/70">{numPeople} {numPeople === 1 ? 'persona' : 'personas'}</p>
                      <p className="text-3xl font-black text-primary">S/ {totalPrice}</p>
                    </div>
                    {selectedPackage?.perClass && (
                      <span className={`font-bold text-xs ${colorClasses.badge} px-3 py-1 rounded-full`}>
                        {selectedPackage.perClass} <span className="text-[10px] opacity-70 uppercase">por clase</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const parsedDate = parseLatinDate(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (!name || !date || !whatsapp) {
                      alert('Por favor, completa nombre, fecha y WhatsApp.');
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
                      activity: title,
                      plan: selectedPackage?.name || '',
                      name,
                      numPeople,
                      date,
                      time,
                      totalPrice,
                      whatsapp,
                      timestamp: new Date().toISOString()
                    };

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
                    } catch (error) {
                      console.error('Error al guardar en el servidor:', error);
                    }

                    const message = `Hola JAH SURF Peru, quiero reservar:
- Actividad: ${title}
- Paquete: ${selectedPackage?.name || 'No especificado'}
- Nombre: ${name}
- Personas: ${numPeople}
- Fecha: ${date}
- Horario: ${time}
- Total: S/ ${totalPrice}
- Mi WhatsApp: ${whatsapp}`;
                    window.open(`https://wa.me/51952641118?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                  className={`flex items-center justify-center gap-3 w-full ${colorClasses.button} text-white text-center py-5 rounded-2xl font-black text-lg transition-colors shadow-lg`}
                >
                  <MessageCircle className="w-6 h-6" />
                  RESERVAR POR WHATSAPP
                </button>

                <p className="text-center text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">
                  * Sujeto a condiciones climáticas y disponibilidad
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

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
        { name: "1 Clase x Semana", desc: "4 clases al mes", price: "S/ 461", perClass: "S/ 115" },
        { name: "2 Clases x Semana", desc: "8 clases al mes", price: "S/ 835", perClass: "S/ 104" },
        { name: "3 Clases x Semana", desc: "12 clases al mes", price: "S/ 1181", perClass: "S/ 98" },
        { name: "Clase Suelta", desc: "Sesión única de prueba", price: "S/ 130", perClass: "S/ 130" },
      ]
    },
    {
      id: 'individuales',
      title: "Clases Individuales",
      icon: <Zap className="w-12 h-12" />,
      color: "secondary",
      desc: "Atención 100% personalizada para perfeccionar tu técnica rápidamente.",
      packages: [
        { name: "1 Clase x Semana", desc: "4 clases al mes", price: "S/ 691", perClass: "S/ 173" },
        { name: "2 Clases x Semana", desc: "8 clases al mes", price: "S/ 1267", perClass: "S/ 158" },
        { name: "3 Clases x Semana", desc: "12 clases al mes", price: "S/ 1728", perClass: "S/ 144" },
        { name: "Clase Suelta", desc: "Sesión única intensiva", price: "S/ 187", perClass: "S/ 187" },
      ]
    },
    {
      id: 'paddle',
      title: "Clases y Paseos en Paddle",
      icon: <Waves className="w-12 h-12" />,
      color: "accent",
      desc: "Mismo costo y mismos paquetes que clases individuales, en modalidad Paddle.",
      packages: [
        { name: "1 Clase x Semana", desc: "4 clases al mes", price: "S/ 691", perClass: "S/ 173" },
        { name: "2 Clases x Semana", desc: "8 clases al mes", price: "S/ 1267", perClass: "S/ 158" },
        { name: "3 Clases x Semana", desc: "12 clases al mes", price: "S/ 1728", perClass: "S/ 144" },
        { name: "Clase Suelta", desc: "Sesión única intensiva", price: "S/ 187", perClass: "S/ 187" },
      ]
    },
    {
      id: 'otras',
      title: "Otras Actividades",
      icon: <Waves className="w-12 h-12" />,
      color: "accent",
      desc: "Experiencias grupales, viajes y eventos diseñados para la comunidad.",
      packages: [
        { name: "Paseos de Surf", desc: "Día completo en otras playas", price: "Desde S/ 288" },
        { name: "Surf Camps", desc: "Fin de semana inmersivo", price: "Consultar" },
        { name: "Eventos Corporativos", desc: "Team building en el mar", price: "Consultar" },
        { name: "Alquiler de Equipo", desc: "Tabla + Wetsuit (2h)", price: "S/ 72" },
      ]
    }
  ];

  return (
    <section id="clases" className="py-20 md:py-32 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-primary"></div>
            <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Membresías</span>
            <div className="w-12 h-px bg-primary"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Elige tu <span className="text-primary">Ritmo</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Planes flexibles diseñados para que el surf se convierta en tu nuevo estilo de vida.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-10">
          {pricingCategories.map((cat) => (
            <motion.div 
              key={cat.id}
              whileHover={{ y: -8 }}
              className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center text-center group cursor-pointer transition-all duration-300 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.12)] hover:bg-white/84"
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
    <section id="beneficios" className="py-20 md:py-32 section-ink text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(2,132,199,0.3),transparent_70%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-14 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-secondary"></div>
            <span className="text-secondary font-black uppercase tracking-[0.2em] text-xs">Transformación</span>
            <div className="w-12 h-px bg-secondary"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black mb-6 uppercase tracking-tighter">Beneficios del <span className="text-secondary">Surf</span></h2>
          <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Mucho más que un deporte, una medicina natural para tu cuerpo y mente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {benefits.map((b, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-dark p-7 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white/12 transition-all duration-300 group border-white/10"
            >
              <div className="text-secondary mb-8 group-hover:scale-105 transition-transform duration-300">
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
    <section id="contacto" className="py-20 md:py-32 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-primary"></div>
              <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Hablemos</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 mb-10 md:mb-12 leading-[0.92] uppercase tracking-tighter">
              ¿Listo para tu <span className="text-primary">primera ola?</span>
            </h2>
            
            <div className="space-y-6 md:space-y-10">
              {[
                { icon: <MapPin />, t: "Ubicación", d: "Malecón Rivera Norte 636, San Bartolo, Lima, Perú", color: "text-primary" },
                { icon: <Clock />, t: "Horarios", d: "Todos los días de 7:00 AM a 7:00 PM", color: "text-secondary" },
                { icon: <MessageCircle />, t: "WhatsApp", d: "+51 952 641 118", color: "text-accent" },
                { icon: <Mail />, t: "Email", d: "jahsamba@hotmail.com", color: "text-primary" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 md:gap-8 items-start group">
                  <div className={`bg-slate-50 p-4 md:p-5 rounded-2xl ${item.color} group-hover:bg-slate-900 group-hover:text-white transition-all duration-300`}>
                    {React.cloneElement(item.icon, { size: 32 })}
                  </div>
                  <div>
                    <h4 className="font-black text-xl uppercase tracking-tight mb-1">{item.t}</h4>
                    <p className="text-slate-600 text-base sm:text-lg font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 md:mt-16 flex gap-4 sm:gap-6">
              <a href="https://www.instagram.com/jahsurfperu/" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] hover:bg-primary hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-slate-900/10" aria-label="Instagram">
                <Instagram size={28} />
              </a>
              <a href="https://www.facebook.com/jahsurfperu" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] hover:bg-primary hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-slate-900/10" aria-label="Facebook">
                <Facebook size={28} />
              </a>
              <a href="https://wa.me/51952641118" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] hover:bg-primary hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-slate-900/10" aria-label="WhatsApp">
                <MessageCircle size={28} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-6 sm:p-8 md:p-16 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-900/5"
          >
            <h3 className="text-2xl sm:text-3xl font-black mb-8 md:mb-10 uppercase tracking-tight">Envíanos un mensaje</h3>
            <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em]">Nombre</label>
                  <input type="text" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="Tu nombre" />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em]">WhatsApp</label>
                  <input type="tel" className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="Tu número" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em]">Interés</label>
                <select className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium appearance-none">
                  <option>Clases Grupales</option>
                  <option>Clases Individuales</option>
                  <option>Eventos / Otros</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-600 uppercase tracking-[0.15em]">Mensaje</label>
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
    <footer className="glass-dark py-14 md:py-20 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <div className="flex items-center gap-3">
            <BrandName className="text-white text-2xl" /> <span className="text-accent text-2xl font-display font-black uppercase tracking-tighter">Peru</span>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-white/70 text-sm font-medium">
              © 2026 <BrandName /> Peru. Todos los derechos reservados.
            </p>
            <p className="text-white/60 text-[10px] uppercase font-black tracking-[0.2em] mt-2">
              Desarrollado por <a href="https://www.miraescuchahablaconamor.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors">miraescuchahablaconamor.com</a>
            </p>
          </div>
          
          <div className="flex gap-6 sm:gap-10">
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
    <section id="reserva" className="py-20 md:py-32 section-sand section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Reserva tu <span className="text-primary">Aventura</span>
          </h2>
          <p className="text-slate-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-medium">
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
      </AuthProvider>
    </ErrorBoundary>
  );
}
