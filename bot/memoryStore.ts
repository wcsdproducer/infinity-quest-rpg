/**
 * InfinityQuestDevBot — Full Memory Store
 *
 * Matches GravityClaw's memory architecture:
 *   1. SQLite (local) — FTS5 keyword search + Gemini semantic embeddings (cosine similarity)
 *   2. Settings table — key/value store for core_profile and preferences
 *   3. Conversation history — persists context across bot restarts, with rolling summary
 *   4. Firestore (cloud) — cross-session sync for memories and settings
 */

import Database from "better-sqlite3";
import * as path from "path";
import * as fs from "fs";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface Memory {
  id: number;
  content: string;
  category: string;
  created_at: string;
  source?: string;
  score?: number;
}

export interface MemoryStore {
  // Core memory
  store(content: string, category?: string): number;
  search(query: string): Promise<Memory[]>;
  list(limit?: number): Memory[];
  forget(id: number): boolean;
  count(): number;

  // Settings / core profile
  setSetting(key: string, value: string): void;
  getSetting(key: string): string | null;
  getCoreProfile(): string | null;
  setCoreProfile(profile: string): void;

  // Conversation history
  loadHistory(userId: string | number): any[];
  saveHistory(userId: string | number, history: any[]): void;
  saveHistoryAndSummary(userId: string | number, history: any[], summary: string): void;
  loadSummary(userId: string | number): string;
  clearHistory(userId: string | number): void;

  // Cloud sync
  syncToFirestore(): Promise<void>;

  close(): void;
}

// ──────────────────────────────────────────────
// Vector utilities
// ──────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0, mA = 0, mB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    mA += a[i] * a[i];
    mB += b[i] * b[i];
  }
  const denom = Math.sqrt(mA) * Math.sqrt(mB);
  return denom === 0 ? 0 : dot / denom;
}

function vectorToBuffer(vector: number[]): Buffer {
  return Buffer.from(new Float32Array(vector).buffer);
}

function bufferToVector(buffer: Buffer): number[] {
  return Array.from(new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4));
}

// ──────────────────────────────────────────────
// Gemini Embedding
// ──────────────────────────────────────────────

async function embedText(text: string): Promise<number[] | null> {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!response.ok) {
      console.error("Embedding API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.embedding?.values ?? null;
  } catch (e: any) {
    console.error("Embedding failed:", e.message);
    return null;
  }
}

// ──────────────────────────────────────────────
// Firestore Cloud Sync (lazy-loaded)
// ──────────────────────────────────────────────

let firestoreAdmin: any = null;

async function getFirestore() {
  if (firestoreAdmin) return firestoreAdmin;
  try {
    const admin = await import("firebase-admin");
    if (!admin.default.apps.length) {
      admin.default.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "infinity-quest-rpg",
      });
    }
    firestoreAdmin = admin.default.firestore();
    return firestoreAdmin;
  } catch (e: any) {
    console.error("Firestore init failed (memory will be local-only):", e.message);
    return null;
  }
}

// ──────────────────────────────────────────────
// Memory Store Factory
// ──────────────────────────────────────────────

