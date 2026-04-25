
'use server';

/**
 * @fileOverview Cross-session memory utilities for Infinity Quest RPG.
 *
 * Layers:
 *   1. Message Log  — games/{id}/messages  — full chat history per game
 *   2. Game State   — games/{id}/state/current — session counter, quest flags
 *   3. Session Summaries — games/{id}/sessions — end-of-session Gemini recaps
 *   4. Episodic Memory — games/{id}/memories — embedded GM narratives for recall
 */

import { ai } from '@/ai/genkit';
import { initializeServerFirebase } from '@/firebase/server-init';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import type {
  PersistedMessage,
  GameState,
  EpisodicMemory,
  SessionSummary,
} from '@/lib/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-10);
}

// ── Layer 0: Game State ───────────────────────────────────────────────────────

/**
 * Reads the game state doc.  On every call we start a fresh session
 * (increment the counter + new UUID) so each page load = one session.
 */
export async function getOrCreateGameState(gameId: string): Promise<GameState> {
  const { firestore } = initializeServerFirebase();
  const stateRef = doc(firestore, 'games', gameId, 'state', 'current');
  const snap = await getDoc(stateRef);

  const newSessionId = crypto.randomUUID();

  if (snap.exists()) {
    const data = snap.data() as GameState;
    const updated: GameState = {
      ...data,
      sessionId: newSessionId,
      sessionCount: (data.sessionCount ?? 0) + 1,
      lastPlayedAt: Date.now(),
    };
    await setDoc(stateRef, updated);
    return updated;
  }

  const initial: GameState = {
    sessionId: newSessionId,
    sessionCount: 1,
    lastPlayedAt: Date.now(),
    questFlags: {},
  };
  await setDoc(stateRef, initial);
  return initial;
}

// ── Layer 1: Message Log ──────────────────────────────────────────────────────

/** Persist a single message to Firestore (fire-and-forget safe). */
export async function saveMessage(
  gameId: string,
  sessionId: string,
  message: Omit<PersistedMessage, 'sessionId'>
): Promise<void> {
  try {
    const { firestore } = initializeServerFirebase();
    // Destructure out `id` — Firestore assigns its own auto-ID for the document;
    // storing id as a data field causes it to overwrite d.id on reads.
    const { id: _id, ...messageData } = message;
    await addDoc(collection(firestore, 'games', gameId, 'messages'), {
      ...messageData,
      sessionId,
    });
  } catch (e) {
    console.warn('[Memory] saveMessage failed:', e);
  }
}

/**
 * Load the most recent `count` messages for a game, in chronological order.
 * Call this on page load to restore the chat log.
 */
export async function loadRecentMessages(
  gameId: string,
  count = 100
): Promise<PersistedMessage[]> {
  const { firestore } = initializeServerFirebase();
  const messagesRef = collection(firestore, 'games', gameId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ ...(d.data() as Omit<PersistedMessage, 'id'>), id: d.id }))
    .reverse(); // chronological
}

// ── Layer 2: Session Summaries ────────────────────────────────────────────────

/** Fetch the most recent session summary for a game (previous session). */
export async function getLatestSessionSummary(
  gameId: string
): Promise<SessionSummary | null> {
  const { firestore } = initializeServerFirebase();
  const sessionsRef = collection(firestore, 'games', gameId, 'sessions');
  const q = query(sessionsRef, orderBy('sessionNumber', 'desc'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return {
    id: snap.docs[0].id,
    ...(snap.docs[0].data() as Omit<SessionSummary, 'id'>),
  };
}

/**
 * Summarize a session using Gemini Flash and persist it.
 * Called from the "Save & Quit" handler.
 */
export async function summarizeAndSaveSession(
  gameId: string,
  sessionId: string,
  sessionNumber: number,
  messages: Pick<PersistedMessage, 'sender' | 'text' | 'timestamp'>[]
): Promise<void> {
  if (messages.length < 2) return; // nothing to summarize

  try {
    const { firestore } = initializeServerFirebase();

    const log = messages
      .map((m) => `${m.sender === 'player' ? 'PLAYER' : 'WARDEN'}: ${m.text}`)
      .join('\n')
      .slice(0, 10_000); // cap at 10k chars

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are summarizing a Mothership RPG session for future reference. Be concise and factual.

Write a 3-5 sentence prose summary and extract the 3-7 most important events as short bullet points.

Session log:
${log}

Respond with ONLY valid JSON in this exact format:
{"summary":"...","keyEvents":["...","..."]}`,
    });

    // Safely parse the JSON response
    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;
    const parsed = JSON.parse(jsonMatch[0]) as {
      summary: string;
      keyEvents: string[];
    };

    const summary: Omit<SessionSummary, 'id'> = {
      sessionId,
      sessionNumber,
      startedAt: messages[0]?.timestamp ?? Date.now(),
      endedAt: Date.now(),
      summary: parsed.summary ?? '',
      keyEvents: parsed.keyEvents ?? [],
    };

    await addDoc(collection(firestore, 'games', gameId, 'sessions'), summary);
  } catch (e) {
    console.warn('[Memory] summarizeAndSaveSession failed:', e);
  }
}

// ── Layer 3: Episodic Memory ──────────────────────────────────────────────────

/**
 * Embed a piece of text (typically a GM narrative) and store it as a memory.
 * Non-blocking — call without await.
 */
export async function embedAndSaveMemory(
  gameId: string,
  sessionId: string,
  content: string,
  context?: {
    characterIds?: string[];
    locationId?: string;
    importance?: EpisodicMemory['importance'];
  }
): Promise<void> {
  try {
    const { firestore } = initializeServerFirebase();

    const embeddings = await ai.embed({
      embedder: 'googleai/text-embedding-004',
      content,
    });
    const embedding = embeddings[0]?.embedding ?? [];

    const memory: Omit<EpisodicMemory, 'id'> = {
      content,
      embedding,
      importance: context?.importance ?? 'medium',
      characterIds: context?.characterIds ?? [],
      locationId: context?.locationId,
      sessionId,
      tags: [],
      timestamp: Date.now(),
    };

    await addDoc(collection(firestore, 'games', gameId, 'memories'), memory);
  } catch (e) {
    console.warn('[Memory] embedAndSaveMemory failed:', e);
  }
}

/**
 * Retrieve the top-K most semantically relevant memories for a given query.
 * Uses cosine similarity — O(n) over all memories, fine at game scale.
 */
export async function retrieveRelevantMemories(
  gameId: string,
  queryText: string,
  topK = 5
): Promise<EpisodicMemory[]> {
  try {
    const { firestore } = initializeServerFirebase();

    const embeddings = await ai.embed({
      embedder: 'googleai/text-embedding-004',
      content: queryText,
    });
    const queryVector = embeddings[0]?.embedding ?? [];
    if (queryVector.length === 0) return [];

    const snap = await getDocs(
      collection(firestore, 'games', gameId, 'memories')
    );
    if (snap.empty) return [];

    const scored = snap.docs.map((d) => {
      const data = { id: d.id, ...(d.data() as Omit<EpisodicMemory, 'id'>) };
      const score = cosineSimilarity(queryVector, data.embedding);
      return { data, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map((s) => s.data);
  } catch (e) {
    console.warn('[Memory] retrieveRelevantMemories failed:', e);
    return [];
  }
}
