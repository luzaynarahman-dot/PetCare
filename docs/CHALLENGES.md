# 🚧 Challenges I Faced — PetCare

**By:** Luzayna Rahman  
**Built on:** Android phone · Acode Editor  
**Duration:** ~30 days

---

## 1. Building Without a Laptop

**The Challenge:**
No multi-window, no keyboard shortcuts, no easy debugging. Every `Ctrl+C`, `Ctrl+V`, `Ctrl+S` — done by tapping on a touchscreen.

**How I Solved It:**
- Used **Acode Editor** — surprisingly powerful for a mobile editor
- **Chrome for Android** with `chrome://inspect` remote debugging via USB
- **GitHub Mobile app** for version control
- Committed small and often to avoid losing work
- Kept every file short and focused

**What I Learned:**
Constraints force focus. Without the ability to open 20 tabs, I had to plan carefully before writing code.

---

## 2. Simulating a Backend Without One

**The Challenge:**
Real apps have servers. I didn't. But I needed users, products, stores, orders, posts, and foster listings to feel real.

**How I Solved It:**
- **localStorage** for persistence — every action saves instantly
- **Rich demo mode** — one-click seeds 3 pets, 48 health logs, 10 posts, 8 orders, 2 foster listings
- **Real logic** instead of fake data — streak calculation reads actual history, SOS tracking saves reports, vet distance uses Haversine formula

**What I Learned:**
Don't fake what you can build. A user who does the same action twice should see the same result — that's real logic.

---

## 3. Making Features Feel Real

**The Challenge:**
Fake data fails when judges look closely. Random numbers, static counters, and untracked state all give it away.

**How I Solved It:**
Rewrote core features with real logic:

- **Streak system** — reads `pc_careHistory`, counts days with 3+ completed items, resets on missed day
- **SOS tracking** — saves reports, generates notifications, opens timeline modal, persists status
- **Vet distance** — Haversine formula with real Cox's Bazar coordinates
- **Foster applications** — real accept/reject workflow with notifications
- **Care completion** — real daily data with pet-specific storage

**What I Learned:**
Real logic always beats pretty UI. If it looks like it works, it should actually work.

---

## 4. State Management Without a Framework

**The Challenge:**
Data flow between 10+ pages. Change a care item on Home → it must update on Care page. Like a post in Memory → count updates on profile.

**How I Solved It:**
- **Single source of truth** — localStorage
- **Event-driven re-rendering** — only reload the current page on data change
- **Helper functions** — shared across files (`loadDailyCare()`, `getActivePet()`, `calculateRealStreak()`)
- **No global mutation** — every save goes through `Storage.set()`

**What I Learned:**
You don't need React. You need clear data flow and consistent save points.

---

## 5. PWA Offline Support

**The Challenge:**
My first service worker cached nothing — because **one failed asset broke the entire cache**.

```javascript
// This fails if ANY asset fails
cache.addAll(URLS);
```

How I Solved It:
Switched to Promise.allSettled() so individual failures don't break the whole cache:

```javascript
// Individual failures are ignored
Promise.allSettled(
  URLS.map(url => cache.add(url).catch(() => {}))
);
```

Also added cache version bump (v11 → v12) to force refresh on updates.

What I Learned:
A single error should never break the entire system. Use allSettled instead of all for non-critical operations.

---

6. Race Conditions in Demo Mode

The Challenge:
User's own foster listings were being overwritten on page reload. The demo seeded them, but reload reset FOSTER_PETS from data.js.

How I Solved It:

· Backup key — save user's listings to pc_demo_myFosterListings separately
· Synchronous injection — inject listings before reload, not with setTimeout
· Loader support — loadFosterPets() reads backup key on every init
· Longer reload delay — 1100ms → 1500ms to give injection time

What I Learned:
Always anticipate what happens on reload. Persistence is not automatic — you must design for it.

---

7. Dark Mode Breaking the Layout

The Challenge:
My first dark mode attempt broke everything. Text was invisible. Buttons looked broken. Colors clashed.

How I Solved It:

· Moved all colors to CSS variables in palette.css
· Created a body.dark-mode { ... } block that overrides the variables
· Never hardcoded colors in components
· Tested each page in both modes

What I Learned:
One source of truth for colors. Never hardcode #3A4A3A — always use var(--pc-primary).

---

8. Avatar Updates Across Posts

The Challenge:
I initially saved avatars inside each post. When a user changed their avatar, old posts still showed the old one.

How I Solved It:

· Never store avatars in post data
· Always look up avatars by authorId at render time
· Created renderAvatarInner(authorId, fallbackName) helper
· Same pattern for comments and replies

What I Learned:
Never duplicate data. Reference it. This is why Facebook and Instagram always have up-to-date avatars.

---

9. Home vs Care Page Sync

The Challenge:
Home page had its own "Today's Care" implementation with different keys (grooming, exercise), but Care page used walk and medicine. Clicking on Home didn't update Care.

How I Solved It:

· Deleted Home's duplicate implementation
· Both pages now use loadDailyCare(pet.id) — single source
· Home's toggleTodayCare() delegates to Care's toggleCareItem()
· Custom care items synced across both pages

What I Learned:
Two implementations of the same feature always drift. Consolidate into one.

---

10. Foster Verified Badge Cut Off

The Challenge:
The "Verified" ribbon was positioned at top: -8px — outside the parent container. But .foster-scroll had overflow-x: auto which also clipped vertical overflow.

How I Solved It:

