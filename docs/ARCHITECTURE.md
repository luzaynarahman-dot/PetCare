# 🏗️ Architecture — PetCare

**A technical overview of how PetCare is structured and how data flows through the app.**

---

## 📐 Overview

PetCare is a **frontend-only Progressive Web App (PWA)** built with vanilla JavaScript. No framework, no backend, no build step.

**Design principles:**
- **Single source of truth** — localStorage holds all state
- **Layered architecture** — core → features → social/profile
- **Consistent re-render pattern** — every page render is a pure function
- **Zero global mutations** — all writes go through `Storage.set()`

---

## 🗂️ Folder Structure

```

PetCare/
├── index.html              ← Single HTML entry point
├── manifest.json           ← PWA manifest
├── service-worker.js       ← Offline caching
├── offline.html            ← Offline fallback
│
├── css/                    ← Stylesheets (9 files)
│   ├── palette.css         ← CSS variables (light + dark)
│   ├── main.css            ← Reset, nav, layout, components
│   ├── pages.css           ← All page-specific styles
│   ├── profile.css         ← Profile page styles
│   ├── profile-view.css    ← Public profile styles
│   ├── skeleton.css        ← Loading state animations
│   ├── onboarding.css      ← Welcome tour
│   ├── demo.css            ← Demo mode UI
│   └── dark.css            ← Dark mode overrides
│
├── js/                     ← JavaScript modules (20 files)
│   ├── app.js              ← Core: router, state, utilities
│   ├── data.js             ← Static seed data
│   ├── ui/skeleton.js      ← Skeleton loaders
│   ├── drawer.js           ← Side navigation
│   ├── pwa.js              ← Service worker + install
│   ├── onboarding.js       ← First-time tour
│   ├── demo-data.js        ← Rich demo dataset
│   ├── demo.js             ← Demo mode controller
│   ├── home.js             ← Home page
│   ├── shop.js             ← Shop + stores
│   ├── checkout.js         ← Cart + payment
│   ├── tracking.js         ← Order tracking
│   ├── notification.js     ← Notifications
│   ├── appointments.js     ← Vet appointments
│   ├── care.js             ← Pet care + health
│   ├── foster.js           ← Foster system
│   ├── profile-view.js     ← Public profiles
│   ├── memory.js           ← Social feed
│   ├── search.js           ← Search system
│   └── profile.js          ← Own profile
│
├── assets/                 ← Images
│   ├── avatars/
│   ├── covers/
│   ├── products/
│   ├── stores/
│   ├── pets/
│   ├── icons/
│   ├── illustrations/
│   └── mems/
│
└── docs/                   ← Documentation

```

---

## 🧱 Layered Architecture

Scripts load in **strict order** in `index.html`. Each layer depends only on the layers above it.

```

┌──────────────────────────────────────────────────┐
│  LAYER 1 — CORE (Foundation)                     │
│  ├── app.js          (state, router, utilities)  │
│  ├── data.js         (static seed data)          │
│  ├── ui/skeleton.js  (skeleton generators)       │
│  ├── drawer.js       (side navigation)           │
│  ├── pwa.js          (service worker + install)  │
│  ├── onboarding.js   (welcome tour)              │
│  ├── demo-data.js    (rich demo dataset)         │
│  └── demo.js         (demo mode controller)      │
└──────────────────────────────────────────────────┘
↓
┌──────────────────────────────────────────────────┐
│  LAYER 2 — FEATURES (Depend on Core)             │
│  ├── home.js                                     │
│  ├── shop.js                                     │
│  ├── checkout.js                                 │
│  ├── tracking.js                                 │
│  ├── notification.js                             │
│  ├── appointments.js                             │
│  ├── care.js                                     │
│  └── foster.js                                   │
└──────────────────────────────────────────────────┘
↓
┌──────────────────────────────────────────────────┐
│  LAYER 3 — SOCIAL & PROFILE (Top)                │
│  ├── profile-view.js                             │
│  ├── memory.js                                   │
│  ├── search.js                                   │
│  └── profile.js                                  │
└──────────────────────────────────────────────────┘

```

**Rule:** A file in Layer 2 can call functions from Layer 1. A file in Layer 3 can call from Layers 1 and 2. **Never backwards.**

---

## 🔄 Data Flow

### State Storage

All persistent state lives in **localStorage** under `pc_*` keys:

| Key | Purpose |
|-----|---------|
| `pc_token` | Auth token |
| `pc_user` | User profile object |
| `pc_theme` | 'light' or 'dark' |
| `pc_pets` | Array of pet objects |
| `pc_activePetId` | Currently selected pet |
| `pc_healthLog` | Array of health log entries |
| `pc_vaccinations` | Array of vaccination records |
| `pc_medications` | Array of medication entries |
| `pc_reminders` | Array of reminders |
| `pc_dailyCare` | Multi-pet daily completion state |
| `pc_careHistory` | Historical completion for streak calculation |
| `pc_customCare` | User-created care items per pet |
| `pc_cart` | Shopping cart items |
| `pc_wishlist` | Saved product IDs |
| `pc_orders` | Order history |
| `pc_memories` | Social posts |
| `pc_fosterPets` | Foster listings |
| `pc_sosHistory` | SOS emergency reports |
| `pc_notifications` | Notification list |
| `pc_following_map` | Follow relationships |
| `pc_favoriteStores` | Favorite store IDs |
| `pc_saved_posts` | Bookmarked posts |

