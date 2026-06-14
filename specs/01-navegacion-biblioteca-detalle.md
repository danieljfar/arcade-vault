# SPEC 01 — Navegación + Biblioteca + Detalle

> **Estado:** IMPLEMENTADO · **Depende de:** ninguna · **Fecha:** 2026-06-14
> **Objetivo:** Implementar el layout base con navegación responsive, grid de juegos con filtros y pantalla de detalle con leaderboard.

---

## Scope

**In:**

- Tipos TypeScript para `Game`, `Category`, `LeaderboardEntry` en `/lib/types.ts`
- Datos mock (8 juegos, categorías, generador de scores) en `/lib/data.ts`
- Componente `Nav` con logo, links (Biblioteca, Salón), contador de créditos, botón de auth, menú hamburguesa mobile
- Componente `GameCard` con cover, metadata, badge de mejor puntuación, botón JUGAR, y efecto tilt 3D en hover
- Página Biblioteca (`/`) con hero, buscador, chips de filtros por categoría, grid responsive de juegos
- Página Detalle (`/juego/[id]`) con cover grande, info del juego, stats, leaderboard top 10, botones JUGAR y VOLVER
- Layout base en `app/layout.tsx` con fuentes Google (Press Start 2P, Courier Prime), Nav, y footer
- Estilos completos migrados de templates a `/app/globals.css` (variables CSS, animaciones, efectos CRT, responsive)
- Navegación funcional entre pantallas con Next.js App Router
- Responsive completo (desktop, tablet, mobile) según diseño de templates

**Fuera de scope (specs futuras):**

- Autenticación de usuarios (SPEC 03)
- Reproductor de juegos y sistema de puntuaciones (SPEC 02)
- Salón de la Fama (SPEC 03)
- Backend real / Supabase (spec posterior)
- Integración de juegos HTML5 reales (spec posterior)
- OAuth con Google/GitHub (spec posterior)

---

## Modelo de datos

```typescript
// /lib/types.ts

export type Category = "TODOS" | "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export type GameColor = "cyan" | "magenta" | "yellow" | "green";

export interface Game {
  id: string;
  title: string;
  short: string;        // descripción corta para card
  long: string;         // descripción larga para detalle
  cat: Exclude<Category, "TODOS">;
  cover: string;        // clase CSS para background
  color: GameColor;
  best: number;         // mejor puntuación global
  plays: string;        // ej. "12.4K"
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  date: string;         // formato DD/MM/YYYY
}
```

```typescript
// /lib/data.ts

export const GAMES: Game[] = [ /* 8 juegos del template */ ];

export const CATS: Category[] = ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"];

export function seededScores(seed: number, count: number = 12): LeaderboardEntry[] {
  // Generador determinista de scores para leaderboard
  // Implementación del template
}
```

**Convenciones:**

- IDs de juegos en kebab-case (ej. `"bloque-buster"`)
- Puntuaciones formateadas con `toLocaleString("es-ES")` para separadores de miles
- Covers como clases CSS predefinidas en globals.css (`.cover-bricks`, `.cover-tetro`, etc.)
- Categorías siempre en mayúsculas
- Nombres de jugadores máximo 10 caracteres, uppercase

---

## Plan de implementación

1. Crear `/lib/types.ts` con interfaces `Game`, `LeaderboardEntry` y tipos `Category`, `GameColor`.

2. Crear `/lib/data.ts` con array `GAMES` (8 juegos del template), `CATS`, y función `seededScores()`.

3. Migrar estilos del template a `/app/globals.css`:
   - Variables CSS (colores, fuentes, efectos neon)
   - Clases base (`.pixel`, `.neon-cyan`, `.neon-magenta`, etc.)
   - Estilos de Nav (`.av-nav`, `.logo`, `.links`, `.hamburger`, `.av-mobile-panel`)
   - Estilos de Biblioteca (`.av-hero`, `.av-filters`, `.av-grid`, `.card` con tilt)
   - Estilos de Detalle (`.av-detail`, `.detail-cover`, `.leaderboard`, `.podium`)
   - Animaciones (`.fade-in`, `.flicker`, `.pulse`, `.slide-in`, `.blink`)
   - Clases de covers (`.cover-bricks`, `.cover-tetro`, etc. con gradientes)
   - Media queries para responsive

