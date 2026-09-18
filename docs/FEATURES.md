# ✨ PetCare — Complete Feature List

## 🐾 Multi-Pet Health Tracking

### Pet Profiles
- Add unlimited pets (cat, dog, bird, rabbit, other)
- Species-specific avatar library
- Age, weight, gender, breed fields
- Edit and delete pets
- Active pet switcher across all pages
- Custom notes per pet

### Health Logs
- 4 log types: Weight, Temperature, Symptom, Note
- Filter by type (All / Notes / Weight / Temp / Symptoms)
- Edit and delete entries
- Timestamped entries with time
- Color-coded icons per type
- Empty state with "Add Entry" CTA

### Vaccinations
- Multi-vaccine tracking per pet
- Completed / Pending status badges
- Mark complete with celebration confetti
- Undo completion
- Delete vaccines
- Progress bar showing completion percentage

### Medications
- Add medications with name, next dose date, next dose time
- Notes field (after meal, with food, etc.)
- Edit and delete
- Pet-specific
- Empty state guidance
- Long-press to open action menu

### Reminders
- 5 types: Vaccination, Grooming, Vet Checkup, Medication, General
- Date + time picker
- Edit and delete
- Pet-specific
- Action menu on tap (Edit / Delete)
- Colored icons per type

### Weight Chart
- Chart.js line chart with historical data points
- Hover tooltips showing weight in kg
- Auto-sorting by date
- Empty state when no data
- Auto-syncs with pet profile weight

### Custom Care Items
- Add custom items per pet
- Choose from 10 icon options
- Toggle done / not done
- Edit and delete via menu
- Home page shows first 2 + "+N more"
- Full list visible in Care tab

### Real Streak System
- Calculated from actual care history
- 3+ items completed per day = day counted
- Today counts immediately after 1+ items
- Persists across sessions
- Resets if a past day is missed
- Displays on Home and Care pages

---

## 🛍️ E-Commerce

### Products
- 20+ products across 8 categories
- Categories: Food, Treats, Toys, Grooming, Accessories, Health, Training, Others
- Search products by name
- Sort by price (low/high), rating, or default
- Category filter
- Discount badges showing % off
- Product rating and review count
- Wishlist toggle heart

### Stores
- 6+ stores with different types (local, online, hybrid)
- Store detail page with cover, logo, rating
- Products per store
- Reviews tab
- Info tab with hours, location, phone
- Vets tab for clinics
- Favorite stores
- One-tap call button
- Contact store CTA

### Featured Stores
- Horizontal scroll of top-rated stores
- Store card with cover, logo, rating, category
- "See All" to browse all stores

### Categories Grid
- 8 category circles with color-coded icons
- Active state highlights selected category
- Click to filter products

### Top Picks
- Horizontal scroll of most popular products
- Sorted by popularity score
- Quick add to cart

### Cart
- Add/remove products
- Quantity increase/decrease
- Persistent across sessions (localStorage)
- Cart badge count on icon
- Real-time total calculation
- Empty state with browse CTA

### Checkout
- Full name, phone, address fields
- 3 payment methods: bKash, Card, Cash on Delivery
- Order summary with subtotal, delivery, total
- Free delivery over $50
- Order confirmation
- Confetti celebration on success
- Notification generated

### Order Tracking
- 4-stage timeline: Confirmed → Packed → Shipped → Delivered
- "Simulate Next Stage" button for demo
- Order history with past orders
- Tracking modal accessible from notifications
- Delivered celebration with confetti

### Wishlist
- Add/remove products with heart icon
- Wishlist modal in profile
- Empty state with browse CTA
- Add to cart from wishlist

### Favorite Stores
- Heart icon on store cards
- Favorites shown in profile
- Remove from favorites
- "View All Favorites" modal

---

## 📸 Memories (Social Feed)

### Posts
- 4 post types: Story, Tip, Question, Awareness
- Rich text with auto-bold first line
- Photo upload (max 2MB)
- Multi-image product grid
- Product grid auto-layouts for 1, 2, 3, or 4+ images

### Interactions
- Like posts (heart animation)
- Comment on posts
- Reply to comments (nested structure)
- Like comments
- Like replies
- Save posts (bookmark)
- Share posts (Web Share API with clipboard fallback)
- Delete own posts / comments / replies
- Long-press own comment for action sheet