export function createMemoryStore(workspaceRoot: string): MemoryStore {
  const dbDir = path.join(workspaceRoot, ".data");
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const dbPath = path.join(dbDir, "memory.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  // ── Schema ──────────────────────────────────

  // Long-term memories
  db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Gemini vector embeddings
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_embeddings (
      memory_id INTEGER PRIMARY KEY REFERENCES memories(id) ON DELETE CASCADE,
      embedding BLOB NOT NULL
    );
  `);

  // FTS5 full-text search index
  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
      content,
      content='memories',
      content_rowid='id'
    );
  `);

  // FTS sync triggers
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
      INSERT INTO memories_fts(rowid, content) VALUES (new.id, new.content);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content) VALUES('delete', old.id, old.content);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content) VALUES('delete', old.id, old.content);
      INSERT INTO memories_fts(rowid, content) VALUES (new.id, new.content);
    END;
  `);

  // Key/value settings (core_profile, preferences)
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Conversation history with rolling summary (matches GravityClaw)
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversation_history (
      user_id TEXT NOT NULL,
      history_json TEXT NOT NULL,
      summary TEXT DEFAULT '',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id)
    );
  `);

  // ── Store ────────────────────────────────────

  return {
    // ── Memories ──────────────────────────────

    store(content: string, category = "general"): number {
      // Special prefix: [CORE_PROFILE] → saves to settings table instead
      if (content.startsWith("[CORE_PROFILE]")) {
        const actualContent = content.replace("[CORE_PROFILE]", "").trim();
        db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('core_profile', ?)").run(actualContent);
        // Also sync to Firestore async
        getFirestore().then((fs) => {
          if (!fs) return;
          fs.collection("iq_bot_settings").doc("core_profile").set({
            value: actualContent,
            updatedAt: new Date(),
          }).catch(console.error);
        });
        return -1;
      }

      const result = db.prepare("INSERT INTO memories (content, category) VALUES (?, ?)").run(content, category);
      const memoryId = result.lastInsertRowid as number;

      // Async: generate embedding + sync to Firestore
      embedText(content).then(async (embedding) => {
        if (embedding) {
          try {
            db.prepare("INSERT OR REPLACE INTO memory_embeddings (memory_id, embedding) VALUES (?, ?)").run(
              memoryId,
              vectorToBuffer(embedding)
            );
          } catch { /* DB may be closed */ }
        }

        // Firestore sync
        const fsDb = await getFirestore();
        if (fsDb) {
          fsDb.collection("iq_bot_memories").doc(String(memoryId)).set({
            content,
            category,
            createdAt: new Date(),
          }).catch(console.error);
        }
      });

      return memoryId;
    },

    async search(query: string): Promise<Memory[]> {
      const seenIds = new Set<number>();
      const results: Memory[] = [];

      // 1. FTS keyword search
      try {
        const escaped = `"${query.replace(/"/g, '""')}"`;
        const ftsResults = db.prepare(`
          SELECT m.id, m.content, m.category, m.created_at, 'keyword' as source
          FROM memories_fts f
          JOIN memories m ON f.rowid = m.id
          WHERE memories_fts MATCH ?
          ORDER BY rank
          LIMIT 10
        `).all(escaped) as Memory[];

        for (const r of ftsResults) {
          if (!seenIds.has(r.id)) {
            seenIds.add(r.id);
            results.push(r);
          }
        }
      } catch { /* special chars in FTS */ }

      // 2. Semantic cosine similarity search
      try {
        const queryEmbedding = await embedText(query);
        if (queryEmbedding) {
          const allEmbeddings = db.prepare(
            "SELECT memory_id, embedding FROM memory_embeddings"
          ).all() as { memory_id: number; embedding: Buffer }[];

          const scored = allEmbeddings
            .map((row) => ({
              memory_id: row.memory_id,
              similarity: cosineSimilarity(queryEmbedding, bufferToVector(row.embedding)),
            }))
            .filter((m) => m.similarity > 0.5)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10);

          if (scored.length > 0) {
            const placeholders = scored.map(() => "?").join(",");
            const semanticRows = db.prepare(`
              SELECT id, content, category, created_at, 'semantic' as source
              FROM memories
              WHERE id IN (${placeholders})
            `).all(...scored.map((m) => m.memory_id)) as Memory[];

            for (const r of semanticRows) {
              if (!seenIds.has(r.id)) {
                const score = scored.find((m) => m.memory_id === r.id)?.similarity;
                seenIds.add(r.id);
                results.push({ ...r, score });
              }
            }
          }
        }
      } catch (e: any) {
        console.error("Semantic search error:", e.message);
      }

      // 3. Fallback: LIKE search if nothing found
      if (results.length === 0) {
        try {
          const likeRows = db.prepare(`
            SELECT id, content, category, created_at, 'like' as source
            FROM memories
            WHERE content LIKE ?
            ORDER BY created_at DESC
            LIMIT 10
          `).all(`%${query}%`) as Memory[];

          for (const r of likeRows) {
            if (!seenIds.has(r.id)) {
              seenIds.add(r.id);
              results.push(r);
            }
          }
        } catch { /* ignore */ }
      }

      return results;
    },

    list(limit = 20): Memory[] {
      return db.prepare(
        "SELECT id, content, category, created_at FROM memories ORDER BY created_at DESC LIMIT ?"
      ).all(limit) as Memory[];
    },

    forget(id: number): boolean {
      return (db.prepare("DELETE FROM memories WHERE id = ?").run(id).changes > 0);
    },

    count(): number {
      return (db.prepare("SELECT COUNT(*) as count FROM memories").get() as any).count;
    },

    // ── Settings ──────────────────────────────

    setSetting(key: string, value: string): void {
      db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    },

    getSetting(key: string): string | null {
      const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as any;
      return row?.value ?? null;
    },

    getCoreProfile(): string | null {
      return (db.prepare("SELECT value FROM settings WHERE key = 'core_profile'").get() as any)?.value ?? null;
    },

    setCoreProfile(profile: string): void {
      db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('core_profile', ?)").run(profile);
      getFirestore().then((fs) => {
        if (!fs) return;
        fs.collection("iq_bot_settings").doc("core_profile").set({
          value: profile,
          updatedAt: new Date(),
        }).catch(console.error);
      });
    },

    // ── Conversation History ──────────────────

    loadHistory(userId: string | number): any[] {
      const row = db.prepare("SELECT history_json FROM conversation_history WHERE user_id = ?")
        .get(userId.toString()) as any;
      if (!row) return [];
      try { return JSON.parse(row.history_json); } catch { return []; }
    },

    saveHistory(userId: string | number, history: any[]): void {
      db.prepare(`
        INSERT INTO conversation_history (user_id, history_json, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          history_json = excluded.history_json,
          updated_at = excluded.updated_at
      `).run(userId.toString(), JSON.stringify(history));
    },

    saveHistoryAndSummary(userId: string | number, history: any[], summary: string): void {
      db.prepare(`
        INSERT INTO conversation_history (user_id, history_json, summary, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          history_json = excluded.history_json,
          summary = excluded.summary,
          updated_at = excluded.updated_at
      `).run(userId.toString(), JSON.stringify(history), summary);
    },

    loadSummary(userId: string | number): string {
      const row = db.prepare("SELECT summary FROM conversation_history WHERE user_id = ?")
        .get(userId.toString()) as any;
      return row?.summary || "";
    },

    clearHistory(userId: string | number): void {
      db.prepare("DELETE FROM conversation_history WHERE user_id = ?").run(userId.toString());
    },

    // ── Firestore Full Sync ───────────────────

    async syncToFirestore(): Promise<void> {
      const fsDb = await getFirestore();
      if (!fsDb) {
        console.warn("Firestore unavailable — skipping sync");
        return;
      }

      const memories = db.prepare("SELECT * FROM memories ORDER BY created_at DESC LIMIT 500").all() as Memory[];
      const batch = fsDb.batch();

      for (const m of memories) {
        const ref = fsDb.collection("iq_bot_memories").doc(String(m.id));
        batch.set(ref, {
          content: m.content,
          category: m.category,
          createdAt: new Date(m.created_at),
        }, { merge: true });
      }

      const profile = (db.prepare("SELECT value FROM settings WHERE key = 'core_profile'").get() as any)?.value;
      if (profile) {
        batch.set(
          fsDb.collection("iq_bot_settings").doc("core_profile"),
          { value: profile, updatedAt: new Date() },
          { merge: true }
        );
      }

      await batch.commit();
      console.log(`✅ Synced ${memories.length} memories to Firestore`);
    },

    close(): void {
      db.close();
    },
  };
}
