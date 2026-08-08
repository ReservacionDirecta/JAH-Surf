# Plan Multi-Agente Gráfico — Eliminación de AI Slop

> Topología: Grafo dirigido con ciclos de retroalimentación (desarrollo circular)
> Cada nodo = agente especializado | Cada arista = dependencia/feedback

---

## 🔵 Grafo de Agentes

```
                    ┌─────────────────┐
                    │   AGENTE 0:     │
                    │   Orquestador   │
                    │   & QA Gate     │
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────────┐
     │  AGENTE 1:   │ │ AGENTE 2:│ │  AGENTE 3:   │
     │  Seguridad   │ │ Dead Code│ │  Tipos TypeScript │
     │  & Config    │ │ Cleanup  │ │  & Estrictura    │
     └──────┬───────┘ └────┬─────┘ └──────┬───────┘
            │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   AGENTE 4:     │
                    │  Deduplicación  │
                    │  & Abstracción  │
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────────┐
     │  AGENTE 5:   │ │ AGENTE 6:│ │  AGENTE 7:   │
     │  Consistencia│ │  Docs &  │ │  Booking     │
     │  & Patrones  │ │ Comments │ │  Flow Fix    │
     └──────┬───────┘ └────┬─────┘ └──────┬───────┘
            │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   AGENTE 0:     │
                    │   Verificación  │◄── Ciclo circular
                    │   & Re-test     │    (vuelve a empezar
                    └─────────────────┘     si falla)
```

---

## 📋 Especificación de Agentes

### AGENTE 0: Orquestador & QA Gate
**Rol:** Coordina ejecución, verifica resultados, decide si se itera

| Input | Proceso | Output |
|-------|---------|--------|
| Estado del proyecto | Ejecuta `tsc --noEmit`, revisa cada cambio, compara contra checklist | Reporte de paso/fallo, decisión de re-iteración |

**Criterio de paso:**
- `tsc --noEmit` sin errores
- Sin imports sin usar (detectado vía `noUnusedLocals`)
- Sin archivos referenciados que ya no existan
- Booking flow funcional (verificación manual descrita)

**Ciclo:** Si cualquier agente posterior reporta regresión → vuelve al agente correspondiente.

---

### AGENTE 1: Seguridad & Config
**Depende de:** Ninguno (capa base)
**Bloquea a:** Agente 4, 7

| Tarea | Archivo | Acción |
|-------|---------|--------|
| Cargar `.env` | `server.ts:1` | Añadir `import 'dotenv/config'` al inicio |
| Hard-fail en secreto | `server.ts:26` | `if (!process.env.JWT_SECRET) throw new Error(...)` |
| Reemplazar SHA-256 | `server.ts:51-53` | Usar `crypto.scryptSync` con salt por usuario |
| Sanear path traversal | `server.ts:228,257` | Validar `key` con regex `^[a-zA-Z0-9_-]+$` |
| Proteger GET sensibles | `server.ts:255,273` | Añadir auth a `GET /api/store/:key` y `GET /api/store` |
| Limitar payload | `server.ts:36` | Reducir a `1mb` global, `5mb` solo en `/api/upload` |
| Remover `@google/genai` | `package.json:15` | `npm uninstall @google/genai` |
| Duplicado `vite` | `package.json:28,39` | Mover a solo `devDependencies` |

**Entregable:** `server.ts` seguro + `package.json` limpio

---

### AGENTE 2: Dead Code Cleanup
**Depende de:** Agente 1 (seguridad primero)
**Bloquea a:** Agente 4, 5

| Tarea | Archivo | Acción |
|-------|---------|--------|
| Eliminar parse Firestore | `ErrorBoundary.tsx:36-47` | Reducir a `const errorMessage = error?.message \|\| "..."` |
| Eliminar comentario elipsis | `App.tsx:1306` | Borrar línea |
| Eliminar Firebase files | raíz | Borrar `firestore.rules`, `firebase-blueprint.json`, `firebase-applet-config.json` |
| Eliminar imports sin usar | `App.tsx:1,4` | Quitar `useCallback`, `Link` |
| Eliminar tipos sin usar | `auth.ts:15-23,97,104` | Quitar `LoginPayload`, `RegisterPayload`, `isAuthenticated`, `isAdmin` |
| Eliminar import sin usar | `AuthProvider.tsx:3` | Quitar `LoginPayload` |
| Eliminar footer stubs | `App.tsx:1274-1275` | Reemplazar `href="#"` por páginas reales o eliminar |
| Eliminar markdowns | raíz | Borrar 9 de 11 archivos (dejar solo `README.md` + `AGENT.md`) |