### Feed
- Filter by type: All, Vet Tips, Stories, Awareness, Questions
- Sort by most recent
- 10+ demo posts with diverse content

### Author Actions
- Click author avatar → view their profile
- Click author name → view their profile
- Follow/unfollow from profile

### Comment System
- Comment modal with scroll
- Reply indicator bar with cancel
- Bottom sheet menu for delete
- Verified badge for vet comments
- Time-ago display

---

## 👤 Profiles

### Own Profile
- Custom avatar (upload or preset by species)
- Custom cover photo (5 preset options or upload)
- Edit name, location, bio
- Multi-role badges (Owner / Vet / Store Owner)
- Role switcher (post as different roles)
- Quick stats: Posts, Followers, Following, Reviews
- Quick action cards: Edit Profile, My Pets, My Orders, Appointments
- My Posts grid
- My Pets horizontal scroll
- My Stores (if store owner)
- My Foster Listings (if user has foster pets)
- My Applications (if user applied for fosters)
- Upcoming Appointments
- Quick links: Wishlist, Reminders, Health Records, Support
- Favorite Stores scroll
- Settings section with dark mode toggle, notifications, privacy

### Public Profile
- View any user's profile
- Cover + avatar
- Verified vet badge
- Role chips
- Stats row (posts, followers, following, pets)
- Follow/Following button with loading state
- Tabs: Posts, About, Pets, Reviews
- Followers/Following list modal
- Click pet → view pet modal
- Empty states for posts/pets/reviews

### Guest State
- "Welcome to PetCare" card
- Sign In / Register CTA
- Feature grid preview (Manage Pets, Book Vets, Shop & Orders, Share Memories)
- "Explore as Guest" button

### Follow System
- Follow/unfollow with real-time count update
- Followers list modal
- Following list modal
- Click user → view their profile
- Follow button state persists

---

## 🚨 Emergency SOS

