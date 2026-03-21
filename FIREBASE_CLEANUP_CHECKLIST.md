# Firebase Cleanup Checklist (Optional)

Este documento es un **checklist opcional** para limpiar completamente las referencias a Firebase del proyecto si decides no usarlas.

## ⚠️ Nota Importante

**Firebase ya NO se está usando en el flujo de autenticación.** Puedes dejar estos archivos si quieres mantener la capacidad de usarlos en el futuro.

## ✅ Si Decides Limpiar Firebase Completamente

### Paso 1: Eliminar Archivos Firebase
```bash
# Archivos para eliminar:
rm src/firebase.ts
rm src/FirebaseProvider.tsx
rm firebase-applet-config.json
rm firebase-blueprint.json
```

### Paso 2: Actualizar App.tsx
- Remover `import { FirebaseProvider } from "./FirebaseProvider"`
- Remover `<FirebaseProvider>` wrapper

### Paso 3: Actualizar AdminPanel.tsx
Cambiar de Firebase a Auth Local:

**Antes:**
```typescript
import { useFirebase } from "../FirebaseProvider";
import { auth, signOut, signInWithPopup } from "../firebase";

const { user, isAdmin } = useFirebase();
```

**Después:**
```typescript
import { useAuth } from "../AuthProvider";

const { user, isAdmin, login, logout } = useAuth();
```

### Paso 4: Remover Dependencias Firebase
```bash
npm uninstall firebase
```

Actualizar `package.json`:
```json
// REMOVER estas líneas:
"firebase": "^12.11.0",
```

### Paso 5: Remover del Build
Actualizar `tsconfig.json` (eliminar referencias a Firebase):
```json
// Ya está limpio, no hacer nada
```

### Paso 6: Variables de Entorno
Remover de `.env.example`:
```env
# REMOVER:
# GEMINI_API_KEY=...
# APP_URL=...

# DEJAR:
JWT_SECRET=...
ADMIN_EMAIL=...
```

### Paso 7: Verificar el Build
```bash
npm run lint
npm run build
npm run dev
```

## 📋 Archivos Afectados (No Eliminar)

- ✅ `server.ts` - Ya migrado a JWT
- ✅ `src/auth.ts` - Sistema nuevo
- ✅ `src/AuthProvider.tsx` - Provider nuevo
- ✅ `.env.example` - Actualizado
- ✅ `package.json` - Actualizado

## 🔍 Buscar Referencias Restantes

```bash
# Buscar cualquier referencia a firebase/Firebase
grep -r "firebase" src/
grep -r "Firebase" src/
grep -r "firestore" src/

# Si hay resultados, revisar y actualizar
```

## ⚡ Estado Actual (Sin Cambios Requeridos)

✅ **Autenticación:** JWT Local (DONE)  
✅ **Almacenamiento:** Local JSON (DONE)  
✅ **Server:** Express sin Firebase (DONE)  
✅ **Frontend:** React con AuthContext (DONE)  

## ❓ Por Qué NO Eliminar Firebase Aún

1. Otros componentes pueden depender de Firestore
2. BookingForm.tsx podría estar usando Firestore
3. Datos históricos podrían estar en Firebase
4. Gradual migration es más seguro

## Si Necesitas Migracion Gradual

1. Mantener Firebase en dependencies
2. Usar Firebase solo para datos específicos (no auth)
3. Migrar datos gradualmente de Firestore a JSON local
4. Una vez completado, eliminar Firebase

## 🚀 Próximos Pasos

1. **Verificar qué usan cada componente**
   ```bash
   grep -r "db\|getDoc\|setDoc" src/components/
   ```

2. **Documentar dependencias**
   - ¿Qué componentes usan Firebase?
   - ¿Qué datos están en Firestore?

3. **Migrar datos**
   - Exportar de Firestore
   - Importar a JSON local

4. **Testear completamente**
   - Cada componente que usaba Firebase
   - Flujos críticos

## ❌ NO Hacer Sin Revisar

- ❌ Eliminar firebase sin revisar BookingForm.tsx
- ❌ Eliminar sin revisar AdminPanel.tsx completamente
- ❌ Eliminar archivos de configuración sin backup

## ✅ Hacer Siempre

- ✅ Hacer commit antes de limpiar
- ✅ Probar completamente después
- ✅ Actualizar documentación
- ✅ Verificar en desarrollo primero

---

**Status:** Autenticación completamente migrada ✅  
**Firebase Auth:** No usado ✅  
**Firebase Firestore:** Revisar componentes antes de eliminar ⚠️