**Entregable:** Código sin artefactos muertos

---

### AGENTE 3: Tipos TypeScript & Estrictura
**Depende de:** Agente 2 (código limpio antes de tipar)
**Bloquea a:** Agente 4, 5

| Tarea | Archivo | Acción |
|-------|---------|--------|
| Habilitar strict mode | `tsconfig.json` | Añadir `"strict": true`, `"noUnusedLocals": true`, `"noImplicitAny": true` |
| Eliminar `@ts-nocheck` | `vite.config.ts:1` | Quitar, tipar correctamente |
| Tipar `PricingModal` props | `App.tsx:715` | Interfaz `{ isOpen, onClose, title, packages, color }: PricingModalProps` |
| Eliminar `any` en estado | `AdminPanel.tsx:77,78` | Tipar con `Content`, `PricingItem`, `Booking` |
| Eliminar `any` en `App.tsx` | `App.tsx:205,311,965` | Tipar `Content`, `ModalData` |
| Pasar precio numérico | `App.tsx:725-729` | Eliminar `extractPenAmount`, pasar `number` directamente |
| Tipar `req.user` | `server.ts` | Extender `Request` con declaración de módulo |

**Entregable:** Proyecto compila con `strict: true`

---

### AGENTE 4: Deduplicación & Abstracción
**Depende de:** Agente 1, 2, 3 (base limpia y tipada)
**Bloquea a:** Agente 7

| Tarea | Archivo | Acción |
|-------|---------|--------|
| Extraer `ContentProvider` | nuevo `src/Context/ContentContext.tsx` | Unificar 3 fetches de `/api/store/content` |
| Extraer `video.ts` util | nuevo `src/utils/video.ts` | Unificar `normalizeVideoUrl` + `toEmbedUrl` |
| Generic CRUD handlers | `AdminPanel.tsx:214-379` | `updateItem<T>(listKey, id, patch)` genérico |
| Unificar booking submit | `App.tsx:886-944` + `BookingForm.tsx:25-78` | Extraer `useBookingSubmit` hook |
| Colapsar saveByKey fan-out | `AdminPanel.tsx:186-189` | Un solo `saveByKey` con mapa de mensajes |
| Eliminar inline update closures | `AdminPanel.tsx:590-646` | Helper `updateListItem(array, index, patch)` |

**Entregable:** ~400 LOC eliminados, 3 nuevos módulos compartidos

---

### AGENTE 5: Consistencia & Patrones
**Depende de:** Agente 2, 3
**Bloquea a:** Agente 0 (QA final)

| Tarea | Archivo | Acción |
|-------|---------|--------|
| Unificar quote style | Todo el proyecto | Single quote en todo (configurar Prettier/ESLint) |
| Unificar state updates | `AdminPanel.tsx` | Todo con `setX(prev => ...)` funcional |
| Unificar declaración componentes | Todo | Arrow functions en todo (migrar `React.FC` y class) |
| Unificar fetch strategy | `AdminPanel.tsx` | Solo `authenticatedFetch` para rutas protegidas |
| Colapsar tabs+tabTitle | `AdminPanel.tsx:477-495` | Un solo array con `id, icon, label, title` |
| Eliminar ternary chain | `AdminPanel.tsx:559` | Mapa `saveHandlers[activeTab]()` |

**Entregable:** Patrón uniforme en todo el codebase

---

### AGENTE 6: Docs & Comments
**Depende de:** Agente 2 (ya se borró el dead code)
**Bloquea a:** Agente 0 (QA final)

