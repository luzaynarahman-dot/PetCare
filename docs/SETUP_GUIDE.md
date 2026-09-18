# 🛠️ Setup Guide — PetCare

**A quick guide to run PetCare locally on your machine.**

---

## 📋 Prerequisites

**Nothing required.** PetCare is a pure frontend app — no build step, no npm, no server.

You only need:
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: A text editor if you want to modify the code

---

## 🚀 Method 1 — Run from Live URL (Fastest)

**Best for:** Testing, exploring features, judge evaluation.

1. Open your browser
2. Visit: **[https://luzaynarahman-dot.github.io/PetCare/](https://luzaynarahman-dot.github.io/PetCare/)**
3. Click **"Try Demo Without Signing Up"** on the login screen
4. Explore 3 pets, 48 health logs, 10 posts, 8 orders instantly

**No installation needed.**

---

## 💻 Method 2 — Run Locally (For Development)

**Best for:** Editing code, adding features, testing changes.

### Step 1 — Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/luzaynarahman-dot/PetCare.git
cd PetCare
```

Step 2 — Open index.html

Option A — Direct file open:

Double-click index.html in your file manager.

Option B — Local server (recommended):

For proper PWA testing, run a simple HTTP server.

Python 3:

```bash
python -m http.server 8000
```

Python 2:

```bash
python -m SimpleHTTPServer 8000
```

Node.js (with npx):

```bash
npx serve
```

VS Code Live Server:

· Install the "Live Server" extension
· Right-click index.html → "Open with Live Server"

Step 3 — Open in Browser

If using a local server:

```
http://localhost:8000
```

Step 4 — Enter Demo Mode

1. Click "Try Demo Without Signing Up"
2. Wait for the loading animation (3-4 seconds)
3. Explore the full app

---

📱 Method 3 — Install as PWA (Mobile)

Best for: Testing offline mode, real-device experience.

On Android (Chrome)

1. Open https://luzaynarahman-dot.github.io/PetCare/
2. Tap menu (⋮) → "Add to Home Screen"
3. Tap "Install" when the install banner appears
4. Launch from home screen — works offline!

On iOS (Safari)

1. Open the live URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

On Desktop (Chrome / Edge)

1. Open the live URL
2. Click the Install icon in the address bar
3. Click "Install"

---

🗂️ Project Structure

```
PetCare/
├── index.html                  # Main entry point
├── manifest.json               # PWA manifest
├── service-worker.js           # Offline caching
├── offline.html                # Offline fallback page
├── README.md
├── LICENSE
│
├── css/                        # Stylesheets
│   ├── palette.css             # Color variables
│   ├── main.css                # Reset, layout, nav
│   ├── pages.css               # Page-specific styles
│   ├── profile.css             # Profile styles
│   ├── profile-view.css        # Public profile styles
│   ├── skeleton.css            # Loading states
│   ├── onboarding.css          # Welcome tour
│   ├── demo.css                # Demo mode
│   └── dark.css                # Dark mode overrides
│
├── js/                         # JavaScript modules
│   ├── app.js                  # Core: router, state, utilities
│   ├── data.js                 # Static seed data
│   ├── ui/skeleton.js          # Skeleton generators
│   ├── drawer.js               # Side drawer
│   ├── pwa.js                  # Service worker + install
│   ├── onboarding.js           # First-time tour
│   ├── demo-data.js            # Rich demo dataset
│   ├── demo.js                 # Demo mode controller
│   ├── home.js                 # Home page
│   ├── shop.js                 # Shop + stores
│   ├── checkout.js             # Cart + payment
│   ├── tracking.js             # Order tracking
│   ├── notification.js         # Notifications
│   ├── appointments.js         # Appointments
│   ├── care.js                 # Pet care + health
│   ├── foster.js               # Foster system
│   ├── profile-view.js         # Public profiles
│   ├── memory.js               # Social feed
│   ├── search.js               # Search system
│   └── profile.js              # Own profile
│
├── assets/                     # Images
│   ├── avatars/                # Pet avatars
│   ├── covers/                 # Profile covers
│   ├── products/               # Product images
│   ├── stores/                 # Store covers
│   ├── pets/                   # Pet photos
│   ├── icons/                  # PWA icons
│   ├── illustrations/          # Hero illustrations
│   └── mems/                   # Memory images
│
└── docs/                       # Documentation
    ├── PROJECT_DESCRIPTION.md
    ├── FEATURES.md
    ├── ARCHITECTURE.md
    ├── CHALLENGES.md
    ├── LEARNINGS.md
    ├── SETUP_GUIDE.md
    └── screenshots/
```

---

🔧 Common Tasks

Clear All App Data

1. Open app → Hamburger menu → "Clear All Data"
2. Or: Browser DevTools → Application → Local Storage → Delete all keys

Reset Demo Mode

1. Click "Exit" on the demo banner
2. Start demo again

Force Refresh Service Worker

If cached files are outdated:

1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Click "Unregister"
4. Reload page

Debug on Android via Chrome

1. Connect phone to computer via USB
2. Enable USB Debugging in phone settings
3. Open chrome://inspect on computer
4. Click "Inspect" on your PetCare tab

---

🧪 Testing Checklist

After running locally, verify:

☐ Home page loads with hero card
☐ Demo mode loads 3 pets, 48 logs, 10 posts
☐ Bottom nav switches between 5 pages
☐ SOS report saves and tracks
☐ Foster section shows 7 pets
☐ Profile shows user data
☐ Dark mode toggle works
☐ PWA install prompt appears (on HTTPS or localhost)
☐ Offline mode works (DevTools → Network → Offline)

---

🌐 Browser Support

Browser Support
Chrome 90+ ✅ Full support
Firefox 88+ ✅ Full support
Safari 14+ ✅ Full support
Edge 90+ ✅ Full support
Samsung Internet ✅ Full support
Opera ✅ Full support

Service Worker requires HTTPS or localhost.

---

🚫 No Dependencies

PetCare does not use:

· ❌ npm
· ❌ Node.js
· ❌ Webpack / Vite / Rollup
· ❌ React / Vue / Angular
· ❌ Backend server
· ❌ Database
· ❌ Build step

CDN-only libraries:

· Chart.js (charts)
· jsPDF (health records PDF)
· Canvas Confetti (celebrations)
· Font Awesome 6 (icons)
· Google Fonts (Inter + Caveat)

---

🆘 Troubleshooting

"Page not loading"

· Clear browser cache
· Hard reload (Ctrl + Shift + R)
· Check console for errors

"Service Worker not registering"

· Must be on HTTPS or localhost
· Check console: [PWA] Service Worker registered

"Images broken"

· Check file paths — must be relative (./assets/...)
· Verify assets folder exists

"Demo mode not loading"

· Clear localStorage and retry
· Check console for [Demo] Load failed

"Data not saving"

· Check localStorage isn't full
· DevTools → Application → Local Storage

---

📖 Next Steps

· Read ARCHITECTURE.md — how the code is organized
· Read FEATURES.md — complete feature list
· Read LEARNINGS.md — development journey

---

Live Demo: luzaynarahman-dot.github.io/PetCare
GitHub: github.com/luzaynarahman-dot/PetCare

Happy exploring! 🐾

```
