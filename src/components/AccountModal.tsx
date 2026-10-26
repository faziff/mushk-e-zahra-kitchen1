import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShoppingBag,
  Save,
  CheckCircle2,
  Lock,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

interface CustomerProfile {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

interface LocalOrderHistoryItem {
  id: string;
  order_number: number;
  date: string;
  total: number;
  items_summary: string;
  status: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKitchenStaff: () => void;
}

const PROFILE_KEY = 'mzk_customer_profile';
const ORDER_HISTORY_KEY = 'mzk_customer_orders_history';

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenKitchenStaff,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'staff'>('profile');
  const [profile, setProfile] = useState<CustomerProfile>({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [ordersHistory, setOrdersHistory] = useState<LocalOrderHistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const storedProfile = localStorage.getItem(PROFILE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
        const storedOrders = localStorage.getItem(ORDER_HISTORY_KEY);
        if (storedOrders) {
          setOrdersHistory(JSON.parse(storedOrders));
        }
      } catch (e) {
        console.error('Error reading account details from localStorage:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  const handleClearData = () => {
    if (confirm('Clear your saved address and details from this device?')) {
      localStorage.removeItem(PROFILE_KEY);
      setProfile({ name: '', phone: '', address: '', notes: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#FAF4E8] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col border border-[#EBDCC8] animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EBDCC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7A1030]/10 flex items-center justify-center text-[#7A1030]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#7A1030]">
                Customer Account
              </h2>
              <p className="text-xs text-stone-500">
                Manage your saved delivery details and orders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Tabs */}
        <div className="flex border-b border-[#EBDCC8] bg-white px-4 pt-1 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#7A1030] text-[#7A1030]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Saved Details
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#7A1030] text-[#7A1030]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Order History ({ordersHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ml-auto cursor-pointer ${
              activeTab === 'staff'
                ? 'border-[#7A1030] text-[#7A1030]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Staff Portal
          </button>
        </div>

        {/* Tab 1: Saved Profile & Address */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {savedSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your profile & delivery address have been saved for quick checkout!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7A1030]" />
                <span>Your Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ali Khan"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1030]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#7A1030]" />
                <span>Mobile Phone (Pakistani format)</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 0300 1234567"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1030]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7A1030]" />
                <span>Default Delivery Address</span>
              </label>
              <textarea
                rows={3}
                placeholder="House/Apartment #, Street, Sector or Landmark..."
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0D2C0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1030] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#7A1030] hover:bg-[#600C25] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Delivery Details</span>
              </button>

              {(profile.name || profile.phone || profile.address) && (
                <button
                  type="button"
                  onClick={handleClearData}
                  className="p-3 text-stone-400 hover:text-red-600 bg-white border border-[#E0D2C0] rounded-xl text-xs transition-colors cursor-pointer"
                  title="Clear saved data"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        )}

        {/* Tab 2: Customer Order History */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
            {ordersHistory.length === 0 ? (
              <div className="text-center py-12 text-stone-500 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 stroke-1" />
                <h4 className="font-bold text-sm text-stone-700">No past orders yet</h4>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Orders submitted from this device will automatically appear here with their tracking details.
                </p>
              </div>
            ) : (
              ordersHistory.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-4 border border-[#EBDCC8] shadow-xs space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#7A1030]">
                      Order #{ord.order_number}
                    </span>
                    <span className="bg-[#FAF4E8] text-[#7A1030] px-2 py-0.5 rounded-full font-semibold text-[10px]">
                      {ord.status || 'Received'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {ord.items_summary}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                    <span className="text-stone-400 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{ord.date}</span>
                    </span>
                    <span className="font-bold text-[#7A1030]">
                      Rs. {ord.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Staff Portal */}
        {activeTab === 'staff' && (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-[#7A1030]/10 text-[#7A1030] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Kitchen Staff & Owner Portal
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Authorized access for kitchen staff to manage incoming orders, update dish statuses, and edit menu pricing.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenKitchenStaff();
              }}
              className="py-3 px-6 bg-[#7A1030] hover:bg-[#600C25] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#C8A15A]" />
              <span>Enter Staff Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