4. Actualizar `/app/layout.tsx`:
   - Importar fuentes de Google (Press Start 2P, Courier Prime) usando `next/font/google`
   - Aplicar fuentes al body con variables CSS
   - Importar componente Nav (placeholder temporal)
   - Agregar footer con texto del template
   - Verificar: layout se renderiza sin errores

5. Crear `/components/Nav.tsx`:
   - Estructura: logo, links desktop, spacer, contador créditos, botón auth, hamburger
   - Panel mobile con backdrop y animación slide-in
   - Estado local para abrir/cerrar menú mobile
   - Lógica `isActive` para resaltar ruta actual
   - Navegación con `next/link` y función `go()` que cierra mobile al navegar
   - Verificar: Nav responsive funciona en desktop y mobile

6. Crear `/components/GameCard.tsx`:
   - Props: `game: Game`, `onSelect: (game: Game) => void`
   - Cover con clase dinámica, label de categoría
   - Metadata: título, descripción corta, badge de puntuación, botón JUGAR
   - useRef para tilt 3D con `onMouseMove` y `onMouseLeave`
   - onClick en card completo para navegar
   - Verificar: card renderiza correctamente con datos mock

7. Crear `/app/page.tsx` (Biblioteca):
   - Client Component con `'use client'`
   - Estado: `q` (búsqueda), `cat` (categoría)
   - useMemo para filtrar `GAMES` por búsqueda y categoría
   - Sección hero con título "ARCADE VAULT" y subtitle
   - Filtros: input de búsqueda con icono, chips de categorías
   - Grid de GameCard con datos filtrados
   - Mensaje "NO HAY RESULTADOS" cuando array vacío
   - Navegación a detalle con `router.push(\`/juego/${game.id}\`)`
   - Verificar: búsqueda y filtros funcionan, click navega a detalle

8. Crear `/app/juego/[id]/page.tsx` (Detalle):
   - Client Component con `'use client'`
   - Obtener `id` desde `params`
   - useMemo para encontrar juego en `GAMES`
   - useMemo para generar leaderboard con `seededScores(id.length * 17 + 3, 10)`
   - Layout dos columnas: info (cover, tags, título, descripción, stats, botones) + leaderboard (aside)
   - Tags: categoría, "1 JUGADOR", "TECLADO / TÁCTIL", "RETRO 1985"
   - Stat strip: partidas, mejor global (magenta), dificultad (estrellas amarillas)
   - Botones: "JUGAR AHORA" (placeholder, link roto por ahora) y "VOLVER AL VAULT" (navega a `/`)
   - Leaderboard: top 10 con clases especiales para top 3 (`.top1`, `.top2`, `.top3`)
   - Verificar: detalle renderiza correctamente, volver navega a biblioteca

9. Ajustar Nav para recibir prop `route` y resaltar correctamente:
   - Modificar lógica `isActive` para funcionar con App Router
   - Usar `usePathname()` de `next/navigation` para obtener ruta actual
   - Verificar: links de Nav se resaltan correctamente en cada pantalla

10. Prueba de integración completa:
    - Navegar de `/` a `/juego/bloque-buster` y volver
    - Probar búsqueda y filtros en biblioteca
    - Verificar responsive en mobile (menú hamburguesa, grid adapta)
    - Verificar animaciones (fade-in, tilt en cards, flicker en hero)
    - Verificar que no hay errores en consola

---

## Criterios de aceptación

- [ ] Los tipos TypeScript en `/lib/types.ts` compilan sin errores
- [ ] El array `GAMES` en `/lib/data.ts` contiene los 8 juegos del template con todos los campos
- [ ] La función `seededScores()` genera leaderboards deterministas (mismo seed = mismos resultados)
- [ ] Las fuentes "Press Start 2P" y "Courier Prime" cargan correctamente en toda la app
- [ ] El Nav muestra logo, links, contador de créditos y botón de auth en desktop
- [ ] El menú hamburguesa funciona en mobile (abre/cierra panel lateral)
- [ ] Los links del Nav resaltan la ruta actual correctamente
- [ ] La página Biblioteca (`/`) renderiza el hero con título "ARCADE VAULT"
- [ ] El buscador filtra juegos por nombre en tiempo real (case insensitive)
- [ ] Los chips de categorías filtran correctamente (incluyendo "TODOS")
- [ ] El grid muestra 8 GameCards con cover, título, descripción y badge de puntuación
- [ ] El efecto tilt 3D funciona en hover sobre las cards (desktop)
- [ ] Click en una GameCard navega a `/juego/[id]` correctamente
- [ ] La página Detalle muestra cover grande, título, descripción larga y tags
- [ ] El stat strip muestra partidas, mejor global y dificultad con colores correctos
- [ ] El leaderboard muestra top 10 con formato correcto (rank, jugador, score, fecha)
- [ ] Los top 3 del leaderboard tienen estilos especiales (oro, plata, bronce)
- [ ] El botón "VOLVER AL VAULT" navega de vuelta a `/`
- [ ] El footer aparece en todas las páginas con el texto correcto
- [ ] La app es responsive en mobile, tablet y desktop
- [ ] Las animaciones CSS funcionan (fade-in, flicker, pulse, blink)
- [ ] No hay errores en consola del navegador
- [ ] No hay warnings de TypeScript al compilar

