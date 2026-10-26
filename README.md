# Mushk e Zahra Kitchen – Homemade Food Ordering Platform

> **Good Food ♥ Happy Hearts · Homemade with Love**
> Fresh · Tasty · Healthy

A complete, production-ready full-stack online food ordering application built specifically for **Mushk e Zahra Kitchen**, featuring authentic branding with the custom logo emblem, live menu database, smooth horizontal food carousels, customer account area, stable checkout form, and automatic WhatsApp order notification dispatch to the kitchen owner (`0321 0009239`).

---

## 🌟 Key Updates & Features

1. **Authentic Logo Emblem (From Reference Image)**:
   - Handcrafted circular emblem matching the reference image (`public/assets/aistudio/858126179_1845911380094833_4645920199700401382_n_4eb8b49a.jpg`).
   - Features the illustrated chef, warm pink/burgundy apron, cooking pot, gold circular frame, and *"Mushk e Zahra Kitchen - Good Food ♥ Happy Hearts"*.
   - Rendered sharply across navbar, mobile bottom navigation, and footer.

2. **Real, Original, Matching Food Photography**:
   - Every single dish matches its authentic preparation with genuine, appetizing food photos (Seekh/Shami/Chapli kababs, Chicken Biryanis, Chinese Fried Rice, Burgers, Handi Curries, Parathas, and Crispy Samosas).
   - High-performance WebP compression, lazy loading, and `ImageWithFallback` with soft burgundy/cream shimmer placeholders.

3. **Rock-Solid, Stable Ordering Form**:
   - Anchored layout that stays perfectly stationary.
   - Mobile `16px` (`text-base`) input sizing prevents annoying iOS/Android automatic zoom jumps.
   - Fixed modal bounds with scroll containment (`overscroll-contain`) and smooth non-aggressive transitions.
   - Pre-fills saved customer profile details from localStorage for 1-click repeat checkout.

4. **Owner WhatsApp Order Notification (`0321 0009239`)**:
   - Owner's notification recipient: `+923210009239`.
   - When orders are placed, the backend securely formats and delivers the notification:
     ```text
     🛎️ NEW ORDER #1028
     ━━━━━━━━━━━━
     👤 Name: Zahra Batool
     📞 Phone: 03210009239
     📍 Address: House 15, Street 2, Rawalpindi

     🧾 ORDER:
     • Chicken Roasted Biryani x2 = Rs. 700
     • Chapli Kabab x3 = Rs. 300
     • Fresh Fries x1 = Rs. 150

     💰 TOTAL: Rs. 1,150
     💵 Payment: Cash on Delivery
     📝 Note: Extra crispy fries please
     🕐 Time: 22 Oct, 11:42 AM
     ```
   - Three switchable backend providers: **Meta WhatsApp Cloud API**, **Twilio WhatsApp**, and **CallMeBot**.

5. **Customer Account Area (Replaced "Admin Access")**:
   - Clean **Account** button (`User` icon) in the header and mobile bottom nav.
   - **Saved Details**: Customers can save their Name, Phone, and Default Address.
   - **Order History**: Shows past orders placed on this device with live tracking status.
   - **Staff Portal**: Discreet entrance for kitchen staff & managers to enter the administrative dashboard.

6. **Smooth Horizontal Food Carousel**:
   - "Today's Fresh Specials" showcase near the top with real menu items.
   - Smooth left-to-right scrolling with desktop arrow buttons and natural mobile touch gestures.
   - Direct item detail view and "+ Add" steppers.

7. **Festive Special Offer & Delivery Time**:
   - "Festive Special: Free Fresh Fries box on orders above Rs. 1,500!" with live cart progress bar.
   - Prominently displays: **"Estimated delivery: 3-4 hours"**.
   - Full-screen celebration Thank You page with order receipt summary.

8. **Professional Redesigned Footer**:
   - Brand logo emblem, restaurant bio, quick menu links, copyright, and direct customer WhatsApp contact (`+92 321 0009239`).

---

## 🛠️ Project Structure

```text
├── data/
│   └── db.json                          # JSON database (categories, items, orders)
├── server/
│   ├── db.ts                            # Atomic database controller & validation
│   └── whatsapp.ts                      # WhatsApp multi-provider dispatcher
├── src/
│   ├── components/
│   │   ├── AccountModal.tsx             # Customer account, saved profile & staff portal
│   │   ├── AdminPanel.tsx               # Kitchen management dashboard (orders & pricing)
│   │   ├── BottomNavBar.tsx             # Floating mobile bottom nav (Home, Menu, Cart, Card, Account)
│   │   ├── BrandLogo.tsx                # Reference image logo emblem component
│   │   ├── CartDrawer.tsx               # Slide-over & bottom-sheet cart
│   │   ├── CategoryNav.tsx              # Horizontal scrollable category chips
│   │   ├── CheckoutModal.tsx            # Stable ordering form with Pakistani validation
│   │   ├── DesktopCartPanel.tsx         # Desktop right sticky cart sidebar
│   │   ├── DesktopCategorySidebar.tsx   # Desktop left sticky category navigation
│   │   ├── FestiveOfferBar.tsx          # Top festive offer bar & combo card
│   │   ├── FoodCard.tsx                 # 2-column food card with compact stepper
│   │   ├── FoodCarousel.tsx             # Smooth horizontal food showcase carousel
│   │   ├── Footer.tsx                   # Professional footer with WhatsApp contact
│   │   ├── Header.tsx                   # Top bar with logo, account, and pill search
│   │   ├── Hero.tsx                     # 24px rounded hero banner carousel
│   │   ├── ImageWithFallback.tsx        # Resilient food photo loader with skeleton
│   │   ├── ItemDetailModal.tsx          # Bottom-sheet dish preview popup
│   │   ├── MenuCardModal.tsx            # Original printed menu card viewer
│   │   ├── OrderSuccessModal.tsx        # Full-screen thank you screen
│   │   ├── PromoStrip.tsx               # Rewards & freshness trust strip
│   │   └── TrustRow.tsx                 # Trust indicators under hero
│   ├── context/
│   │   └── CartContext.tsx              # Persistent cart state
│   ├── App.tsx                          # Main application layout
│   ├── index.css                        # Tailwind CSS configuration
│   └── types.ts                         # Shared TypeScript interfaces
├── netlify.toml                         # Netlify build & redirect rules
├── public/_redirects                    # Netlify SPA routing fallback
├── server.ts                            # Full-stack Express server
└── .env.example
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Netlify

The repository includes `netlify.toml` and `public/_redirects` configured for Netlify:

1. **Connect Repository**: Link your GitHub / GitLab repository in the [Netlify Dashboard](https://app.netlify.com/).
2. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. **Environment Variables** (in Netlify Site Settings > Environment Variables):
   - `OWNER_WHATSAPP_NUMBER`: `+923210009239`
   - `ADMIN_PASSWORD`: `admin123` (or your preferred password)
   - `WHATSAPP_PROVIDER`: `cloudapi` | `twilio` | `callmebot`
   - `CALLMEBOT_APIKEY` or `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID`
4. **Deploy**: Trigger deployment. Netlify will build the production assets into `dist/` and route all SPA traffic seamlessly without 404s.
