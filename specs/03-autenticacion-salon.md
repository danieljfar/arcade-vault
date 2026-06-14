# SPEC 03 — Autenticación + Salón de la Fama

> **Estado:** IMPLEMENTADO · **Depende de:** SPEC 01, SPEC 02 · **Fecha:** 2026-06-14
> **Objetivo:** Implementar autenticación básica con modo invitado y Salón de la Fama con podio, tabla de rankings y puntuaciones reales de localStorage.

---

## Scope

**In:**

- Tipo `User` para representar usuario autenticado
- Página `/auth` con tabs login/registro y botón modo invitado
- Persistencia de usuario en localStorage (key: `av_user`)
- Página `/salon` (Salón de la Fama) con tabs por juego, podio top 3, tabla completa
- Integración de puntuaciones reales desde localStorage (`av_scores`)
- Sección "TU MEJOR MARCA" cuando hay usuario logueado
- Actualización del Nav para mostrar nombre de usuario cuando está logueado
- Botón cerrar sesión en Nav (dropdown o directo)
- Integración de usuario en reproductor (nombre pre-llenado en modal game over)
- Botones sociales (Google, GitHub) como placeholders no funcionales
- Link "Salón de la Fama" en Nav funciona correctamente
- Footer en todas las páginas

**Fuera de scope (specs futuras):**

- OAuth real con Google/GitHub (spec posterior)
- Backend real para autenticación (spec posterior)
- Validación de email/password real (solo mock en este MVP)
- Recuperación de contraseña (spec posterior)
- Edición de perfil de usuario (spec posterior)
- Sistema de rankings global con backend (spec posterior)
- Comparación en tiempo real con otros jugadores (spec posterior)

---

## Modelo de datos

```typescript
// /lib/types.ts (agregar)

export interface User {
  name: string;        // max 10 chars, uppercase
}
```

```typescript
// localStorage structure
// Key: "av_user"
// Value: User | null

// Ejemplo:
{ "name": "PX_KAI" }
```

**Convenciones:**

- Nombre de usuario: max 10 caracteres, uppercase
- Login/registro mock: cualquier input crea usuario
- Modo invitado: `user = null` en localStorage
- Puntuaciones de invitado tienen `name: "INVITADO"`
- Rankings calculados desde localStorage `av_scores` en tiempo real

---

## Plan de implementación

1. Actualizar `/lib/types.ts`:
   - Agregar interface `User`

2. Crear `/app/auth/page.tsx`:
   - Client Component
   - Estado: `tab` (in/up), `user`, `pass`, `email`
   - Tabs: "INICIAR SESIÓN" / "CREAR CUENTA"
   - Formulario controlado con campos usuario, email (solo en registro), contraseña
   - Botón submit: crea usuario mock, guarda en localStorage, navega a biblioteca
   - Botón "JUGAR COMO INVITADO": no guarda usuario, navega a biblioteca
   - Botones sociales Google/GitHub (placeholders, no funcionales)
   - Texto "AL ENTRAR ACEPTAS LOS TÉRMINOS DEL SALÓN ARCADE"

3. Crear `/app/salon/page.tsx`:
   - Client Component
   - Estado: `tab` (game id actual)
   - Cargar usuario desde localStorage
   - Cargar puntuaciones desde localStorage `av_scores`
   - Filtrar puntuaciones por juego seleccionado
   - Calcular top 12 ordenado por score descendente
   - Header con título "SALÓN DE LA FAMA" y subtitle
   - Tabs con chips por cada juego (reutilizar estilos)
   - Podio con top 3: gold (centro, más alto), silver (izq), bronze (der)
   - Tabla completa con top 12 (thead + rows animados)
   - Sección "TU MEJOR MARCA" si hay usuario: calcular mejor puntuación del usuario en juego actual
   - Botón "VOLVER A LA BIBLIOTECA"

4. Actualizar `/components/Nav.tsx`:
   - Cargar usuario desde localStorage en mount
   - Si `user` existe: mostrar nombre + botón cerrar sesión
   - Si no existe: mostrar botón "Iniciar Sesión"
   - Función `handleSignOut()`: borra localStorage, actualiza estado
   - Asegurar que link "Salón de la Fama" navega a `/salon`

5. Actualizar `/app/juego/[id]/jugar/page.tsx`:
   - Cargar usuario desde localStorage en mount
   - Pre-llenar input de nombre con `user?.name || "INVITADO"`

6. Agregar estilos faltantes en `/app/globals.css`:
   - Verificar `.av-auth-wrap`, `.auth-card`, `.auth-tabs`, `.field`, `.social`
   - Verificar `.av-hall`, `.hall-head`, `.hall-tabs`, `.podium`, `.hall-table`
   - Agregar si faltan (ya deberían estar de SPEC 01)

7. Crear función helper `/lib/scores.ts`:
   - `getScoresByGame(gameId: string): SavedScore[]` - lee localStorage, filtra por juego
   - `getTopScores(gameId: string, limit: number): LeaderboardEntry[]` - retorna top N ordenados
   - `getUserBestScore(gameId: string, userName: string): SavedScore | null` - mejor score del usuario

