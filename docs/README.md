# 🐾 PetCare — Happy Tails · Healthy Lives

> An all-in-one pet care PWA — track pet health, shop for products, book vet appointments, share memories, and report animal emergencies. All in one installable app.

[![TechCommons Hacks V2](https://img.shields.io/badge/TechCommons%20Hacks%20V2-Submitted-3A4A3A?style=flat-square)](https://techcommons-hacks-v2.devpost.com/)
[![FirstCommit](https://img.shields.io/badge/FirstCommit-Beginner%27s%20Paradise-orange?style=flat-square)](https://firstcommit.devpost.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple?style=flat-square&logo=pwa)](https://luzaynarahman-dot.github.io/PetCare/)
[![Made on Android](https://img.shields.io/badge/Made%20on-Android-green?style=flat-square&logo=android)](https://github.com/luzaynarahman-dot)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🌟 What is PetCare?

PetCare is a **Progressive Web App (PWA)** built for pet owners, veterinarians, and small pet store owners. It combines health tracking, e-commerce, social features, and emergency services into one beautiful, installable app.

**Built by a solo developer — entirely on an Android phone, without a laptop.**

---

## 💡 Why PetCare?

In Bangladesh (and many places), when a pet gets lost or injured, most people don't know who to call. Pet owners juggle between 5+ apps for health tracking, shopping, vet appointments, and community. Pet store owners and vets have no unified platform to reach their audience.

**PetCare brings them all together in one "pet city":**

- 🐕 **Pet owners** — track health, shop, share memories, find emergency help
- 🩺 **Vets** — post verified medical tips, get discovered
- 🏪 **Store owners** — create a store, sell products, reach local pet parents

---

## ⚠️ Transparency Note

**This is a Frontend MVP / Prototype.**

Backend services are **simulated** using:

- **localStorage** — for data persistence
- **Rich demo data** — for users, products, posts, stores
- **Client-side authentication** — no real password hashing
- **Simulated order tracking** — stages advance on button click

**Why?** As a solo developer building **entirely on an Android device with Acode Editor**, I focused on UI/UX, logic, and offline capability — the parts that matter most for a demo. A real backend would require server hosting, database setup, and authentication services beyond the hackathon scope.

This is documented honestly. See [`docs/LEARNINGS.md`](docs/LEARNINGS.md) for full details.

---

## 🚀 Try It Live

**🔗 Live Demo:** [luzaynarahman-dot.github.io/PetCare](https://luzaynarahman-dot.github.io/PetCare/)

**⚡ Quick Demo Mode (No signup!):**

1. Open the app
2. Click **"Try Demo Without Signing Up"** on the login screen
3. Explore 3 pets, 48 health logs, 8 orders, 10 posts instantly

---

## ✨ Features

### 🐕 Multi-Pet Health Tracking
- Weight charts (Chart.js)
- Vaccination records with due dates
- Medication reminders
- Health logs (weight, temperature, symptoms, notes)
- Custom care items per pet
- Real streak tracking (based on actual completion history)

### 🛍️ E-Commerce
- Product catalog across 8 categories
- Shopping cart with quantity control
- Multi-method checkout (bKash, Card, COD)
- Order tracking with 4-stage timeline
- Wishlist + Favorite stores

### 📅 Vet Appointments
- Book chat / video / in-person consultations
- Appointment history
- Multi-vet support

### 🚨 Emergency SOS
- Report injured, lost, or abused animals
- Real-time 5-stage tracking timeline
- Auto-assign nearest open vet (Haversine formula)
- SOS history

### 📸 Memories (Social Feed)
- Post stories, tips, questions, awareness
- Likes, comments, nested replies
- Save posts, share posts
- Follow / unfollow users
- Search users, posts, tags

### 🐾 Foster & Adopt
- Verified rescue organizations with badges
- Community-listed foster pets
- Full application workflow (apply, accept, reject)
- Donation tracking
- Organization profile pages

### 👥 Multi-Role System
- **Pet Owner** — default role
- **Vet** — verified badge, medical tips (with 2-step application)
- **Store Owner** — create and manage stores

### 🎨 Theme & UX
- Light mode (cozy coffee theme)
- Dark mode (warm espresso theme)
- Skeleton loaders
- Onboarding tour for first-time users
- Toast notifications
- PWA installable + works offline

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Core** | Vanilla JavaScript (ES6+) — no framework |
| **Markup** | HTML5 + CSS3 (Variables, Grid, Flexbox) |
| **Storage** | LocalStorage API |
| **PWA** | Service Worker + Web App Manifest |
| **Charts** | Chart.js |
| **PDF** | jsPDF |
| **Confetti** | Canvas Confetti |
| **Icons** | Font Awesome 6 |
| **Fonts** | Inter + Caveat (Google Fonts) |
| **Hosting** | GitHub Pages |
| **Editor** | Acode (Android) |

---

## 📱 Install as App

**Android (Chrome):**
1. Open the live URL
2. Tap menu (⋮) → "Add to Home Screen"
3. Launch from home screen — works offline!

**iOS (Safari):**
1. Open in Safari
2. Tap Share → "Add to Home Screen"

---

## 📂 Project Structure

```

PetCare/
├── index.html
├── manifest.json
├── service-worker.js
├── offline.html
├── README.md
├── LICENSE
│
├── css/
│   ├── palette.css
│   ├── main.css
│   ├── pages.css
│   ├── profile.css
│   ├── profile-view.css
│   ├── skeleton.css
│   ├── onboarding.css
│   ├── demo.css
│   └── dark.css
│
├── js/
│   ├── app.js
│   ├── data.js
│   ├── ui/skeleton.js
│   ├── drawer.js
│   ├── pwa.js
│   ├── onboarding.js
│   ├── demo-data.js
│   ├── demo.js
│   ├── home.js
│   ├── shop.js
│   ├── checkout.js
│   ├── tracking.js
│   ├── notification.js
│   ├── appointments.js
│   ├── care.js
│   ├── foster.js
│   ├── profile-view.js
│   ├── memory.js
│   ├── search.js
│   └── profile.js
│
├── assets/
│   ├── avatars/
│   ├── covers/
│   ├── products/
│   ├── stores/
│   ├── pets/
│   ├── icons/
│   ├── illustrations/
│   └── mems/
│
└── docs/
├── PROJECT_DESCRIPTION.md
├── FEATURES.md
├── ARCHITECTURE.md
├── CHALLENGES.md
├── LEARNINGS.md
├── SETUP_GUIDE.md
└── screenshots/

```

---

## 🎯 Key Highlights

- ✅ **Zero backend dependencies** — pure frontend MVP
- ✅ **Installable PWA** with offline support
- ✅ **Multi-role** system (Owner / Vet / Store)
- ✅ **Rich demo mode** for instant exploration
- ✅ **Real logic** — streak, SOS, vet distance, foster applications
- ✅ **Mobile-first** responsive design
- ✅ **Dark mode** with warm coffee theme
- ✅ **~18,000 lines** of hand-written code
- ✅ **Built entirely on Android** — no laptop used

---

## 📸 Screenshots

**See [`docs/screenshots/`](docs/screenshots/) for full gallery.**

| Home | Care | Foster |
|------|------|--------|
| ![Home](docs/screenshots/01-home.jpg) | ![Care](docs/screenshots/03-care-today.jpg) | ![Foster](docs/screenshots/04-foster.jpg) |

| Memory | Shop | SOS Modal |
|--------|------|-----------|
| ![Memory](docs/screenshots/05-memory.jpg) | ![Shop](docs/screenshots/02-shop.png) | ![SOS](docs/screenshots/09-sos.jpg) |

---

## 🎬 Demo Video

**📺 Watch on YouTube:** *(link will be added before final submission)*

**Timeline (2-3 minutes):**
- 0:00–0:15 — Intro
- 0:15–0:40 — Problem statement
- 0:40–2:15 — Live walkthrough
- 2:15–2:45 — Technical highlights
- 2:45–3:00 — Learning journey

---

## 🏆 Hackathons

This project is submitted to:

| # | Hackathon | Focus |
|---|-----------|-------|
| 1 | **TechCommons Hacks V2** | Machine Learning / AI · Social Good |
| 2 | **FirstCommit Beginner's Paradise** | Learning journey |
| 3 | **Global Innovation Build Challenge V2** | Applied AI · Open invention |
| 4 | **Next Founders Hackathon** | Build · Pitch · Win |
| 5 | **CAST-GNY Startup Pitch** | Devpost submission |

---

## 🤖 AI Usage Disclosure

**AI-assisted:**
- Code generation for boilerplate
- CSS styling ideas
- Documentation structure

**Self-designed:**
- All architecture decisions
- All feature planning
- All UI/UX design
- All state management
- All testing & debugging on real Android device

Full details in [`docs/LEARNINGS.md`](docs/LEARNINGS.md).

---

## 👤 About the Developer

**Luzayna Rahman** — self-taught developer from Cox's Bazar, Bangladesh.

I do all my coding on an Android phone. I don't have a laptop. I just finished my HSC examination and I'm looking forward to studying CSE at university.

> *"I don't have a pet yet, but I wanted to build something for the animals. In Bangladesh, when a pet gets lost or injured, most people don't know who to call. PetCare is my answer — a small pet city in one app."*

- 🐙 **GitHub:** [@luzaynarahman-dot](https://github.com/luzaynarahman-dot)
- 📍 Cox's Bazar, Chattogram, Bangladesh

---

## 📜 License

MIT License — see [`LICENSE`](LICENSE)

---

## 🙏 Acknowledgements

- **TechCommons** — for the hackathon opportunity
- **FirstCommit** — for the learning-first culture
- **Devpost** — for the platform
- **Open source community** — for Chart.js, jsPDF, Confetti, Font Awesome
- **Every pet parent** — for the inspiration

---

**Made with ❤️ and 🐾 by a solo dev on Android**

*"Every pet deserves a happy tail."*
```
