# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

Arcade Vault is a retro arcade game portal web application where users can play classic games online and compete for high scores. The app features a dark arcade cabinet theme with neon aesthetics (cyan #00f5ff, magenta #ff006e, yellow #f5ff00) and retro CRT monitor styling.

**Important**: All UI text, labels, buttons, navigation, messages, and content must be in Spanish.

## Development Workflow: Spec-Driven Design

This project follows **Spec-Driven Design** methodology based on `/spec` and `/spec-impl` patterns:
- Specifications should be written first in a `/spec` directory before implementation
- Implementation follows the spec in `/spec-impl`
- Reference: https://github.com/Klerith/fernando-skills

To add the Fernando skills:
```bash
npx skills@latest add Klerith/fernando-skills
```

## Technology Stack

- **Framework**: Next.js 16.2.9 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS v4
- **Fonts**: Google Fonts - "Press Start 2P" (headings/titles) + "Courier Prime" (body/monospace)

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm start           # Start production server
npm run lint        # Run ESLint
```

## Project Structure

- `/app` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page
  - `globals.css` - Global styles (Tailwind)
- `/public` - Static assets (SVG icons, game assets)
- `/references` - Reference materials and documentation
- `prompt-arcade-vult.md` - Detailed design specification for the arcade portal

## Path Aliases

TypeScript paths are configured with `@/*` mapping to the root directory:
```typescript
import { Something } from '@/components/Something'
```

## Key Features to Implement

1. **Game Library**: Grid of game cards with thumbnails, titles, descriptions, and high scores
2. **Game Player**: CRT monitor-styled container for HTML games with HUD (score, lives, level)
3. **Authentication**: Login/register with guest mode option, social auth (Google, GitHub)
4. **Leaderboards**: Top 10 global scores per game, personal best tracking
5. **Responsive Design**: Mobile-first, works across all devices

## Technical Implementation Notes

- Game area uses sandboxed iframe/canvas for loading external HTML game files
- localStorage for guest score tracking
- Backend integration points planned for REST API or Supabase (authenticated users)
- Animations: CRT glow effects, scanline textures, neon borders, 3D tilt on hover
- Google Fonts must be loaded: "Press Start 2P" and "Courier Prime"

## Design Guidelines

- **Background**: #0a0a0f with pixel/scanline texture overlay, animated perspective grid
- **Typography**: "Press Start 2P" for headings/titles, monospace for UI
- **Effects**: CRT glow on cards, neon borders on hover, pixel-style button press animations
- **Language**: All text must be in Spanish (e.g., "JUGAR", "VOLVER AL VAULT", "PUNTUACIÓN")
- **Interactions**: Card lift + glow on hover, typewriter animations, retro pixel spinner for loading

## Important Next.js Considerations

This project uses Next.js 16.2.9, which may have breaking changes from previous versions. Always consult `node_modules/next/dist/docs/` for current API documentation before implementing features.
