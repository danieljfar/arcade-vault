# SPEC 02 — Reproductor + Sistema de puntuaciones

> **Estado:** IMPLEMENTADO · **Depende de:** SPEC 01 · **Fecha:** 2026-06-14
> **Objetivo:** Implementar el reproductor de juegos con monitor CRT, HUD, simulador visual y sistema de guardado de puntuaciones en localStorage.

---

## Scope

**In:**

- Página reproductor en `/juego/[id]/jugar` como ruta separada
- Componente reproductor con monitor CRT estilizado (bordes, sombras, efecto de pantalla)
- HUD con stats: jugador, puntuación, vidas, nivel
- Controles del HUD: botones PAUSA/REANUDAR, FIN, SALIR
- Simulador visual de juego con animaciones CSS (nave, enemigos, grid de perspectiva)
- Lógica de juego simulada: score auto-incrementa, nivel sube cada 2500 puntos
- Estados del juego: jugando, pausa, game over
- Overlay de pausa con mensaje "EN PAUSA"
- Modal de game over con puntuación final, input de nombre (max 10 chars uppercase), botón guardar
- Persistencia de puntuaciones en localStorage (array global `av_scores`)
- Toast de confirmación "PUNTUACIÓN GUARDADA" después de guardar
- Botones en modal: "JUGAR DE NUEVO" (reinicia), "VOLVER AL VAULT" (navega a biblioteca)
- Actualización del botón "JUGAR AHORA" en página detalle para navegar a `/juego/[id]/jugar`
- Soporte para modo invitado (nombre "INVITADO" por defecto si no hay usuario)

**Fuera de scope (specs futuras):**

- Integración de juegos HTML5 reales (spec posterior)
- Autenticación de usuarios (SPEC 03)
- Backend real para puntuaciones (spec posterior)
- Controles de teclado para jugar (spec posterior)
- Sistema de vidas real (por ahora solo visual, siempre 3 vidas)
- Leaderboard actualizado en tiempo real con puntuaciones guardadas (SPEC 03)

---

## Modelo de datos

```typescript
// /lib/types.ts (agregar)

export interface SavedScore {
  game: string;        // game.id
  score: number;
  name: string;        // max 10 chars, uppercase
  at: number;          // timestamp Date.now()
}
```

```typescript
// localStorage structure
// Key: "av_scores"
// Value: SavedScore[]

// Ejemplo:
[
  { game: "bloque-buster", score: 28450, name: "PX_KAI", at: 1738560000000 },
  { game: "caida", score: 184220, name: "NEONFOX", at: 1738560120000 },
  { game: "bloque-buster", score: 15200, name: "INVITADO", at: 1738560240000 }
]
```

**Convenciones:**

- Nombres de jugadores: max 10 caracteres, uppercase, sanitizado en input
- Score auto-incrementa: `+10 a +100` cada 220ms cuando está jugando
- Nivel sube cuando: `score % 2500 < 100` (cada ~2500 puntos)
- Vidas siempre 3 (visual, no decrece en este MVP)
- Estados: `"playing" | "paused" | "gameover"`

---

## Plan de implementación

1. Actualizar `/lib/types.ts`:
   - Agregar interface `SavedScore`
   - Exportar tipos

2. Crear `/app/juego/[id]/jugar/page.tsx`:
   - Client Component
   - Obtener `id` desde params
   - Buscar juego en `GAMES`
   - Estados: `score`, `lives`, `level`, `paused`, `over`, `name`, `saved`
   - useEffect: auto-incrementar score cuando está jugando (no paused, no over)
   - useEffect: detectar cambio de nivel cuando score % 2500 < 100
   - Funciones: `endGame()`, `restart()`
   - Renderizar: HUD + CRT screen + modal game over condicional

3. Crear componente HUD dentro del reproductor:
   - Mostrar: jugador, puntuación formateada, vidas (♥ repetido), nivel (padStart 2 dígitos)
   - Botones: PAUSA/REANUDAR (toggle `paused`), FIN (llama `endGame()`), SALIR (navega a `/juego/[id]`)
   - Estilos: `.player-hud`, `.hud-stat`, `.hud-actions` ya en globals.css

4. Crear monitor CRT con simulador:
   - Clase `.crt` con bordes, sombras, efecto glow
   - `.crt-screen` con background negro, scanlines, vignette
   - `.game-arena` con grid animado, nave (triángulo CSS), enemigos (cuadrados)
   - Overlay de pausa condicional: `{paused && <div className="crt-content">EN PAUSA</div>}`
   - `.crt-bottom` con indicadores: "SEÑAL OK", título del juego, "60 HZ"

5. Crear modal de game over:
   - Mostrar cuando `over === true`
   - Backdrop con clase `.modal-bd`
   - Modal con borde magenta, título "FIN DEL JUEGO", puntuación final grande
   - Input controlado para nombre (value uppercase, max 10 chars)
   - Botón "GUARDAR PUNTUACIÓN": guarda en localStorage, setea `saved = true`
   - Toast "PUNTUACIÓN GUARDADA" cuando `saved === true`
   - Botones: "JUGAR DE NUEVO" (restart), "VOLVER AL VAULT" (navega a `/`)

6. Implementar función `handleSaveScore()`:
   - Leer array actual de localStorage: `JSON.parse(localStorage.getItem("av_scores") || "[]")`
   - Agregar nueva entrada: `{ game: gameId, score, name, at: Date.now() }`
   - Guardar array actualizado: `localStorage.setItem("av_scores", JSON.stringify(all))`
   - Manejar errores con try/catch