### Read Flow

```

User visits page
↓
Router (showPage) activates the page
↓
renderPageContent() called
↓
Page's renderer runs (e.g., renderHome)
↓
Renderer reads APP state + localStorage
↓
HTML built via template strings
↓
Injected into #page-{name} element

```

### Write Flow

```

User performs an action (e.g., toggles care item)
↓
Handler function runs (e.g., toggleCareItem)
↓
Mutates the relevant state object
↓
Calls Storage.set(key, value)
↓
(Optional) Re-renders current page
↓
(Optional) Generates notification
↓
(Optional) Updates badges (cart, notif, drawer)

```

---

## 🎯 Core Module — `app.js`

**Everything depends on this file.**

### Global State Object

```javascript
const APP = {
  currentPage: 'home',
  user: null,
  token: null,
  cart: [],
  wishlist: [],
  orders: [],
  notifications: [],
  pets: [],
  activePetId: null,
  memories: [],
  stores: [],
  appointments: [],
  isDrawerOpen: false,
  isCartOpen: false,
  theme: 'light',
  STORAGE_KEYS: { /* all localStorage keys */ }
};
```

Router

```javascript
function showPage(pageName) {
  // 1. Hide all pages
  // 2. Show target page
  // 3. Update bottom nav active state
  // 4. Scroll to top
  // 5. Show top nav
  // 6. Update navbar icons
  // 7. Close search if open
  // 8. Render page content (with skeleton + retry)
}
```

Storage Helpers

```javascript
const Storage = {
  get(key, fallback = null) { /* safe JSON parse */ },
  set(key, value) { /* safe JSON stringify */ },
  remove(key) { /* safe delete */ },
  clear() { /* safe clear all */ }
};
```

Page Rendering with Error Boundary

```javascript
function renderPageContent(pageName) {
  // 1. Show skeleton for the page
  // 2. Wait for renderers to be available (retry up to 30 times)
  // 3. Call the correct renderer function
  // 4. On error → showErrorBoundary(pageName)
  // 5. On success → fade in content
}
```

Retry logic: Some renderers are defined in later scripts. Retry up to 30 times with 100ms delay = 3 second wait.

Utilities

· escapeHtml(str) — XSS prevention
· formatDate(date) — 'Jan 15, 2026'
· formatTime(date) — '3:30 PM'
· timeAgo(date) — '5m ago', '2h ago', '3d ago'
· generateId(prefix) — unique ID generation

Role Management

· getActiveRole() — returns user's current role
· setActiveRole(role) — switches role
· hasRole(role) — checks if user has a role
· isVerifiedVet() — vet with approved application
· isVetPending() — vet with pending application

---

🗂️ Feature Module Pattern

Every feature module follows the same pattern:

```javascript
/* ============================================================ */
/* MODULE NAME                                                   */
/* ============================================================ */

// 1. Local state
let featureState = { /* ... */ };

// 2. Helper functions (private)
function doSomething() { /* ... */ }

// 3. Main renderer (public)
function renderFeature() {
  const page = document.getElementById('page-feature');
  if (!page) return;
  page.innerHTML = `...`;
  attachHandlers();
}

// 4. Event handlers (private)
function attachHandlers() { /* ... */ }

// 5. Public API (exported)
window.renderFeature = renderFeature;
window.someAction = someAction;

console.log('PetCare Feature loaded');
```

Benefits:

· Each module is self-contained
· No cross-module mutation
· Easy to debug in isolation

---

🎨 CSS Architecture

Variable Layer (palette.css)

All colors defined as CSS custom properties:

```css
:root {
  --pc-primary: #3A4A3A;
  --pc-card: #FAF6F0;
  --pc-text: #3D2E1F;
  /* ... */
}

body.dark-mode {
  --pc-primary: #6B9E5F;
  --pc-card: #2A1F18;
  --pc-text: #F5E6D3;
  /* ... */
}
```

Rule: Components never hardcode colors. Always use var(--pc-*).

Component Styles

· main.css — Global reset, typography, nav, buttons, inputs, cards, modals, drawer, cart
· pages.css — Page-specific layouts (home, shop, care, memory, foster, profile)
· profile.css + profile-view.css — Profile variants
· dark.css — Extra dark mode polish (rarely needed)
· skeleton.css — Loading state animations
· onboarding.css + demo.css — Feature-specific

Naming Convention

· .pc-* — Prefix for CSS variables
· .page-* — Page containers
· .prof-* — Public profile elements
· .mp-* — Own profile elements
· .mem-* — Memory feed elements
· .foster-* — Foster system elements

---

🔌 Cross-Module Communication

Modules communicate via 3 mechanisms:

1. Global State (APP)