---

## Decisiones

- **Sí:** `/components` en raíz del proyecto. Convención estándar Next.js con alias `@/components`.
- **Sí:** Client Components para Nav, Biblioteca y Detalle. Todos requieren estado e interactividad.
- **Sí:** Datos mock en `/lib/data.ts`. Separación clara entre datos y lógica de presentación.
- **Sí:** Tipos explícitos en `/lib/types.ts`. Mejora DX y previene errores en tiempo de compilación.
- **Sí:** Estilos en `/app/globals.css`. Migración directa del template para velocidad. Refactor a módulos CSS o Tailwind utility classes puede venir en spec futura si se requiere.
- **Sí:** Biblioteca en ruta raíz (`/`). Es la pantalla principal y punto de entrada natural.
- **Sí:** Detalle en `/juego/[id]`. Semántico y permite expansión futura (ej. `/juego/[id]/editar`).
- **Sí:** Navegación con `<Link>` y `useRouter()` de `next/navigation`. Estándar de App Router.
- **Sí:** Nav en `layout.tsx`. Persiste entre navegaciones sin re-render.
- **Sí:** Todas las animaciones CSS del template. Son parte de la identidad visual retro-arcade.
- **Sí:** Tilt 3D manual con `onMouseMove`. Implementación ligera, sin dependencias externas.
- **No:** Backend real en esta spec. Se queda en localStorage puro. Backend va en spec posterior cuando se defina arquitectura (Supabase, REST API, etc.).
- **No:** Integración de juegos HTML5 reales. Esta spec solo monta la estructura visual. Integración de iframes/canvas va en SPEC 02.
- **No:** OAuth social. Auth básica + invitado van en SPEC 03.
- **No:** Server Components para estas pantallas. Aunque App Router lo permite, la interactividad requerida (filtros, búsqueda, menú mobile) hace que Client Components sea la elección correcta.

---

## Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Next.js 16.2.9 tiene breaking changes no documentados en training data | Consultar `node_modules/next/dist/docs/` antes de implementar cada feature. Testear `next/font/google` y `usePathname` explícitamente. |
| Fuentes Google pueden fallar en carga o causar FOUT/FOIT | Usar `next/font/google` con `display: 'swap'` y definir fallbacks en CSS (`font-family: 'Press Start 2P', monospace`). |
| Animaciones CSS pueden causar jank en mobile | Usar `transform` y `opacity` (GPU-accelerated). Testear en dispositivos reales. Si hay problemas, simplificar animaciones en media queries mobile. |
| Grid de 8 juegos puede no llenar bien el espacio en ciertas resoluciones | Usar `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` para adaptación fluida. |
| IDs de juegos en URLs pueden chocar si hay caracteres especiales | Los IDs actuales son kebab-case ASCII puro. Si en futuro se agregan juegos con nombres complejos, sanitizar con `encodeURIComponent`. |

---

## Lo que **NO** está en esta spec

- Sistema de autenticación (login, registro, modo invitado) → SPEC 03
- Reproductor de juegos con HUD y controles → SPEC 02
- Persistencia y gestión de puntuaciones → SPEC 02
- Salón de la Fama con podio y rankings → SPEC 03
- Integración de usuario en Nav (mostrar nombre, cerrar sesión) → SPEC 03
- Backend real o API externa → spec posterior
- Juegos HTML5 reales cargados en iframe/canvas → spec posterior
- OAuth con Google/GitHub → spec posterior
- Editor de perfil de usuario → spec posterior
- Sistema de logros o badges → spec posterior

Cada una de estas funcionalidades, si se implementa, va en su propia spec.
