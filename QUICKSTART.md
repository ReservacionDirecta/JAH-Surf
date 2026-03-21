# 🚀 Quick Start Guide - JAH SURF Peru

## ⚡ 30 Segundos Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env.local
cat > .env.local << 'EOF'
JWT_SECRET=mi-clave-super-segura-1234567890abcdefghij
ADMIN_EMAIL=admin@jahsurfperu.com
VITE_API_URL=http://localhost:3000
NODE_ENV=development
EOF

# 3. Iniciar servidor
npm run dev

# 4. Abrir en navegador
# http://localhost:5173
```

## 📝 Primeros Pasos (Después del Setup)

### 1. Crear cuenta admin
1. Click "Admin" en navegación
2. Click "Registrarse"
3. Email: `admin@jahsurfperu.com` (tu ADMIN_EMAIL)
4. Password: cualquiera (min 6 caracteres)
5. ¡Listo! Tendrás rol admin automáticamente

### 2. Explorar panel admin
- Ver página "Admin Panel"
- Editar contenido (hero, about, contact)
- Ver precios y reservas

### 3. Probar autenticación
```bash
# Terminal 1: Servidor
npm run dev

# Terminal 2: API testing
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jahsurfperu.com","password":"tupass"}'

# Respuesta:
# {"token":"jwt-token-aqui","user":{"id":"uuid","email":"...","role":"admin"}}
```

## 📁 Estructura Importante

```
src/
├── auth.ts              ← Funciones de auth
├── AuthProvider.tsx     ← Context para auth
├── components/
│   └── AdminPanel.tsx   ← Panel admin (actualizar)
└── App.tsx              ← Rutas principales

server.ts               ← Backend con JWT routes
.env.local              ← Variables secretas (NO COMMITEAR)
```

## 🔑 Variables de Entorno

```env
# REQUERIDAS para producción:
JWT_SECRET              # Mínimo 32 caracteres aleatorios
ADMIN_EMAIL             # Email del primer admin
NODE_ENV                # development o production

# OPCIONALES:
VITE_API_URL            # URL de la API (default: localhost:3000)
STORE_PATH              # Ruta de almacenamiento (default: /store)
```

## 🧪 Testear Autenticación

### 1. Login desde Frontend
```typescript
import { login } from './src/auth';

const response = await login('admin@jahsurfperu.com', 'password');
// response.token
// response.user { id, email, role }
```

### 2. Proteger ruta en Backend
```typescript
// En server.ts
app.post('/api/admin/data', (req, res) => {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Lógica protegida aquí
});
```

### 3. Usar en Componente React
```typescript
import { useAuth } from './AuthProvider';

export const ProtectedComponent = () => {
  const { user, isAdmin, isLoading } = useAuth();
  
  if (isLoading) return <div>Cargando...</div>;
  if (!isAdmin) return <div>No autorizado</div>;
  
  return <div>Contenido admin: {user?.email}</div>;
};
```

## 🔄 Flujo Típico de Desarrollo

### Agregar Ruta Protegida

**Paso 1: Backend (server.ts)**
```typescript
app.post('/api/admin/update-content', (req, res) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  
  // Tu lógica
  const data = req.body;
  fs.writeFileSync('/store/content.json', JSON.stringify(data));
  res.json({ success: true });
});
```

**Paso 2: Frontend (hook o componente)**
```typescript
const updateContent = async (data: any) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch('/api/admin/update-content', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
};
```

## 📊 Datos Almacenados

Todos en `/store/`:

**users.json**
```json
[
  {
    "id": "uuid",
    "email": "admin@jahsurfperu.com",
    "password": "sha256-hash",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**content.json, pricing.json, bookings.json**
```json
// Tu estructura personalizada aquí
```

## ⚠️ Importante

- ❌ NUNCA commitear `.env.local`
- ❌ NUNCA exponer JWT_SECRET
- ✅ SIEMPRE hashear contraseñas en backend
- ✅ SIEMPRE verificar JWT en rutas protegidas
- ✅ SIEMPRE validar roles de usuario

## 🚀 Deploy a Railway

1. Crear proyecto en Railway
2. Conectar repo Git
3. Agregar variables:
   ```
   JWT_SECRET = <random-32-chars>
   ADMIN_EMAIL = admin@example.com
   NODE_ENV = production
   ```
4. Crear volumen `/store` (persistente)
5. Deploy automático en cada push

## 📞 Comandos Útiles

```bash
# Verificar tipos
npm run lint

# Build para producción
npm run build

# Preview del build
npm run preview

# Limpiar dist
npm run clean

# Desarrollo con HMR
npm run dev
```

## 🐛 Debug

**Ver logs del servidor:**
```bash
NODE_DEBUG=* npm run dev  # Muestra todo
```

**Ver datos almacenados:**
```bash
cat /store/users.json
cat /store/content.json
```

**Resetear usuario admin:**
```bash
rm /store/users.json
# Crear nuevo usuario admin al registrarse
```

## ✅ Checklist Primer Deploy

- [ ] Variables de entorno configuradas en Railway
- [ ] Volumen `/store` creado
- [ ] Build pasa sin errores
- [ ] Puedo hacer login
- [ ] Panel admin funciona
- [ ] Datos persisten después de restart

## 📚 Leer Después

1. **AGENT.md** - Estándares de código
2. **SKILLS.md** - Stack tecnológico
3. **MIGRATION_FIREBASE_TO_LOCAL_AUTH.md** - Detalles técnicos
4. **IMPLEMENTATION_SUMMARY.md** - Estado del proyecto

---

**¿Preguntas?** Revisa los documentos .md en el root del proyecto.
