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

export interface CartItem {
  item: MenuItem;
  quantity: number;
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

export interface StoreConfig {
  brandName: string;
  tagline: string;
  minimumOrderAmount: number;
  whatsappProvider: string;
  offerEnabled?: boolean;
  offerText?: string;
  offerMinAmount?: number;
}