· Moved badge inside the image container
· Changed top: -8px to top: 8px
· Added backdrop-filter: blur(8px) for a modern look

What I Learned:
overflow: hidden on one axis affects the other axis too. Design within the container, not outside it.

---

11. Duplicate Drawer Items

The Challenge:
The drawer showed "My Cart" twice. I couldn't figure out why — I only added it once in HTML.

How I Solved It:

· Added Drawer.cleanDuplicateItems() that runs on init
· Scans all [data-drawer-action] items
· Removes any duplicates using a Set

What I Learned:
Copy-paste mistakes happen. Add a runtime check for duplicate DOM elements.

---

12. Modal Stacking Issue

The Challenge:
Clicking "Apply to Foster" inside the foster detail modal opened the apply form behind the detail modal. Two modals stacked with the same z-index.

How I Solved It:

· Close parent modal first — call closeModal('fosterDetailModal') before opening apply
· Lower z-index for detail modal — added modal-stacked class with z-index: 990 (default is 1000)
· Reopen detail modal after submit — smooth return flow

What I Learned:
Modals should be treated like a stack. When opening a child, close or hide the parent.

---

13. Duplicate Toggle Function

The Challenge:
toggleProductWishlist() was defined twice in shop.js. The second definition overwrote the first, but it caused confusion during debugging.

How I Solved It:

· Kept the better version (with refreshDrawer() call)
· Deleted the duplicate
· Exported only once

What I Learned:
JavaScript silently overrides duplicate function declarations. Use const/let and search for duplicates before debugging weird behavior.

---

14. Week Timeline Showing Wrong State

The Challenge:
Today's care completion wasn't turning the paw green. The logic used completedCount >= 3, but user might complete 1-2 items and still expect progress.

How I Solved It:

· Today counts as "done" if 1+ items are completed (immediate feedback)
· Past days require 3+ items (meaningful day)
· Future days never count as done (bug fix — they were showing as done before)

What I Learned:
Different days can have different completion rules. Today should feel responsive; past days should be strict.

---

15. Deployment on GitHub Pages

The Challenge:
File paths worked locally but broke after deploying. Images showed broken icons. JavaScript files threw 404 errors.

How I Solved It:

· Used relative paths everywhere (./css/main.css, not /css/main.css)
· Set <base href="./"> in HTML
· Pushed from local Git — GitHub Pages auto-deploys from main branch
· Tested every page on the live URL

What I Learned:
Relative paths are portable. Absolute paths only work in one environment.

---

16. No Dark Mode Toggle in Drawer

The Challenge:
The dark mode toggle in the drawer wasn't syncing with the theme. Clicking it did nothing.

How I Solved It:

· Added event.stopPropagation() to prevent the drawer item from closing
· Called toggleTheme(e.target.checked) directly
· Synced toggle state with body.dark-mode class on init

What I Learned:
Event propagation can silently break UI. Use stopPropagation() when nesting interactive elements.

---

17. Search Only Working on Memory Page

The Challenge:
Search icon was only visible on Memory page — but users expected it everywhere.

How I Solved It:

· Kept it focused on Memory page (deliberate decision)
· Documented the reason in README
· Users can search from Memory → jump to any page

What I Learned:
Sometimes "not everywhere" is better than "everywhere but broken". Focused features work better.

---

18. Onboarding Tour Interfering with Demo

The Challenge:
When demo mode loaded, the onboarding tour popped up and blocked the home page. Judges couldn't see the demo data.

How I Solved It:

· Demo mode sets pc_onboarding_done = 'true' automatically
· Preserves this flag even after demo exit
· Tour only shows on true first visit

What I Learned:
Demo mode must be judge-friendly. Nothing should block the first impression.

---

19. Pet Selector Edit Button Overlapping

The Challenge:
The edit pencil icon on pet chips was overlapping the pet avatar and name.

How I Solved It:

· Moved edit button inside the chip
· Positioned it under the name with position: absolute; bottom: -2px
· Added z-index: 3 to keep it above other elements

What I Learned:
Absolute positioning needs to consider the parent's overflow. Test on mobile, not just desktop.

---

20. Foster Modal Not Loading User Data

The Challenge:
After demo load, the foster detail modal showed 0 applications even though demo data had them. The modal loaded before FOSTER_PETS was populated.

How I Solved It:

· Demo mode now injects foster data synchronously
· Backup key (pc_demo_myFosterListings) restored on every page load
· Foster modal reads from getFosterPetById() which reads live data

What I Learned:
Timing matters. If data must be present, seed it before the page renders — not after.

---

🔑 Top Lessons From All Challenges

1. Constraints force focus — no laptop meant planning carefully
2. Real logic beats fake data — judges notice
3. Single source of truth — localStorage, no duplicate state
4. Design for reload — persistence is not automatic
5. Test on real device — emulators miss 80% of bugs
6. Small commits — easier to debug and revert
7. Never duplicate functions — JS silently overwrites
8. Use allSettled not all — one failure shouldn't break everything
9. Modals are a stack — close parent before opening child
10. Document honestly — mistakes are the best stories

---

💚 Final Thought

Every single bug I fixed taught me something a tutorial never could.

The 30 days I spent building this were not always smooth. There were nights when the same error kept appearing. There were days when I wanted to give up.

But then I installed my own app on my phone and opened it offline — and it worked. That one moment made everything worth it.

Keep building. 🐾

— Luzayna Rahman
Cox's Bazar, Bangladesh

```
