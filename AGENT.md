# Agent Instructions - JAH SURF Peru

Este documento define las instrucciones y contexto para que los agentes de IA (como GitHub Copilot) comprendan mejor la estructura y necesidades de este proyecto.

## Información del Proyecto

### Propósito
JAH SURF Peru es una plataforma web para una escuela de surf que permite:
- Mostrar contenido dinámico gestionado por administrador
- Gestionar reservas de clases
- Administración con autenticación local (sin Firebase)
- Despliegue seamless en Railway con almacenamiento persistente

### Stack Tecnológico

**Frontend:**
- React 19 con TypeScript
- Vite como build tool
- Tailwind CSS para estilos
- React Router para navegación
- Motion para animaciones

**Backend:**
- Express.js con TypeScript
- Autenticación JWT local
- Almacenamiento persistente en archivos JSON

**Infraestructura:**
- Railway para despliegue (sin dependencias de Firebase/Google)
- Variables de entorno (JWT_SECRET, ADMIN_EMAIL)
- Volumen persistente `/store` para datos

## Estructura del Proyecto

```
.
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx       # Panel de admin con autenticación local
│   │   ├── BookingForm.tsx      # Formulario de reservas
│   │   └── ...otros
│   ├── auth.ts                  # Lógica de autenticación JWT
│   ├── AuthProvider.tsx         # Context para autenticación
│   ├── App.tsx                  # Componente raíz y rutas
│   └── main.tsx
├── server.ts                    # Backend Express con rutas de auth y datos
├── vite.config.ts
├── tsconfig.json
├── .env.local                   # Variables de entorno (NO COMMITEAR)
├── package.json
└── README.md
```

## Autenticación Local (Reemplazo de Firebase)

### Flujo de Autenticación
```
1. Usuario ingresa email + contraseña
2. Servidor verifica contra users.json
3. Si es válido, genera JWT con expiración
4. Token se almacena en localStorage del cliente
5. Cada request incluye Authorization: Bearer token
6. Servidor valida token antes de operaciones
```

### Estructura de users.json
```json
{
  "users": [
    {
      "id": "unique-id",
      "email": "admin@jahsurfperu.com",
      "password": "hashed-password-bcrypt",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Variables de Entorno Requeridas
```env
# .env.local
JWT_SECRET=tu-clave-secreta-muy-larga-aqui
ADMIN_EMAIL=admin@jahsurfperu.com
```

### API de Autenticación

**POST /api/auth/login**
```json
Request:
{ "email": "admin@jahsurfperu.com", "password": "..." }

Response:
{ "token": "jwt-token", "user": { "id", "email", "role" } }
```

**POST /api/auth/register**
```json
Request:
{ "email": "user@example.com", "password": "..." }

Response:
{ "token": "jwt-token", "user": { "id", "email", "role" } }
```

**POST /api/auth/logout**
- Simplemente descarta el token en cliente (stateless)

## Estándares de Código

### TypeScript
- ✅ Usar tipos explícitos para funciones y variables
- ✅ Interfaces para tipos de usuario, autenticación, datos
- ✅ Evitar `any` - usar tipos específicos
- ✅ Ejecutar `npm run lint` antes de commits

**Ejemplo:**
```typescript
interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface LoginPayload {
  email: string;
  password: string;
}
```

### React & Autenticación
- ✅ Usar `AuthContext` para acceso global a usuario
- ✅ Componentes funcionales con hooks
- ✅ Verificar roles antes de renderizar componentes admin
- ✅ Manejo de loading states durante autenticación

**Ejemplo:**
```typescript
interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const { user, isAdmin, isLoading } = useAuth();