7. Actualizar `/app/juego/[id]/page.tsx` (página detalle):
   - Cambiar botón "JUGAR AHORA" de placeholder a `<Link href={\`/juego/${game.id}/jugar\`}>`
   - Verificar navegación funciona

8. Agregar estilos faltantes en `/app/globals.css` (si no existen):
   - Verificar que `.crt`, `.game-arena`, `.modal`, `.modal-bd`, `.toast-saved` estén presentes
   - Agregar si faltan

9. Probar flujo completo:
   - Desde biblioteca → detalle → click "JUGAR AHORA" → reproductor carga
   - Score incrementa automáticamente
   - Nivel sube al llegar a ~2500 puntos
   - Botón PAUSA detiene score, muestra overlay
   - Botón FIN muestra modal game over
   - Guardar puntuación en localStorage
   - Toast de confirmación aparece
   - "JUGAR DE NUEVO" reinicia el juego
   - "VOLVER AL VAULT" navega a biblioteca
   - "SALIR" en HUD navega a detalle

10. Verificar en DevTools:
    - localStorage contiene array `av_scores` después de guardar
    - Puntuaciones persisten entre reloads
    - No hay errores en consola

---

## Criterios de aceptación

- [ ] La interface `SavedScore` está definida en `/lib/types.ts`
- [ ] La ruta `/juego/[id]/jugar` renderiza el reproductor correctamente
- [ ] El HUD muestra jugador, puntuación formateada, vidas (♥ ♥ ♥) y nivel (01, 02, etc.)
- [ ] El score auto-incrementa cuando el juego está en estado "playing"
- [ ] El nivel sube automáticamente cada ~2500 puntos
- [ ] El botón PAUSA detiene el score y muestra overlay "EN PAUSA"
- [ ] El botón REANUDAR oculta el overlay y reanuda el score
- [ ] El botón FIN termina el juego y muestra modal game over
- [ ] El botón SALIR navega de vuelta a `/juego/[id]` (detalle)
- [ ] El monitor CRT tiene estilos correctos (bordes, sombras, scanlines)
- [ ] El simulador visual muestra nave, enemigos y grid animado
- [ ] El modal game over muestra la puntuación final formateada
- [ ] El input de nombre acepta max 10 caracteres y convierte a uppercase
- [ ] El botón "GUARDAR PUNTUACIÓN" guarda en localStorage correctamente
- [ ] El toast "PUNTUACIÓN GUARDADA" aparece después de guardar
- [ ] El array `av_scores` en localStorage tiene la estructura correcta
- [ ] El botón "JUGAR DE NUEVO" reinicia el juego (score=0, lives=3, level=1)
- [ ] El botón "VOLVER AL VAULT" navega a la biblioteca (`/`)
- [ ] El botón "JUGAR AHORA" en detalle navega a `/juego/[id]/jugar`
- [ ] El modo invitado funciona (nombre "INVITADO" por defecto)
- [ ] No hay errores en consola
- [ ] No hay warnings de TypeScript
- [ ] Las puntuaciones persisten después de reload

---

## Decisiones

- **Sí:** Ruta separada `/juego/[id]/jugar`. Permite URLs compartibles y navegación limpia.
- **Sí:** Simulador CSS puro. Juegos HTML5 reales van en spec posterior cuando se defina la arquitectura de sandboxing.
- **Sí:** Score auto-incrementa. Es un simulador, no requiere input del usuario.
- **Sí:** Array global de puntuaciones en localStorage (`av_scores`). Más simple que arrays por juego, permite queries cross-game.
- **Sí:** Guardamos puntuaciones de invitados. Modo invitado puede competir localmente. Auth en SPEC 03 diferenciará local vs backend.
- **Sí:** Nivel sube cada 2500 puntos. Valor razonable para MVP, configurable en futuro.
- **Sí:** Botón "FIN" termina inmediatamente sin confirmación. UX simple y directa.
- **Sí:** Botón "SALIR" navega a detalle. Usuario puede querer revisar info del juego antes de volver.
- **Sí:** Nombre max 10 caracteres uppercase. Convención retro-arcade, consistente con leaderboards.
- **No:** Controles de teclado para jugar. Simulador no es interactivo en este MVP.
- **No:** Sistema de vidas real. Siempre 3 vidas visual, no decrece. Juego real en spec posterior.
- **No:** Leaderboard actualizado en tiempo real. Requiere recargar página. Actualización live en SPEC 03.

---

## Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| localStorage deshabilitado en modo privado o lleno | Envolver todas las operaciones en try/catch. Si falla, el juego sigue funcionando pero no persiste. Mostrar mensaje al usuario en futuro. |
| Score incrementa muy rápido o muy lento | Usar intervalo de 220ms con incremento aleatorio `Math.floor(10 + Math.random() * 90)`. Ajustable si se necesita rebalancear. |
| Modal game over bloquea interacción si hay bug | Agregar botón de escape (X) en modal para cerrar manualmente. |
| Usuario cierra tab antes de guardar puntuación | No hay solución en este MVP. Auto-save en futuro si se requiere. |

---

## Lo que **NO** está en esta spec

- Integración de juegos HTML5 reales en iframe/canvas → spec posterior
- Autenticación de usuarios y sincronización con backend → SPEC 03
- Sistema de vidas con lógica real (game over al llegar a 0) → spec posterior
- Controles de teclado/touch para jugar → spec posterior cuando haya juegos reales
- Leaderboard actualizado automáticamente con puntuaciones nuevas → SPEC 03
- Power-ups, bonus, efectos de sonido → specs posteriores
- Multiplayer o comparación de puntuaciones en tiempo real → spec posterior

Cada una de estas funcionalidades, si se implementa, va en su propia spec.
