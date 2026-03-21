import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthProvider";
import { authenticatedFetch } from "../auth";
import { LogOut, Save, Layout, DollarSign, Calendar, Image, BarChart3, Settings, Trash2, Plus, ArrowUp, ArrowDown, GripVertical } from "lucide-react";

type Tab = "content" | "pricing" | "bookings" | "images" | "experience" | "reports" | "settings";

type Booking = {
  id: string;
  activity: string;
  plan: string;
  numPeople: number;
  date: string;
  time: string;
  totalPrice: number;
  whatsapp: string;
  status?: "pendiente" | "confirmada" | "completada" | "cancelada";
  notes?: string;
  timestamp?: string;
};

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
};

type VideoItem = {
  id: string;
  url: string;
  title?: string;
};

type ContentListKey = "galleryImages" | "experienceImages" | "videoLinks";

const defaultContent = {
  heroTitle: "JAH SURF",
  heroSubtitle: "Donde el mar se encuentra con tu espíritu.",
  aboutTitle: "Más que una escuela, una filosofía",
  aboutText: "En JAH SURF Peru, el surf es el puente para reconectar con tu ser interior.",
  contactEmail: "hola@jahsurfperu.com",
  contactWhatsApp: "+51 904 060 670",
  heroImageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1920",
  aboutImageUrl: "https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&q=80&w=1000",
  galleryImages: [
    {
      id: "g1",
      src: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1200",
      alt: "Surf en San Bartolo",
    },
  ] as GalleryImage[],
  experienceImages: [
    { id: "e1", src: "", alt: "Surf en San Bartolo" },
    { id: "e2", src: "", alt: "Clase de surf" },
    { id: "e3", src: "", alt: "Olas en San Bartolo" },
    { id: "e4", src: "", alt: "Aprendiendo a surfear" },
  ] as GalleryImage[],
  videoLinks: [] as VideoItem[],
};

const defaultPricing = [
  { id: "grupales", name: "Clases Grupales", price: 96, description: "Por persona" },
  { id: "individuales", name: "Clases Individuales", price: 180, description: "Por clase" },
  { id: "paddle", name: "Clases y Paseos en Paddle", price: 180, description: "Mismo costo que individuales" },
  { id: "otras", name: "Eventos especiales", price: 420, description: "Por grupo" },
];

const defaultSettings = {
  siteName: "JAH SURF Peru",
  reservationsEnabled: true,
  maxGalleryItems: 12,
};

