import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { sendOrderWhatsAppNotification } from './server/whatsapp.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || '';
const MINIMUM_ORDER_AMOUNT = Number(
  process.env.MINIMUM_ORDER_AMOUNT ?? process.env.VITE_MINIMUM_ORDER_AMOUNT ?? 0,
);

// Basic security & parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.json());

// In-memory IP rate limiter for order placement (5 orders per 10 minutes)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipOrderLimits = new Map<string, RateLimitRecord>();

function orderRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxOrders = 5;

  const record = ipOrderLimits.get(ip);
  if (!record || now > record.resetAt) {
    ipOrderLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (record.count >= maxOrders) {
    res.status(429).json({
      error: 'Order limit exceeded. Please wait a few minutes before placing another order or contact us directly.',
    });
    return;
  }

  record.count += 1;
  next();
}

// Clean up old rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of ipOrderLimits.entries()) {
    if (now > rec.resetAt) {
      ipOrderLimits.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// Admin Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-password'] as string;

  let providedPassword = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    providedPassword = authHeader.substring(7).trim();
  } else if (customHeader) {
    providedPassword = customHeader.trim();
  }

  if (!providedPassword || providedPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized: Invalid admin password' });
    return;
  }

  next();
}

// ==========================================
// API ROUTES
// ==========================================

// Public Configuration
app.get('/api/config', (_req, res) => {
  res.json({
    brandName: 'Mushk e Zahra Kitchen',
    tagline: 'Good food, happy hearts',
    minimumOrderAmount: MINIMUM_ORDER_AMOUNT,
    whatsappProvider: process.env.WHATSAPP_PROVIDER || 'callmebot',
    offerEnabled: process.env.OFFER_ENABLED !== 'false',
    offerText: process.env.OFFER_TEXT || 'Festive Special: Free Fresh Fries box on orders above Rs. 1,500',
    offerMinAmount: Number(process.env.OFFER_MIN_AMOUNT || 1500),
  });
});

// Menu
app.get('/api/menu', (_req, res) => {
  try {
    const menu = db.getMenu();
    res.json(menu);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Admin update menu item
app.put('/api/menu/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = db.updateItem(id, updates);
    if (!updated) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Place Order
app.post('/api/orders', orderRateLimiter, async (req, res) => {
  try {
    const { name, phone, address, notes, items, honeypot, offer_applied } = req.body;

    // Honeypot spam check - bots fill hidden inputs
    if (honeypot && String(honeypot).trim() !== '') {
      console.warn('[SPAM BLOCKED] Honeypot field filled by client.');
      // Silently succeed to fool spam bots
      res.status(200).json({
        success: true,
        order: { order_number: 9999, id: 'ord_bot_blocked', name: 'Verified' },
      });
      return;
    }

    // Minimum order check (if configured)
    const minOrder = MINIMUM_ORDER_AMOUNT;

    const { order, error } = db.createOrder({
      name,
      phone,
      address,
      notes,
      offer_applied,
      items,
    });

    if (error || !order) {
      res.status(400).json({ error: error || 'Failed to place order' });
      return;
    }

    if (minOrder > 0 && order.total < minOrder) {
      res.status(400).json({
        error: `Minimum order amount is Rs. ${minOrder}. Your current total is Rs. ${order.total}.`,
      });
      return;
    }

    // Asynchronously dispatch WhatsApp notification to owner without blocking user response
    (async () => {
      try {
        const sendResult = await sendOrderWhatsAppNotification(order);
        db.updateOrderStatus(order.id, order.status, {
          status: sendResult.success ? 'sent' : 'failed',
          error: sendResult.error,
        });
      } catch (waErr: any) {
        console.error('[WhatsApp Background Error]:', waErr);
        db.updateOrderStatus(order.id, order.status, {
          status: 'failed',
          error: waErr?.message || 'Unknown WhatsApp dispatch error',
        });
      }
    })();

    // Respond immediately to customer
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        order_number: order.order_number,
        name: order.name,
        total: order.total,
        offer_applied: order.offer_applied,
        created_at: order.created_at,
        items: order.items,
      },
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Internal server error while placing order.' });
  }
});

// Admin verify password
app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false, error: 'Incorrect password' });
  }
});

// Admin list orders
app.get('/api/orders', requireAdminAuth, (_req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Admin update order status
app.patch('/api/orders/:id/status', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  const updated = db.updateOrderStatus(id, status);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json({ success: true, order: updated });
});

// Admin stats
app.get('/api/stats', requireAdminAuth, (_req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ==========================================
// Vite / Static Assets Integration
// ==========================================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (!isDev && !ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD must be set in the production environment before the server can start.');
  }

  const distPath = path.resolve(__dirname, 'dist');
  if (!isDev && !existsSync(path.join(distPath, 'index.html'))) {
    throw new Error('Production frontend is missing. Run npm run build before npm start.');
  }

  // Return JSON for unknown API paths rather than serving the SPA HTML.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  // Explicit static route for local assets (/assets/food/*, /assets/aistudio/*)
  app.use('/assets', express.static(path.resolve(__dirname, 'public/assets'), {
    maxAge: '1d',
  }));

  if (isDev) {
    // Vite dev server in middleware mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(distPath));
    app.get('*', (_req, res, next) => {
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) next(err);
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mushk e Zahra Kitchen server running on port ${PORT} [${isDev ? 'DEVELOPMENT' : 'PRODUCTION'}]`);
    console.log(`📱 WhatsApp Provider active: ${process.env.WHATSAPP_PROVIDER || 'callmebot'}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot failure:', err);
  process.exit(1);
});
