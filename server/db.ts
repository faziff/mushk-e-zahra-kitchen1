import fs from 'fs';
import path from 'path';

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  unit_note: string;
  image: string;
  is_available: boolean;
  featured?: boolean;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit_note?: string;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: number;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  offer_applied?: string;
  payment_method: 'Cash on Delivery';
  status: 'New' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  created_at: string;
  whatsapp_status: 'sent' | 'failed' | 'pending' | 'simulated' | 'disabled';
  whatsapp_error?: string;
}

export interface DatabaseSchema {
  categories: Category[];
  items: MenuItem[];
  orders: Order[];
  next_order_number: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// 6 Categories matching Mushk e Zahra Kitchen Menu Reference
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'signature-kabab',
    name: 'Signature Kabab',
    tagline: 'Per Piece · Sizzling Spiced Kababs',
    icon: 'flame',
    note: 'PER PIECE',
  },
  {
    id: 'desi-handi',
    name: 'Desi Handi',
    tagline: 'Chicken + Egg Plate · Homestyle Gravies',
    icon: 'pot',
    note: 'CHICKEN + EGG PLATE',
  },
  {
    id: 'rice-kitchen',
    name: 'Rice Kitchen',
    tagline: 'Per Plate · Royal Biryanis & Fragrant Rice',
    icon: 'bowl',
    note: 'PER PLATE',
  },
  {
    id: 'frozen-kitchen',
    name: 'Frozen Kitchen',
    tagline: 'Frozen & Fresh · Handcrafted for Quick Feasts',
    icon: 'snowflake',
    note: 'FROZEN & FRESH',
  },
  {
    id: 'burger-crunch',
    name: 'Burger & Crunch Corner',
    tagline: 'Street Style Anda Shami & Crispy Snacks',
    icon: 'sandwich',
    note: 'STREET STYLE & CRUNCH',
  },
  {
    id: 'snack-attack',
    name: 'Snack Attack',
    tagline: '6 Pieces Each · Golden Crisp Fusion Samosas',
    icon: 'sparkles',
    note: '6 PIECES EACH',
  },
];