export const AdminPanel = () => {
  const { user, isLoading, isAdmin, login, logout, error } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [content, setContent] = useState<any>(defaultContent);
  const [pricing, setPricing] = useState<any[]>(defaultPricing);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ listKey: ContentListKey; id: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const reports = useMemo(() => {
    const totalBookings = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmada" || b.status === "completada").length;
    const completed = bookings.filter((b) => b.status === "completada").length;
    const canceled = bookings.filter((b) => b.status === "cancelada").length;
    const revenue = bookings
      .filter((b) => b.status !== "cancelada")
      .reduce((acc, b) => acc + (Number(b.totalPrice) || 0), 0);
    return { totalBookings, confirmed, completed, canceled, revenue };
  }, [bookings]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return;

      try {
        const keysRes = await fetch('/api/store');
        const availableKeys = new Set<string>();
        if (keysRes.ok) {
          const keys = await keysRes.json();
          if (Array.isArray(keys)) {
            keys.forEach((k) => availableKeys.add(String(k)));
          }
        }

        if (availableKeys.has('content')) {
          const contentRes = await fetch("/api/store/content");
          if (contentRes.ok) {
            const contentData = await contentRes.json();
            if (contentData) {
              setContent({ 
                ...defaultContent, 
                ...contentData, 
                galleryImages: contentData.galleryImages ?? defaultContent.galleryImages,
                experienceImages: contentData.experienceImages ?? defaultContent.experienceImages,
                videoLinks: contentData.videoLinks ?? defaultContent.videoLinks,
              });
            }
          }
        }

        if (availableKeys.has('pricing')) {
          const pricingRes = await fetch("/api/store/pricing");
          if (pricingRes.ok) {
            const pricingData = await pricingRes.json();
            if (Array.isArray(pricingData)) setPricing(pricingData);
          }
        }

        if (availableKeys.has('bookings')) {
          const bookingsRes = await fetch("/api/store/bookings");
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            if (Array.isArray(bookingsData)) {
              const normalized = bookingsData.map((b: any, idx: number) => ({
                ...b,
                id: b.id || `${b.timestamp || "booking"}-${idx}`,
                status: b.status || "pendiente",
                notes: b.notes || "",
              }));
              setBookings(normalized.sort((a: Booking, b: Booking) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()));
            }
          }
        }

        if (availableKeys.has('settings')) {
          const settingsRes = await fetch("/api/store/settings");
          if (settingsRes.ok) {
            const settingsData = await settingsRes.json();
            if (settingsData) setSettings({ ...defaultSettings, ...settingsData });
          }
        }
      } catch (err) {
        console.error("Error loading admin data", err);
      }
    };

    loadData();
  }, [isAdmin]);

  const saveByKey = async (key: string, data: any, message: string) => {
    setSaving(true);
    try {
      await authenticatedFetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data }),
      });
      alert(message);
    } catch (err) {
      console.error(err);
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const saveContent = () => saveByKey("content", content, "Contenido guardado con éxito");
  const savePricing = () => saveByKey("pricing", pricing, "Precios guardados con éxito");
  const saveBookings = () => saveByKey("bookings", bookings, "Reservas actualizadas con éxito");
  const saveSettings = () => saveByKey("settings", settings, "Ajustes guardados con éxito");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Error de autenticación");
    }
  };

  const addPricingRow = () => {
    setPricing((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name: "Nuevo plan", price: 0, description: "Descripción" },
    ]);
  };

  const removePricingRow = (id: string) => {
    setPricing((prev) => prev.filter((item) => item.id !== id));
  };

  const addGalleryItem = () => {
    const gallery = (content.galleryImages || []) as GalleryImage[];
    if (gallery.length >= Number(settings.maxGalleryItems || 12)) {
      alert("Llegaste al máximo de imágenes configurado.");
      return;
    }
    setContent({
      ...content,
      galleryImages: [...gallery, { id: `g-${Date.now()}`, src: "", alt: "" }],
    });
  };

  const updateGalleryItem = (id: string, patch: Partial<GalleryImage>) => {
    setContent({
      ...content,
      galleryImages: (content.galleryImages || []).map((img: GalleryImage) =>
        img.id === id ? { ...img, ...patch } : img,
      ),
    });
  };

  const removeGalleryItem = (id: string) => {
    setContent({
      ...content,
      galleryImages: (content.galleryImages || []).filter((img: GalleryImage) => img.id !== id),
    });
  };

  /** Converts imgur page URLs to direct image URLs.
   *  https://imgur.com/ZkoAVs0  →  https://i.imgur.com/ZkoAVs0.jpg
   *  Already-direct i.imgur.com URLs are left unchanged. */
  const normalizeImageUrl = (url: string): string => {
    if (!url) return url;
    const m = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([A-Za-z0-9]+)(?:\.[a-zA-Z]{3,4})?$/);
    if (m) return `https://i.imgur.com/${m[1]}.jpg`;
    return url;
  };

  const handleImageUpload = async (file: File, fieldName: string, galleryId?: string) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    setUploading(fieldName);
    const formData = new FormData();
    formData.append('file', file);

    const setUploadedUrl = (url: string) => {
      if (galleryId) {
        if (fieldName.startsWith('experience')) {
          updateExperienceImage(galleryId, { src: url });
        } else {
          updateGalleryItem(galleryId, { src: url });
        }
      } else {
        setContent((prev: any) => ({ ...prev, [fieldName]: url }));
      }
    };

    const toDataUrl = (imageFile: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('No se pudo leer la imagen localmente'));
        reader.readAsDataURL(imageFile);
      });

    try {
      const response = await authenticatedFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          const localDataUrl = await toDataUrl(file);
          setUploadedUrl(localDataUrl);
          alert('El endpoint /api/upload no está disponible. Se guardó la imagen de forma local (base64) en tu contenido.');
          return;
        }
        const errorBody = await response.text();
        throw new Error(`Upload failed (${response.status}): ${errorBody || response.statusText}`);
      }
      const { url } = await response.json();

      setUploadedUrl(url);
    } catch (err) {
      console.error('Upload error:', err);
      const message = err instanceof Error ? err.message : 'Error al subir la imagen';
      alert(message);
    } finally {
      setUploading(null);
    }
  };

  const updateExperienceImage = (id: string, patch: Partial<GalleryImage>) => {
    setContent({
      ...content,
      experienceImages: (content.experienceImages || []).map((img: GalleryImage) =>
        img.id === id ? { ...img, ...patch } : img,
      ),
    });
  };

  const removeExperienceImage = (id: string) => {
    setContent({
      ...content,
      experienceImages: (content.experienceImages || []).filter((img: GalleryImage) => img.id !== id),
    });
  };

  const addExperienceImage = () => {
    const list = (content.experienceImages || []) as GalleryImage[];
    if (list.length >= Number(settings.maxGalleryItems || 12)) {
      alert("Llegaste al máximo de imágenes configurado.");
      return;
    }
    setContent({
      ...content,
      experienceImages: [...list, { id: `e-${Date.now()}`, src: "", alt: "Nueva experiencia" }],
    });
  };

  const normalizeVideoUrl = (url: string): string => {
    if (!url) return url;
    const safeUrl = url.trim();

    const ytWatch = safeUrl.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{6,})/i);
    if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;

    const ytShort = safeUrl.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{6,})/i);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;

    const ytEmbed = safeUrl.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/i);
    if (ytEmbed) return `https://www.youtube.com/embed/${ytEmbed[1]}`;

    const vimeo = safeUrl.match(/vimeo\.com\/(\d{6,})/i);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

    return safeUrl;
  };

  const addVideoItem = () => {
    const list = (content.videoLinks || []) as VideoItem[];
    setContent({
      ...content,
      videoLinks: [...list, { id: `v-${Date.now()}`, url: "", title: "" }],
    });
  };

  const updateVideoItem = (id: string, patch: Partial<VideoItem>) => {
    setContent({
      ...content,
      videoLinks: (content.videoLinks || []).map((item: VideoItem) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  };

  const removeVideoItem = (id: string) => {
    setContent({
      ...content,
      videoLinks: (content.videoLinks || []).filter((item: VideoItem) => item.id !== id),
    });
  };

  const reorderContentList = (listKey: ContentListKey, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    setContent((prev: typeof defaultContent) => {
      const items = [...((prev[listKey] || []) as Array<GalleryImage | VideoItem>)];
      const [movedItem] = items.splice(fromIndex, 1);
      if (!movedItem) return prev;
      items.splice(toIndex, 0, movedItem);
      return { ...prev, [listKey]: items };
    });
  };

  const moveContentItem = (listKey: ContentListKey, id: string, direction: -1 | 1) => {
    const items = (content[listKey] || []) as Array<GalleryImage | VideoItem>;
    const currentIndex = items.findIndex((item) => item.id === id);
    const nextIndex = currentIndex + direction;
    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= items.length) return;
    reorderContentList(listKey, currentIndex, nextIndex);
  };

  const handleDragStart = (listKey: ContentListKey, id: string) => {
    setDragState({ listKey, id });
  };

  const handleDrop = (listKey: ContentListKey, targetId: string) => {
    if (!dragState || dragState.listKey !== listKey || dragState.id === targetId) {
      setDragState(null);
      return;
    }

    const items = (content[listKey] || []) as Array<GalleryImage | VideoItem>;
    const fromIndex = items.findIndex((item) => item.id === dragState.id);
    const toIndex = items.findIndex((item) => item.id === targetId);
    reorderContentList(listKey, fromIndex, toIndex);
    setDragState(null);
  };

  const renderOrderControls = (listKey: ContentListKey, id: string, index: number, total: number) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => moveContentItem(listKey, id, -1)}
        disabled={index === 0}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Mover arriba"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        onClick={() => moveContentItem(listKey, id, 1)}
        disabled={index === total - 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Mover abajo"
      >
        <ArrowDown size={14} />
      </button>
      <div className="p-2 rounded-lg border border-dashed border-slate-300 text-slate-400 cursor-grab active:cursor-grabbing" aria-hidden="true">
        <GripVertical size={14} />
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando panel administrativo...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="glass p-12 rounded-[2rem] text-center max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-display font-black mb-8 uppercase tracking-tighter">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" className="w-full border rounded-lg px-4 py-3" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full border rounded-lg px-4 py-3" required />
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-black">Ingresar</button>
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="glass p-12 rounded-[2rem] text-center max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-display font-black mb-4 uppercase tracking-tighter">Acceso Denegado</h2>
          <p className="text-slate-500 mb-8">No tienes permisos de administrador.</p>
          <button onClick={logout} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-64 glass-dark text-white p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary p-2 rounded-xl"><Layout className="w-6 h-6" /></div>
          <span className="font-display font-black text-xl uppercase tracking-tighter">CMS Admin</span>
        </div>

        <nav className="flex flex-col gap-4">
          {[
            { id: "content", icon: <Layout size={20} />, label: "Contenido" },
            { id: "pricing", icon: <DollarSign size={20} />, label: "Precios" },
            { id: "bookings", icon: <Calendar size={20} />, label: "Reservas" },
            { id: "images", icon: <Image size={20} />, label: "Imagenes" },
            { id: "experience", icon: <Image size={20} />, label: "Experiencia" },
            { id: "reports", icon: <BarChart3 size={20} />, label: "Reportes" },
            { id: "settings", icon: <Settings size={20} />, label: "Ajustes" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex items-center gap-4 p-4 rounded-2xl ${activeTab === tab.id ? "bg-primary text-white" : "text-white/70 hover:bg-white/10"}`}>
              {tab.icon}
              <span className="font-black uppercase tracking-widest text-xs">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-4 p-4 rounded-2xl text-white/50 hover:bg-red-500/20 hover:text-red-400">
          <LogOut size={20} />
          <span className="font-black uppercase tracking-widest text-xs">Salir</span>
        </button>
      </div>

      <div className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter">
            {activeTab === "content" ? "Gestion de Contenido" : activeTab === "pricing" ? "Gestion de Precios" : activeTab === "bookings" ? "Reservas" : activeTab === "images" ? "Gestion de Imagenes" : activeTab === "experience" ? "Gestion de Experiencia" : activeTab === "reports" ? "Reportes" : "Ajustes"}
          </h1>
          {(activeTab === "content" || activeTab === "pricing" || activeTab === "bookings" || activeTab === "images" || activeTab === "experience" || activeTab === "settings") && (
            <button onClick={activeTab === "content" ? saveContent : activeTab === "pricing" ? savePricing : activeTab === "bookings" ? saveBookings : activeTab === "images" || activeTab === "experience" ? saveContent : saveSettings} disabled={saving} className="bg-primary text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2">
              <Save size={18} /> {saving ? "Guardando..." : "Guardar"}
            </button>
          )}
        </header>

        {activeTab === "content" && (
          <div className="space-y-4 bg-white p-6 rounded-xl border">
            <label className="block text-xs font-black uppercase tracking-wider">Titulo Hero</label>
            <input value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} className="w-full border rounded-lg px-4 py-3" />
            <label className="block text-xs font-black uppercase tracking-wider">Subtitulo Hero</label>
            <textarea value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} className="w-full border rounded-lg px-4 py-3" rows={3} />
            <label className="block text-xs font-black uppercase tracking-wider">Titulo About</label>
            <input value={content.aboutTitle || ""} onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })} className="w-full border rounded-lg px-4 py-3" />
            <label className="block text-xs font-black uppercase tracking-wider">Texto About</label>
            <textarea value={content.aboutText || ""} onChange={(e) => setContent({ ...content, aboutText: e.target.value })} className="w-full border rounded-lg px-4 py-3" rows={4} />
            <label className="block text-xs font-black uppercase tracking-wider">Email Contacto</label>
            <input value={content.contactEmail || ""} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} className="w-full border rounded-lg px-4 py-3" />
            <label className="block text-xs font-black uppercase tracking-wider">WhatsApp Contacto</label>
            <input value={content.contactWhatsApp || ""} onChange={(e) => setContent({ ...content, contactWhatsApp: e.target.value })} className="w-full border rounded-lg px-4 py-3" />
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-4">
            {pricing.map((item, index) => (
              <div key={item.id ?? index} className="bg-white p-4 rounded-xl border">
                <div className="flex justify-end">
                  <button onClick={() => removePricingRow(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </div>
                <label className="block text-xs font-black uppercase tracking-wider">Nombre</label>
                <input value={item.name} onChange={(e) => {
                  const updated = [...pricing];
                  updated[index] = { ...updated[index], name: e.target.value };
                  setPricing(updated);
                }} className="w-full border rounded-lg px-4 py-2" />
                <label className="block text-xs font-black uppercase tracking-wider mt-2">Precio</label>
                <input type="number" value={item.price} onChange={(e) => {
                  const updated = [...pricing];
                  updated[index] = { ...updated[index], price: Number(e.target.value) };
                  setPricing(updated);
                }} className="w-full border rounded-lg px-4 py-2" />
                <label className="block text-xs font-black uppercase tracking-wider mt-2">Descripcion</label>
                <input value={item.description} onChange={(e) => {
                  const updated = [...pricing];
                  updated[index] = { ...updated[index], description: e.target.value };
                  setPricing(updated);
                }} className="w-full border rounded-lg px-4 py-2" />
              </div>
            ))}
            <button onClick={addPricingRow} className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"><Plus size={16} /> Agregar plan</button>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.map((booking, idx) => (
              <div key={booking.id || idx} className="bg-white p-4 rounded-xl border space-y-2">
                <p><strong>{booking.activity}</strong> ({booking.plan})</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <input value={booking.date || ""} onChange={(e) => {
                    const updated = [...bookings];
                    updated[idx] = { ...updated[idx], date: e.target.value };
                    setBookings(updated);
                  }} className="border rounded-lg px-3 py-2" />
                  <input value={booking.time || ""} onChange={(e) => {
                    const updated = [...bookings];
                    updated[idx] = { ...updated[idx], time: e.target.value };
                    setBookings(updated);
                  }} className="border rounded-lg px-3 py-2" />
                </div>
                <p>Personas: {booking.numPeople} - S/ {booking.totalPrice}</p>
                <p>Contacto: {booking.whatsapp}</p>
                <select value={booking.status || "pendiente"} onChange={(e) => {
                  const updated = [...bookings];
                  updated[idx] = { ...updated[idx], status: e.target.value as Booking["status"] };
                  setBookings(updated);
                }} className="border rounded-lg px-3 py-2">
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <textarea value={booking.notes || ""} onChange={(e) => {
                  const updated = [...bookings];
                  updated[idx] = { ...updated[idx], notes: e.target.value };
                  setBookings(updated);
                }} placeholder="Notas internas" className="w-full border rounded-lg px-3 py-2" rows={2} />
                <button onClick={() => setBookings((prev) => prev.filter((b) => b.id !== booking.id))} className="text-red-500 hover:text-red-700 inline-flex items-center gap-2">
                  <Trash2 size={14} /> Eliminar reserva
                </button>
              </div>
            ))}
            {bookings.length === 0 && <p>No hay reservas registradas.</p>}
          </div>
        )}

        {activeTab === "images" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border space-y-4">
              <h2 className="text-xl font-black uppercase tracking-wider">Imagen de Hero</h2>
              {content.heroImageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <img src={content.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="block text-xs font-black uppercase tracking-wider">URL o Subir Archivo</label>
              <div className="flex gap-3">
                <input 
                  value={content.heroImageUrl || ""} 
                  onChange={(e) => setContent({ ...content, heroImageUrl: e.target.value })} 
                  onBlur={(e) => setContent((prev: any) => ({ ...prev, heroImageUrl: normalizeImageUrl(e.target.value) }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1 border rounded-lg px-4 py-3" 
                />
                <label className="cursor-pointer bg-slate-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition">
                  {uploading === 'heroImageUrl' ? 'Subiendo...' : 'Subir'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'heroImageUrl')}
                    disabled={uploading !== null}
                  />
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border space-y-4">
              <h2 className="text-xl font-black uppercase tracking-wider">Imagen de About</h2>
              {content.aboutImageUrl && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <img src={content.aboutImageUrl} alt="About" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="block text-xs font-black uppercase tracking-wider">URL o Subir Archivo</label>
              <div className="flex gap-3">
                <input 
                  value={content.aboutImageUrl || ""} 
                  onChange={(e) => setContent({ ...content, aboutImageUrl: e.target.value })} 
                  onBlur={(e) => setContent((prev: any) => ({ ...prev, aboutImageUrl: normalizeImageUrl(e.target.value) }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1 border rounded-lg px-4 py-3" 
                />
                <label className="cursor-pointer bg-slate-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-800 transition">
                  {uploading === 'aboutImageUrl' ? 'Subiendo...' : 'Subir'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'aboutImageUrl')}
                    disabled={uploading !== null}
                  />
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-wider">Galería</h2>
                <button onClick={addGalleryItem} className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"><Plus size={16} /> Agregar</button>
              </div>
              {(content.galleryImages || []).map((img: GalleryImage, index: number, list: GalleryImage[]) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart("galleryImages", img.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("galleryImages", img.id)}
                  onDragEnd={() => setDragState(null)}
                  className={`border rounded-lg p-4 space-y-2 ${dragState?.listKey === "galleryImages" && dragState.id === img.id ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">Posición {index + 1}</p>
                    {renderOrderControls("galleryImages", img.id, index, list.length)}
                  </div>
                  {img.src && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border mb-3">
                      <img src={img.src} alt={img.alt || 'Gallery'} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="block text-xs font-black uppercase tracking-wider">URL o Subir Archivo</label>
                  <div className="flex gap-3">
                    <input 
                      value={img.src} 
                      onChange={(e) => updateGalleryItem(img.id, { src: e.target.value })} 
                      onBlur={(e) => updateGalleryItem(img.id, { src: normalizeImageUrl(e.target.value) })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="flex-1 border rounded-lg px-3 py-2" 
                    />
                    <label className="cursor-pointer bg-slate-900 text-white px-3 py-2 rounded-lg font-medium hover:bg-slate-800 transition text-sm">
                      {uploading === img.id ? 'Subiendo...' : 'Subir'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'galleryImage', img.id)}
                        disabled={uploading !== null}
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-black uppercase tracking-wider">Descripción (ALT)</label>
                  <input 
                    value={img.alt} 
                    onChange={(e) => updateGalleryItem(img.id, { alt: e.target.value })} 
                    placeholder="Descripción de la imagen"
                    className="w-full border rounded-lg px-3 py-2" 
                  />
                  <button onClick={() => removeGalleryItem(img.id)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-2"><Trash2 size={14} /> Eliminar</button>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-wider">Videos (Galería Multimedia)</h2>
                <button onClick={addVideoItem} className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"><Plus size={16} /> Agregar Video</button>
              </div>

              {(content.videoLinks || []).map((video: VideoItem, index: number, list: VideoItem[]) => (
                <div
                  key={video.id}
                  draggable
                  onDragStart={() => handleDragStart("videoLinks", video.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("videoLinks", video.id)}
                  onDragEnd={() => setDragState(null)}
                  className={`border rounded-lg p-4 space-y-2 ${dragState?.listKey === "videoLinks" && dragState.id === video.id ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">Posición {index + 1}</p>
                    {renderOrderControls("videoLinks", video.id, index, list.length)}
                  </div>
                  <label className="block text-xs font-black uppercase tracking-wider">Título (opcional)</label>
                  <input
                    value={video.title || ''}
                    onChange={(e) => updateVideoItem(video.id, { title: e.target.value })}
                    placeholder="Nombre del video"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  <label className="block text-xs font-black uppercase tracking-wider">URL del video (YouTube/Vimeo/embed)</label>
                  <input
                    value={video.url}
                    onChange={(e) => updateVideoItem(video.id, { url: e.target.value })}
                    onBlur={(e) => updateVideoItem(video.id, { url: normalizeVideoUrl(e.target.value) })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  {video.url && (
                    <div className="rounded-lg overflow-hidden border bg-slate-100 aspect-video">
                      <iframe
                        src={video.url}
                        title={video.title || 'Preview video'}
                        className="w-full h-full"
                        loading="lazy"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <button onClick={() => removeVideoItem(video.id)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-2"><Trash2 size={14} /> Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider">Galería de Experiencia</h2>
                  <p className="text-sm text-slate-600">Administra imágenes dinámicas para experiencia (N+1)</p>
                </div>
                <button onClick={addExperienceImage} className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"><Plus size={16} /> Agregar</button>
              </div>
              {(content.experienceImages || []).map((img: GalleryImage, idx: number, list: GalleryImage[]) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart("experienceImages", img.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop("experienceImages", img.id)}
                  onDragEnd={() => setDragState(null)}
                  className={`border rounded-lg p-4 space-y-2 ${dragState?.listKey === "experienceImages" && dragState.id === img.id ? "opacity-60" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black text-sm uppercase">{idx + 1}. {img.alt}</h3>
                    {renderOrderControls("experienceImages", img.id, idx, list.length)}
                  </div>
                  {img.src && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                      <img src={img.src} alt={img.alt || 'Experience'} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="block text-xs font-black uppercase tracking-wider">URL o Subir Archivo</label>
                  <div className="flex gap-3">
                    <input 
                      value={img.src} 
                      onChange={(e) => updateExperienceImage(img.id, { src: e.target.value })} 
                      onBlur={(e) => updateExperienceImage(img.id, { src: normalizeImageUrl(e.target.value) })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="flex-1 border rounded-lg px-3 py-2" 
                    />
                    <label className="cursor-pointer bg-slate-900 text-white px-3 py-2 rounded-lg font-medium hover:bg-slate-800 transition text-sm">
                      {uploading === `experience-${img.id}` ? 'Subiendo...' : 'Subir'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], `experience-${img.id}`, img.id)}
                        disabled={uploading !== null}
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-black uppercase tracking-wider">Descripción (ALT)</label>
                  <input 
                    value={img.alt} 
                    onChange={(e) => updateExperienceImage(img.id, { alt: e.target.value })} 
                    placeholder="Descripción de la imagen"
                    className="w-full border rounded-lg px-3 py-2" 
                  />
                  <button onClick={() => removeExperienceImage(img.id)} className="text-red-500 hover:text-red-700 inline-flex items-center gap-2"><Trash2 size={14} /> Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border"><p className="text-xs uppercase font-black">Reservas</p><p className="text-3xl font-black">{reports.totalBookings}</p></div>
            <div className="bg-white p-5 rounded-xl border"><p className="text-xs uppercase font-black">Confirmadas</p><p className="text-3xl font-black">{reports.confirmed}</p></div>
            <div className="bg-white p-5 rounded-xl border"><p className="text-xs uppercase font-black">Completadas</p><p className="text-3xl font-black">{reports.completed}</p></div>
            <div className="bg-white p-5 rounded-xl border"><p className="text-xs uppercase font-black">Canceladas</p><p className="text-3xl font-black">{reports.canceled}</p></div>
            <div className="bg-white p-5 rounded-xl border"><p className="text-xs uppercase font-black">Ingresos</p><p className="text-3xl font-black">S/ {reports.revenue}</p></div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-xl border space-y-4">
            <label className="block text-xs font-black uppercase tracking-wider">Nombre del sitio</label>
            <input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full border rounded-lg px-4 py-3" />
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.reservationsEnabled} onChange={(e) => setSettings({ ...settings, reservationsEnabled: e.target.checked })} />
              <span className="text-sm font-medium">Permitir nuevas reservas</span>
            </label>
            <label className="block text-xs font-black uppercase tracking-wider">Maximo de imagenes en galeria</label>
            <input type="number" min={1} max={50} value={settings.maxGalleryItems} onChange={(e) => setSettings({ ...settings, maxGalleryItems: Number(e.target.value) || 12 })} className="w-full border rounded-lg px-4 py-3" />
          </div>
        )}
      </div>
    </div>
  );
};
