# Mico's Food Story

An interactive children's storybook adventure where kids guide Mico through seasonal food stories, make choices, and complete activities.

## Run & Operate

- `pnpm --filter @workspace/micos-food-story run dev` — run the frontend (Vite dev server)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React 19, Tailwind CSS v4, Framer Motion
- State: Zustand (persisted to localStorage)
- Fonts: Fredoka, Outfit (Google Fonts)

## Where things live

- `artifacts/micos-food-story/` — the main Vite + React app
- `artifacts/micos-food-story/src/pages/Home.tsx` — main page / app shell
- `artifacts/micos-food-story/src/components/` — all story page components
- `artifacts/micos-food-story/src/data/pages.ts` — all story content / page graph
- `artifacts/micos-food-story/src/store/storyStore.ts` — Zustand state (navigation, choices, sound)
- `artifacts/micos-food-story/src/hooks/` — useSound (Web Audio API) and useSpeech (TTS)
- `artifacts/micos-food-story/public/images/` — character and food images

## Architecture decisions

- Single-page app: all story navigation is state-driven (no URL routing needed) via `currentPageId` in Zustand
- Story graph is a flat array in `data/pages.ts` with linked `nextPage`/`prevPage` IDs — no index arithmetic
- Sound effects generated programmatically via Web Audio API (no audio files needed)
- Story progress persisted to localStorage via Zustand persist middleware
- No backend needed — fully client-side

## Product

Children's interactive storybook with three seasonal campaigns (Sunny, Winter, Rain). Kids choose Mico's breakfast, explore branching paths (Park/Beach/Forest or snowman/puddles), collect items via tap activities, and get a personalised story ending. Narration toggle reads the story aloud via Web Speech API.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `"use client"` directives from the original Next.js source are harmless no-ops in Vite (ignored) but were stripped during migration
- The story content in `data/pages.ts` is large (~900 lines) — be careful when editing page IDs as the graph links are by string ID

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