8. Probar flujo completo de autenticación:
   - Visitar `/auth`
   - Llenar formulario, crear usuario
   - Verificar localStorage `av_user`
   - Verificar que Nav muestra nombre de usuario
   - Cerrar sesión, verificar que desaparece
   - Modo invitado funciona

9. Probar Salón de la Fama:
   - Visitar `/salon`
   - Cambiar tabs entre juegos
   - Verificar que podio y tabla muestran datos correctos de localStorage
   - Jugar un juego, guardar puntuación
   - Volver a `/salon`, verificar que aparece la nueva puntuación
   - Verificar sección "TU MEJOR MARCA" con usuario logueado

10. Verificación final:
    - Flujo completo: auth → jugar → guardar puntuación → ver en salón
    - No hay errores en consola
    - TypeScript compila sin warnings

---

## Criterios de aceptación

- [ ] La interface `User` está definida en `/lib/types.ts`
- [ ] La página `/auth` renderiza con tabs login/registro
- [ ] El formulario de login/registro funciona (mock)
- [ ] El botón "JUGAR COMO INVITADO" navega a biblioteca sin guardar usuario
- [ ] Los botones sociales Google/GitHub están presentes (placeholders)
- [ ] El usuario se guarda en localStorage (`av_user`) al autenticarse
- [ ] El Nav muestra el nombre del usuario cuando está logueado
- [ ] El botón cerrar sesión en Nav borra el usuario y actualiza el estado
- [ ] El botón "Iniciar Sesión" en Nav navega a `/auth` cuando no hay usuario
- [ ] La página `/salon` renderiza con header y subtitle
- [ ] Los tabs por juego funcionan y filtran correctamente
- [ ] El podio muestra top 3 con estilos gold/silver/bronze
- [ ] La tabla muestra top 12 con formato correcto (rank, jugador, puntuación, fecha)
- [ ] Las puntuaciones vienen de localStorage (`av_scores`) en tiempo real
- [ ] La sección "TU MEJOR MARCA" aparece cuando hay usuario logueado
- [ ] La sección "TU MEJOR MARCA" muestra la mejor puntuación del usuario en el juego actual
- [ ] El input de nombre en game over se pre-llena con el nombre del usuario logueado
- [ ] El botón "VOLVER A LA BIBLIOTECA" en salón navega a `/`
- [ ] Guardar una puntuación nueva y recargar `/salon` muestra la puntuación actualizada
- [ ] No hay errores en consola
- [ ] No hay warnings de TypeScript

---

## Decisiones

- **Sí:** Autenticación mock. Solo guarda nombre en localStorage. Backend real en spec posterior.
- **Sí:** Login y registro hacen lo mismo (crean usuario mock). UX simple para MVP.
- **Sí:** Modo invitado no guarda usuario. Pueden jugar y guardar puntuaciones locales con nombre "INVITADO".
- **Sí:** OAuth placeholders. Botones visibles pero no funcionales. Implementación real en spec posterior.
- **Sí:** Puntuaciones desde localStorage. Tiempo real dentro de la sesión local, no sincroniza con backend.
- **Sí:** Tipo `User` minimalista (solo `name`). Expandible en futuro con `email`, `avatar`, etc.
- **Sí:** Salón de la Fama usa datos seeded + reales mezclados. Seeded para llenar, reales de localStorage.
- **No:** En realidad, solo usamos datos reales de localStorage. Seeded solo para demostración si no hay puntuaciones.
- **Sí:** Mejor usar solo datos reales de `av_scores`. Si está vacío, mostrar mensaje "No hay puntuaciones aún".
- **Sí:** "TU MEJOR MARCA" solo aparece si hay usuario Y tiene puntuaciones en ese juego.
- **Sí:** Botón cerrar sesión directo en Nav (no dropdown por simplicidad).
- **No:** Validación de email/password. Cualquier input es válido en este MVP.
- **No:** Recuperación de contraseña. No hay backend.

---

## Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| localStorage `av_user` corrupto | Envolver en try/catch. Si falla, asumir no logueado. |
| localStorage `av_scores` vacío en salón | Mostrar mensaje "No hay puntuaciones registradas todavía. ¡Sé el primero!" |
| Usuario cierra sesión mientras juega | El reproductor sigue usando el nombre que tenía en mount. No afecta sesión actual. |
| Puntuaciones de invitados mezcladas con autenticados | Es intencional. En backend futuro se separarán. |

---

## Lo que **NO** está en esta spec

- OAuth real con Google/GitHub → spec posterior
- Backend real para autenticación y usuarios → spec posterior
- Validación de email/password con reglas reales → spec posterior
- Recuperación de contraseña → spec posterior
- Edición de perfil (cambiar nombre, avatar, etc.) → spec posterior
- Sistema de rankings global con backend → spec posterior
- Sincronización de puntuaciones entre dispositivos → spec posterior
- Comparación en tiempo real con otros jugadores → spec posterior
- Sistema de amigos o social → spec posterior

Cada una de estas funcionalidades, si se implementa, va en su propia spec.
