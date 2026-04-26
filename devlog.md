# Infinity Quest RPG — Dev Log

> This file is read by InfinityQuestDevBot on every startup.
> Keep it updated with current status, blockers, and decisions.
> The bot's memory system stores deeper context — this is the "today's briefing."

---

## Project Overview
- **Name**: Infinity Quest RPG
- **Type**: Browser-based sci-fi RPG (Mothership-inspired)
- **Stack**: Next.js 15 + TypeScript + Firebase (Firestore + Storage + App Hosting) + Genkit + Gemini
- **Firebase Project**: `infinity-quest-rpg`
- **GitHub Repo**: `wcsdproducer/infinity-quest-rpg`
- **Live URL**: https://infinityquestrpg.com
- **App Hosting**: `infinity-quest--infinity-quest-rpg.us-central1.hosted.app`
- **Local Dev**: `npm run dev` (port 9002)

## Key Directories
- `src/app/` — Next.js App Router pages
- `src/components/` — UI (game engine, combat, character sheets, map)
- `src/ai/flows/` — Genkit flows (continue-adventure, generate-npc, summarize-session, etc.)
- `src/ai/tools/` — Genkit tools (queryLocation, queryLore)
- `src/lib/` — Firebase config, game utilities
- `public/` — Static assets, fallback images
- `bot/` — Telegram dev bot (InfinityQuestDevBot)

## Firebase Collections
- `players/{userId}` — Character data, XP, level, inventory, game state
- `games/{gameId}` — Active game sessions
- `campaigns/{campaignId}` — Campaign modules (e.g. `apof` = A Pound of Flesh)
- `campaigns/apof/locations` — Location graph for A Pound of Flesh
- `locations/{locationId}` — Map nodes, room data, media catalog
- `media/{mediaId}` — Image/video asset catalog
- `iq_bot_memories` — Bot persistent memory (Firestore-synced)

## Active Campaign: A Pound of Flesh
- Campaign ID: `apof`
- Setting: Space station noir/horror (Mothership RPG)
- Location graph stored in Firestore under `campaigns/apof/locations`
- Media assets in Firebase Storage under `locations/` prefix

## Current Status
- App deployed to Firebase App Hosting
- Telegram bot (InfinityQuestDevBot) running via PM2 (ID: 9)
- Bot uses Genkit agentic loop — executes tools autonomously

## Recent Work
- 2026-04-26: Bot upgraded to Genkit ai.generate() loop with maxTurns: 50
- 2026-04-26: Embedding model updated to gemini-embedding-001
- 2026-04-26: **Full local machine access granted to bot**
  - `execute_command` now accepts optional `cwd` param; defaults to `/Volumes/SAMSUNG 500gb/Antigravity` (not just IQ RPG workspace)
  - All file tools (`read_file`, `write_file`, `patch_file`, `list_directory`) support absolute paths anywhere on the machine
  - Shell changed to `/bin/zsh` for full PATH/alias support
  - `list_directory` defaults to Antigravity root when no path given
  - `soul.md` updated to document multi-project access (GravityClaw, Second Act, PropFlipPro, etc.)
  - Bot restarted via PM2 (ID: 9) — typecheck: clean
- 2026-04-26: **PDF Reader MCP added to Antigravity**
  - Package: `@sylphx/pdf-reader-mcp` (high-performance, parallel processing)
  - Supports local file paths and remote URLs
  - Added to `/Users/johnfreeman/.gemini/antigravity/mcp_config.json` — enabled by default
  - Pre-cached via npx for fast startup

## Known Issues / Blockers
- None currently logged

## Key Decisions
- Mothership RPG ruleset (mostly faithful, some adaptations for browser play)
- Gemini 2.5 Flash as primary GM model
- Firebase Admin SDK for all backend data ops (bypasses security rules)
- PM2 (ID: 9) keeps bot alive across sessions
