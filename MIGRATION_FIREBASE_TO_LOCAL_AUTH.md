# Migración de Firebase a Autenticación Local

## 📋 Resumen de Cambios

Este proyecto ha sido migrado de Firebase Authentication a un sistema local de autenticación basado en JWT. Esta solución es **totalmente autónoma**, sin dependencias de servicios Google.

## ✨ Beneficios

✅ **Sin dependencias externas** - No requiere Firebase ni Google Cloud  
✅ **Funciona en Railway** - Almacenamiento persistente en volúmenes  
✅ **Completamente local** - Datos guardados en archivos JSON  
✅ **Control total** - Administra tus usuarios como quieras  
✅ **Más rápido** - Sin latencia de servicios cloud para auth  

## 🔧 Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
JWT_SECRET=generador-una-clave-aleatoria-de-al-menos-32-caracteres
ADMIN_EMAIL=admin@jahsurfperu.com
VITE_API_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Generar JWT_SECRET seguro (en bash/PowerShell)

**En Linux/Mac:**
```bash
openssl rand -base64 32
```

**En PowerShell:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 -InputObject (33..126) | % {[char]$_} | Join-String)) | -replace '=*$')
```

O simplemente usa una cadena larga aleatoria:
```
my-super-secret-key-1234567890ABCDEFGHIJKLMNOPQRST
```

### 4. Iniciar desarrollo
```bash
npm run dev
```

Acceder a `http://localhost:5173`

## 📁 Estructura de Datos

Los datos se almacenan en `/store` como archivos JSON:

```
/store/
├── users.json          # Base de datos de usuarios
├── content.json        # Contenido dinámico del sitio
├── pricing.json        # Información de precios
└── bookings.json       # Reservas de usuarios
```

### Estructura de `users.json`
```json
[
  {
    "id": "uuid-aqui",
    "email": "admin@jahsurfperu.com",
    "password": "hashed-sha256",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

## 🔐 API de Autenticación

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@jahsurfperu.com",
  "password": "contraseña"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "admin@jahsurfperu.com",
    "role": "admin"
  }
}
```

### Registro
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "contraseña"
}
```

### Verificar Token
```bash
GET /api/auth/verify
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## 🔑 Archivos Nuevos Creados

- `src/auth.ts` - Lógica de autenticación cliente
- `src/AuthProvider.tsx` - Context de React para autenticación
- `server.ts` - Actualizado con rutas de auth JWT
- `.env.example` - Ejemplo de variables de entorno

## 🧹 Cambios Pendientes (Opcional)

Si quieres limpiar las referencias a Firebase:

1. Remover `FirebaseProvider.tsx` y `firebase.ts`
2. Remover componentes que dependan de Firestore
3. Actualizar `AdminPanel.tsx` para usar `useAuth()` en lugar de `useFirebase()`
4. Remover `firebase` de `package.json`
5. Remover archivos de configuración Firebase

## 🚀 Despliegue en Railway

### Variables de Entorno en Railway
```
JWT_SECRET=<genera-uno-seguro>
ADMIN_EMAIL=admin@jahsurfperu.com
NODE_ENV=production
STORE_PATH=/store
```

### Volumen Persistente
- Mount path: `/store`
- Todos los datos (usuarios, contenido, reservas) se guardan aquí

### Deploy
```bash
npm run build
```

Railway automáticamente ejecutará `npm run dev` (o configura el start command).

## 🔄 Primer Inicio de Sesión

1. Ve a la página de login
2. Haz clic en "Registrarse"
3. Usa tu email (si es `ADMIN_EMAIL`, tendrá rol admin automáticamente)
4. Crea una contraseña
5. ¡Listo! Sesión iniciada

## 🐛 Troubleshooting

### Error: "JWT_SECRET not set"
Asegúrate de que `.env.local` contiene `JWT_SECRET` y el server está reiniciado.

### Error: "Invalid token"
El token expiró. El usuario debe iniciar sesión nuevamente. Los tokens válidos por 7 días.

### Datos no persisten después de deploy
Verifica que el volumen `/store` está correctamente montado en Railway.

### Contraseña incorrecta siempre
Las contraseñas se hashean con SHA256 + JWT_SECRET. Si cambias JWT_SECRET, todos los hashes serán inválidos.

## 📚 Documentación

Ver `AGENT.md` y `SKILLS.md` para arquitectura y estándares de código.

## ❓ Preguntas

Para crear nuevas rutas protegidas, ver ejemplos en `server.ts` líneas 100-150.