// All individual food items accurately matching Menu Reference with dedicated local images
const DEFAULT_ITEMS: MenuItem[] = [
  // 1. Signature Kabab
  {
    id: 'shami-kabab',
    category: 'signature-kabab',
    name: 'Shami Kabab',
    description: 'Slow-cooked spiced minced meat and lentil patty, pan-fried to perfection with an egg wash coat.',
    price: 250,
    unit_note: 'Per piece',
    image: '/assets/food/shami-kabab.jpg',
    is_available: true,
    featured: true,
    badge: 'Popular',
  },
  {
    id: 'chapli-kabab',
    category: 'signature-kabab',
    name: 'Chapli Kabab',
    description: 'Traditional Peshawari style spiced minced meat patty with crushed pomegranate seeds, tomatoes, and coriander.',
    price: 160,
    unit_note: 'Per piece',
    image: '/assets/food/chapli-kabab.jpg',
    is_available: true,
    featured: true,
    badge: 'Chef Special',
  },
  {
    id: 'seekh-kabab',
    category: 'signature-kabab',
    name: 'Seekh Kabab',
    description: 'Juicy skewered minced meat seasoned with ginger, garlic, crushed chilies, and aromatic herbs.',
    price: 160,
    unit_note: 'Per piece',
    image: '/assets/food/seekh-kabab.jpg',
    is_available: true,
    featured: true,
  },

  // 2. Desi Handi (Chicken + Egg Plate)
  {
    id: 'mix-choor',
    category: 'desi-handi',
    name: 'Mix Choor',
    description: 'Comforting homestyle chicken and mixed vegetable curry slow-simmered with aromatic desi spices in a clay handi.',
    price: 250,
    unit_note: 'Chicken · Per plate',
    image: '/assets/food/mix-choor.jpg',
    is_available: true,
    featured: true,
    badge: 'Homestyle',
  },
  {
    id: 'anday-keelay',
    category: 'desi-handi',
    name: 'Anday Keelay',
    description: 'Tender chicken and golden boiled eggs simmered in a silky, rich caramelized onion and yogurt Mughlai gravy.',
    price: 350,
    unit_note: 'Chicken + Egg Plate',
    image: '/assets/food/anday-keelay.jpg',
    is_available: true,
    featured: true,
    badge: 'Must Try',
  },
  {
    id: 'achaar-gosht',
    category: 'desi-handi',
    name: 'Achaar Gosht',
    description: 'Tender chicken braised in tangy, zesty pickle masala featuring kalonji, mustard seeds, and spiced slit green chilies.',
    price: 350,
    unit_note: 'Chicken · Per plate',
    image: '/assets/food/achaar-gosht.jpg',
    is_available: true,
    badge: 'Tangy & Spicy',
  },

  // 3. Rice Kitchen (Per Plate)
  {
    id: 'chicken-rice',
    category: 'rice-kitchen',
    name: 'Chicken Rice',
    description: 'Fragrant wok-fried long-grain basmati with egg ribbons, shredded chicken, and tender seasonal vegetables.',
    price: 250,
    unit_note: 'Per plate',
    image: '/assets/food/chicken-rice.jpg',
    is_available: true,
  },
  {
    id: 'chicken-pistasal-biryani',
    category: 'rice-kitchen',
    name: 'Chicken PistasaI Biryani',
    description: 'Signature royal dum biryani infused with crushed green pistachios, saffron milk, and juicy marinated chicken.',
    price: 450,
    unit_note: 'Per plate',
    image: '/assets/food/chicken-pistasal-biryani.jpg',
    is_available: true,
    featured: true,
    badge: 'Chef Special',
  },
  {
    id: 'chicken-bombay-biryani',
    category: 'rice-kitchen',
    name: 'Chicken Bombay Biryani',
    description: 'Zesty and spicy Bombay-style biryani with tender chicken, golden potatoes, dried plums, and kewra essence.',
    price: 450,
    unit_note: 'Per plate',
    image: '/assets/food/chicken-bombay-biryani.jpg',
    is_available: true,
    featured: true,
    badge: 'Bestseller',
  },
  {
    id: 'chicken-shahi-biryani',
    category: 'rice-kitchen',
    name: 'Chicken Shahi Biryani',
    description: 'Mild, aromatic royal Mughal recipe biryani prepared with layered chicken, fried onions, roasted nuts, and whole spices.',
    price: 350,
    unit_note: 'Per plate',
    image: '/assets/food/chicken-shahi-biryani.jpg',
    is_available: true,
    badge: 'Aromatic',
  },
  {
    id: 'chicken-yakhni-pulao',
    category: 'rice-kitchen',
    name: 'Chicken Yakhni Pulao',
    description: 'Mild, fragrant basmati rice cooked in authentic slow-simmered chicken bone broth with fennel and whole roasted spices.',
    price: 350,
    unit_note: 'Per plate',
    image: '/assets/food/chicken-yakhni-pulao.jpg',
    is_available: true,
  },

  // 4. Frozen Kitchen (Frozen & Fresh)
  {
    id: 'frozen-paratha',
    category: 'frozen-kitchen',
    name: 'Frozen Paratha',
    description: 'Ready-to-cook flaky, multi-layered round parathas kneaded with pure ghee. Golden & crispy in 3 minutes.',
    price: 250,
    unit_note: '5 piece pack',
    image: '/assets/food/frozen-paratha.jpg',
    is_available: true,
  },
  {
    id: 'aloo-paratha',
    category: 'frozen-kitchen',
    name: 'Aloo Paratha',
    description: 'Handmade stuffed parathas filled with savory spiced mashed potatoes, fresh herbs, and carom seeds.',
    price: 350,
    unit_note: '5 piece pack',
    image: '/assets/food/aloo-paratha.jpg',
    is_available: true,
  },
  {
    id: 'frozen-shami-kabab',
    category: 'frozen-kitchen',
    name: 'Frozen Shami Kabab',
    description: 'Pre-shaped handmade shami kababs, vacuum-packed fresh. Dip in egg and shallow fry anytime.',
    price: 500,
    unit_note: '5 piece pack',
    image: '/assets/food/frozen-shami-kabab.jpg',
    is_available: true,
    badge: 'Freezer Must-Have',
  },
  {
    id: 'frozen-chapli-kabab',
    category: 'frozen-kitchen',
    name: 'Frozen Chapli Kabab',
    description: 'Peshawari spiced raw seasoned chapli kabab patties ready for a quick pan sear in hot oil.',
    price: 800,
    unit_note: '4 piece pack',
    image: '/assets/food/frozen-chapli-kabab.jpg',
    is_available: true,
  },
  {
    id: 'frozen-chicken-samosa',
    category: 'frozen-kitchen',
    name: 'Frozen Chicken Samosa',
    description: 'Hand-folded triangular pastry shells stuffed with seasoned chicken filling. Deep-fry to golden perfection.',
    price: 350,
    unit_note: '8 piece pack',
    image: '/assets/food/frozen-chicken-samosa.jpg',
    is_available: true,
  },

  // 5. Burger & Crunch Corner
  {
    id: 'beef-anda-shami-burger',
    category: 'burger-crunch',
    name: 'Beef Anda Shami Burger',
    description: 'Toasted sesame bun loaded with spiced beef shami patty, fried egg, crunchy onion slices, and house green chutney.',
    price: 350,
    unit_note: '1 burger',
    image: '/assets/food/beef-anda-shami-burger.jpg',
    is_available: true,
    featured: true,
    badge: 'Popular',
  },
  {
    id: 'anda-shami-burger',
    category: 'burger-crunch',
    name: 'Anda Shami Burger',
    description: 'The authentic Karachi street-food classic: golden egg omelette, spiced shami kabab, ketchup, and tangy mint mayo.',
    price: 350,
    unit_note: '1 burger',
    image: '/assets/food/anda-shami-burger.jpg',
    is_available: true,
  },
  {
    id: 'fresh-fries',
    category: 'burger-crunch',
    name: 'Fresh Fries',
    description: 'Freshly cut, double-fried crispy potato chips dusted with our special tangy kitchen masala.',
    price: 150,
    unit_note: '1 box',
    image: '/assets/food/fresh-fries.jpg',
    is_available: true,
    badge: 'Crispy',
  },
  {
    id: 'crispy-nuggets',
    category: 'burger-crunch',
    name: 'Crispy Nuggets',
    description: 'Crunchy golden-fried minced chicken nuggets with a tender seasoned center, served with garlic dip.',
    price: 250,
    unit_note: '6 pieces',
    image: '/assets/food/crispy-nuggets.jpg',
    is_available: true,
  },
  {
    id: 'chicken-macaroni-half',
    category: 'burger-crunch',
    name: 'Chicken Macaroni Half Plate',
    description: 'Desi-style stir fried elbow macaroni with shredded chicken, bell peppers, tomatoes, and spicy homemade sauce.',
    price: 250,
    unit_note: 'Half Plate',
    image: '/assets/food/chicken-macaroni-half.jpg',
    is_available: true,
  },
  {
    id: 'chicken-macaroni-full',
    category: 'burger-crunch',
    name: 'Chicken Macaroni Full Plate',
    description: 'Hearty full family portion of spicy homemade chicken macaroni cooked with fresh veggies and generous chicken chunks.',
    price: 500,
    unit_note: 'Full Plate',
    image: '/assets/food/chicken-macaroni-full.jpg',
    is_available: true,
    badge: 'Feast Size',
  },

  // 6. Snack Attack (6 piece pack)
  {
    id: 'malai-boti-samosa',
    category: 'snack-attack',
    name: 'Malai Boti Samosa',
    description: 'Ultra-crispy samosa pockets stuffed with creamy, melt-in-the-mouth chicken malai boti filling (6 pcs).',
    price: 200,
    unit_note: '6 piece pack',
    image: '/assets/food/malai-boti-samosa.jpg',
    is_available: true,
    featured: true,
    badge: 'Must Try',
  },
  {
    id: 'pizza-samosa',
    category: 'snack-attack',
    name: 'Pizza Samosa',
    description: 'Fusion samosas filled with gooey melted mozzarella cheese, chicken chunks, Italian herbs, and pizza sauce (6 pcs).',
    price: 250,
    unit_note: '6 piece pack',
    image: '/assets/food/pizza-samosa.jpg',
    is_available: true,
    badge: 'Kids Favorite',
  },
  {
    id: 'mix-vegetable-samosa',
    category: 'snack-attack',
    name: 'Mix Vegetable Samosa',
    description: 'Golden fried crispy pastry stuffed with spiced potatoes, green peas, sweet carrots, and roasted cumin (6 pcs).',
    price: 200,
    unit_note: '6 piece pack',
    image: '/assets/food/mix-vegetable-samosa.jpg',
    is_available: true,
  },
  {
    id: 'mozzart-samosa',
    category: 'snack-attack',
    name: 'Mozzart Samosa',
    description: 'Gourmet samosas filled with rich melted mozzarella cheese and savory Italian herbs (6 pcs).',
    price: 250,
    unit_note: '6 piece pack',
    image: '/assets/food/mozzart-samosa.jpg',
    is_available: true,
    badge: 'Cheesy',
  },
  {
    id: 'chicken-samosa',
    category: 'snack-attack',
    name: 'Chicken Samosa',
    description: 'Authentic desi samosas packed with spiced minced chicken, fresh coriander, green chilies, and onions (6 pcs).',
    price: 300,
    unit_note: '6 piece pack',
    image: '/assets/food/chicken-samosa.jpg',
    is_available: true,
    featured: true,
    badge: 'Popular',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          categories: parsed.categories || DEFAULT_CATEGORIES,
          items: parsed.items && parsed.items.length > 0 ? parsed.items : DEFAULT_ITEMS,
          orders: parsed.orders || [],
          next_order_number: parsed.next_order_number || 1001,
        };
      } catch (err) {
        console.error('Failed to parse database file, initializing with defaults:', err);
      }
    }

    const initial: DatabaseSchema = {
      categories: DEFAULT_CATEGORIES,
      items: DEFAULT_ITEMS,
      orders: [],
      next_order_number: 1001,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Menu
  getMenu(): { categories: Category[]; items: MenuItem[] } {
    return {
      categories: this.data.categories,
      items: this.data.items,
    };
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories;
  }

  // Items
  getItems(): MenuItem[] {
    return this.data.items;
  }

  getItemById(id: string): MenuItem | undefined {
    return this.data.items.find((item) => item.id === id);
  }

  updateItemAvailability(id: string, is_available: boolean): MenuItem | null {
    const item = this.data.items.find((i) => i.id === id);
    if (!item) return null;
    item.is_available = is_available;
    this.saveData(this.data);
    return item;
  }

  updateItemPrice(id: string, price: number): MenuItem | null {
    const item = this.data.items.find((i) => i.id === id);
    if (!item) return null;
    item.price = price;
    this.saveData(this.data);
    return item;
  }

  updateItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const itemIndex = this.data.items.findIndex((i) => i.id === id);
    if (itemIndex === -1) return null;
    this.data.items[itemIndex] = { ...this.data.items[itemIndex], ...updates };
    this.saveData(this.data);
    return this.data.items[itemIndex];
  }

  resetMenuToDefaults(): MenuItem[] {
    this.data.categories = DEFAULT_CATEGORIES;
    this.data.items = DEFAULT_ITEMS;
    this.saveData(this.data);
    return this.data.items;
  }

  // Orders
  getOrders(): Order[] {
    return [...this.data.orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  createOrder(orderData: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
    items: Array<{ id: string; quantity: number }>;
    offer_applied?: string;
  }): { order?: Order; error?: string } {
    if (!orderData.name || !orderData.phone || !orderData.address) {
      return { error: 'Name, phone, and delivery address are required' };
    }
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return { error: 'Cart is empty. Please add items before placing an order.' };
    }

    const resolvedItems: OrderItem[] = [];
    let calculatedTotal = 0;

    for (const rawItem of orderData.items) {
      const dbItem = this.getItemById(rawItem.id);
      if (!dbItem) {
        return { error: `Item with id ${rawItem.id} was not found in the menu.` };
      }
      if (!dbItem.is_available) {
        return { error: `${dbItem.name} is currently out of stock.` };
      }
      const qty = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));
      const lineTotal = dbItem.price * qty;
      calculatedTotal += lineTotal;
      resolvedItems.push({
        id: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: qty,
        unit_note: dbItem.unit_note,
        line_total: lineTotal,
      });
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      order_number: this.data.next_order_number,
      name: orderData.name.trim(),
      phone: orderData.phone.trim(),
      address: orderData.address.trim(),
      notes: orderData.notes ? orderData.notes.trim() : undefined,
      items: resolvedItems,
      total: calculatedTotal,
      offer_applied: orderData.offer_applied,
      payment_method: 'Cash on Delivery',
      status: 'New',
      created_at: new Date().toISOString(),
      whatsapp_status: 'pending',
    };

    this.data.next_order_number += 1;
    this.data.orders.unshift(newOrder);
    this.saveData(this.data);
    return { order: newOrder };
  }

  updateOrderStatus(
    id: string,
    status: Order['status'],
    whatsappUpdate?: { status: Order['whatsapp_status']; error?: string }
  ): Order | null {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    if (whatsappUpdate) {
      order.whatsapp_status = whatsappUpdate.status;
      if (whatsappUpdate.error !== undefined) {
        order.whatsapp_error = whatsappUpdate.error;
      }
    }
    this.saveData(this.data);
    return order;
  }

  updateOrderWhatsAppStatus(
    id: string,
    status: Order['whatsapp_status'],
    error?: string
  ): Order | null {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;
    order.whatsapp_status = status;
    if (error !== undefined) {
      order.whatsapp_error = error;
    }
    this.saveData(this.data);
    return order;
  }

  getStats() {
    const orders = this.data.orders;
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === 'New').length;
    const activeOrders = orders.filter(
      (o) => o.status === 'Confirmed' || o.status === 'Preparing' || o.status === 'Out for Delivery'
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      activeOrders,
      itemCount: this.data.items.length,
    };
  }
}

export const db = new Database();