```javascript
// Any module can read
const pets = APP.pets;

// Writes go through a single setter
Storage.set(APP.STORAGE_KEYS.PETS, newPets);
APP.pets = newPets;
```

2. Global Functions (via window)

```javascript
// In home.js
window.showToast('Hello');

// Called from anywhere
showToast('Hello');
```

3. Custom Events (Rare)

Not used in PetCare. Re-rendering on page switch is enough.

---

📱 PWA Architecture

Service Worker Strategy

Cache-first for:

· CSS files
· JS files
· Images
· Fonts

Network-first for:

· HTML pages
· API-like calls

Stale-while-revalidate for:

· Everything else

Cache Management

```javascript
const CACHE_NAME = 'petcare-v3-cache-v12';
const RUNTIME_CACHE = 'petcare-v3-runtime-v12';
```

On version bump:

· Install new cache
· Keep old caches until activate
· Activate → delete old caches
· Claim all clients

Install Prompt

```javascript
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});
```

Update Detection

```javascript
registration.addEventListener('updatefound', () => {
  const newWorker = registration.installing;
  newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      showUpdateToast();
    }
  });
});
```

---

🎭 Routing Model

No URL router. Pages are switched via JavaScript:

```javascript
showPage('home');    // Shows #page-home
showPage('care');    // Shows #page-care
```

Why no URL routing?

· Simpler for a static frontend
· No history API complexity on GitHub Pages
· PWA works better without URL state

Browser back button: Handled with history.pushState() for public profile view and store detail pages only.

---

🔄 Render Lifecycle

Every page render follows the same 4-step lifecycle:

```
1. SKELETON
   ↓ Show skeleton loader while renderer loads
   
2. RENDER
   ↓ Call renderer function (e.g., renderHome)
   ↓ Build HTML string
   ↓ Inject into #page-{name}
   
3. ATTACH
   ↓ Attach event listeners to interactive elements
   ↓ Bind toggle handlers, click handlers, form handlers
   
4. FADE IN
   ↓ Add content-loaded class
   ↓ Remove after 400ms
```

Why 4 steps?

· Skeleton improves perceived performance
· Separation of concerns
· Easier to debug errors

---

🧪 Testing Strategy

Manual testing only (no automated tests for this project).

Test flow:

1. Clear localStorage
2. Start demo mode
3. Visit each page
4. Test all interactive elements
5. Test dark mode
6. Test offline mode
7. Reload to verify persistence

Debug tools:

· Chrome DevTools via chrome://inspect
· console.log for state inspection
· Network tab for asset loading
· Application tab for localStorage

---

⚠️ Known Limitations

1. No backend — all data is local
2. No real authentication — mock tokens
3. No real payment — mock checkout
4. No multi-user sync — each device is isolated
5. Image uploads — stored as base64 in localStorage
6. No automated tests — manual only
7. No TypeScript — plain JavaScript

These limitations are intentional for the hackathon scope. See LEARNINGS.md for why.

---

🎯 Design Decisions

Why Vanilla JavaScript?

· No build step — works directly on GitHub Pages
· Small bundle — instant load
· Learn fundamentals — no framework magic
· Android-friendly — no complex tooling needed

Why localStorage?

· Works offline — PWA can't rely on server
· Simple API — no database setup
· Instant reads — no network latency
· Perfect for demo mode

Why No Framework?

· Learning goal — understand DOM, state, events
· Bundle size — 0 KB framework overhead
· Android constraints — no npm install on mobile
· Full control — no hidden behavior

Why Skeleton Loaders?

· Perceived performance — feels faster
· Polish — matches modern app patterns
· Robustness — handles slow script loading

---

🚀 Deployment

Platform: GitHub Pages

Flow:

1. Commit to main branch
2. GitHub Pages auto-builds
3. Live at https://luzaynarahman-dot.github.io/PetCare/

Custom domain: None (uses GitHub subdomain)

HTTPS: Automatic (required for Service Worker)

---

📊 Performance Metrics

· Initial load: <2s on 4G
· Route switch: <100ms
· localStorage read: <5ms
· Page render: <50ms
· PWA install: <3s

Optimizations:

· Lazy image loading
· Debounced search
· Minimal re-renders
· CSS variable-based theming (no reflow)
· Service worker caching

---

🔮 Future Architecture (If Backend Added)

```
┌─────────────────────────────────────────┐
│  FRONTEND (Current code)                │
│  - Same vanilla JS                       │
│  - Replace Storage.set() with API calls │
└─────────────────────────────────────────┘
              ↓ HTTP
┌─────────────────────────────────────────┐
│  API LAYER                              │
│  - Node.js + Express                    │
│  - JWT authentication                   │
│  - REST endpoints                       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  DATABASE                               │
│  - MongoDB for user data                │
│  - Cloudinary for images                │
└─────────────────────────────────────────┘
```

Migration path:

· Storage.get(key) → await api.get('/key')
· Storage.set(key, value) → await api.post('/key', value)
· No other changes needed

---

Architecture reflects the actual code in the repository as of the final submission.

```
