/**
 * Firebase Admin SDK singleton for InfinityQuestDevBot
 * Admin access to Firestore + Storage — security rules do NOT apply.
 */

import {
  initializeApp,
  getApps,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";
import * as fsModule from "fs";

let _db: Firestore;
let _storage: Storage;
let _initialized = false;

function initAdmin(): void {
  if (_initialized) return;

  const existing = getApps().find((a) => a.name === "iq-bot-admin");
  let app: App;

  if (existing) {
    app = existing;
  } else {
    const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (saPath) {
      const sa = JSON.parse(fsModule.readFileSync(saPath, "utf-8"));
      app = initializeApp({ credential: cert(sa), projectId: "infinity-quest-rpg" }, "iq-bot-admin");
    } else {
      // Uses Application Default Credentials (gcloud auth application-default login)
      app = initializeApp({ projectId: "infinity-quest-rpg" }, "iq-bot-admin");
    }
  }

  _db = getFirestore(app);
  _storage = getStorage(app);
  _initialized = true;
}

export function getAdminFirestore(): Firestore {
  initAdmin();
  return _db;
}

export function getAdminStorage(): Storage {
  initAdmin();
  return _storage;
}
