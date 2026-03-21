import React, { useState, useEffect } from "react";
import { useFirebase } from "../FirebaseProvider";
import { auth, db, googleProvider, handleFirestoreError, OperationType, signInWithEmailAndPassword, signInWithPopup, signOut } from "../firebase";
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { LogIn, LogOut, Save, Layout, DollarSign, Calendar, Mail, Lock } from "lucide-react";
import { motion } from "motion/react";

export const AdminPanel = () => {
  const { user, loading, isAdmin } = useFirebase();
  const [activeTab, setActiveTab] = useState<"content" | "pricing" | "bookings">("content");
  const [content, setContent] = useState<any>({
    heroTitle: "JAH SURF",
    heroSubtitle: "Donde el mar se encuentra con tu espíritu.",
    aboutTitle: "Más que una escuela, una filosofía",
    aboutText: "En JAH SURF Peru, el surf es el puente para reconectar con tu ser interior.",
    contactEmail: "hola@jahsurfperu.com",
    contactWhatsApp: "+51 904 060 670"
  });
  const [pricing, setPricing] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      // Fetch content
      const fetchContent = async () => {
        const contentDoc = await getDoc(doc(db, "content", "main"));
        if (contentDoc.exists()) {
          setContent(contentDoc.data());
        }
      };
      fetchContent();

      // Fetch pricing
      const unsubscribePricing = onSnapshot(collection(db, "pricing"), (snapshot) => {
        const pricingData = snapshot.docs.map(doc => doc.data());
        setPricing(pricingData);
      });

      // Fetch bookings
      const q = query(collection(db, "bookings"), orderBy("timestamp", "desc"));
      const unsubscribeBookings = onSnapshot(q, (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
      });

      return () => {
        unsubscribePricing();
        unsubscribeBookings();
      };
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("El usuario cerró la ventana de inicio de sesión.");
      } else if (error.code === 'auth/popup-blocked') {
        alert("El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes o abre la aplicación en una nueva pestaña.");
      } else {
        console.error("Login failed:", error);
        alert("Error al iniciar sesión con Google. Intenta con el formulario de correo o abre la app en una nueva pestaña.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Email login failed:", error);
      let message = "Error al iniciar sesión.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Credenciales incorrectas.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Correo electrónico inválido.";
      }
      alert(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "content", "main"), content);
      alert("Contenido guardado con éxito");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "content/main");
    } finally {
      setSaving(false);
    }
  };

  const savePricingCategory = async (category: any) => {
    try {
      await setDoc(doc(db, "pricing", category.id), category);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `pricing/${category.id}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="glass p-12 rounded-[2rem] text-center max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-display font-black mb-8 uppercase tracking-tighter">Admin Login</h2>
          
          {!showEmailLogin ? (
            <div className="space-y-4">
              <button 
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn size={20} />
                )}
                {loginLoading ? "CONECTANDO..." : "INGRESAR CON GOOGLE"}
              </button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-400">
                  <span className="bg-slate-50 px-4">o</span>
                </div>
              </div>

              <button 
                onClick={() => setShowEmailLogin(true)}
                className="w-full bg-white border-2 border-slate-200 text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
              >
                <Mail size={20} />
                INGRESAR CON CORREO
              </button>
              
              <p className="text-[10px] text-slate-400 mt-6 font-medium leading-relaxed">
                Si el botón de Google no responde, asegúrate de haber permitido las ventanas emergentes o intenta ingresar con tu correo y contraseña.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:border-primary outline-none transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn size={20} />
                )}
                {loginLoading ? "VERIFICANDO..." : "INICIAR SESIÓN"}
              </button>

              <button 
                type="button"
                onClick={() => setShowEmailLogin(false)}
                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
              >
                Volver a Google
              </button>
            </form>
          )}
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
          <button 
            onClick={handleLogout}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all"
          >
            <LogOut size={20} />
            CERRAR SESIÓN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 glass-dark text-white p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary p-2 rounded-xl">
            <Layout className="w-6 h-6" />
          </div>
          <span className="font-display font-black text-xl uppercase tracking-tighter">CMS Admin</span>
        </div>

        <nav className="flex flex-col gap-4">
          {[
            { id: "content", icon: <Layout size={20} />, label: "Contenido" },
            { id: "pricing", icon: <DollarSign size={20} />, label: "Precios" },
            { id: "bookings", icon: <Calendar size={20} />, label: "Reservas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-primary text-white' : 'text-white/50 hover:bg-white/10'}`}
            >
              {tab.icon}
              <span className="font-black uppercase tracking-widest text-xs">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 p-4 rounded-2xl text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          <span className="font-black uppercase tracking-widest text-xs">Salir</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter">
            {activeTab === "content" ? "Gestión de Contenido" : activeTab === "pricing" ? "Gestión de Precios" : "Reservas Recibidas"}
          </h1>
          {activeTab === "content" && (
            <button 
              onClick={saveContent}
              disabled={saving}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            </button>
          )}
        </header>

        {activeTab === "content" && (
          <div className="grid gap-8">
            <div className="glass p-8 rounded-[2rem] space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight border-b pb-4">Hero Section</h3>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título Principal</label>
                  <input 
                    type="text" 
                    value={content.heroTitle} 
                    onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Subtítulo</label>
                  <textarea 
                    value={content.heroSubtitle} 
                    onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 h-24"
                  />
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2rem] space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight border-b pb-4">About Section</h3>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título</label>
                  <input 
                    type="text" 
                    value={content.aboutTitle} 
                    onChange={(e) => setContent({...content, aboutTitle: e.target.value})}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Texto Principal</label>
                  <textarea 
                    value={content.aboutText} 
                    onChange={(e) => setContent({...content, aboutText: e.target.value})}
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 h-40"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="grid gap-8">
            {pricing.map((cat, catIdx) => (
              <div key={cat.id} className="glass p-8 rounded-[2rem] space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">{cat.title}</h3>
                  <button 
                    onClick={() => savePricingCategory(cat)}
                    className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
                  >
                    Guardar Categoría
                  </button>
                </div>
                <div className="grid gap-6">
                  {cat.packages.map((pkg: any, pkgIdx: number) => (
                    <div key={pkgIdx} className="grid md:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                      <input 
                        type="text" 
                        value={pkg.name} 
                        onChange={(e) => {
                          const newPricing = [...pricing];
                          newPricing[catIdx].packages[pkgIdx].name = e.target.value;
                          setPricing(newPricing);
                        }}
                        className="bg-slate-50 rounded-xl px-4 py-2 text-sm font-bold"
                        placeholder="Nombre"
                      />
                      <input 
                        type="text" 
                        value={pkg.desc} 
                        onChange={(e) => {
                          const newPricing = [...pricing];
                          newPricing[catIdx].packages[pkgIdx].desc = e.target.value;
                          setPricing(newPricing);
                        }}
                        className="bg-slate-50 rounded-xl px-4 py-2 text-sm"
                        placeholder="Descripción"
                      />
                      <input 
                        type="text" 
                        value={pkg.price} 
                        onChange={(e) => {
                          const newPricing = [...pricing];
                          newPricing[catIdx].packages[pkgIdx].price = e.target.value;
                          setPricing(newPricing);
                        }}
                        className="bg-slate-50 rounded-xl px-4 py-2 text-sm font-black"
                        placeholder="Precio"
                      />
                      <input 
                        type="text" 
                        value={pkg.perClass} 
                        onChange={(e) => {
                          const newPricing = [...pricing];
                          newPricing[catIdx].packages[pkgIdx].perClass = e.target.value;
                          setPricing(newPricing);
                        }}
                        className="bg-slate-50 rounded-xl px-4 py-2 text-sm"
                        placeholder="Por clase"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="glass rounded-[2rem] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-6 text-xs font-black uppercase tracking-widest">Fecha/Hora</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest">Cliente</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest">WhatsApp</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest">Actividad</th>
                  <th className="p-6 text-xs font-black uppercase tracking-widest">Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-6">
                      <div className="font-bold">{booking.date}</div>
                      <div className="text-xs text-slate-400">{booking.time}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold">{booking.name}</div>
                      <div className="text-xs text-slate-400">{new Date(booking.timestamp).toLocaleString()}</div>
                    </td>
                    <td className="p-6 font-medium text-primary">{booking.whatsapp}</td>
                    <td className="p-6">
                      <div className="font-bold uppercase text-xs">{booking.activity}</div>
                      <div className="text-xs text-slate-500">{booking.plan} ({booking.numPeople} pers.)</div>
                    </td>
                    <td className="p-6 font-black text-slate-900">S/ {booking.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-medium">No hay reservas registradas aún.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
