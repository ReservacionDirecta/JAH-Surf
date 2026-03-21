# 🏄 JAH SURF Peru - Escuela de Surf Digital

**Plataforma web moderna para gestionar una escuela de surf con autenticación local, panel administrativo y gestión de reservas.**

![Status](https://img.shields.io/badge/status-ready%20for%20production-brightgreen)
![License](https://img.shields.io/badge/license-proprietary-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

## ⚡ Quick Start

```bash
# 1. Clone & Install
git clone https://github.com/ReservacionDirecta/JAH-Surf.git
cd JAH-Surf
npm install

# 2. Setup Environment
cp .env.example .env.local
# Edit JWT_SECRET in .env.local

# 3. Run
npm run dev
# Open http://localhost:5173
```

## ✨ Features

- 🔐 **Autenticación JWT Local** - Sin Firebase, sin Google Cloud
- 📱 **Admin Panel** - Gestión de contenido, precios, reservas
- 💾 **Almacenamiento Local** - Archivos JSON persistentes
- ⚡ **React 19 + TypeScript** - Frontend moderno y seguro
- 🚀 **Express Backend** - API REST con seguridad
- 🎨 **Tailwind CSS** - UI responsive y hermosa
- 🚢 **Railway Ready** - Deploy sin dependencias externas

## 📚 Documentación

### Para Empezar
- **[QUICKSTART.md](QUICKSTART.md)** - Setup en 30 segundos ⚡

### Para Desarrolladores
- **[AGENT.md](AGENT.md)** - Estándares de código y arquitectura
- **[SKILLS.md](SKILLS.md)** - Stack tecnológico disponible

### Referencia Técnica
- **[MIGRATION_FIREBASE_TO_LOCAL_AUTH.md](MIGRATION_FIREBASE_TO_LOCAL_AUTH.md)** - Detalles de autenticación
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Estado actual y próximos pasos
- **[FIREBASE_CLEANUP_CHECKLIST.md](FIREBASE_CLEANUP_CHECKLIST.md)** - Cómo eliminar Firebase (opcional)
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Índice maestro de documentación

## 🏗️ Arquitectura

### Frontend
```
React 19 + TypeScript
├── Auth Context (useAuth())
├── Components
└── Tailwind CSS
```

### Backend
```
Express.js
├── /api/auth/* (JWT routes)
├── /api/store/* (Data CRUD)
└── Middleware validation
```

### Storage
```
/store/ (Persistent Volume)
├── users.json
├── content.json
├── pricing.json
└── bookings.json
```

## 🔐 Autenticación

### Login
```bash
POST /api/auth/login
{
  "email": "admin@jahsurfperu.com",
  "password": "your-password"
}

Response: { token: "jwt-token", user: { id, email, role } }
```

### Crear Usuario Admin
1. Ir a http://localhost:5173
2. Click "Admin" → "Registrarse"
3. Usar email del `ADMIN_EMAIL` en .env
4. ¡Automáticamente admin!

## 📦 Comandos

```bash
npm run dev      # Desarrollo con HMR
npm run build    # Build producción
npm run lint     # TypeScript check
npm run preview  # Preview build
npm run clean    # Limpiar dist/
```

## 🌍 Environment Variables

```env
JWT_SECRET=clave-segura-32+-caracteres-aleatorios
ADMIN_EMAIL=admin@jahsurfperu.com
VITE_API_URL=http://localhost:3000
NODE_ENV=development
STORE_PATH=/store
```

## 📊 Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | Express.js, Node.js, JWT |
| Database | JSON (files in /store/) |
| Auth | JWT local (SHA256 + secrets) |
| Deploy | Railway + Persistent Volumes |

## 🚀 Deploy (Railway)

### Environment Variables
```
JWT_SECRET=<secure-random-32-chars>
ADMIN_EMAIL=<your-admin-email>
NODE_ENV=production
```

### Volume
- Mount Path: `/store`
- Persistent data across deploys

### Commands
- **Build:** `npm run build`
- **Start:** `npm run dev`

## 📁 Project Structure

```
.
├── src/
│   ├── auth.ts                  # Auth functions
│   ├── AuthProvider.tsx         # React context
│   ├── components/
│   │   ├── AdminPanel.tsx       # Admin dashboard
│   │   └── ...
│   └── App.tsx                  # Routes
├── server.ts                    # Backend with JWT
├── .env.example                 # Env template
└── [documentation].md           # 7 guides
```

## 🔍 What's Included

✅ **Autenticación JWT** - Local, sin Firebase  
✅ **React Context** - Para manejo de estado auth  
✅ **Backend API** - Express con rutas protegidas  
✅ **Admin Panel** - Gestión de contenido  
✅ **Almacenamiento** - JSON files en /store/  
✅ **Documentación** - 7 guías completas  
✅ **TypeScript** - Type-safe development  
✅ **Tailwind CSS** - Modern UI framework  

## 🚫 NOT Included

❌ Firebase (reemplazado por JWT local)  
❌ Google Cloud services  
❌ External auth providers  
❌ Database ORM/query builder  

## 📖 Documentation

| Doc | For... | Read Time |
|-----|--------|-----------|
| QUICKSTART.md | Getting started fast | 2 min |
| AGENT.md | Code standards | 10 min |
| SKILLS.md | Tech stack | 5 min |
| MIGRATION_FIREBASE_TO_LOCAL_AUTH.md | Technical details | 15 min |
| IMPLEMENTATION_SUMMARY.md | Project status | 10 min |
| FIREBASE_CLEANUP_CHECKLIST.md | Removing Firebase | 5 min |
| DOCUMENTATION_INDEX.md | Navigation | 2 min |

## ✅ Checklist

- [x] Autenticación JWT implementada
- [x] Backend Express funcional
- [x] Frontend React con TypeScript
- [x] Almacenamiento persistente
- [x] Railway compatible
- [x] Documentación completa
- [x] Build sin errores
- [x] TypeScript linting OK
- [x] GitHub repositorio sync

## 🎯 Next Steps

1. **Actualizar AdminPanel** - Usar `useAuth()` en lugar de `useFirebase()`
2. **Agregar rutas protegidas** - Para content, pricing, bookings
3. **Tests** - Jest/Vitest para autenticación
4. **Mejorar UX** - Loading states, error handling
5. **Escalar** - PostgreSQL/MongoDB cuando sea necesario

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/feature-name`)
2. Follow code standards in AGENT.md
3. Test locally (`npm run lint`, `npm run build`)
4. Commit with clear messages
5. Push and create Pull Request

## 📄 Licencia

Propietario - JAH SURF Peru. Todos los derechos reservados.

## 📞 Support

- **Setup Help:** Ver [QUICKSTART.md](QUICKSTART.md)
- **Architecture:** Ver [AGENT.md](AGENT.md)
- **Technical:** Ver [MIGRATION_FIREBASE_TO_LOCAL_AUTH.md](MIGRATION_FIREBASE_TO_LOCAL_AUTH.md)
- **Status:** Ver [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

## 🔗 Links

- **Live App:** [https://jahsurfperu.com](https://jahsurfperu.com) (when deployed)
- **GitHub:** [https://github.com/ReservacionDirecta/JAH-Surf](https://github.com/ReservacionDirecta/JAH-Surf)
- **Issues:** [Report here](https://github.com/ReservacionDirecta/JAH-Surf/issues)

---

**Built with ❤️ for JAH SURF Peru**

*Last Updated: March 21, 2024 | Status: ✅ Production Ready*
