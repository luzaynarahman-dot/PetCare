# PetCare — Happy Tails · Healthy Lives

## 🎯 Inspiration

I don't have a pet yet. But I love animals, and I want to have my own house with pets someday.

Living in Cox's Bazar, Bangladesh, I noticed a real problem: when a pet gets lost or injured, most people don't know who to call. There's no unified system for animal rescue, no emergency hotline, no easy way to find nearby vets. Pet owners juggle between 5+ apps — one for health tracking, one for shopping, one for booking vet appointments, one for community. Vets and small pet store owners have no unified platform to reach their audience.

I also noticed something else: many people rescue kittens and post about it on Instagram stories, hoping someone will adopt them. But most pet lovers who actually want to adopt never see those stories. There's a gap between rescuers and adopters.

**PetCare is my answer** — a small "pet city" in one app, where pet owners, vets, and store owners all come together. Everything a pet needs, in one place.

---

## 💡 What It Does

PetCare is a **Progressive Web App (PWA)** that combines 5 apps in one:

### 1. Multi-Pet Health Tracking
- Add unlimited pets with species-specific profiles
- Weight charts using Chart.js with real historical data
- Vaccination records with due dates and completion tracking
- Medication reminders with next dose date and time
- Health logs (weight, temperature, symptoms, notes) with filtering
- Custom care items per pet (user can create their own)
- **Real streak system** — calculated from actual daily care completion, not random numbers

### 2. E-Commerce
- Product catalog across 8 categories (Food, Treats, Toys, Grooming, Accessories, Health, Training, Others)
- Shopping cart with quantity control and persistence
- Multi-method checkout (bKash, Card, Cash on Delivery)
- Order tracking with 4-stage timeline (Confirmed → Packed → Shipped → Delivered)
- Wishlist with one-tap add
- Favorite stores

### 3. Vet Appointments
- Book chat, video, or in-person consultations
- Appointment history with past/upcoming tabs
- Multi-vet support with specialization display

### 4. Memories (Social Feed)
- Post stories, tips, questions, awareness content
- Likes, comments, and nested replies
- Save posts for later
- Share via Web Share API
- Follow / unfollow users
- Search users, posts, and tags

### 5. Emergency SOS
- Report injured, lost, abused, or trapped animals
- 5-stage tracking timeline (Reported → Assigned → En Route → On Scene → Resolved)
- **Auto-assign nearest open vet** using Haversine formula
- First-aid guides for 6 emergency situations (Choking, Poisoning, Bleeding, CPR, Heat Stroke, Fracture)
- SOS history with status tracking

### 6. Foster & Adopt
- **Verified rescue organizations** with green checkmark badges
- Community-listed foster pets (any user can list)
- Full application workflow (apply, view applications, accept, reject)
- Donation tracking with progress bars
- Organization profile pages showing rescue stats

### Multi-Role System
- **Pet Owner** — default role for all users
- **Vet** — verified badge, can post medical tips (2-step application with license upload)
- **Store Owner** — create and manage stores

---

## 🛠️ How I Built It

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core** | Vanilla JavaScript (ES6+) — no framework |
| **Markup** | HTML5 + CSS3 (CSS Variables, Grid, Flexbox) |
| **Storage** | LocalStorage API |
| **PWA** | Service Worker + Web App Manifest |
| **Charts** | Chart.js |
| **PDF Export** | jsPDF |
| **Celebrations** | Canvas Confetti |
| **Icons** | Font Awesome 6 |
| **Fonts** | Inter + Caveat (Google Fonts) |
| **Hosting** | GitHub Pages |

### Development Environment

I built **this entire app on an Android phone** — a Samsung Galaxy A30. No laptop. No desktop.

- **Editor:** Acode (a powerful Android code editor)
- **Browser:** Chrome for Android (with `chrome://inspect` remote debugging)
- **Version Control:** GitHub Mobile app
- **Hosting:** GitHub Pages (deployed directly from phone)

Every line of code was typed on a touchscreen.

### Architecture

```

Layer 1: Core (app.js, data.js, skeleton.js, drawer.js)
Layer 2: Features (home.js, shop.js, care.js, checkout.js, tracking.js)
Layer 3: Social & Profile (memory.js, search.js, profile.js, profile-view.js, foster.js)

```

Each layer builds on the previous. No circular dependencies. Clean separation of concerns.

### Design Philosophy — "Cozy Coffee Theme"

- **Light mode:** Warm cream background + forest green + caramel accents
- **Dark mode:** Espresso brown + sage + gold
- Rounded corners (20px radius)
- Playful Caveat font for headers
- Hand-drawn illustration style

**Why?** Pet care is **emotional**. The design should feel **warm, safe, inviting** — not clinical like a medical app.

---

## ⚠️ Transparency — What's Real, What's Simulated

**This is a Frontend MVP / Prototype.**

I want to be honest about what's real and what's simulated:

