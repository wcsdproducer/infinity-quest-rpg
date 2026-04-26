import axios from 'axios';

/**
 * Sends a message to the Telegram owner via the bot.
 * This can be used for build alerts, deployment status, or game events.
 */
export async function notifyOwner(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.TELEGRAM_OWNER_ID;

  if (!token || !ownerId) {
    console.warn('⚠️ Telegram notification skipped: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_OWNER_ID');
    return false;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: ownerId,
      text: message,
      parse_mode: 'Markdown',
    });
    return true;
  } catch (error: any) {
    console.error('❌ Failed to send Telegram notification:', error.response?.data || error.message);
    return false;
  }
}
