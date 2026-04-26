/**
 * Telegram Notification Utility
 * Used to send messages to the owner/user via the Infinity Quest Dev Bot.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_ID = process.env.TELEGRAM_OWNER_ID;

export async function sendTelegramNotification(text: string, parseMode: 'Markdown' | 'HTML' = 'Markdown') {
  if (!BOT_TOKEN || !OWNER_ID) {
    console.warn('[Telegram] Missing BOT_TOKEN or OWNER_ID. Notification skipped:', text);
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: OWNER_ID,
        text,
        parse_mode: parseMode,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('[Telegram] Failed to send message:', data.description);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Telegram] Error sending message:', error);
    return false;
  }
}