### ✅ Real Logic (Not Fake)
- **Streak calculation** — reads actual care history from localStorage, counts consecutive days with 3+ completed items
- **SOS tracking** — saves reports to localStorage, generates notifications, opens tracking modal with real timeline
- **Vet distance calculation** — uses Haversine formula with real coordinates (Cox's Bazar)
- **Foster applications** — saves to localStorage, tracks status (pending/accepted/rejected), sends notifications
- **Care history** — actual daily completion data, persists across sessions
- **All CRUD operations** — pets, health logs, reminders, foster listings all save/update/delete properly

### ⚠️ Simulated (No Backend)
- **User authentication** — mock login, no real password hashing
- **Payment processing** — mock checkout, no real payment gateway
- **Image uploads** — converted to base64, stored in localStorage
- **Multi-user sync** — no real server, all data is local to each device

**Why?** As a solo developer building entirely on Android, I focused on UI/UX, logic, and offline capability — the parts that matter most for a demo. A real backend would require server hosting, database setup, and authentication services beyond the hackathon scope.

This is documented honestly in [`LEARNINGS.md`](LEARNINGS.md).

---

## 🌍 Impact & Relevance

### The Real Problem

In Cox's Bazar (and much of Bangladesh), there's no unified pet care ecosystem:

- **No emergency hotline** for injured animals
- **No central platform** for foster/adoption
- **No unified marketplace** for pet products
- **No verified vet directory** with real-time availability
- **No community space** for pet parents to share knowledge

### How PetCare Helps

1. **For pet owners:** One app for health, shopping, appointments, and community
2. **For rescuers:** A platform to list foster pets and reach adopters
3. **For vets:** A way to share verified medical advice and get discovered
4. **For store owners:** A low-cost digital storefront without needing a website
5. **For emergency response:** A single button to report injured animals and get help

### Who Benefits

- Pet owners in regions without unified pet care apps
- Small rescue organizations with limited digital presence
- Independent vets building their reputation
- Small pet store owners reaching local customers
- Anyone who wants to help animals but doesn't know where to start

---

## 🏆 What I'm Proud Of

- ✅ **Built entirely on Android** — no laptop used
- ✅ **Installable PWA** — works offline after first visit
- ✅ **Rich demo mode** — one-click loads 3 pets, 48 health logs, 10 posts
- ✅ **Real streak system** — based on actual care history, not random
- ✅ **Real SOS tracking** — 5-stage timeline with persistence
- ✅ **Real foster workflow** — apply, review, accept/reject with notifications
- ✅ **Multi-role system** — Owner / Vet / Store Owner
- ✅ **~18,000 lines** of hand-typed code
- ✅ **Zero frameworks** — pure vanilla JavaScript

---

## 🚧 Challenges I Faced

### 1. Building Without a Laptop

**Problem:** No multi-window, no keyboard shortcuts, no easy debugging.

**Solution:** Acode + Chrome for Android + GitHub Mobile app. Every commit, every line, every test — all on a touchscreen.

### 2. Simulating a Backend Without One

**Problem:** Real apps have servers. I didn't.

**Solution:** localStorage + a rich **demo mode** that seeds realistic data on one tap, so judges can explore the full experience without signup.

### 3. Making Features Feel Real

**Problem:** Fake data fails when judges look closely.

**Solution:** Implemented **real logic** — Haversine distance, streak calculation, SOS timeline, foster workflow. If it looks like it works, it actually works.

### 4. State Management Without a Framework

**Problem:** Data sync between 10+ pages.

**Solution:** Single source of truth (localStorage) + event-driven re-rendering on page switch.

### 5. PWA Offline Support

**Problem:** One failed cache asset broke everything.

**Solution:** Switched from `Promise.all()` to `Promise.allSettled()` so individual failures don't break the whole cache.

### 6. Race Conditions in Demo Mode

**Problem:** User's foster listings were being overwritten on page reload.

**Solution:** Synchronous injection + backup localStorage key (`pc_demo_myFosterListings`) that restores on every load.

---

## 🔮 What's Next

### Immediate
- Real backend (Node.js + Express + MongoDB)
- User authentication with JWT
- Real image uploads (Cloudinary)

### Short-term
- Real-time chat between pet owners and vets
- Push notifications (Firebase)
- Payment gateway integration (bKash API)

### Long-term
- Multi-language support (Bengali first)
- Vet verification system with admin panel
- Marketplace commission model
- Native mobile apps (React Native)

---

## 🤖 AI Usage Disclosure

**AI-assisted:**
- Code generation for boilerplate patterns
- CSS styling ideas and layout debugging
- Documentation structure suggestions
- Debugging help (explaining error messages)

**Self-designed:**
- All architecture decisions (file structure, data models)
- All feature planning (what to build, in what order)
- All UI/UX design (layout, colors, animations)
- All state management (how data flows between pages)
- All testing on real Android device
- All debugging (reproducing bugs, finding causes)

Full disclosure in [`LEARNINGS.md`](LEARNINGS.md).

---

## 📌 Team

**Solo submission** — Luzayna Rahman

- **Role:** Everything (design, development, testing, documentation)
- **Contribution:** 100% of code, design, and documentation
- **Context:** Self-taught developer, just finished HSC, building on Android with no laptop

**GitHub:** [@luzaynarahman-dot](https://github.com/luzaynarahman-dot)  
**Live Demo:** [luzaynarahman-dot.github.io/PetCare](https://luzaynarahman-dot.github.io/PetCare/)

---

## 🔗 Links

- **Live Demo:** https://luzaynarahman-dot.github.io/PetCare/
- **GitHub Repo:** https://github.com/luzaynarahman-dot/PetCare
- **Demo Video:** *(link added on submission)*

---

*"Every pet deserves a happy tail."*

**Made with ❤️ and 🐾 on Android.**
```