| Tarea | Archivo | Acción |
|-------|---------|--------|
| Eliminar comentarios "Utility:" | `server.ts:50,55,60,65,75,104` | Borrar, el nombre de función basta |
| Eliminar JSDoc redundante | `auth.ts:29-153` | Borrar, repiten la firma |
| Eliminar "// Restore session" | `AuthProvider.tsx:22` | Borrar, `useEffect([])` es auto-explicativo |
| Eliminar "// Types" | `server.ts:13` | Borrar |
| Eliminar "// Auth Routes" | `server.ts:127` | Borrar |
| Mantener comentarios útiles | `AdminPanel.tsx:242-244` | Conservar (explica el *porqué* de imgur) |

**Entregable:** Solo comentarios que explican "porqué", no "qué"

---

### AGENTE 7: Booking Flow Fix
**Depende de:** Agente 1 (seguridad), Agente 4 (dedup)
**Bloquea a:** Agente 0 (QA final)

| Tarea | Archivo | Acción |
|-------|---------|--------|
| Unificar storage key | `App.tsx:920` | Usar `bookings` con `append: true` (no `booking_modal_${Date.now()}`) |
| Verificar `response.ok` | `App.tsx:919-933` | Chequear status, mostrar error si falla |
| Usar hook compartido | `App.tsx` + `BookingForm.tsx` | Ambos usan `useBookingSubmit` del Agente 4 |
| Conectar admin placeholders | `AdminPanel.tsx` | Wire up `reservationsEnabled`, `contactEmail/WhatsApp` o eliminar |

**Entregable:** Reserva del modal llega al admin panel correctamente

---

## 🔄 Ciclos de Retroalimentación (Desarrollo Circular)

```
CICLO 1: Seguridad → Dead Code → Tipos → Dedup → Consistencia → Docs → Booking → QA
   │
   ├── Si QA falla → vuelve al agente que introdujo la regresión
   │
   └── Si QA pasa → CICLO 2

CICLO 2: Re-verificación completa
   │
   ├── Agente 0 ejecuta `tsc --noEmit --strict`
   ├── Agente 0 verifica que no quedó código muerto
   ├── Agente 0 verifica que no quedó duplicación
   │
   ├── Si algo quedó → vuelve al agente correspondiente
   │
   └── Si todo limpio → CICLO 3 (verificación manual)

CICLO 3: Verificación funcional
   │
   ├── Levantar servidor, probar login admin
   ├── Probar flujo de reserva desde PricingModal
   ├── Probar flujo de reserva desde BookingForm
   ├── Verificar que admin ve las reservas
   │
   ├── Si algo falla → vuelve al Agente 7 o 1
   │
   └── ✅ COMPLETADO
```

---

## 📊 Métricas de Éxito

| Métrica | Antes | Meta |
|---------|-------|------|
| LOC totales | ~2,900 | ~2,200 (-24%) |
| Archivos markdown | 11 | 2 (-82%) |
| `any` explícitos | ~15 | 0 (100%) |
| Fetches duplicados de content | 3 | 1 (-67%) |
| CRUD handlers duplicados | 9 | 3 genéricos (-67%) |
| Regex video duplicados | 8 (2 archivos × 4) | 4 (1 archivo) (-50%) |
| Vulnerabilidades críticas | 5 | 0 (100%) |
| TypeScript strict | ❌ | ✅ |
| Imports sin usar | ~8 | 0 (100%) |

---

## 🚀 Orden de Ejecución

```
Fase 1 (paralela):  Agente 1 + Agente 2
Fase 2 (secuencial): Agente 3 (requiere 2)
Fase 3 (paralela):  Agente 4 + Agente 5 + Agente 6
Fase 4 (secuencial): Agente 7 (requiere 4)
Fase 5 (ciclo):     Agente 0 verifica → itera si necesario
```

---

## ⚙️ Implementación con OpenCode Agents

Para ejecutar este plan con el sistema de agents/subagents de OpenCode:

```json
// .opencode/agents/security.json
{
  "name": "security-agent",
  "description": "Fixes security vulnerabilities in server.ts",
  "tools": ["read", "edit", "bash"],
  "prompt": "Fix all security issues per PLAN-MULTI-AGENTE.md Agente 1"
}
```

Cada agente se puede invocar como task secuencial o paralelo según las dependencias del grafo.