### Reporting
- 5 emergency types: Injured, Lost, Abused, Trapped, Other
- Description field (min 10 chars, max 300)
- Auto-detected location (realistic Cox's Bazar locations)
- Optional phone number
- Submit → saves to history
- Notification generated
- Tracking modal opens automatically

### Tracking
- 5-stage timeline: Reported → Assigned → En Route → On Scene → Resolved
- Auto-assign nearest open vet (Haversine formula)
- ETA calculation
- "Update Status" button to advance stages
- Resolved state with confetti + badge
- Assigned vet info with call button

### History
- All past reports in modal
- Status badges (Pending / Resolved)
- Color-coded icons per type
- Click → open tracking modal
- Empty state with report CTA

### First-Aid Guides
- 6 emergency situations:
  - Choking
  - Poisoning
  - Bleeding
  - CPR
  - Heat Stroke
  - Fracture
- Numbered step-by-step instructions
- "Do NOT" warning box
- Emergency vet call button
- Progress through cards

---

## 🐾 Foster & Adopt

### Verified Rescue Organizations
- 3 verified rescue orgs with green checkmark badges
- Organization profile modal
- Stats: Rescued count, Available pets, Since year
- Description and location
- Contact button
- Currently listed pets scroll

### Home Card Display
- Verified ribbon on org-listed pets
- Medical status chip (Healthy / Medical Care)
- Name, gender, age, breed
- Location with distance
- Listed time ("1 day ago")
- Views + Applications count
- Horizontal scroll

### Detail Modal
- Hero image with verified badge
- Name, gender, age, breed
- Listed time
- Info grid: Location, Duration, Cost, Applications
- Medical status chips (Vaccinated, Dewormed, Neutered, Healthy)
- Medical notes
- Full description
- Rescuer card with verified org
- Donation progress bar
- Community support total
- CTA: Apply to Foster / Donate
- Share button

### Apply to Foster
- Full application form
- Name, phone, address
- Has pets dropdown (no, cats only, dogs only, mixed)
- Experience dropdown (first time, some, very experienced)
- Reason textarea (min 20 chars)
- Agreement checkbox
- Submit → saves to pet's applications
- Notification to lister
- Confetti celebration

### Applications Management (as Lister)
- View all applications for a listing
- Applicant name, phone, time
- Status badge (pending / accepted / rejected)
- Full application details
- Accept button (marks pet as fostered, rejects others)
- Reject button
- Real-time status update

### My Applications (as Applicant)
- Profile section showing all applications
- Pet name, image
- Applied date
- Status badge

### My Foster Listings
- Profile section for users who listed pets
- Card per listing with image, name, status
- Stats: Views, Applications, Donations
- 3-dot menu with options:
  - Edit Listing
  - View Applications (with count)
  - Mark as Fostered
  - Delete Listing

### Add / Edit Foster Pet
- Photo upload (max 2MB)
- Pet name, species, gender
- Age, breed
- Location
- Foster duration
- Monthly cost (USD)
- Description (min 30 chars)
- Medical status checkboxes (Vaccinated, Dewormed, Neutered, Healthy)
- Medical notes
- Submit → appears in home foster scroll
- Confetti celebration

### Donation System
- Preset amounts: $5, $10, $25, $50, $100
- Custom amount input (max $10,000)
- Real-time progress bar update
- Donor recorded in pet's donatedBy array
- Notification on donation
- Confetti celebration

### Share
- Native share on supported devices
- Clipboard fallback
- Shares pet name + location

---

## 👥 Multi-Role System

### Pet Owner
- Default role for all users
- Full access to health, shop, community, foster

### Vet (Verified)
- 2-step application form:
  - Step 1: Specialization, Experience, Clinic name, Clinic address
  - Step 2: License number, License photo upload
- Pending status with hourglass badge
- "Simulate Admin Approval" button (demo)
- Approved status grants:
  - Green verified badge on profile
  - "Vet" role in post composer
  - Tip-type posts by default

### Store Owner
- Create store with full form:
  - Store name, category, type
  - Phone, location, hours
  - Description
  - Is-clinic checkbox
- Auto-added to user's ownedStores
- "Store Owner" role chip
- "Awareness" post type in composer
- Store management in profile

### Role Switching
- "Post As" button in profile
- Choose between owned roles
- Active role saved to localStorage
- Posts rendered with active role
- Role badge changes

---

## 🎨 Theme & UX

### Light Mode
- Warm cream backgrounds
- Forest green primary
- Caramel accents
- Soft shadows

### Dark Mode
- Espresso brown backgrounds
- Sage green primary
- Gold accents
- Reduced shadow intensity
- Accessible color contrast

### Skeleton Loaders
- Home page skeleton
- Shop page skeleton
- Care page skeleton
- Memory page skeleton
- Profile page skeleton
- Auto fade-in transition

### Onboarding Tour
- 4-step welcome tour
- Illustrations with emoji
- Feature lists
- Progress dots and bar
- Skip / Back / Next / Get Started
- Only shown on first visit

### Toast Notifications
- Bottom-center display
- Auto-dismiss (2.5s default)
- Custom duration support
- Icon + message
- Slide-up animation

### Confetti Celebrations
- On demo start
- On order placed
- On SOS resolved
- On foster accept
- On donation
- On vaccination complete
- On pet added

### PWA Install Banner
- Custom install prompt
- "Add to Home Screen" guidance
- Dismissable (3-day cooldown)
- Auto-hides after install
- Detects standalone mode

### Offline Support
- Service worker caches assets
- Offline fallback page
- Auto-retry on connection restored
- Cached images load without internet

### Search System
- In-place navbar expansion
- Live results as you type
- Search users, posts, tags
- Sectioned results (People, Posts, Tags)
- Click result → navigate to profile/post

### Drawer Navigation
- Hamburger menu
- User profile header
- Quick access: Cart, Wishlist, Track Order, Notifications
- Preferences: Settings, Dark Mode, Export Data, Clear Data
- About PetCare
- Login/Signup button
- Footer version info

### Demo Mode
- One-click demo entry
- Loads 3 pets, 48 health logs, 10 posts, 8 orders, 2 foster listings
- Staged loading messages
- Live timer banner showing demo age
- Exit button with confirmation
- Preserves theme on exit

### Error Boundaries
- Graceful error display
- Retry button
- "Go Home" fallback
- Prevents blank screens
- Console logging for debugging

---

## 🔍 Search

- Navbar search icon (visible on Memory page)
- In-place expansion
- Real-time results
- Search across:
  - Users (with role chips)
  - Posts (with thumbnails)
  - Tags (filter shortcuts)
- Empty state for no results
- ESC to close
- Clear button

---

## 📊 Data & Persistence

### LocalStorage Keys
- `pc_token` — auth token
- `pc_user` — user profile
- `pc_theme` — light/dark mode
- `pc_cart` — cart items
- `pc_wishlist` — saved products
- `pc_orders` — order history
- `pc_notifications` — notifications
- `pc_pets` — user's pets
- `pc_activePetId` — currently selected pet
- `pc_memories` — social posts
- `pc_stores` — user-created stores
- `pc_appointments` — vet appointments
- `pc_healthLog` — health entries
- `pc_vaccinations` — vaccination records
- `pc_medications` — medication list
- `pc_reminders` — reminders
- `pc_dailyCare` — daily care completion
- `pc_careHistory` — historical completion for streak
- `pc_customCare` — user-created care items
- `pc_fosterPets` — foster listings
- `pc_demo_myFosterListings` — demo backup
- `pc_sosHistory` — SOS reports
- `pc_following_map` — follow relationships
- `pc_saved_posts` — bookmarked posts
- `pc_favoriteStores` — favorite stores
- `pc_onboarding_done` — onboarding flag
- `pc_notifPrefs` — notification preferences
- `pc_lastLocation` — last known location
- `pc_demo_mode` — demo mode flag

### Export / Import
- Export all data as JSON file
- Clear all data (with confirmation)
- Preserves theme and onboarding flag on clear

---

## 🎯 Accessibility

- Focus rings on interactive elements
- ARIA labels on icon-only buttons
- Keyboard navigation support
- ESC to close modals and drawer
- Reduced motion support via `prefers-reduced-motion`
- High contrast in dark mode
- Semantic HTML structure

---

## 📱 Responsive Design

- Mobile-first design
- Breakpoints at 768px, 640px, 480px, 400px
- Touch-friendly tap targets (min 44px)
- Safe area insets on iOS
- Horizontal scroll for cards
- Grid layouts adapt to screen size
- Bottom nav fixed for thumb reach
- Modal content scales appropriately
- Font sizes adjust for readability

---

## 🌐 Progressive Web App

- Web App Manifest with icons (72px to 512px)
- Standalone display mode
- Custom theme color (#3A4A3A)
- Service Worker with 3 caching strategies:
  - Cache-first for assets
  - Network-first for pages
  - Stale-while-revalidate for API-like calls
- Offline fallback page with auto-retry
- Install prompt handling
- Update detection and reload notification
- App shortcuts (Care, Shop, Memory)
- Works on Android, iOS, and desktop Chrome

---

## 🎉 Special Features

### Real-time SOS Tracking
- Timeline advances manually for demo
- Auto-assigns nearest open vet
- Distance calculated with Haversine formula
- Notifications on status change

### Foster Verification System
- Verified rescue orgs with green ribbon
- Community-listed pets without badge
- Org profile modal with stats
- Donation tracking per pet

### Multi-Role Posts
- Post as Pet Owner, Vet, or Store Owner
- Different post types per role
- Role badge on every post
- Author avatar always looked up live

### Care Streak Gamification
- Real streak based on history
- "🔥 X day streak" badge
- Weekly timeline visualization
- Today highlighted specially
- Resets on missed day

### First-Aid Emergency Guides
- 6 situations with numbered steps
- "Do NOT" warnings
- Emergency vet call button
- Mobile-friendly card layout

### Smart Notifications
- 6 types: Order, Reminder, Appointment, Social, SOS, System
- Unread badge on bell icon
- Mark all as read
- Clear all
- Click → navigate to relevant page

---

## 🚀 Performance

- Lazy image loading
- Skeleton loaders for perceived speed
- Debounced search input
- Efficient re-renders (only changed content)
- LocalStorage for instant data access
- Service worker caching for offline speed
- Optimized animations with `will-change`
- Minimal DOM manipulation
- No external JS dependencies on critical path

---

*Every feature listed above is implemented and working in the live demo at [luzaynarahman-dot.github.io/PetCare](https://luzaynarahman-dot.github.io/PetCare/).*
```
