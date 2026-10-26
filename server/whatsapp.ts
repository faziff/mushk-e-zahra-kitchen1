import { Order } from './db.js';

export interface WhatsAppSendResult {
  success: boolean;
  provider: string;
  error?: string;
  attempts: number;
}

/**
 * Format order into clean, easy-to-read WhatsApp message template
 */
export function formatOrderWhatsAppMessage(order: Order): string {
  const dateObj = new Date(order.created_at);
  const timeFormatted = dateObj.toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const itemsList = order.items
    .map((item) => `• ${item.name} x${item.quantity} = Rs. ${item.line_total.toLocaleString()}`)
    .join('\n');

  const offerLine = order.offer_applied ? `\n🎁 Offer: ${order.offer_applied}` : '';
  const noteLine = order.notes ? `\n📝 Note: ${order.notes}` : '';

  return (
    `🛎️ NEW ORDER #${order.order_number}\n` +
    `━━━━━━━━━━━━\n` +
    `👤 Name: ${order.name}\n` +
    `📞 Phone: ${order.phone}\n` +
    `📍 Address: ${order.address}\n\n` +
    `🧾 ORDER:\n` +
    `${itemsList}\n` +
    `${offerLine}\n\n` +
    `💰 TOTAL: Rs. ${order.total.toLocaleString()}\n` +
    `💵 Payment: ${order.payment_method}` +
    `${noteLine}\n` +
    `🕐 Time: ${timeFormatted}`
  );
}

/**
 * Clean phone number to E.164 without plus or special chars for APIs
 */
function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('03')) {
    // Pakistani local format 03xx -> 923xx
    cleaned = '92' + cleaned.substring(1);
  }
  return cleaned.replace('+', '');
}

/**
 * Send WhatsApp notification using Meta Cloud API
 */
async function sendViaMetaCloud(message: string, recipient: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error('Meta WhatsApp Cloud API requires WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID.');
  }

  const cleanRecipient = cleanPhoneNumber(recipient);
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanRecipient,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Meta Cloud API HTTP ${response.status}: ${errorBody}`);
  }
}

/**
 * Send WhatsApp notification using Twilio WhatsApp API
 */
async function sendViaTwilio(message: string, recipient: string): Promise<void> {
  const sid = process.env.TWILIO_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM || 'whatsapp:+14155238886';

  if (!sid || !token) {
    throw new Error('Twilio requires TWILIO_SID and TWILIO_AUTH_TOKEN.');
  }

  const cleanRecipient = cleanPhoneNumber(recipient);
  const to = `whatsapp:+${cleanRecipient}`;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;

  const params = new URLSearchParams();
  params.append('From', from.startsWith('whatsapp:') ? from : `whatsapp:${from}`);
  params.append('To', to);
  params.append('Body', message);

  const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Twilio HTTP ${response.status}: ${errorBody}`);
  }
}

/**
 * Send WhatsApp notification using CallMeBot Free API
 */
async function sendViaCallMeBot(message: string, recipient: string): Promise<void> {
  const apiKey = process.env.CALLMEBOT_APIKEY;

  if (!apiKey) {
    throw new Error('CallMeBot requires CALLMEBOT_APIKEY.');
  }

  const cleanRecipient = cleanPhoneNumber(recipient);
  const encodedText = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=+${cleanRecipient}&text=${encodedText}&apikey=${apiKey}`;

  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`CallMeBot HTTP ${response.status}: ${errorBody}`);
  }
}

/**
 * Primary dispatch function with automatic retry logic (up to 3 times)
 */
export async function sendOrderWhatsAppNotification(order: Order): Promise<WhatsAppSendResult> {
  const provider = (process.env.WHATSAPP_PROVIDER || 'callmebot').toLowerCase();
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER || '+923210009239';
  const message = formatOrderWhatsAppMessage(order);

  // If set to log or if credentials are unconfigured dummy values, simulate & log cleanly
  const hasMeta = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
  const hasTwilio = Boolean(process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN);
  const hasCallMeBot = Boolean(process.env.CALLMEBOT_APIKEY && process.env.CALLMEBOT_APIKEY !== 'your_callmebot_api_key');

  const shouldSimulate =
    provider === 'log' ||
    (provider === 'cloudapi' && !hasMeta) ||
    (provider === 'twilio' && !hasTwilio) ||
    (provider === 'callmebot' && !hasCallMeBot);

  if (shouldSimulate) {
    console.log('\n==================================================');
    console.log(`[WHATSAPP NOTIFICATION - SIMULATED (${provider.toUpperCase()})]`);
    console.log(`To Owner: ${ownerNumber}`);
    console.log('--------------------------------------------------');
    console.log(message);
    console.log('==================================================\n');
    return {
      success: true,
      provider: `${provider} (simulated/log mode - configure keys in .env to send live)`,
      attempts: 1,
    };
  }

  let lastError: Error | null = null;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[WhatsApp] Dispatching order #${order.order_number} via ${provider} (Attempt ${attempt}/${maxRetries})...`);

      if (provider === 'cloudapi') {
        await sendViaMetaCloud(message, ownerNumber);
      } else if (provider === 'twilio') {
        await sendViaTwilio(message, ownerNumber);
      } else if (provider === 'callmebot') {
        await sendViaCallMeBot(message, ownerNumber);
      } else {
        throw new Error(`Unknown WHATSAPP_PROVIDER: "${provider}". Expected "cloudapi", "twilio", or "callmebot".`);
      }

      console.log(`[WhatsApp] Successfully notified owner for order #${order.order_number} on attempt ${attempt}.`);
      return {
        success: true,
        provider,
        attempts: attempt,
      };
    } catch (err: any) {
      lastError = err;
      console.error(`[WhatsApp] Attempt ${attempt} failed:`, err?.message || err);

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  return {
    success: false,
    provider,
    error: lastError?.message || 'Failed after 3 attempts',
    attempts: maxRetries,
  };
}
