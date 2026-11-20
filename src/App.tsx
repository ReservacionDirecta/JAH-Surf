import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Waves,
  Instagram,
  Facebook,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Shield,
  Users,
  Zap,
  Award,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { PRICE_TABLES } from './constants';
import { toWhatsAppNumber } from './utils/whatsapp';
import { useContent } from './hooks/useContent';
import { useSettings } from './hooks/useSettings';
import { LanguageProvider, useLanguage, toUsd } from './i18n';

import { BookingEngine } from './components/BookingEngine';
import { VideoBackground } from './components/VideoBackground';
import { AdminPanel } from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Logo } from './components/logo';

type Category = 'grupales' | 'individuales' | 'paddle' | 'otras';

const DEFAULT_WHATSAPP_DISPLAY = '+51 952 641 118';
const DEFAULT_EMAIL = 'jahsamba@hotmail.com';
const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&q=80&w=1920',
];

const Navbar = () => {
  const prefersReducedMotion = useReducedMotion();
  const { content } = useContent();
  const { lang, toggleLang } = useLanguage();
  const waNumber = toWhatsAppNumber(content.contactWhatsApp);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;
      setIsScrolled(window.scrollY > 40);

      const sections = ['inicio', 'nosotros', 'clases', 'reserva', 'contacto'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
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
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    if (isMobileMenuOpen) {
      setIsScrolled(true);
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    }
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
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

  const navLinks =
    lang === 'es'
      ? [
          { name: 'Inicio', href: '#inicio', id: 'inicio' },
          { name: 'Escuela', href: '#nosotros', id: 'nosotros' },
          { name: 'Clases', href: '#clases', id: 'clases' },
          { name: 'Reservar', href: '#reserva', id: 'reserva' },
          { name: 'Contacto', href: '#contacto', id: 'contacto' },
        ]
      : [
          { name: 'Home', href: '#inicio', id: 'inicio' },
          { name: 'School', href: '#nosotros', id: 'nosotros' },
          { name: 'Classes', href: '#clases', id: 'clases' },
          { name: 'Book', href: '#reserva', id: 'reserva' },
          { name: 'Contact', href: '#contacto', id: 'contacto' },
        ];

  const menuListMotion = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 } };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'glass pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-lg shadow-slate-900/5'
            : 'bg-gradient-to-b from-slate-950/60 to-transparent pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]'
        }`}
      >
        <div className="rasta-stripe h-1 w-full absolute top-0 left-0" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <a
            href="#inicio"
            aria-label="Ir al inicio de JAH SURF Peru"
            className="transition-transform duration-300 hover:scale-[1.03] min-w-[44px] min-h-[44px] flex items-center gap-3"
          >
            <Logo size="sm" shape="circle" className="w-11 h-11 text-[10px]" />
            <span
              className={`hidden sm:inline font-display font-black tracking-wider text-sm uppercase ${
                isScrolled ? 'text-slate-900' : 'text-white'
              }`}
            >
              <span className="text-red-500">J</span>
              <span className={isScrolled ? 'text-amber-600' : 'text-yellow-400'}>A</span>
              <span className="text-green-500">H</span> SURF
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-[0.18em] transition-colors hover:text-secondary ${
                  activeSection === link.id
                    ? 'text-secondary'
                    : isScrolled
                      ? 'text-slate-700'
                      : 'text-white/90'
                }`}
              >
                {link.name}
              </a>
            ))}

            <button
              type="button"
              onClick={toggleLang}
              aria-label="Cambiar idioma / Switch language"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                isScrolled
                  ? 'border-slate-300 text-slate-800 hover:bg-slate-100'
                  : 'border-white/30 text-white hover:bg-white/15'
              }`}
            >
              <Globe size={13} />
              {lang === 'es' ? 'ES | EN' : 'EN | ES'}
            </button>

            <a
              href="#reserva"
              className="bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              {lang === 'es' ? 'Reservar' : 'Book Now'}
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-full text-xs font-bold uppercase border touch-manipulation ${
                isScrolled || isMobileMenuOpen
                  ? 'border-slate-300 text-slate-900 bg-white'
                  : 'border-white/30 text-white bg-white/15 backdrop-blur-md'
              }`}
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-full transition-colors touch-manipulation ${
                isScrolled || isMobileMenuOpen
                  ? 'text-slate-900 bg-slate-100'
                  : 'text-white bg-white/15 backdrop-blur-md'
              }`}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-lg flex flex-col justify-center items-center p-6 md:hidden"
          >
            <motion.div {...menuListMotion} className="flex flex-col items-center gap-6 w-full max-w-xs">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={handleMobileNavigate(link.href)}
                  className="text-2xl font-display font-black text-white uppercase tracking-wider hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-full font-bold text-base"
              >
                <MessageCircle size={20} />
                {lang === 'es' ? 'WhatsApp Directo' : 'Direct WhatsApp'}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const heroVideoUrl = content.videoLinks?.find((v) => v.url)?.url;

  const gallerySlides = [
    content.heroImageUrl,
    ...(content.experienceImages || []).map((img) => img.src),
  ].filter((src): src is string => Boolean(src));

  const slides = gallerySlides.length > 0 ? gallerySlides : DEFAULT_HERO_IMAGES;
  const [activeSlide, setActiveSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(Boolean(heroVideoUrl));
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setShowVideo(Boolean(heroVideoUrl));
  }, [heroVideoUrl]);

  useEffect(() => {
    if (showVideo || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [showVideo, slides.length]);

  const nextSlide = () => {
    setShowVideo(false);
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setShowVideo(false);
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = endX - touchStartX;
    if (deltaX > 45) {
      prevSlide();
    } else if (deltaX < -45) {
      nextSlide();
    }
    setTouchStartX(null);
  };

  const heroTitle = content.heroTitle || 'JAH SURF';
  const renderHeroTitle = () => {
    const match = heroTitle.match(/^JAH(.*)$/i);
    if (!match) return heroTitle;
    return (
      <>
        <span className="text-red-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          {heroTitle[0]}
        </span>
        <span className="text-yellow-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          {heroTitle[1]}
        </span>
        <span className="text-green-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          {heroTitle[2]}
        </span>
        <span>{match[1]}</span>
      </>
    );
  };

  return (
    <section
      id="inicio"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-slate-950 touch-pan-y"
    >
      <div className="absolute inset-0 z-0">
        {showVideo && heroVideoUrl ? (
          <VideoBackground
            url={heroVideoUrl}
            poster={slides[0]}
            overlayClassName="bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/85"
          />
        ) : (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="flex h-full transition-transform duration-700 ease-out will-change-transform"
                style={{ transform: `translateX(-${activeSlide * 50}%)` }}
              >
                {[...slides, ...slides].map((src, idx) => (
                  <img
                    key={`${src}-${idx}`}
                    src={src}
                    alt={`Surf en San Bartolo - JAH SURF ${idx + 1}`}
                    className="flex-shrink-0 w-auto h-full object-cover"
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                  />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/85" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex-1 flex flex-col justify-between items-center text-center pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24">
        <div className="flex flex-col items-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white/95 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.22em] mb-4 sm:mb-6 rounded-full border border-white/20">
            <MapPin size={13} className="text-secondary" />
            {lang === 'es' ? 'San Bartolo, Lima • Perú' : 'San Bartolo, Lima • Peru'}
          </span>

          <h1 className="text-4xl sm:text-7xl md:text-8xl font-display font-black text-white mb-4 sm:mb-5 leading-[0.9] uppercase tracking-tight">
            {renderHeroTitle()}
          </h1>

          <p className="text-sm sm:text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">
            {lang === 'es'
              ? content.heroSubtitle ||
                'Clases de surf para locales y surf guiding en San Bartolo, Peñascal y La Isla. Instructores certificados y equipo completo incluido.'
              : 'Score year-round swell in San Bartolo, Peñascal & La Isla. Surf lessons for all levels & local surf guiding with our local crew — quiver & wetsuit included.'}
          </p>
        </div>

        <div className="w-full max-w-md sm:max-w-none flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-8">
          <a
            href="#reserva"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
          >
            {lang === 'es' ? 'Reservar Clase' : 'Lock In Your Session'}
            <ArrowRight size={18} />
          </a>
          <a
            href="#clases"
            className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-white/20 transition-all border border-white/25"
          >
            {lang === 'es' ? 'Explorar Planes' : 'Explore Plans'}
          </a>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-0.5 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/15">
        {heroVideoUrl && (
          <button
            type="button"
            onClick={() => setShowVideo((v) => !v)}
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 text-[11px] font-bold uppercase tracking-wider text-white/90 hover:text-secondary border-r border-white/20 transition-colors"
            title={showVideo ? 'Ver galería de fotos' : 'Ver video de fondo'}
          >
            {showVideo ? <ImageIcon size={13} /> : <Play size={13} />}
            <span className="hidden sm:inline">
              {showVideo ? (lang === 'es' ? 'Fotos' : 'Photos') : 'Video'}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous image"
          className="text-white/75 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setShowVideo(false);
                setActiveSlide(idx);
              }}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                !showVideo && activeSlide === idx ? 'w-5 bg-secondary' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next image"
          className="text-white/75 hover:text-white transition-colors p-0.5"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

const TrustBar = () => {
  const { lang } = useLanguage();
  return (
    <div className="bg-slate-900 text-white py-4 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 flex flex-wrap justify-center md:justify-between items-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary shrink-0" />
          <span>
            {lang === 'es'
              ? 'San Bartolo, Peñascal & La Isla • Olas todo el año'
              : 'San Bartolo, Peñascal & La Isla • Year-round swell'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-primary shrink-0" />
          <span>
            {lang === 'es'
              ? 'Instructores locales y Surf Guiding'
              : 'Local crew & certified surf guiding'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-primary shrink-0" />
          <span>
            {lang === 'es' ? 'Tabla, wetsuit y leash incluidos' : 'Quiver, wetsuit & leash included'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star size={16} className="text-secondary shrink-0" fill="currentColor" />
          <span>
            {lang === 'es' ? '4.9/5 por alumnos locales y viajeros' : '4.9/5 stoked locals & travelers'}
          </span>
        </div>
      </div>
    </div>
  );
};

const SchoolExperience = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const photos = (content.experienceImages || []).filter((p) => p.src).slice(0, 4);

  return (
    <section id="nosotros" className="py-16 md:py-24 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-center mb-12">
          <div className="lg:col-span-5">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              {lang === 'es' ? 'Filosofía Costera' : 'Coastal Philosophy'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 mt-2 mb-4 uppercase tracking-tight leading-[1.02]">
              {lang === 'es' ? (
                <>
                  Más que una clase, tu <span className="text-primary">conexión</span> con San Bartolo
                </>
              ) : (
                <>
                  More than a lesson, your <span className="text-primary">connection</span> to San Bartolo
                </>
              )}
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              {lang === 'es'
                ? content.aboutText ||
                  'En JAH SURF combinamos enseñanza técnica para locales y surf guiding personalizado para viajeros extranjeros en las mejores olas de San Bartolo, Peñascal y La Isla.'
                : 'At JAH SURF we combine technical coaching for locals and tailored surf guiding for international travelers across San Bartolo, Peñascal, and La Isla.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-2xl font-display font-black text-slate-900">10+</p>
                <p className="text-xs text-slate-500 font-medium">
                  {lang === 'es' ? 'Años enseñando en San Bartolo' : 'Years coaching in San Bartolo'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-2xl font-display font-black text-slate-900">ES / EN</p>
                <p className="text-xs text-slate-500 font-medium">
                  {lang === 'es' ? 'Clases y guiding bilingüe' : 'Bilingual lessons & guiding'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
            {(photos.length > 0 ? photos : DEFAULT_HERO_IMAGES.map((src) => ({ src, alt: 'Jah Surf' }))).map(
              (photo, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden bg-slate-100 ${
                    i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt || 'Experiencia Jah Surf'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onSelectCategory }: { onSelectCategory: (cat: Category) => void }) => {
  const { settings } = useSettings();
  const { lang } = useLanguage();

  const pricingCategories: {
    id: Category;
    title: string;
    icon: React.ReactNode;
    desc: string;
    level: string;
    duration: string;
    startingPrice: number;
    featured?: boolean;
  }[] = [
    {
      id: 'grupales',
      title: lang === 'es' ? 'Clases Grupales' : 'Group Lessons',
      icon: <Users className="w-5 h-5" />,
      desc:
        lang === 'es'
          ? 'Grupos reducidos (máx. 4 alumnos por instructor) para aprender con energía y seguridad.'
          : 'Small groups (max 4 students per coach) to learn with great energy and safety.',
      level: lang === 'es' ? 'Principiante / Intermedio' : 'Beginner / Intermediate',
      duration: '90 min',
      startingPrice: PRICE_TABLES.grupales[0]?.price ?? 80,
      featured: true,
    },
    {
      id: 'individuales',
      title: lang === 'es' ? 'Clases Individuales' : 'Private 1-on-1',
      icon: <Zap className="w-5 h-5" />,
      desc:
        lang === 'es'
          ? 'Coach 1-a-1 enfocado 100% en tu técnica de remada, pop-up y maniobras.'
          : '1-on-1 coaching focused 100% on your paddling, pop-up, and wave selection.',
      level: lang === 'es' ? 'Todos los niveles' : 'All levels',
      duration: '90 min',
      startingPrice: PRICE_TABLES.individuales[0]?.price ?? 120,
    },
    {
      id: 'paddle',
      title: 'Paddle Surf',
      icon: <Waves className="w-5 h-5" />,
      desc:
        lang === 'es'
          ? 'Travesías guiadas y clases de Stand Up Paddle en aguas tranquilas de la bahía.'
          : 'Guided SUP tours and lessons in the calm waters of San Bartolo bay.',
      level: lang === 'es' ? 'Principiante' : 'Beginner',
      duration: '60 - 90 min',
      startingPrice: PRICE_TABLES.paddle[0]?.price ?? 90,
    },
    {
      id: 'otras',
      title: lang === 'es' ? 'Surf Guiding & Alquiler' : 'Surf Guiding & Rental',
      icon: <Award className="w-5 h-5" />,
      desc:
        lang === 'es'
          ? 'Surf guiding en Peñascal/La Isla para viajeros, alquiler de equipo y surf camps.'
          : 'Local surf guiding at Peñascal & La Isla for travelers, gear rental & surf camps.',
      level: lang === 'es' ? 'Libre / Viajeros' : 'Open / Travelers',
      duration: lang === 'es' ? 'Flexible' : 'Flexible',
      startingPrice: PRICE_TABLES.otras[0]?.price ?? 50,
    },
  ];

  const handleBookClick = (catId: Category) => {
    if (!settings.reservationsEnabled) return;
    onSelectCategory(catId);
    const target = document.getElementById('reserva');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="clases" className="py-16 md:py-24 section-sand section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            {lang === 'es' ? 'Programas & Tarifas' : 'Programs & Rates'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 mt-2 mb-3 uppercase tracking-tight">
            {lang === 'es' ? (
              <>
                Elige tu <span className="text-primary">Sesión</span>
              </>
            ) : (
              <>
                Choose Your <span className="text-primary">Session</span>
              </>
            )}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            {lang === 'es'
              ? 'Precios transparentes en Soles (S/) y Dólares ($ USD). Reserva en segundos.'
              : 'Transparent pricing in Peruvian Soles (S/) and US Dollars ($ USD). Book in seconds.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {pricingCategories.map((cat) => (
            <div
              key={cat.id}
              className={`bg-white p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                cat.featured
                  ? 'border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/10'
                  : 'border-slate-100 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {lang === 'es' ? 'Desde' : 'From'}
                    </span>
                    <span className="text-xl font-display font-black text-slate-900">
                      S/ {cat.startingPrice}
                    </span>
                    <span className="block text-xs font-semibold text-primary">
                      ~ ${toUsd(cat.startingPrice)} USD
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-2">
                  {cat.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    {cat.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    {cat.duration}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-6 leading-relaxed">{cat.desc}</p>
              </div>

              <button
                type="button"
                disabled={!settings.reservationsEnabled}
                onClick={() => handleBookClick(cat.id)}
                className="w-full py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {settings.reservationsEnabled ? (
                  <>
                    {lang === 'es' ? 'Reservar ahora' : 'Book now'}
                    <ArrowRight size={16} />
                  </>
                ) : lang === 'es' ? (
                  'No disponible'
                ) : (
                  'Unavailable'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Booking = ({ selectedCategory }: { selectedCategory: Category }) => {
  const { settings } = useSettings();
  const { lang } = useLanguage();

  if (!settings.reservationsEnabled) {
    return (
      <section id="reserva" className="py-16 md:py-24 section-paper section-divider">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 mb-4 uppercase tracking-tight">
            {lang === 'es' ? 'Reservas Cerradas' : 'Bookings Closed'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            {lang === 'es'
              ? 'Estamos actualizando la agenda. Escríbenos por WhatsApp para más información.'
              : 'We are updating our schedule. Message us on WhatsApp for more details.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="reserva" className="py-16 md:py-24 section-paper section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            {lang === 'es' ? 'Reserva Online' : 'Online Booking'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-slate-900 mt-2 mb-3 uppercase tracking-tight">
            {lang === 'es' ? (
              <>
                Asegura tu <span className="text-primary">Sesión</span>
              </>
            ) : (
              <>
                Book Your <span className="text-primary">Session</span>
              </>
            )}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            {lang === 'es'
              ? 'Elige tu clase, fecha y método de pago (Link de Pago, Yape/Plin o Transferencia).'
              : 'Pick your class, date, and payment method (Payment Link, Yape/Plin, or Bank Transfer).'}
          </p>
        </div>
        <BookingEngine key={selectedCategory} defaultCategory={selectedCategory} />
      </div>
    </section>
  );
};

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/jah+surf/data=!4m2!3m1!1s0x91059f2985df96ad:0xc5b3e103ebd1f9e7?sa=X&ved=1t:242&ictx=111';
const GOOGLE_MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=jah+surf+san+bartolo&t=&z=16&ie=UTF8&iwloc=&output=embed';

const Contact = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const waNumber = toWhatsAppNumber(content.contactWhatsApp);

  return (
    <section id="contacto" className="py-16 md:py-24 section-sand section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                {lang === 'es' ? 'Encuéntranos' : 'Find Us'}
              </span>
              <h2 className="text-3xl font-display font-black text-slate-900 mt-2 mb-4 uppercase tracking-tight">
                San Bartolo, Lima
              </h2>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Playa Norte / Malecón de San Bartolo, Lima, Perú</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    {lang === 'es'
                      ? 'Todos los días: 8:00 am – 5:30 pm'
                      : 'Every day: 8:00 am – 5:30 pm'}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{String(content.contactEmail || DEFAULT_EMAIL)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 px-6 rounded-full font-bold text-base hover:bg-primary/90 transition-colors"
              >
                <MessageCircle size={20} />
                WhatsApp ({String(content.contactWhatsApp || DEFAULT_WHATSAPP_DISPLAY)})
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 px-6 rounded-full font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                <MapPin size={18} />
                {lang === 'es' ? 'Abrir en Google Maps' : 'Open in Google Maps'}
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-3 rounded-full font-semibold text-sm hover:bg-slate-200 transition-colors"
                >
                  <Instagram size={18} />
                  Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-3 rounded-full font-semibold text-sm hover:bg-slate-200 transition-colors"
                >
                  <Facebook size={18} />
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 sm:h-72 bg-slate-100">
            <iframe
              title="Ubicación JAH SURF San Bartolo"
              src={GOOGLE_MAPS_EMBED_URL}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { lang } = useLanguage();
  return (
    <footer className="relative bg-slate-950 text-white pt-10 pb-24 sm:py-10">
      <div className="rasta-stripe h-1 w-full absolute top-0 left-0" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <Logo size="sm" shape="circle" className="w-10 h-10 text-[10px]" />
          <div>
            <p className="font-display font-black uppercase tracking-wider text-sm">
              <span className="text-red-500">J</span>
              <span className="text-yellow-400">A</span>
              <span className="text-green-500">H</span> SURF PERÚ
            </p>
            <p className="text-xs text-slate-400">
              {lang === 'es' ? 'San Bartolo • Escuela de Surf' : 'San Bartolo • Surf School & Guiding'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} JAH SURF Perú.{' '}
          {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
};

const FloatingWhatsApp = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const waNumber = toWhatsAppNumber(content.contactWhatsApp);

  return (
    <a
      href={`https://wa.me/${waNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={lang === 'es' ? 'Contactar por WhatsApp' : 'Chat on WhatsApp'}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform touch-manipulation"
    >
      <MessageCircle size={26} />
    </a>
  );
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('grupales');

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/admin" element={<AdminPanel />} />
              <Route
                path="/"
                element={
                  <div className="relative theme-handmade">
                    <Navbar />
                    <main>
                      <Hero />
                      <TrustBar />
                      <SchoolExperience />
                      <Pricing onSelectCategory={setSelectedCategory} />
                      <Booking selectedCategory={selectedCategory} />
                      <Contact />
                    </main>
                    <Footer />
                    <FloatingWhatsApp />
                  </div>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
