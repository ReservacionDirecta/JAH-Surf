# 🏄 JAH SURF Peru - Escuela de Surf Platform

Plataforma web moderna para gestionar una escuela de surf con **autenticación local, panel administrativo y gestión de reservas**.

## ✨ Características

- ✅ **Autenticación Local** - JWT-based sin Firebase
- ✅ **Panel Admin** - Gestión de contenido, precios, reservas
- ✅ **Almacenamiento Persistente** - JSON local o Railway volumes
- ✅ **React 19** - Frontend moderno con TypeScript
- ✅ **Express Backend** - API REST con seguridad
- ✅ **Tailwind CSS** - Estilos responsive
- ✅ **Railway Ready** - Despliegue sin dependencias externas

## 🚀 Quick Start (30 segundos)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar env
cp .env.example .env.local
# Editar: JWT_SECRET y ADMIN_EMAIL

# 3. Correr
npm run dev

# 4. Abrir navegador
# http://localhost:5173
```

## 📚 Documentación

| Documento | Para... |
|-----------|---------|
| **[QUICKSTART.md](QUICKSTART.md)** | Empezar rápido |
| **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** | Ver todas las guías |
| **[AGENT.md](AGENT.md)** | Estándares de código |
| **[SKILLS.md](SKILLS.md)** | Stack tecnológico |
| **[MIGRATION_FIREBASE_TO_LOCAL_AUTH.md](MIGRATION_FIREBASE_TO_LOCAL_AUTH.md)** | Detalles técnicos |

## 🔐 Autenticación

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jahsurfperu.com","password":"tupass"}'
```

### Crear Cuenta Admin (First Time)
1. Ir a http://localhost:5173
2. Click "Admin"
3. Registrarse con email de ADMIN_EMAIL
4. ¡Automáticamente admin!

## 📁 Estructura

```
.
├── src/
│   ├── auth.ts                    # Funciones de autenticación
│   ├── AuthProvider.tsx           # Context de React
│   ├── components/
│   │   ├── AdminPanel.tsx         # Panel administrativo
│   │   └── ...otros
│   └── App.tsx                    # Rutas principales
├── server.ts                      # Backend Express con JWT
├── .env.example                   # Variables de entorno
└── [documentación MD]             # 6 guías completas
```

## 💾 Almacenamiento

Datos en `/store/` (JSON):
- `users.json` - Usuarios y roles
- `content.json` - Contenido del sitio  
- `pricing.json` - Precios de clases
- `bookings.json` - Reservas

## 🚀 Deployment (Railway)

```
Env Variables:
- JWT_SECRET (seguro, min 32 caracteres)
- ADMIN_EMAIL (tu email)
- NODE_ENV=production

Volume:
- Mount: /store (datos persistentes)
```

## 📝 Comandos

```bash
npm run dev      # Desarrollo con HMR
npm run build    # Build producción
npm run lint     # TypeScript check
npm run preview  # Preview build
npm run clean    # Limpiar dist/
```

## 🔑 Variables de Entorno

```env
JWT_SECRET=clave-segura-32+-caracteres
ADMIN_EMAIL=admin@jahsurfperu.com
VITE_API_URL=http://localhost:3000
NODE_ENV=development
STORE_PATH=/store
```

## 📊 Stack

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Motion

**Backend:**
- Express.js
- JWT
- Node.js
- Almacenamiento JSON

## ✅ Checklist Deployment

- [ ] `.env.local` configurado
- [ ] `npm install` completado
- [ ] `npm run lint` sin errores
- [ ] `npm run build` exitoso
- [ ] `npm run dev` sin errores
- [ ] Login funciona
- [ ] Admin panel accesible

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| `JWT_SECRET not set` | Editar `.env.local` |
| `Port 3000 in use` | `lsof -i :3000; kill -9 PID` |
| `Build error` | `npm install; npm run clean; npm run build` |
| `Token invalid` | Re-login (tokens expiran en 7 días) |

## 🎯 Próximos Pasos

1. Revisar [AGENT.md](AGENT.md) para estándares
2. Actualizar AdminPanel.tsx
3. Agregar rutas protegidas
4. Tests con Jest/Vitest
5. Refresh tokens (mejora)

## 📄 Licencia

Propietario - JAH SURF Peru

---

**👉 Empezar:** Ver [QUICKSTART.md](QUICKSTART.md)  
**📖 Documentación:** Ver [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)  
**🔧 Dev:** Ver [AGENT.md](AGENT.md)
