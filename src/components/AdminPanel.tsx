import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  RefreshCw,
  Clock,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Save,
  Send,
  Eye,
  LogOut,
} from 'lucide-react';
import { Order, MenuItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onMenuUpdated,
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('mzk_admin_auth') === 'true';
  });
  const [adminToken, setAdminToken] = useState(() => {
    return sessionStorage.getItem('mzk_admin_token') || '';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'stats'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Edit item state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editAvailable, setEditAvailable] = useState<boolean>(true);
  const [isSavingItem, setIsSavingItem] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.error || 'Invalid admin password');
      }

      setIsAuthenticated(true);
      setAdminToken(password);
      sessionStorage.setItem('mzk_admin_auth', 'true');
      sessionStorage.setItem('mzk_admin_token', password);
      loadData(password);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    sessionStorage.removeItem('mzk_admin_auth');
    sessionStorage.removeItem('mzk_admin_token');
  };

  const loadData = async (tokenOverride?: string) => {
    const token = tokenOverride || adminToken;
    if (!token) return;

    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Orders
      const ordersRes = await fetch('/api/orders', { headers });
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }

      // Fetch Menu
      const menuRes = await fetch('/api/menu');
      if (menuRes.ok) {
        const data = await menuRes.json();
        setMenuItems(data.items || []);
      }

      // Fetch Stats
      const statsRes = await fetch('/api/stats', { headers });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const startEditItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditPrice(item.price);
    setEditAvailable(item.is_available);
  };

  const saveEditItem = async (itemId: string) => {
    setIsSavingItem(true);
    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          price: editPrice,
          is_available: editAvailable,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMenuItems((prev) =>
          prev.map((i) => (i.id === itemId ? data.item : i))
        );
        setEditingItemId(null);
        onMenuUpdated();
      }
    } catch (err) {
      console.error('Failed to save item edit:', err);
    } finally {
      setIsSavingItem(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs transition-opacity duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-[#FAF4E8] rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[95vh] flex flex-col border border-[#EBDCC8] animate-in zoom-in-95 duration-200">
        {/* Top Bar */}
        <div className="p-4 sm:p-5 bg-[#7A1030] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <Lock className="w-5 h-5 text-[#C8A15A]" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                Kitchen Owner Dashboard
              </h2>
              <div className="text-xs text-[#EADAC5]">
                Mushk e Zahra Kitchen — Orders & Menu Control
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => loadData()}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Login Screen (if not authenticated) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#7A1030]/10 text-[#7A1030] flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Admin Authentication
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter the admin password configured in your hosting environment.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1030]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#7A1030] hover:bg-[#600C25] text-white font-semibold rounded-xl text-sm transition-all shadow-xs"
              >
                {isLoading ? 'Verifying...' : 'Unlock Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#EBDCC8] bg-white px-4 sm:px-6 gap-2 pt-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#FAF4E8] text-[#7A1030] border-t-2 border-[#7A1030]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === 'menu'
                    ? 'bg-[#FAF4E8] text-[#7A1030] border-t-2 border-[#7A1030]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Menu Pricing & Stock ({menuItems.length})
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-[#FAF4E8] text-[#7A1030] border-t-2 border-[#7A1030]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Kitchen Analytics
              </button>
            </div>

            {/* Tab 1: Orders */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-sm">
                    No orders placed yet. New incoming orders will appear here in real time.
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EBDCC8] shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#7A1030]">
                            Order #{order.order_number}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(order.created_at).toLocaleString('en-PK', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                        {/* WhatsApp dispatch status */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                              order.whatsapp_status === 'sent'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.whatsapp_status === 'simulated'
                                ? 'bg-blue-100 text-blue-800'
                                : order.whatsapp_status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                            title={order.whatsapp_error || 'WhatsApp notification status'}
                          >
                            <Send className="w-3 h-3" />
                            <span>WA: {order.whatsapp_status}</span>
                          </span>

                          {/* Order Status Select */}
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A1030]"
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 bg-[#FAF4E8] p-3 rounded-xl">
                        <div>
                          <span className="text-stone-400">Customer:</span>{' '}
                          <span className="font-bold">{order.name}</span> ({order.phone})
                        </div>
                        <div>
                          <span className="text-stone-400">Address:</span>{' '}
                          <span>{order.address}</span>
                        </div>
                        {order.notes && (
                          <div className="sm:col-span-2 text-[#7A1030] font-medium">
                            <span className="text-stone-400">Instructions:</span> "{order.notes}"
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="text-xs space-y-1">
                        <div className="text-stone-500 font-semibold">Items Ordered:</div>
                        <div className="space-y-1">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="flex justify-between text-stone-800">
                              <span>
                                • {i.name} <span className="text-stone-500 font-medium">× {i.quantity}</span>
                              </span>
                              <span className="font-semibold">Rs. {i.line_total.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.offer_applied && (
                        <div className="text-xs bg-emerald-50 text-emerald-800 p-2 rounded-xl font-semibold flex items-center justify-between">
                          <span>🎁 Offer Applied:</span>
                          <span>{order.offer_applied}</span>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2 border-t border-stone-100 font-serif font-bold text-[#7A1030]">
                        <span>Grand Total (COD)</span>
                        <span className="text-base sm:text-lg">Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Menu Editing */}
            {activeTab === 'menu' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  💡 Edit prices or toggle items Out-of-Stock instantly. Changes persist in the backend database.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {menuItems.map((item) => {
                    const isEditing = editingItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-4 border border-[#EBDCC8] shadow-xs flex items-center justify-between gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-sm text-[#2D2424] truncate">
                            {item.name}
                          </h4>
                          <div className="text-[11px] text-stone-500">
                            {item.unit_note || item.category}
                          </div>

                          {isEditing ? (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-bold text-[#7A1030]">Rs.</span>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-20 px-2 py-1 text-xs border border-stone-300 rounded-lg"
                              />
                              <label className="flex items-center gap-1 text-xs text-stone-600">
                                <input
                                  type="checkbox"
                                  checked={editAvailable}
                                  onChange={(e) => setEditAvailable(e.target.checked)}
                                />
                                Available
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-serif font-bold text-sm text-[#7A1030]">
                                Rs. {item.price}
                              </span>
                              {!item.is_available && (
                                <span className="bg-stone-200 text-stone-600 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Edit Buttons */}
                        <div>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => saveEditItem(item.id)}
                                disabled={isSavingItem}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditItem(item)}
                              className="p-1.5 text-stone-400 hover:text-[#7A1030] hover:bg-stone-100 rounded-lg transition-colors"
                              title="Edit Price & Availability"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Analytics */}
            {activeTab === 'stats' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#EBDCC8] shadow-xs">
                    <div className="text-xs text-stone-400 font-semibold uppercase">Total Orders</div>
                    <div className="font-serif text-2xl font-bold text-[#7A1030] mt-1">
                      {stats?.totalOrders || orders.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#EBDCC8] shadow-xs">
                    <div className="text-xs text-stone-400 font-semibold uppercase">Today's Orders</div>
                    <div className="font-serif text-2xl font-bold text-[#7A1030] mt-1">
                      {stats?.todayOrdersCount || 0}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#EBDCC8] shadow-xs">
                    <div className="text-xs text-stone-400 font-semibold uppercase">Total Revenue</div>
                    <div className="font-serif text-2xl font-bold text-emerald-700 mt-1">
                      Rs. {(stats?.revenueTotal || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#EBDCC8] shadow-xs">
                    <div className="text-xs text-stone-400 font-semibold uppercase">Pending Orders</div>
                    <div className="font-serif text-2xl font-bold text-amber-600 mt-1">
                      {stats?.pendingOrders || 0}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EBDCC8] space-y-3">
                  <h4 className="font-serif font-bold text-base text-stone-800">
                    WhatsApp Multi-Provider Integration Status
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Whenever a customer submits an order, the server automatically formats and delivers the notification to the owner's WhatsApp number without requiring the customer to open WhatsApp.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-[#FAF4E8] border border-[#EBDCC8]">
                      <div className="font-bold text-[#7A1030]">1. Meta Cloud API</div>
                      <div className="text-stone-500 mt-0.5">Official WhatsApp Business Cloud API</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF4E8] border border-[#EBDCC8]">
                      <div className="font-bold text-[#7A1030]">2. Twilio WhatsApp</div>
                      <div className="text-stone-500 mt-0.5">Twilio programmable messages</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF4E8] border border-[#EBDCC8]">
                      <div className="font-bold text-[#7A1030]">3. CallMeBot API</div>
                      <div className="text-stone-500 mt-0.5">Free lightweight WhatsApp gateway</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
