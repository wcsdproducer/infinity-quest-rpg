import "dotenv/config";
import { createDevBot } from "./devBotFramework.js";

(async () => {
  const bot = await createDevBot({
    token: process.env.TELEGRAM_BOT_TOKEN!,
    ownerId: parseInt(process.env.TELEGRAM_OWNER_ID!, 10),
    workspaceRoot:
      process.env.WORKSPACE_ROOT ||
      "/Volumes/SAMSUNG 500gb/Antigravity/Infinity Quest RPG",
    workspaceName: "Infinity Quest RPG",
    firebaseProjectId: "infinity-quest-rpg",
  });

  console.log("🎮 Infinity Quest RPG Dev Bot starting...");

  // Clear any stale webhook before starting
  try {
    await bot.api.deleteWebhook({ drop_pending_updates: true });
    console.log("🧹 Cleared stale webhook");
  } catch (err: any) {
    console.warn("⚠️ Could not clear webhook:", err.message);
  }

  // Retry loop: waits for any previous polling session to expire
  const maxRetries = 8;
  const baseDelayMs = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await bot.start({
        onStart: () => console.log("✅ @InfinityQuestDevBot is running"),
        drop_pending_updates: true,
      });
      return;
    } catch (err: any) {
      const is409 =
        err?.error_code === 409 || err?.message?.includes("409");
      if (is409 && attempt < maxRetries) {
        const delay = baseDelayMs * attempt;
        console.warn(
          `⚠️ 409 conflict (attempt ${attempt}/${maxRetries}). Waiting ${delay / 1000}s...`
        );
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
})().catch((err) => {
  console.error("❌ Bot failed after retries:", err.message || err);
  process.exit(1);
});