if (!isAdmin) return <div>Acceso denegado</div>;
```

### Tailwind CSS
- ✅ Usar clases Tailwind en lugar de CSS custom
- ✅ Mobile-first: `sm:`, `md:`, `lg:` responsive
- ✅ Componentes reutilizables con estilos consistentes
- ❌ Evitar estilos inline

### Express Backend
- ✅ Middleware de autenticación para rutas protegidas
- ✅ Validación de JWT en cada request
- ✅ Manejo de errores consistente
- ✅ Respuestas JSON estructuradas

**Ejemplo:**
```typescript
app.post('/api/admin/content', authenticateJWT, authorizeAdmin, (req, res) => {
  // Solo admins autenticados llegan aquí
});
```

## Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | PascalCase | `AdminPanel.tsx` |
| Variables/Funciones | camelCase | `handleLogin`, `fetchUsers` |
| Constantes | UPPER_SNAKE_CASE | `JWT_EXPIRY = 3600` |
| Tipos/Interfaces | PascalCase | `AuthUser`, `ApiResponse` |
| Variables de entorno | UPPER_SNAKE_CASE | `JWT_SECRET`, `ADMIN_EMAIL` |
| Archivos de datos | snake_case | `users.json`, `bookings.json` |

## Configuración de Desarrollo

### Primeros Pasos
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local:
# JWT_SECRET=tu-clave-super-segura-min-32-caracteres
# ADMIN_EMAIL=admin@jahsurfperu.com

# 3. Iniciar desarrollo
npm run dev
# Acceder a http://localhost:5173
```

### Comandos Disponibles
- `npm run dev`: Inicia servidor con HMR
- `npm run build`: Build para producción
- `npm run preview`: Preview local del build
- `npm run lint`: Verifica tipos

## Guías de Implementación

### Agregar Nueva Ruta Protegida

**1. Backend (server.ts):**
```typescript
app.post('/api/admin/new-feature', authenticateJWT, authorizeAdmin, (req, res) => {
  // Tu lógica aquí
  res.json({ success: true });
});
```

**2. Frontend (hook personalizado):**
```typescript
const useAdminData = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/admin/new-feature', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).then(setData);
    }
  }, [user]);

  return data;
};
```

### Crear Componente Protegido
```typescript
interface ProtectedComponentProps {
  children: React.ReactNode;
}

export const AdminOnly: React.FC<ProtectedComponentProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAdmin) return <AccessDenied />;

  return <>{children}</>;
};

// Uso:
<AdminOnly>
  <AdminPanel />
</AdminOnly>
```

### Gestionar Datos Persistentes
Los datos se almacenan en `/store` como archivos JSON:
```typescript
// En server.ts, ruta para actualizar contenido
app.post('/api/content/update', authenticateJWT, authorizeAdmin, (req, res) => {
  const { key, data } = req.body;
  const filePath = path.join(STORE_PATH, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ success: true });
});
```

## Mejores Prácticas

### Seguridad
- ✅ JWT siempre en localStorage (o mejor: cookie httpOnly en cookies-api)
- ✅ Validar JWT en cada request protegido
- ✅ Nunca exponer JWT_SECRET en cliente
- ✅ Sanitizar inputs de usuario
- ✅ Configurar CORS apropiadamente para producción

### Rendimiento
- ✅ Code splitting con React Router
- ✅ Lazy loading de componentes pesados
- ✅ Caching de datos dinámicos
- ✅ Evitar re-renders innecesarios

### Experiencia de Usuario
- ✅ Loading states claros durante autenticación
- ✅ Error messages descriptivos
- ✅ Confirmaciones para acciones críticas
- ✅ Feedback visual inmediato

## Gestión de Errores

```typescript
// ✅ Correcto
try {
  const response = await fetch('/api/data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('API error');
  return await response.json();
} catch (error) {
  console.error('Error fetching data:', error);
  showErrorNotification('No se pudo cargar los datos');
}

// ❌ Incorrecto
const response = await fetch('/api/data');
const data = response.json();
```

## Variables de Entorno

```env
# .env.local (NUNCA commitear esto)
JWT_SECRET=mi-clave-super-secreta-de-minimo-32-caracteres
ADMIN_EMAIL=admin@jahsurfperu.com
VITE_API_URL=http://localhost:3000
```

## Railway Deployment

### Configuración Requerida

1. **Variables en Railway:**
   ```
   JWT_SECRET=<clave-aleatoria-segura>
   ADMIN_EMAIL=<tu-email-admin>
   NODE_ENV=production
   ```

2. **Volumen Persistente:**
   - Mount path: `/store`
   - Todos los datos se guardan aquí automáticamente

3. **Build Command:**
   ```
   npm run build
   ```

4. **Start Command:**
   ```
   npm run dev
   ```

### Verificar Despliegue
- Los datos persisten entre deploys
- `/api/store` endpoints disponibles
- JWT_SECRET está protegido en Railway secrets
- Login funciona sin dependencias externas
