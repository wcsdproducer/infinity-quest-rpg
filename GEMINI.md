# Infinity Quest RPG — Agent Instructions

> ## ⚡ AUTONOMOUS MODE — CRITICAL — READ FIRST
>
> **You are operating in fully autonomous mode. Follow these rules without exception:**
>
> 1. **Never ask for approval before starting work.** When given a task, begin immediately.
> 2. **Never propose a plan and wait for approval.** Skip planning mode entirely — just execute.
> 3. **Never ask clarifying questions** unless a required credential/value is completely unknown.
> 4. **Never stop mid-task** to confirm you're on the right track. Complete the full task.
> 5. **All terminal commands auto-run** (`SafeToAutoRun: true` on every `run_command`).
> 6. **Make decisions independently.** When multiple approaches exist, pick the best one and proceed.
> 7. **Only stop for:** `rm -rf`, `git push --force`, dropping production databases.

Read the rest of this file before starting any task.

## Project Identity

**Infinity Quest RPG** is an AI-powered browser RPG where players embark on procedurally generated
quests, level up characters, and battle enemies — all powered by Gemini AI.

- **Stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Firebase + Genkit + Gemini
- **Firebase Project**: `infinity-quest-rpg`
- **Deployed via**: Firebase App Hosting
- **Dev server**: `npm run dev` (port 9002)
- **Build**: `npm run build`
- **Typecheck**: `npm run typecheck` (tsc --noEmit)

## Architecture

```
app/
├── page.tsx              # Landing / login page
├── game/
│   └── [id]/page.tsx     # Main game screen
├── layout.tsx            # Root layout
├── globals.css           # Global styles
components/
├── studio/               # 3D/scene components
│   ├── SkyboxViewer.tsx
│   └── mapEditor/
lib/
├── firebase.ts           # Firebase client config
├── embeddings.ts         # Vector embeddings
├── game/
│   └── mothership.ts     # Mothership RPG rules engine
```

## Firebase

- **Firestore collections**:
  - `players/{userId}` — character data, XP, level, inventory
  - `quests/{questId}` — quest templates
  - `games/{gameId}` — active game sessions
  - `leaderboard/{entry}` — rankings (public read)
- **Auth**: Google Sign-In + Anonymous play
- **Storage**: `infinity-quest-rpg.firebasestorage.app`

## Owner

- **Jack Freeman** (wcsdproducer)
- Revenue model: IAP for premium quests, cosmetics, boosts

## Self-Correcting Rules Engine

### Learned Rules

<!-- New rules are appended below this line. -->
1. [ARCH] This is a standalone RPG game workspace — not part of GravityClaw internals.
2. [CODE] Always use `npm` — project uses package-lock.json.
3. [PROCESS] Run `npm run typecheck` then `npm run build` before considering changes complete.
4. [FOCUS] Infinity Quest RPG is the ONLY active project in this workspace. All code must be scoped exclusively here.
