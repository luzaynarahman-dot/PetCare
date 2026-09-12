// ============================================ //
// PETCARE v2.0 — FULL SPA APPLICATION          //
// Home | Care | Shop | Profile                 //
// Bug-Free Stable Build                        //
// ============================================ //

// ============================================ //
// SAFE STORAGE WRAPPER                         //
// (fallback if localStorage blocked)           //
// ============================================ //
(function ensureStorage() {
  try {
    const t = '__test__';
    window.localStorage.setItem(t, t);
    window.localStorage.removeItem(t);
  } catch (e) {
    console.warn('localStorage blocked — using in-memory fallback');
    const memStore = {};
    window.localStorage = {
      getItem: (k) => (k in memStore ? memStore[k] : null),
      setItem: (k, v) => { memStore[k] = String(v); },
      removeItem: (k) => { delete memStore[k]; },
      clear: () => { Object.keys(memStore).forEach(k => delete memStore[k]); },
      key: (i) => Object.keys(memStore)[i] || null,
      get length() { return Object.keys(memStore).length; }
    };
  }
})();

// ============================================ //
// PRODUCT DATABASE                             //
// ============================================ //
const products = {
  adoption: [
    { id: "adopt1", name: "Shiba Inu", price: 250, oldPrice: 350, rating: 4.8, reviews: 24, badge: "Shiba Inu", badgeClass: "", stock: "in-stock", img: "pet-care-images/shiba-inu.jpg", category: "adoption", popularity: 89 },
    { id: "adopt2", name: "Golden Retriever", price: 300, oldPrice: 450, rating: 4.9, reviews: 187, badge: "Golden Retriever", badgeClass: "badge2", stock: "in-stock", img: "pet-care-images/golden-retriver.jpg", category: "adoption", popularity: 245 },
    { id: "adopt3", name: "Siamese Cat", price: 200, oldPrice: 280, rating: 4.5, reviews: 92, badge: "Siamese Cat", badgeClass: "badge3", stock: "in-stock", img: "pet-care-images/siamese.jpg", category: "adoption", popularity: 156 },
    { id: "adopt4", name: "British Shorthair", price: 350, oldPrice: 500, rating: 4.9, reviews: 156, badge: "British Shorthair", badgeClass: "badge4", stock: "limited", img: "pet-care-images/british-shorthair.jpg", category: "adoption", popularity: 203 },
    { id: "adopt5", name: "Persian Cat", price: 400, oldPrice: 550, rating: 4.7, reviews: 203, badge: "Persian Cat", badgeClass: "badge5", stock: "in-stock", img: "pet-care-images/persian-cat.jpg", category: "adoption", popularity: 178 },
    { id: "adopt6", name: "Maine Coon", price: 450, oldPrice: 600, rating: 4.9, reviews: 178, badge: "Maine Coon", badgeClass: "", stock: "in-stock", img: "pet-care-images/mainecoon.jpg", category: "adoption", popularity: 167 },
    { id: "adopt7", name: "Bengal Cat", price: 500, oldPrice: 700, rating: 4.6, reviews: 134, badge: "Bengal Cat", badgeClass: "badge2", stock: "limited", img: "pet-care-images/bangal-cat.jpg", category: "adoption", popularity: 145 },
    { id: "adopt8", name: "Scottish Fold", price: 380, oldPrice: 520, rating: 4.8, reviews: 167, badge: "Scottish Fold", badgeClass: "badge3", stock: "in-stock", img: "pet-care-images/scottish-fold.jpg", category: "adoption", popularity: 198 },
    { id: "adopt9", name: "German Shepherd", price: 320, oldPrice: 480, rating: 4.9, reviews: 245, badge: "German Shepherd", badgeClass: "badge4", stock: "in-stock", img: "pet-care-images/german-shepherd.jpg", category: "adoption", popularity: 312 },
    { id: "adopt10", name: "Siberian Husky", price: 360, oldPrice: 500, rating: 4.7, reviews: 198, badge: "Siberian Husky", badgeClass: "badge5", stock: "limited", img: "pet-care-images/siberian-husky.jpg", category: "adoption", popularity: 234 }
  ],
  food: [
    { id: "food1", name: "Skyler Treats Herring", price: 24.99, oldPrice: 35.99, rating: 4.8, reviews: 89, badge: "Skyler Treats", badgeClass: "", stock: "in-stock", img: "pet-care-images/herring-fish.jpg", category: "food", popularity: 67 },
    { id: "food2", name: "Skyler Treats Rabbit", price: 19.99, oldPrice: 28.99, rating: 4.5, reviews: 56, badge: "Skyler Treats", badgeClass: "badge2", stock: "in-stock", img: "pet-care-images/rabbit-cubes.jpg", category: "food", popularity: 45 },
    { id: "food3", name: "Quail Egg Yolk", price: 15.99, oldPrice: 22.99, rating: 4.9, reviews: 42, badge: "Skyler Treats", badgeClass: "badge3", stock: "limited", img: "pet-care-images/quail-egg-yolk.jpg", category: "food", popularity: 38 },
    { id: "food4", name: "Beef Bone Broth", price: 29.99, oldPrice: 42.99, rating: 4.7, reviews: 112, badge: "Beef Bone Broth", badgeClass: "badge4", stock: "in-stock", img: "pet-care-images/beef-bone-broth.jpg", category: "food", popularity: 89 },
    { id: "food5", name: "Viva For Cats", price: 34.99, oldPrice: 49.99, rating: 4.6, reviews: 78, badge: "Viva For Cats", badgeClass: "badge5", stock: "in-stock", img: "pet-care-images/vivaforcats.jpg", category: "food", popularity: 56 },
    { id: "food6", name: "Me-O", price: 12.99, oldPrice: 18.99, rating: 4.4, reviews: 234, badge: "Me-O", badgeClass: "", stock: "in-stock", img: "pet-care-images/me-o.jpg", category: "food", popularity: 189 },
    { id: "food7", name: "Whiskas", price: 14.99, oldPrice: 21.99, rating: 4.7, reviews: 312, badge: "Whiskas", badgeClass: "badge2", stock: "in-stock", img: "pet-care-images/whiskas.jpg", category: "food", popularity: 278 },
    { id: "food8", name: "Jinx Biscuit", price: 9.99, oldPrice: 14.99, rating: 4.3, reviews: 67, badge: "JinX Biscuit", badgeClass: "badge3", stock: "in-stock", img: "pet-care-images/jinx-biscuit.jpg", category: "food", popularity: 54 },
    { id: "food9", name: "Selective Jr", price: 18.99, oldPrice: 27.99, rating: 4.8, reviews: 45, badge: "Selective Jr", badgeClass: "badge4", stock: "limited", img: "pet-care-images/selectivejr.jpg", category: "food", popularity: 34 },
    { id: "food10", name: "Pedigree", price: 22.99, oldPrice: 32.99, rating: 4.9, reviews: 456, badge: "Pedigree", badgeClass: "badge5", stock: "in-stock", img: "pet-care-images/pedigree.jpg", category: "food", popularity: 389 }
  ],
  accessories: [
    { id: "acc1", name: "Pet Spa Set", price: 45.99, oldPrice: 65.99, rating: 4.8, reviews: 67, badge: "Pet Spa", badgeClass: "", stock: "in-stock", img: "pet-care-images/accessories1.jpg", category: "accessories", popularity: 78 },
    { id: "acc2", name: "Pet Nail Cutter", price: 12.99, oldPrice: 19.99, rating: 4.5, reviews: 123, badge: "Pet Nail Cutter", badgeClass: "badge2", stock: "in-stock", img: "pet-care-images/accessories2.jpg", category: "accessories", popularity: 145 },
    { id: "acc3", name: "Pet Carrier", price: 55.99, oldPrice: 79.99, rating: 4.7, reviews: 89, badge: "Pet Carrier", badgeClass: "badge3", stock: "limited", img: "pet-care-images/accessories3.jpg", category: "accessories", popularity: 112 },
    { id: "acc4", name: "Dog & Cat Bowls", price: 18.99, oldPrice: 27.99, rating: 4.9, reviews: 234, badge: "Dog & Cat Bowls", badgeClass: "badge4", stock: "in-stock", img: "pet-care-images/accessories4.jpg", category: "accessories", popularity: 267 },
    { id: "acc5", name: "Pet Hair Comb", price: 14.99, oldPrice: 22.99, rating: 4.6, reviews: 156, badge: "Pet Hair Comb", badgeClass: "badge5", stock: "in-stock", img: "pet-care-images/accessories5.jpg", category: "accessories", popularity: 134 },
    { id: "acc6", name: "Dog Toothbrush", price: 8.99, oldPrice: 13.99, rating: 4.4, reviews: 78, badge: "Dog Toothbrush", badgeClass: "", stock: "in-stock", img: "pet-care-images/accessories6.jpg", category: "accessories", popularity: 89 },
    { id: "acc7", name: "Pet Grooming Kit", price: 39.99, oldPrice: 59.99, rating: 4.8, reviews: 145, badge: "Pet Grooming Kit", badgeClass: "badge2", stock: "in-stock", img: "pet-care-images/accessories7.jpg", category: "accessories", popularity: 167 },
    { id: "acc8", name: "Paw Balm", price: 11.99, oldPrice: 17.99, rating: 4.7, reviews: 98, badge: "Paw Balm", badgeClass: "badge3", stock: "in-stock", img: "pet-care-images/accessories8.jpg", category: "accessories", popularity: 76 },
    { id: "acc9", name: "Pet Ear-drops", price: 9.99, oldPrice: 14.99, rating: 4.5, reviews: 56, badge: "Pet Ear-drops", badgeClass: "badge4", stock: "limited", img: "pet-care-images/accessories9.jpg", category: "accessories", popularity: 43 },
    { id: "acc10", name: "Licking Mat", price: 13.99, oldPrice: 20.99, rating: 4.8, reviews: 112, badge: "Licking Mat", badgeClass: "badge5", stock: "in-stock", img: "pet-care-images/accessories10.jpg", category: "accessories", popularity: 98 }
  ]
};

// ============================================ //
// HEALTH GUIDANCE DATABASE                     //
// ============================================ //
const healthGuidance = {
  'not-eating': {
    title: 'Not Eating', emoji: '🍽️', severity: 'moderate',
    advice: [
      'Check if food is fresh and at room temperature',
      'Try a different flavor or brand temporarily',
      'Remove treats for 12 hours to build appetite',
      'Ensure fresh water is always available',
      'Rule out stress from recent changes'
    ],
    vetIf: 'If your pet has not eaten for more than 24 hours, contact a vet immediately.'
  },
  'vomiting': {
    title: 'Vomiting', emoji: '🤢', severity: 'high',
    advice: [
      'Withhold food for 6–12 hours to rest the stomach',
      'Provide small amounts of water frequently',
      'Watch for blood or repeated episodes',
      'Keep a log of frequency and contents',
      'Avoid giving human medications'
    ],
    vetIf: 'If vomiting occurs more than 3 times in 24 hours or contains blood, see a vet.'
  },
  'itching': {
    title: 'Itching / Scratching', emoji: '🐾', severity: 'low',
    advice: [
      'Check for fleas, ticks, or visible rashes',
      'Bathe with mild, pet-safe shampoo',
      'Apply vet-approved soothing balm',
      'Clean bedding and vacuum the environment',
      'Consider possible food allergies'
    ],
    vetIf: 'If skin is broken, hair loss occurs, or itching persists over a week, consult a vet.'
  },
  'coughing': {
    title: 'Coughing', emoji: '😷', severity: 'moderate',
    advice: [
      'Keep the environment dust-free',
      'Avoid smoke and strong odors',
      'Ensure the pet rests in a humid area',
      'Check for foreign objects in the throat',
      'Monitor breathing rate and effort'
    ],
    vetIf: 'If coughing persists more than 48 hours or is accompanied by difficulty breathing, see a vet.'
  },
  'diarrhea': {
    title: 'Diarrhea', emoji: '💧', severity: 'high',
    advice: [
      'Ensure constant access to fresh water',
      'Offer bland food (boiled chicken, rice)',
      'Avoid dairy and fatty foods',
      'Monitor for blood or mucus',
      'Keep the pet warm and rested'
    ],
    vetIf: 'If diarrhea lasts more than 24 hours, contains blood, or pet becomes lethargic, contact a vet.'
  },
  'lethargy': {
    title: 'Lethargy', emoji: '😴', severity: 'moderate',
    advice: [
      'Ensure the pet has a quiet resting place',
      'Check for fever or unusual behavior',
      'Offer water regularly',
      'Monitor appetite and bathroom habits',
      'Avoid strenuous activity'
    ],
    vetIf: 'If lethargy lasts more than 24 hours or is combined with other symptoms, see a vet.'
  }
};


// ============================================ //
// EMERGENCY DATA (v2.0)                        //
// ============================================ //

// Demo vets — real backend এ GPS query হবে
const emergencyVets = [
  { id: 1, name: 'Dhaka Pet Emergency', distance: '0.8 km', open: true, type: '24/7 Clinic', phone: '+880-1700-000001' },
  { id: 2, name: 'Animal Rescue BD', distance: '2.3 km', open: true, type: 'Rescue Center', phone: '+880-1700-000002' },
  { id: 3, name: 'City Vet Hospital', distance: '3.1 km', open: false, type: 'Clinic', phone: '+880-1700-000003' }
];

// First-Aid quick guides — 3-minute emergency instructions
const firstAidGuides = {
  choking: {
    emoji: '😰',
    title: 'Choking',
    subtitle: 'Object stuck in airway',
    steps: [
      'Stay calm. Do not panic the pet.',
      'Open mouth — remove visible object ONLY with fingers.',
      'Small pet: hold upside down, give 5 firm back blows.',
      'Large pet: Heimlich — 5 abdominal thrusts.',
      'If unconscious — begin CPR and call vet NOW.'
    ],
    dont: 'Never stick fingers blindly down throat. Never give water.'
  },
  poison: {
    emoji: '☠️',
    title: 'Poisoning',
    subtitle: 'Toxic substance ingested',
    steps: [
      'Remove pet from source immediately.',
      'Note WHAT was eaten and HOW MUCH.',
      'Do NOT induce vomiting unless vet instructs.',
      'Collect sample/vomit in a bag for the vet.',
      'Call poison hotline or vet — go immediately.'
    ],
    dont: 'Never give milk, oil, or home remedies. Never force vomit.'
  },
  bleeding: {
    emoji: '🩸',
    title: 'Bleeding',
    subtitle: 'Wound or cut',
    steps: [
      'Apply firm pressure with clean cloth for 3 min.',
      'Do NOT remove cloth if soaked — add another on top.',
      'Elevate the wound above heart if possible.',
      'Wrap with bandage — snug but not tight.',
      'Rush to vet if bleeding doesn\'t stop in 5 min.'
    ],
    dont: 'Never use tourniquet unless trained. Never apply dirt or powder.'
  },
  cpr: {
    emoji: '💓',
    title: 'CPR',
    subtitle: 'Not breathing / no pulse',
    steps: [
      'Lay pet on right side on firm surface.',
      'Close mouth, seal with your hand.',
      'Breathe into nose — 2 breaths, watch chest rise.',
      'Compress chest 100–120 times/min (30 compressions).',
      'Repeat: 30 compressions + 2 breaths until vet arrives.'
    ],
    dont: 'Do NOT press too hard on small pets. Do NOT give up early.'
  },
  heatstroke: {
    emoji: '🌡️',
    title: 'Heat Stroke',
    subtitle: 'Overheating / panting heavily',
    steps: [
      'Move pet to cool shaded area immediately.',
      'Pour cool (NOT cold) water over body — especially paws, belly.',
      'Place wet towel under armpits and groin.',
      'Offer small sips of cool water if conscious.',
      'Rush to vet — heat stroke can be fatal in 15 min.'
    ],
    dont: 'Never use ice-cold water or ice packs directly. Never leave unattended.'
  },
  fracture: {
    emoji: '🦴',
    title: 'Fracture',
    subtitle: 'Broken bone / unable to walk',
    steps: [
      'Do NOT try to reset the bone.',
      'Muzzle the pet (pain causes biting).',
      'Immobilize with a makeshift splint (rolled magazine).',
      'Support body with a towel or stretcher.',
      'Transport slowly — avoid bumps.'
    ],
    dont: 'Never let pet walk. Never apply pressure on the broken area.'
  }
};

// Urgent foster pets — demo data
const fosterPets = [
  { id: 'foster1', name: 'Milo', age: '3 months', status: 'Injured · Foster needed', urgent: true, img: 'pet-care-images/milo.png' },
  { id: 'foster2', name: 'Bella', age: '1 year', status: 'Rescue · Ready to adopt', urgent: false, img: 'pet-care-images/bella.png' },
  { id: 'foster3', name: 'Rocky', age: '6 months', status: 'Urgent · Medical care', urgent: true, img: 'pet-care-images/rocky.png' }
];


// ============================================ //
// TIPS LIBRARY                                 //
// ============================================ //
const tipsLibrary = {
  nutrition: [
    "Feed a balanced diet appropriate for your pet's age and size.",
    'Avoid toxic foods: chocolate, onions, garlic, grapes, xylitol.',
    'Fresh water should always be available.',
    'Measure portions to prevent obesity.',
    'Introduce new foods gradually over 7 days.'
  ],
  hygiene: [
    'Bathe your pet every 4–6 weeks (depending on breed).',
    'Clean food and water bowls daily.',
    'Wash bedding weekly to prevent pests.',
    'Brush teeth 2–3 times a week.',
    'Keep litter boxes and crates clean.'
  ],
  exercise: [
    'Dogs need 30–120 minutes of activity daily.',
    'Cats benefit from 15–20 minutes of play, twice a day.',
    'Use puzzle toys for mental stimulation.',
    'Adjust exercise for age and health.',
    'Avoid walking on hot pavement.'
  ],
  grooming: [
    'Brush coat 2–3 times a week to reduce shedding.',
    'Trim nails every 3–4 weeks.',
    'Check ears weekly for dirt or infection.',
    'Clean eyes gently with a damp cloth.',
    'Start grooming routines early for comfort.'
  ],
  safety: [
    'Pet-proof your home — secure cords, chemicals, trash.',
    'Use a secure collar with ID tag.',
    'Never leave pets in a hot car.',
    'Keep toxic plants out of reach.',
    'Microchip your pet for safety.'
  ],
  behavior: [
    'Use positive reinforcement for training.',
    'Socialize puppies and kittens early.',
    'Provide a safe, quiet space.',
    'Never punish physically — it damages trust.',
    'Consult a behaviorist for persistent issues.'
  ]
};

// ============================================ //
// GLOBAL STATE                                 //
// ============================================ //
let cart = [];
let wishlist = [];
let productReviews = {};
let currentReviewProduct = null;
let currentRating = 0;
let swipers = [];
let allOrders = [];
let notifications = [];

let pets = [];
let activePetId = null;
let healthLog = [];
let vaccinations = {};
let medications = {};
let reminders = {};
let dailyCare = {};
let currentPage = 'home';
let currentCareTab = 'health';
let currentTipIndex = 0;
let editingPetId = null;

let currentSort = 'default';
let currentPriceMax = 500;
let currentCategory = 'all';
let currentSearchTerm = '';
let shopInitialized = false;

// ============================================ //
// INITIALIZATION                               //
// ============================================ //
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  loadWishlist();
  loadReviews();
  loadOrders();
  loadNotifications();
  loadPets();
  loadDailyCare();
  loadHealthLog();
  loadVaccinations();
  loadMedications();
  loadReminders();
  seedDefaultData();

  showPage('home');
  

  initRouter();
  initCareTabs();
  initProfileTabs();
  initDarkMode();
  initHeroSlider();
  initEventListeners();
  initFilterListeners();
  initBackToTop();
  updateNotifBadge();
  updateWishlistCount();
  updateNotifCount();

  if (!localStorage.getItem('token') && !sessionStorage.getItem('loginPromptShown')) {
    sessionStorage.setItem('loginPromptShown', '1');
    setTimeout(() => {
      document.getElementById('loginModal')?.classList.add('active');
    }, 2500);
  }
});

// ============================================ //
// SPA ROUTER                                   //
// ============================================ //
function showPage(pageName) {
  currentPage = pageName;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageName)?.classList.add('active');

  document.querySelectorAll('.bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.bottom-nav [data-nav="${pageName}"]`)?.classList.add('active');

  if (pageName === 'home') renderHome();
  if (pageName === 'care') renderCare();
  if (pageName === 'shop') initShopPage();
  if (pageName === 'profile') renderProfile();
  if (pageName === 'memories') renderMemoriesFeed();   // ✅ NEW

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initRouter() {
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(item.dataset.nav);
    });
  });

  document.addEventListener('click', (e) => {
    const gotoBtn = e.target.closest('[data-goto]');
    if (gotoBtn) {
      e.preventDefault();
      const target = gotoBtn.dataset.goto;
      showPage(target);
      if (gotoBtn.dataset.careTab) switchCareTab(gotoBtn.dataset.careTab);
      if (gotoBtn.dataset.profileTab) switchProfileTab(gotoBtn.dataset.profileTab);
    }
  });
}

// ============================================ //
// PERSISTENCE HELPERS                          //
// ============================================ //
function loadCart() {
  try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); } catch (e) { cart = []; }
  updateCartUI();
}
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function loadWishlist() {
  try { wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch (e) { wishlist = []; }
}
function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  updateWishlistCount();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function loadReviews() {
  try { productReviews = JSON.parse(localStorage.getItem('productReviews') || '{}'); } catch (e) { productReviews = {}; }
}
function saveReviews() { localStorage.setItem('productReviews', JSON.stringify(productReviews)); }

function loadOrders() {
  try { allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]'); } catch (e) { allOrders = []; }
}
function saveOrders() {
  localStorage.setItem('allOrders', JSON.stringify(allOrders));
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function loadNotifications() {
  try { notifications = JSON.parse(localStorage.getItem('notifications') || '[]'); } catch (e) { notifications = []; }
  updateNotifBadge();
}
function saveNotifications() {
  localStorage.setItem('notifications', JSON.stringify(notifications));
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function loadPets() {
  try { pets = JSON.parse(localStorage.getItem('pets') || '[]'); } catch (e) { pets = []; }
  activePetId = localStorage.getItem('activePetId') || (pets[0]?.id ?? null);
}
function savePets() { localStorage.setItem('pets', JSON.stringify(pets)); }
function saveActivePet() { if (activePetId) localStorage.setItem('activePetId', activePetId); }
function getActivePet() { return pets.find(p => p.id === activePetId) || pets[0] || null; }

function loadDailyCare() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem('dailyCare') || '{}'); } catch (e) { saved = {}; }
  const today = new Date().toISOString().slice(0, 10);
  if (saved.date !== today) {
    const fresh = { date: today, feeding: false, water: false, exercise: false, grooming: false };
    localStorage.setItem('dailyCare', JSON.stringify(fresh));
    dailyCare = fresh;
  } else {
    dailyCare = saved;
  }
  return dailyCare;
}
function saveDailyCare(data) { localStorage.setItem('dailyCare', JSON.stringify(data)); }

function loadHealthLog() {
  try { healthLog = JSON.parse(localStorage.getItem('healthLog') || '[]'); } catch (e) { healthLog = []; }
}
function saveHealthLog() { localStorage.setItem('healthLog', JSON.stringify(healthLog)); }

function loadVaccinations() {
  try { vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '{}'); } catch (e) { vaccinations = {}; }
}
function saveVaccinations() { localStorage.setItem('vaccinations', JSON.stringify(vaccinations)); }

function loadMedications() {
  try { medications = JSON.parse(localStorage.getItem('medications') || '{}'); } catch (e) { medications = {}; }
}
function saveMedications() { localStorage.setItem('medications', JSON.stringify(medications)); }

function loadReminders() {
  try { reminders = JSON.parse(localStorage.getItem('reminders') || '{}'); } catch (e) { reminders = {}; }
}
function saveReminders() { localStorage.setItem('reminders', JSON.stringify(reminders)); }

// ============================================ //
// SEED DEMO DATA                               //
// ============================================ //
function seedDefaultData() {
  if (pets.length) return;

  const lunaId = 'pet_' + Date.now();
  pets.push({
    id: lunaId, name: 'Luna', species: 'cat', breed: 'British Shorthair',
    age: 2, weight: 4.2, gender: 'female', allergies: 'None known', img: ''
  });
  activePetId = lunaId;
  savePets();
  saveActivePet();

  vaccinations[lunaId] = [
    { name: 'Rabies', done: true },
    { name: 'FVRCP', done: true },
    { name: 'FeLV', done: false }
  ];
  saveVaccinations();

  medications[lunaId] = [{ name: 'Deworming Tablet', nextDose: 'Tomorrow 8 PM' }];
  saveMedications();

  reminders[lunaId] = [
    { date: 'Tomorrow', type: 'medication', label: '💊 Medicine — 8 PM' },
    { date: 'Sep 18', type: 'vaccination', label: '💉 Vaccination' },
    { date: 'Sep 25', type: 'grooming', label: '✂️ Grooming' }
  ];
  saveReminders();

  healthLog.push(
    { id: Date.now(), petId: lunaId, type: 'note', note: 'Ate less today', date: new Date().toISOString() },
    { id: Date.now() + 1, petId: lunaId, type: 'weight', note: 'Weight: 4.2 kg', date: new Date(Date.now() - 86400000).toISOString() },
    { id: Date.now() + 2, petId: lunaId, type: 'note', note: 'Energy: Normal', date: new Date(Date.now() - 172800000).toISOString() }
  );
  saveHealthLog();
}

// ============================================ //
// HOME PAGE                                    //
// ============================================ //
function renderHome() {
  renderGreeting();
  renderQuickStats();
  renderHomeVets();
  renderFirstAidChips();
  renderFosterPets();
  renderHomeCare();
  renderHomeTip();
  renderHomeRecommended();
  renderHomeRecentOrder();
}

function renderGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning!';
  else if (hour < 17) greeting = 'Good afternoon!';

  const greetingEl = document.getElementById('greetingText');
  if (greetingEl) greetingEl.textContent = greeting;

  const petName = getActivePet()?.name || 'your pet';
  const gPet = document.getElementById('greetingPetName');
  const gPetBtn = document.getElementById('greetingPetNameBtn');
  const weekPetName = document.getElementById('weekPetName');
  const rPet = document.getElementById('recPetName');

  if (gPet) gPet.textContent = petName;
  if (gPetBtn) gPetBtn.textContent = petName;
  if (weekPetName) weekPetName.textContent = petName;
  if (rPet) rPet.textContent = petName;
}

function renderHomeCare() {
  const grid = document.getElementById('homeCareGrid');
  if (!grid) return;
  const care = loadDailyCare();
  const items = [
    { key: 'feeding', label: 'Feeding' },
    { key: 'water', label: 'Water' },
    { key: 'grooming', label: 'Grooming' },
    { key: 'exercise', label: 'Exercise' }
  ];
  grid.innerHTML = items.map(it => `
    <div class="home-care-item ${care[it.key] ? 'done' : ''}">
      <i class="fas ${care[it.key] ? 'fa-check-circle' : 'fa-circle'}"></i>
      <span>${it.label}</span>
    </div>
  `).join('');
}

const dailyTips = [
  "Keep your pet's water bowl clean and filled with fresh water daily.",
  "Brush your pet's coat 2–3 times a week to reduce shedding.",
  "Schedule regular vet checkups — at least once a year.",
  "Never feed your pet chocolate, onions, or grapes — they're toxic.",
  "Provide interactive toys to keep your pet mentally stimulated.",
  "Trim your pet's nails every 3–4 weeks to prevent discomfort.",
  "Give your pet a comfortable, quiet place to rest.",
  "Regular exercise prevents obesity and improves mood."
];

function renderHomeTip() {
  const tipEl = document.getElementById('homeTipText');
  if (tipEl) tipEl.textContent = dailyTips[currentTipIndex % dailyTips.length];
}

function renderHomeRecommended() {
  const container = document.getElementById('homeRecommended');
  if (!container) return;
  const all = [...products.food, ...products.accessories];
  const picks = [...all].sort(() => 0.5 - Math.random()).slice(0, 6);

  container.innerHTML = picks.map(p => `
    <div class="rec-card" data-product-id="${p.id}">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='pet-care-images/logo.png'">
      <div class="rec-card-info">
        <p class="rec-card-title">${p.name}</p>
        <p class="rec-card-price">$${p.price}</p>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.rec-card').forEach(card => {
    card.addEventListener('click', () => {
      const allProducts = [...products.adoption, ...products.food, ...products.accessories];
      const product = allProducts.find(p => p.id === card.dataset.productId);
      if (product) openQuickView(product);
    });
  });
}


// ============================================ //
// HOME v2.0 — EMERGENCY LAYER RENDER           //
// ============================================ //

function renderQuickStats() {
  const orders = JSON.parse(localStorage.getItem('allOrders') || '[]');
  const logs = JSON.parse(localStorage.getItem('healthLog') || '[]');

  const streakEl = document.getElementById('statStreak');
  const ordersEl = document.getElementById('statOrders');
  const logsEl = document.getElementById('statLogs');

  const streak = logs.length > 0 ? Math.min(4 + Math.floor(logs.length / 3), 14) : 0;

  if (streakEl) streakEl.textContent = streak;
  if (ordersEl) ordersEl.textContent = orders.length;
  if (logsEl) logsEl.textContent = logs.length;

  // ✅ Render paw timeline
  renderWeekTimeline(streak);
}

// ✅ Weekly paw timeline renderer
function renderWeekTimeline(streakCount) {
  const timeline = document.getElementById('weekTimeline');
  if (!timeline) return;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const doneDays = new Set();
  for (let i = 0; i < Math.min(streakCount, 7); i++) {
    const idx = (todayIdx - i + 7) % 7;
    doneDays.add(idx);
  }

  timeline.innerHTML = days.map((day, i) => {
    const isDone = doneDays.has(i);
    const isToday = i === todayIdx;
    return `
      <div class="week-day ${isDone ? 'done' : ''} ${isToday ? 'today' : ''}">
        <div class="week-paw">🐾</div>
        <span class="week-label">${day}</span>
      </div>
    `;
  }).join('');
}

function renderHomeVets() {
  const list = document.getElementById('homeVetList');
  if (!list) return;

  list.innerHTML = emergencyVets.map(vet => `
    <div class="vet-item ${vet.open ? '' : 'closed'}">
      <div class="vet-icon">
        <i class="fas ${vet.type === 'Rescue Center' ? 'fa-paw' : 'fa-hospital'}"></i>
      </div>
      <div class="vet-info">
        <p class="vet-name">${vet.name}</p>
        <div class="vet-meta">
          <span class="open-badge">${vet.open ? 'OPEN' : 'CLOSED'}</span>
          <span>${vet.type}</span>
          <span>·</span>
          <span>${vet.distance}</span>
        </div>
      </div>
      <button class="vet-call-btn" data-phone="${vet.phone}" data-name="${vet.name}" title="Call">
        <i class="fas fa-phone"></i>
      </button>
    </div>
  `).join('');

  // Attach call handlers
  list.querySelectorAll('.vet-call-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const name = btn.dataset.name;
      const phone = btn.dataset.phone;
      showToast(`📞 Calling ${name}...`);
      // Real app: window.location.href = `tel:${phone}`;
    };
  });
}

function renderFirstAidChips() {
  const grid = document.getElementById('firstaidGrid');
  if (!grid) return;

  grid.innerHTML = Object.entries(firstAidGuides).map(([key, guide]) => `
    <button class="firstaid-chip" data-guide="${key}">
      <span class="fa-emoji">${guide.emoji}</span>
      <span class="fa-label">${guide.title}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.firstaid-chip').forEach(chip => {
    chip.onclick = () => openFirstAidModal(chip.dataset.guide);
  });
}

function renderFosterPets() {
  const scroll = document.getElementById('fosterScroll');
  if (!scroll) return;

  scroll.innerHTML = fosterPets.map(pet => `
    <div class="foster-card-item" data-foster-id="${pet.id}">
      ${pet.urgent ? '<span class="foster-urgent-badge">URGENT</span>' : ''}
      <img src="${pet.img}" alt="${pet.name}" class="foster-img" onerror="this.src='pet-care-images/logo.png'">
      <p class="foster-name">${pet.name}</p>
      <p class="foster-meta">${pet.age} · ${pet.status}</p>
    </div>
  `).join('');

  scroll.querySelectorAll('.foster-card-item').forEach(card => {
  card.onclick = () => {
    const pet = fosterPets.find(p => p.id === card.dataset.fosterId);
    if (pet) openFosterModal(pet);
  };
});
}


function openFosterModal(pet) {
  const modal = document.getElementById('fosterModal');
  const body = document.getElementById('fosterModalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <img src="${pet.img}" alt="${pet.name}" 
         style="width:100%; max-height:240px; object-fit:cover; border-radius:14px; margin-bottom:15px; background:#FCE7F3;" 
         onerror="this.src='pet-care-images/logo.png'">
    
    ${pet.urgent ? '<span style="background:#DC2626; color:white; padding:5px 14px; border-radius:20px; font-size:11px; font-weight:800; letter-spacing:0.5px; display:inline-block;">🚨 URGENT</span>' : ''}
    
    <h3 style="color:#831843; font-size:1.4rem; margin:12px 0 6px; font-weight:800;">${pet.name}</h3>
    <p style="color:#BE185D; font-size:13px; font-weight:600; margin-bottom:18px;">${pet.age} · ${pet.status}</p>
    
    <div style="background:#FDF2F8; padding:14px; border-radius:12px; margin-bottom:18px;">
      <p style="color:#831843; font-size:13.5px; line-height:1.6; margin:0;">
        ${pet.name} was recently rescued and needs urgent foster care or adoption. 
        Please help give ${pet.name} a safe home while we find a permanent family.
      </p>
    </div>
    
    <div style="display:flex; gap:8px; margin-bottom:14px;">
      <div style="flex:1; text-align:center; padding:10px; background:#F8FAFF; border-radius:10px;">
        <p style="color:#94A3B8; font-size:10px; font-weight:700; text-transform:uppercase; margin:0 0 3px;">AGE</p>
        <p style="color:#2F3A5F; font-size:13px; font-weight:700; margin:0;">${pet.age}</p>
      </div>
      <div style="flex:1; text-align:center; padding:10px; background:#F8FAFF; border-radius:10px;">
        <p style="color:#94A3B8; font-size:10px; font-weight:700; text-transform:uppercase; margin:0 0 3px;">STATUS</p>
        <p style="color:#2F3A5F; font-size:13px; font-weight:700; margin:0;">${pet.urgent ? 'Urgent' : 'Available'}</p>
      </div>
      <div style="flex:1; text-align:center; padding:10px; background:#F8FAFF; border-radius:10px;">
        <p style="color:#94A3B8; font-size:10px; font-weight:700; text-transform:uppercase; margin:0 0 3px;">DISTANCE</p>
        <p style="color:#2F3A5F; font-size:13px; font-weight:700; margin:0;">2.4 km</p>
      </div>
    </div>
    
    <button class="foster-contact-btn" onclick="handleFosterContact('${pet.name}')">
      <i class="fas fa-hand-holding-heart"></i>
      Contact Rescue Team
    </button>
  `;

  modal.classList.add('active');
}

function handleFosterContact(name) {
  const btn = document.querySelector('.foster-contact-btn');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending request...';
    btn.style.pointerEvents = 'none';
  }
  
  setTimeout(() => {
    showToast(`💌 Request sent for ${name}!`);
    addNotification(
      '🐾 Foster Request Sent',
      `Your request to foster ${name} was sent. Rescue team will contact you within 24h.`
    );
    document.getElementById('fosterModal')?.classList.remove('active');
  }, 1600);
}



function renderHomeRecentOrder() {
  const card = document.getElementById('recentOrderCard');
  const body = document.getElementById('homeRecentOrder');
  if (!card || !body) return;
  if (!allOrders.length) { card.style.display = 'none'; return; }

  card.style.display = 'block';
  const latest = [...allOrders].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  body.innerHTML = `
    <div class="home-order-row">
      <div>
        <p class="home-order-id">#${latest.id}</p>
        <p class="order-status ${latest.status}">${latest.status.toUpperCase()}</p>
      </div>
      <div style="text-align:right;">
        <p class="home-order-total">$${latest.total.toFixed(2)}</p>
        <button class="track-mini-btn" data-order-id="${latest.id}">Track →</button>
      </div>
    </div>
  `;
  body.querySelector('.track-mini-btn')?.addEventListener('click', () => {
    document.getElementById('trackingId').value = latest.id;
    document.getElementById('trackingModal')?.classList.add('active');
    trackOrder();
  });
}

// ============================================ //
// CARE PAGE                                    //
// ============================================ //
function switchCareTab(tabName) {
  currentCareTab = tabName;
  document.querySelectorAll('.care-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.care-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.care-tab[data-care-tab="${tabName}"]`)?.classList.add('active');
  document.getElementById('careTab-' + tabName)?.classList.add('active');

  if (tabName === 'health') renderCareHealth();
  if (tabName === 'daily') renderDailyCare();
  if (tabName === 'reminders') renderReminders();
  if (tabName === 'guidance') renderGuidance();
  if (tabName === 'tips') renderTipsLibrary();
}

function initCareTabs() {
  document.querySelectorAll('.care-tab').forEach(tab => {
    tab.addEventListener('click', () => switchCareTab(tab.dataset.careTab));
  });
}

function renderCare() {
  renderPetsList();
  if (currentCareTab === 'health') renderCareHealth();
  if (currentCareTab === 'daily') renderDailyCare();
  if (currentCareTab === 'reminders') renderReminders();
  if (currentCareTab === 'guidance') renderGuidance();
  if (currentCareTab === 'tips') renderTipsLibrary();
}

function renderPetsList() {
  const list = document.getElementById('petsList');
  if (!list) return;

  if (!pets.length) {
    list.innerHTML = `<p class="empty-state">No pets yet. <button class="card-link-btn" id="emptyAddPet">Add your first pet →</button></p>`;
    document.getElementById('emptyAddPet')?.addEventListener('click', () => openPetModal());
    return;
  }

  list.innerHTML = pets.map(p => `
    <div class="pet-chip ${p.id === activePetId ? 'active' : ''}" data-pet-id="${p.id}">
      <div class="pet-avatar">${p.species === 'cat' ? '🐱' : p.species === 'dog' ? '🐶' : '🐾'}</div>
      <div class="pet-chip-info">
        <p class="pet-chip-name">${p.name}</p>
        <p class="pet-chip-meta">${p.age || '?'}y • ${p.weight || '?'}kg</p>
      </div>
      <button class="pet-edit-btn" data-edit-pet="${p.id}"><i class="fas fa-pen"></i></button>
    </div>
  `).join('');

  list.querySelectorAll('.pet-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      if (e.target.closest('.pet-edit-btn')) return;
      activePetId = chip.dataset.petId;
      saveActivePet();
      renderCare();
      renderGreeting();
    });
  });

  list.querySelectorAll('.pet-edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPetModal(btn.dataset.editPet);
    });
  });
}

function renderCareHealth() {
  const pet = getActivePet();
  const logList = document.getElementById('healthLogList');
  const vaxList = document.getElementById('vaxList');
  const medList = document.getElementById('medList');

  if (!pet) {
    if (logList) logList.innerHTML = '<p class="empty-state">Add a pet to see health data.</p>';
    if (vaxList) vaxList.innerHTML = '<p class="empty-state">No pet selected.</p>';
    if (medList) medList.innerHTML = '<p class="empty-state">No pet selected.</p>';
    const ctx = document.getElementById('careWeightChart');
    if (ctx && window.careWeightChartInstance) {
      window.careWeightChartInstance.destroy();
      window.careWeightChartInstance = null;
    }
    return;
  }

  if (logList) {
    const petLog = healthLog.filter(l => l.petId === pet.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!petLog.length) {
      logList.innerHTML = '<p class="empty-state">No health entries yet. Click "Add" to record one.</p>';
    } else {
      logList.innerHTML = petLog.slice(0, 10).map(l => `
        <div class="health-log-item">
          <div class="health-log-dot"></div>
          <div class="health-log-content">
            <p class="health-log-note">${l.note}</p>
            <p class="health-log-date">${new Date(l.date).toLocaleDateString()}</p>
          </div>
          <button class="health-log-delete" data-log-id="${l.id}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `).join('');

      // Attach delete handlers
      logList.querySelectorAll('.health-log-delete').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const id = parseInt(btn.dataset.logId);
          if (confirm('Delete this entry?')) {
            healthLog = healthLog.filter(l => l.id !== id);
            saveHealthLog();
            renderCareHealth();
            showToast('Entry deleted');
          }
        };
      });
    }
  }

  if (vaxList) {
    const vax = vaccinations[pet.id] || [];
    vaxList.innerHTML = vax.length ? vax.map((v, i) => `
      <div class="vax-item ${v.done ? 'done' : ''}">
        <i class="fas ${v.done ? 'fa-check-circle' : 'fa-circle'}"></i>
        <span>${v.name}</span>
        <span class="vax-status">${v.done ? 'Completed' : 'Pending'}</span>
      </div>
    `).join('') : '<p class="empty-state">No vaccinations recorded yet. Click "Add".</p>';
  }

  if (medList) {
    const meds = medications[pet.id] || [];
    medList.innerHTML = meds.length ? meds.map(m => `
      <div class="med-item">
        <i class="fas fa-pills"></i>
        <div>
          <p class="med-name">${m.name}</p>
          <p class="med-dose">Next: ${m.nextDose}</p>
        </div>
      </div>
    `).join('') : '<p class="empty-state">No medications yet. Click "Add".</p>';
  }

  const ctx = document.getElementById('careWeightChart')?.getContext('2d');
  if (ctx) {
    if (window.careWeightChartInstance) window.careWeightChartInstance.destroy();
    const baseWeight = pet.weight || 4.2;
    const weights = [
      +(baseWeight - 0.2).toFixed(2),
      +(baseWeight - 0.1).toFixed(2),
      +(baseWeight - 0.05).toFixed(2),
      +baseWeight.toFixed(2),
      +baseWeight.toFixed(2)
    ];
    window.careWeightChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4', 'Now'],
        datasets: [{
          label: 'Weight (kg)', data: weights,
          borderColor: '#5372F0', backgroundColor: 'rgba(83,114,240,0.1)',
          tension: 0.4, fill: true, pointBackgroundColor: '#2F3A5F', pointRadius: 5
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }
    });
  }
}

function renderDailyCare() {
  const list = document.getElementById('dailyCareList');
  const dateLabel = document.getElementById('dailyDateLabel');
  if (!list) return;

  dailyCare = loadDailyCare();
  if (dateLabel) dateLabel.textContent = new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' });

  const items = [
    { key: 'feeding', label: 'Feeding', icon: 'fa-utensils' },
    { key: 'water', label: 'Fresh Water', icon: 'fa-tint' },
    { key: 'exercise', label: 'Exercise / Play', icon: 'fa-running' },
    { key: 'grooming', label: 'Grooming / Brushing', icon: 'fa-cut' }
  ];

  list.innerHTML = items.map(it => `
    <label class="daily-care-row ${dailyCare[it.key] ? 'done' : ''}">
      <input type="checkbox" data-care-key="${it.key}" ${dailyCare[it.key] ? 'checked' : ''}>
      <i class="fas ${it.icon}"></i>
      <span>${it.label}</span>
      ${dailyCare[it.key] ? '<i class="fas fa-check-circle done-check"></i>' : ''}
    </label>
  `).join('');

  list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const key = e.target.dataset.careKey;
      dailyCare[key] = e.target.checked;
      saveDailyCare(dailyCare);
      renderDailyCare();
      renderHomeCare();
      if (e.target.checked) showToast('✓ ' + key.charAt(0).toUpperCase() + key.slice(1) + ' done!');
    });
  });
}

function renderReminders() {
  const list = document.getElementById('remindersList');
  if (!list) return;
  const pet = getActivePet();
  if (!pet) { list.innerHTML = '<p class="empty-state">Add a pet first.</p>'; return; }

  const rem = reminders[pet.id] || [];
  if (!rem.length) { list.innerHTML = '<p class="empty-state">No upcoming reminders. Click "Add".</p>'; return; }

  list.innerHTML = rem.map(r => `
    <div class="reminder-item reminder-${r.type}">
      <p class="reminder-date">${r.date}</p>
      <p class="reminder-label">${r.label}</p>
    </div>
  `).join('');
}

function renderGuidance() {
  const chips = document.querySelectorAll('.concern-chip');
  chips.forEach(chip => {
    chip.onclick = () => showGuidance(chip.dataset.symptom);
  });

  const searchBtn = document.getElementById('symptomSearchBtn');
  if (searchBtn) {
    searchBtn.onclick = () => {
      const input = document.getElementById('symptomInput')?.value?.toLowerCase().trim();
      if (!input) return;
      let match = null;
      if (input.includes('eat') || input.includes('food') || input.includes('appetite')) match = 'not-eating';
      else if (input.includes('vomit') || input.includes('throw')) match = 'vomiting';
      else if (input.includes('itch') || input.includes('scratch') || input.includes('rash')) match = 'itching';
      else if (input.includes('cough') || input.includes('choke')) match = 'coughing';
      else if (input.includes('diarrhea') || input.includes('loose')) match = 'diarrhea';
      else if (input.includes('tired') || input.includes('lazy') || input.includes('letharg')) match = 'lethargy';

      if (match) showGuidance(match);
      else showToast('No specific match found. Try a common concern chip below.');
    };
  }
}

function showGuidance(symptomKey) {
  const guide = healthGuidance[symptomKey];
  const result = document.getElementById('guidanceResult');
  if (!guide || !result) return;

  const severityColors = { low: '#4CAF50', moderate: '#FF9800', high: '#f44336' };

  result.innerHTML = `
    <div class="guidance-card severity-${guide.severity}">
      <div class="guidance-header">
        <span class="guidance-emoji">${guide.emoji}</span>
        <h3>${guide.title}</h3>
        <span class="severity-badge" style="background:${severityColors[guide.severity]}">
          ${guide.severity.toUpperCase()}
        </span>
      </div>
      <h4>What to do:</h4>
      <ul class="guidance-advice">
        ${guide.advice.map(a => `<li>${a}</li>`).join('')}
      </ul>
      <div class="vet-if-box">
        <i class="fas fa-exclamation-triangle"></i>
        <p><strong>See a vet if:</strong> ${guide.vetIf}</p>
      </div>
      <button class="guidance-save-btn" data-symptom="${symptomKey}">
        <i class="fas fa-save"></i> Save to Health Log
      </button>
    </div>
  `;

  result.querySelector('.guidance-save-btn')?.addEventListener('click', () => {
    const pet = getActivePet();
    if (!pet) { showToast('Add a pet first'); return; }
    healthLog.push({
      id: Date.now(), petId: pet.id, type: 'symptom',
      note: `${guide.emoji} ${guide.title}`, date: new Date().toISOString()
    });
    saveHealthLog();
    showToast('Saved to health log ✓');
    if (currentCareTab === 'health') renderCareHealth();
  });
}

function renderTipsLibrary() {
  const chips = document.querySelectorAll('.tip-cat-chip');
  chips.forEach(chip => {
    chip.onclick = () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      displayTips(chip.dataset.tipCat);
    };
  });
  const activeCat = document.querySelector('.tip-cat-chip.active')?.dataset.tipCat || 'nutrition';
  displayTips(activeCat);
}

function displayTips(category) {
  const list = document.getElementById('tipsList');
  if (!list) return;
  const tips = tipsLibrary[category] || [];
  list.innerHTML = tips.map((t, i) => `
    <div class="tip-card">
      <span class="tip-number">${i + 1}</span>
      <p>${t}</p>
    </div>
  `).join('');
}

// ============================================ //
// PET MODAL                                    //
// ============================================ //
function openPetModal(petId = null) {
  editingPetId = petId;
  const modal = document.getElementById('petModal');
  const title = document.getElementById('petModalTitle');
  if (!modal) return;

  if (petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    if (title) title.textContent = 'Edit Pet';
    document.getElementById('petName').value = pet.name || '';
    document.getElementById('petSpecies').value = pet.species || '';
    document.getElementById('petBreed').value = pet.breed || '';
    document.getElementById('petAge').value = pet.age || '';
    document.getElementById('petWeight').value = pet.weight || '';
    document.getElementById('petGender').value = pet.gender || '';
    document.getElementById('petAllergies').value = pet.allergies || '';
  } else {
    if (title) title.textContent = 'Add Pet';
    document.getElementById('petForm')?.reset();
  }
  modal.classList.add('active');
}

// ============================================ //
// SHOP PAGE                                    //
// ============================================ //
function initShopPage() {
  if (shopInitialized) {
    setTimeout(() => initSwiperInstances(), 50);
    return;
  }
  shopInitialized = true;

  const skel = document.getElementById('skeletonContainer');
  const main = document.getElementById('mainContent');

  if (skel) skel.style.display = 'grid';
  if (main) main.style.display = 'none';

  setTimeout(() => {
    if (skel) skel.style.display = 'none';
    if (main) main.style.display = 'block';
    renderShopProducts();
    setTimeout(() => initSwiperInstances(), 100);
  }, 400);
}

function renderShopProducts() {
  const adoptionList = document.getElementById('adoptionList');
  const foodList = document.getElementById('foodList');
  const accessoriesList = document.getElementById('accessoriesList');

  if (adoptionList) adoptionList.innerHTML = products.adoption.map(p => createProductCard(p)).join('');
  if (foodList) foodList.innerHTML = products.food.map(p => createProductCard(p)).join('');
  if (accessoriesList) accessoriesList.innerHTML = products.accessories.map(p => createProductCard(p)).join('');

  attachCardEvents();
}

function initSwiperInstances() {
  if (swipers.length) {
    swipers.forEach(s => {
      try { s.destroy(true, true); } catch (err) { /* ignore */ }
    });
    swipers = [];
  }

  document.querySelectorAll('.card-wrapper').forEach((wrapper) => {
    const sectionEl = wrapper.closest('.swiper-section');
    if (sectionEl && sectionEl.style.display === 'none') return;

    try {
      const swiper = new Swiper(wrapper, {
        loop: false,
        spaceBetween: 20,
        centeredSlides: false,
        observer: true,
        observeParents: true,
        pagination: {
          el: wrapper.querySelector('.swiper-pagination'),
          clickable: true
        },
        breakpoints: {
          0: { slidesPerView: 1.1 },
          640: { slidesPerView: 1.8 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }
      });
      swipers.push(swiper);
    } catch (err) {
      console.warn('Swiper init failed:', err);
    }
  });
}

function createProductCard(p) {
  const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  const starRating = getStarHtml(p.rating);
  const isInWishlist = wishlist.includes(p.id);
  const reviews = productReviews[p.id] || [];
  const reviewCount = p.reviews + reviews.length;

  return `
    <li class="card-item swiper-slide" data-product-id="${p.id}" data-product-name="${p.name}" data-product-category="${p.category}" data-product-price="${p.price}" data-product-img="${p.img}">
      <div class="card-link">
        <div class="card-image-container">
          <img src="${p.img}" alt="${p.name}" loading="lazy" class="card-img" onerror="this.src='pet-care-images/logo.png'">
          <button class="favorite-btn ${isInWishlist ? 'active' : ''}" data-product-id="${p.id}">${isInWishlist ? '♥' : '♡'}</button>
          <span class="stock-badge ${p.stock}">${p.stock === 'in-stock' ? 'In Stock' : 'Limited'}</span>
        </div>
        <div class="card-info">
          <p class="badge ${p.badgeClass}">${p.badge}</p>
          <h3 class="card-title">${p.name}</h3>
          <div class="rating">
            <span class="stars">${starRating}</span>
            <span class="rating-count view-reviews-link" data-product-id="${p.id}">(${reviewCount})</span>
          </div>
          <div class="price-row">
            <span class="current-price">$${p.price}</span>
            <span class="old-price">$${p.oldPrice}</span>
            <span class="discount-badge">-${discount}%</span>
          </div>
          <div class="card-actions">
            <button class="quick-view-btn" data-product-id="${p.id}">Quick View</button>
            <button class="cart-btn add-to-cart-btn" data-product-id="${p.id}"></button>
          </div>
        </div>
      </div>
    </li>
  `;
}

function getStarHtml(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '★';
  while (s.length < 5) s += '☆';
  return s;
}

// ============================================ //
// SHOP — FILTER & SORT                         //
// ============================================ //
function initFilterListeners() {
  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    filterAndSortAllSections();
  });
  document.getElementById('priceRange')?.addEventListener('input', (e) => {
    currentPriceMax = parseInt(e.target.value);
    const pm = document.getElementById('priceMax');
    if (pm) pm.textContent = currentPriceMax;
    filterAndSortAllSections();
  });
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      filterAndSortAllSections();
    });
  });
  document.getElementById('liveSearch')?.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    const clear = document.getElementById('searchClear');
    if (clear) clear.style.display = currentSearchTerm ? 'flex' : 'none';
    filterAndSortAllSections();
  });
  document.getElementById('searchClear')?.addEventListener('click', () => {
    const input = document.getElementById('liveSearch');
    if (input) input.value = '';
    currentSearchTerm = '';
    document.getElementById('searchClear').style.display = 'none';
    filterAndSortAllSections();
  });
}

function sortProducts(list, sortType) {
  const sorted = [...list];
  switch(sortType) {
    case 'price-low': return sorted.sort((a, b) => a.price - b.price);
    case 'price-high': return sorted.sort((a, b) => b.price - a.price);
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'popularity': return sorted.sort((a, b) => b.popularity - a.popularity);
    default: return sorted;
  }
}

function filterAndSortAllSections() {
  const allProducts = [...products.adoption, ...products.food, ...products.accessories];
  let filtered = allProducts.filter(p => p.price <= currentPriceMax);
  if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
  if (currentSearchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(currentSearchTerm));

  const sorted = sortProducts(filtered, currentSort);

  ['adoption', 'food', 'accessories'].forEach(section => {
    const sectionProducts = sorted.filter(p => p.category === section);
    const container = document.getElementById(`${section}List`);
    const sectionEl = document.getElementById(`section${section.charAt(0).toUpperCase() + section.slice(1)}`);

    if (!container || !sectionEl) return;

    if (sectionProducts.length === 0) {
      sectionEl.style.display = 'none';
    } else {
      sectionEl.style.display = 'block';
      container.innerHTML = sectionProducts.map(p => createProductCard(p)).join('');
    }
  });

  const noRes = document.getElementById('noResults');
  const mainContent = document.getElementById('mainContent');
  if (noRes) {
    if (filtered.length === 0) {
      noRes.style.display = 'block';
      if (mainContent) mainContent.style.display = 'block';
    } else {
      noRes.style.display = 'none';
    }
  }

  const countEl = document.getElementById('searchResultsCount');
  if (countEl) {
    countEl.textContent = currentSearchTerm
      ? `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`
      : '';
  }

  attachCardEvents();

  if (filtered.length > 0) {
    setTimeout(() => initSwiperInstances(), 60);
  }
}

// ============================================ //
// SHOP — CARD EVENTS                           //
// ============================================ //
function attachCardEvents() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const card = btn.closest('.card-item');
      if (card) addToCart(card.dataset.productId, card.dataset.productName, card.dataset.productPrice);
    };
  });
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const card = btn.closest('.card-item');
      if (card) {
        const all = [...products.adoption, ...products.food, ...products.accessories];
        const product = all.find(p => p.id === card.dataset.productId);
        if (product) openQuickView(product);
      }
    };
  });
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleWishlist(btn.dataset.productId);
    };
  });
  document.querySelectorAll('.view-reviews-link').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      showReviews(btn.dataset.productId);
    };
  });
}

// ============================================ //
// CART                                         //
// ============================================ //
function addToCart(productId, productName, productPrice) {
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ id: productId, name: productName, price: parseFloat(productPrice), quantity: 1 });
  saveCart();
  showToast(`${productName} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  showToast('Item removed');
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(productId);
  else saveCart();
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;

  const totalPrice = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
  if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  if (!cartItems) return;
  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
          <button class="cart-qty-minus" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="cart-qty-plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <i class="fas fa-trash cart-item-remove" data-id="${item.id}"></i>
    </div>
  `).join('');

  cartItems.querySelectorAll('.cart-qty-minus').forEach(b => b.onclick = () => updateQuantity(b.dataset.id, -1));
  cartItems.querySelectorAll('.cart-qty-plus').forEach(b => b.onclick = () => updateQuantity(b.dataset.id, 1));
  cartItems.querySelectorAll('.cart-item-remove').forEach(b => b.onclick = () => removeFromCart(b.dataset.id));
}

// ============================================ //
// WISHLIST                                     //
// ============================================ //
function toggleWishlist(productId) {
  const i = wishlist.indexOf(productId);
  if (i === -1) { wishlist.push(productId); showToast('Added to wishlist'); }
  else { wishlist.splice(i, 1); showToast('Removed from wishlist'); }
  saveWishlist();
  renderShopProducts();
  if (document.getElementById('wishlistModal')?.classList.contains('active')) updateWishlistUI();
}

function updateWishlistUI() {
  const container = document.getElementById('wishlistItems');
  if (!container) return;
  if (!wishlist.length) {
    container.innerHTML = '<p class="empty-wishlist">Your wishlist is empty</p>';
    return;
  }
  const all = [...products.adoption, ...products.food, ...products.accessories];
  const items = all.filter(p => wishlist.includes(p.id));
  container.innerHTML = items.map(p => `
    <div class="wishlist-item">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='pet-care-images/logo.png'">
      <div class="wishlist-item-info">
        <div class="wishlist-item-title">${p.name}</div>
        <div class="wishlist-item-price">$${p.price}</div>
      </div>
      <div class="wishlist-item-actions">
        <button class="wishlist-add-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Add</button>
        <button class="wishlist-remove" data-id="${p.id}">✕</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.wishlist-add-cart').forEach(b => b.onclick = () => addToCart(b.dataset.id, b.dataset.name, b.dataset.price));
  container.querySelectorAll('.wishlist-remove').forEach(b => b.onclick = () => { toggleWishlist(b.dataset.id); updateWishlistUI(); });
}

// ============================================ //
// QUICK VIEW MODAL                             //
// ============================================ //
function openQuickView(product) {
  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const reviews = productReviews[product.id] || [];
  const reviewCount = product.reviews + reviews.length;

  body.innerHTML = `
    <img src="${product.img}" alt="${product.name}" class="modal-product-img" onerror="this.src='pet-care-images/logo.png'">
    <h3 class="modal-product-title">${product.name}</h3>
    <div class="rating">${getStarHtml(product.rating)} (${reviewCount} reviews)</div>
    <p class="modal-product-price">$${product.price} <span class="old-price">$${product.oldPrice}</span> <span class="discount-badge">-${discount}%</span></p>
    <p class="modal-product-desc">${product.name} is a premium product loved by pet owners worldwide.</p>
    <div class="modal-quantity">
      <button id="modalQtyMinus">-</button>
      <span id="modalQty">1</span>
      <button id="modalQtyPlus">+</button>
    </div>
    <button class="modal-add-btn" id="modalAddToCart">Add to Cart</button>
  `;

  let qty = 1;
  const qtySpan = document.getElementById('modalQty');
  document.getElementById('modalQtyMinus').onclick = () => { if (qty > 1) { qty--; qtySpan.textContent = qty; } };
  document.getElementById('modalQtyPlus').onclick = () => { qty++; qtySpan.textContent = qty; };
  document.getElementById('modalAddToCart').onclick = () => {
    for (let i = 0; i < qty; i++) addToCart(product.id, product.name, product.price);
    modal.classList.remove('active');
  };

  modal.classList.add('active');
}

// ============================================ //
// CHECKOUT & ORDERS                            //
// ============================================ //
function openCheckout() {
  const modal = document.getElementById('checkoutModal');
  const summary = document.getElementById('orderSummary');
  if (!modal || !summary) return;
  if (!cart.length) { showToast('Your cart is empty'); return; }

  const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
  summary.innerHTML = `
    <h4>Order Summary</h4>
    ${cart.map(i => `<div class="order-summary-item"><span>${i.name} x${i.quantity}</span><span>$${(i.price * i.quantity).toFixed(2)}</span></div>`).join('')}
    <div class="order-summary-item" style="font-weight:700; margin-top:10px; padding-top:10px; border-top:1px solid #ddd;"><span>Total</span><span>$${total.toFixed(2)}</span></div>
  `;
  modal.classList.add('active');
}

function trackOrder() {
  const id = document.getElementById('trackingId')?.value?.trim();
  const result = document.getElementById('trackingResult');
  if (!result) return;
  if (!id) { result.innerHTML = '<p style="color:red;">Enter an Order ID</p>'; return; }

  const order = allOrders.find(o => o.id === id);
  if (!order) { result.innerHTML = '<p style="color:red;">Order not found.</p>'; return; }

  const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const idx = steps.indexOf(order.status);

  result.innerHTML = `
    <h4>Order #${order.id}</h4>
    <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
    <p>Total: $${order.total.toFixed(2)}</p>
    <div class="tracking-status">
      ${steps.map((s, i) => `
        <div class="status-step ${idx >= i ? 'active' : ''}">
          <div class="step-icon">${idx >= i ? '✓' : '●'}</div>
          <span>${s.charAt(0).toUpperCase() + s.slice(1)}</span>
        </div>
      `).join('')}
    </div>
    <p style="margin-top:15px;">Deliver to: ${order.address}</p>
  `;
}

// ============================================ //
// REVIEWS                                      //
// ============================================ //
function addReview(productId, rating, text) {
  if (!productReviews[productId]) productReviews[productId] = [];
  productReviews[productId].push({
    id: Date.now(), rating, text,
    date: new Date().toLocaleDateString(), userName: 'Customer'
  });
  saveReviews();
  renderShopProducts();
  showToast('Review submitted ✓');
}

function showReviews(productId) {
  const reviews = productReviews[productId] || [];
  const all = [...products.adoption, ...products.food, ...products.accessories];
  const product = all.find(p => p.id === productId);
  if (!product) return;

  let html = `<h3>Reviews for ${product.name}</h3>`;
  if (!reviews.length) html += '<p>No reviews yet. Be the first!</p>';
  else html += reviews.map(r => `
    <div class="review-item">
      <div class="review-header"><span class="review-stars">${getStarHtml(r.rating)}</span><span class="review-date">${r.date}</span></div>
      <p class="review-text">${r.text}</p>
      <span class="review-author">- ${r.userName}</span>
    </div>
  `).join('');
  html += `<button class="write-review-btn" data-id="${productId}">Write a Review</button>`;

  showModalContent(html);
  document.querySelector('.write-review-btn')?.addEventListener('click', () => {
    closeModal();
    openReviewModal(productId);
  });
}

function openReviewModal(productId) {
  currentReviewProduct = productId;
  currentRating = 0;
  const modal = document.getElementById('reviewModal');
  if (!modal) return;
  document.querySelectorAll('#reviewStars i').forEach(s => s.classList.remove('active'));
  const rt = document.getElementById('reviewText');
  if (rt) rt.value = '';
  modal.classList.add('active');
}

function initReviewStars() {
  document.querySelectorAll('#reviewStars i').forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.rating);
      document.querySelectorAll('#reviewStars i').forEach((s, i) => {
        s.classList.toggle('active', i < currentRating);
      });
    });
  });
}

// ============================================ //
// PROFILE PAGE                                 //
// ============================================ //
function switchProfileTab(tabName) {
  if (tabName === 'orders') {
    document.getElementById('orderFilter')?.scrollIntoView({ behavior: 'smooth' });
  }
}

function initProfileTabs() {
  document.getElementById('orderFilter')?.addEventListener('change', renderProfileOrders);
}

function renderProfile() {
  renderProfileHeader();
  renderProfilePets();
  renderProfileOrders();
  updateWishlistCount();
  updateNotifCount();
  syncSettingsUI();
}

function renderProfileHeader() {
  const user = JSON.parse(localStorage.getItem('user') || 'null') || { name: 'Guest User', email: 'guest@petcare.shop' };
  const role = getUserRole();
  const vetName = localStorage.getItem('vetName');
  const vetSpecialty = localStorage.getItem('vetSpecialty');

  const av = document.getElementById('profileAvatar');
  const nm = document.getElementById('profileName');
  const em = document.getElementById('profileEmail');
  const tag = document.getElementById('profileVetTag');

  const displayName = (role === 'vet' && vetName) ? vetName : (user.name || 'Guest User');

  if (av) av.textContent = (displayName || 'G').charAt(0).toUpperCase();
  if (nm) {
    nm.innerHTML = displayName;
    if (tag) {
      if (role === 'vet') {
        tag.innerHTML = '<span class="vet-verified-tag"><i class="fas fa-circle-check"></i> Vet</span>';
      } else if (role === 'normal') {
        tag.innerHTML = '<span class="role-badge normal"><i class="fas fa-user"></i> Pet Owner</span>';
      } else {
        tag.innerHTML = '<span class="role-badge" style="background:#F1F5F9;color:#64748B;"><i class="fas fa-question"></i> No Role</span>';
      }
    }
  }
  if (em) em.textContent = user.email || (role === 'vet' && vetSpecialty ? vetSpecialty : 'guest@petcare.shop');

  const authBtn = document.getElementById('profileAuthBtn');
  if (authBtn) {
    authBtn.textContent = localStorage.getItem('token') ? 'Logout' : 'Login / Sign Up';
    authBtn.onclick = () => {
      if (localStorage.getItem('token')) logout();
      else document.getElementById('loginModal')?.classList.add('active');
    };
  }
}

function renderProfilePets() {
  const row = document.getElementById('profilePetsRow');
  if (!row) return;
  if (!pets.length) { row.innerHTML = '<p class="section-desc">No pets added yet.</p>'; return; }
  row.innerHTML = pets.map(p => `
    <div class="profile-pet-chip">
      <span>${p.species === 'cat' ? '🐱' : p.species === 'dog' ? '🐶' : '🐾'}</span>
      <span>${p.name}</span>
    </div>
  `).join('');
}

function renderProfileOrders() {
  const container = document.getElementById('profileOrdersList');
  if (!container) return;
  const filter = document.getElementById('orderFilter')?.value || 'all';
  let list = allOrders;
  if (filter !== 'all') list = allOrders.filter(o => o.status === filter);

  if (!list.length) { container.innerHTML = '<p class="empty-state">No orders yet.</p>'; return; }

  container.innerHTML = [...list].sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => `
    <div class="order-card ${order.status}">
      <div class="order-header">
        <span class="order-id">#${order.id}</span>
        <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
      </div>
      <div class="order-items">
        ${order.items.map(i => `<div class="order-item"><span>${i.name} x${i.quantity}</span><span>$${(i.price * i.quantity).toFixed(2)}</span></div>`).join('')}
      </div>
      <div class="order-footer">
        <span class="order-total">$${order.total.toFixed(2)}</span>
        <button class="track-order-btn" data-id="${order.id}">Track</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.track-order-btn').forEach(btn => {
    btn.onclick = () => {
      document.getElementById('trackingId').value = btn.dataset.id;
      document.getElementById('trackingModal')?.classList.add('active');
      trackOrder();
    };
  });
}

// ============================================ //
// NOTIFICATIONS                                //
// ============================================ //
function addNotification(title, message) {
  notifications.unshift({ id: Date.now(), title, message, read: false, date: new Date().toISOString() });
  if (notifications.length > 30) notifications = notifications.slice(0, 30);
  saveNotifications();
  updateNotifBadge();
  updateNotifCount();
}

function updateNotifBadge() {
  const unread = notifications.filter(n => !n.read).length;
  const icon = document.getElementById('notifIcon');
  if (icon) {
    icon.setAttribute('data-count', unread);
    icon.style.color = unread > 0 ? '#FFD966' : '#fff';
  }
}

function updateNotifCount() {
  const el = document.getElementById('notifCountText');
  if (el) el.textContent = `${notifications.length} notification${notifications.length === 1 ? '' : 's'}`;
}

function updateWishlistCount() {
  const el = document.getElementById('wishlistCountText');
  if (el) el.textContent = `${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved`;
}

function syncSettingsUI() {
  const dark = document.getElementById('settingsDarkMode');
  if (dark) dark.checked = document.body.classList.contains('dark-mode');
}

// ============================================ //
// AUTH                                         //
// ============================================ //
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Logged out');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
  setTimeout(() => document.getElementById('loginModal')?.classList.add('active'), 400);
}

// ============================================ //
// DARK MODE                                    //
// ============================================ //
function initDarkMode() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark-mode');
}

// ============================================ //
// HERO SLIDER                                  //
// ============================================ //
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const dotsContainer = document.getElementById('heroDots');
  if (!slides.length) return;

  let current = 0;
  function showSlide(i) {
    if (i < 0) i = slides.length - 1;
    if (i >= slides.length) i = 0;
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    document.querySelectorAll('.hero-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
    current = i;
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('hero-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) prevBtn.onclick = () => showSlide(current - 1);
  if (nextBtn) nextBtn.onclick = () => showSlide(current + 1);

  let interval = setInterval(() => showSlide(current + 1), 5000);
  const banner = document.querySelector('.hero-banner');
  if (banner) {
    banner.addEventListener('mouseenter', () => clearInterval(interval));
    banner.addEventListener('mouseleave', () => interval = setInterval(() => showSlide(current + 1), 5000));
  }
}

// ============================================ //
// UTILITIES                                    //
// ============================================ //
function showToast(msg) {
  const t = document.getElementById('toast');
  const tm = document.getElementById('toastMessage');
  if (!t || !tm) return;
  tm.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

function showModalContent(content) {
  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('modalBody');
  if (modal && body) {
    body.innerHTML = content;
    modal.classList.add('active');
  }
}

function openGenericModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.warn('Modal not found:', modalId);
    return;
  }
  modal.classList.add('active');
}

// ============================================ //
// EMERGENCY SOS MODAL                          //
// ============================================ //
function openSosModal() {
  const modal = document.getElementById('sosModal');
  if (!modal) return;

  // Reset form
  document.getElementById('sosForm')?.reset();

  // Photo upload reset
  const photoBox = document.getElementById('sosPhotoUpload');
  if (photoBox) {
    photoBox.classList.remove('attached');
    photoBox.innerHTML = '<i class="fas fa-camera"></i><span>Tap to attach a photo</span>';
  }

  // Trigger location detection
  detectLocation();

  // Show modal
  modal.classList.add('active');
}

function detectLocation() {
  const box = document.querySelector('.sos-location-box');
  const text = document.getElementById('sosLocationText');
  if (!box || !text) return;

  box.classList.remove('detected');
  box.classList.add('detecting');
  text.textContent = '📍 Detecting your location';

  // Fallback location (if GPS denied/unavailable)
  const fallback = () => {
    box.classList.remove('detecting');
    box.classList.add('detected');
    text.innerHTML = '📍 <strong>Dhanmondi, Dhaka</strong> · 23.7465°N, 90.3760°E';
  };

  if (!navigator.geolocation) {
    setTimeout(fallback, 800);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      box.classList.remove('detecting');
      box.classList.add('detected');
      text.innerHTML = `📍 <strong>${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E</strong> · Live GPS`;
    },
    () => {
      // Permission denied or error → fallback
      setTimeout(fallback, 800);
    },
    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
  );
}

function handleSosPhotoTap() {
  const box = document.getElementById('sosPhotoUpload');
  if (!box || box.classList.contains('attached')) return;

  // Simulate photo attached (real app: <input type="file">)
  box.classList.add('attached');
  box.innerHTML = '<i class="fas fa-check-circle"></i><span>photo_evidence.jpg attached ✓</span>';
  showToast('📸 Photo attached');
}

async function handleSosSubmit(e) {
  e.preventDefault();

  const type = document.getElementById('sosType')?.value;
  const desc = document.getElementById('sosDescription')?.value?.trim();

  if (!type) { showToast('Please select emergency type'); return; }
  if (!desc || desc.length < 8) { showToast('Please add more details'); return; }

  const btn = document.querySelector('.sos-submit-btn');
if (!btn) return;

// Loading state
btn.classList.add('loading');
btn.innerHTML = '<i class="fas fa-circle-notch"></i> ALERTING RESCUE TEAM...';

// Call API layer (works in mock + real mode)
let apiResult;
try {
  apiResult = await API.reportEmergency({
    type,
    description: desc,
    location: document.getElementById('sosLocationText')?.textContent || 'Unknown'
  });
} catch (err) {
  apiResult = { success: false };
}
  
  // Success state
  btn.classList.remove('loading');
if (!apiResult?.success) {
  btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> FAILED — CALL +880-1700-000001';
  btn.style.background = 'linear-gradient(135deg,#7f1d1d,#450a0a)';
  showToast('❌ Alert failed. Please call emergency vet.');
  return;
}
btn.classList.add('success');
btn.innerHTML = '<i class="fas fa-check-circle"></i> RESCUE TEAM ALERTED!';

  // Add notification
  addNotification(
    '🚨 Emergency Reported',
    `${type.toUpperCase()} report sent. Nearest team: Animal Rescue BD (2.3 km). ETA ~12 min.`
  );

  showToast('🚨 Rescue team alerted! ETA 12 min.');

  // Confetti for positive feel
  if (typeof canvasConfetti === 'function') {
    canvasConfetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#DC2626', '#F59E0B', '#4CAF50']
    });
  }

  // Close after 1.8s
  setTimeout(() => {
    document.getElementById('sosModal')?.classList.remove('active');
    btn.classList.remove('success');
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND EMERGENCY ALERT';
  }, 1800);
}

// ============================================ //
// FIRST-AID GUIDE MODAL                        //
// ============================================ //
function openFirstAidModal(guideKey) {
  const guide = firstAidGuides[guideKey];
  if (!guide) return;

  const modal = document.getElementById('firstaidModal');
  if (!modal) return;

  // Set Font Awesome icon based on guide type
const iconMap = {
  choking:   'fa-hand-dots',           // airway blockage
  poison:    'fa-skull-crossbones',    // toxic
  bleeding:  'fa-droplet',             // blood
  cpr:       'fa-heart-pulse',         // heartbeat
  heatstroke:'fa-temperature-high',    // heat
  fracture:  'fa-bone'                 // bone
};

const iconEl = document.getElementById('faModalIcon');
const title = document.getElementById('faModalTitle');
const sub = document.getElementById('faModalSubtitle');

if (iconEl) {
  // Remove all previous fa- classes, keep 'fas' base
  iconEl.className = 'fas ' + (iconMap[guideKey] || 'fa-first-aid');
}
if (title) title.textContent = guide.title;
if (sub) sub.textContent = guide.subtitle;

  // Set steps
  const steps = document.getElementById('firstaidSteps');
  if (steps) {
    steps.innerHTML = guide.steps.map(s => `<li>${s}</li>`).join('');
  }

  // Set don't
  const dont = document.getElementById('firstaidDont');
  if (dont) dont.textContent = guide.dont;

  // Set call button handler
const callBtn = document.getElementById('firstaidCallBtn');
if (callBtn) {
  callBtn.onclick = () => {
    // Open device dialer
    tryCall('+8801700000001', 'Dhaka Pet Emergency');
    
    showToast('📞 Dialing +880-1700-000001...');
    
    // Disable button + show connecting state
    callBtn.disabled = true;
    const originalHTML = callBtn.innerHTML;
    callBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Connecting...';
    
    setTimeout(() => {
      // Connected
      callBtn.innerHTML = '<i class="fas fa-phone-volume"></i> Connected ✓';
      callBtn.style.background = '#4CAF50';
      
      showToast('✅ Connected to Dhaka Pet Emergency');
      
      addNotification(
        '📞 Vet Call Connected',
        'Dhaka Pet Emergency · ETA 10 min. Stay on the line.'
      );
      
      // Reset after 2s
      setTimeout(() => {
        callBtn.innerHTML = originalHTML;
        callBtn.style.background = '';
        callBtn.disabled = false;
      }, 2000);
    }, 1800);
  };
}

  modal.classList.add('active');
}

// ============================================ //
// EVENT LISTENERS (global)                     //
// ============================================ //
function initEventListeners() {
  document.getElementById('cartIcon')?.addEventListener('click', () => {
    document.getElementById('cartSidebar')?.classList.add('active');
  });
  document.getElementById('closeCart')?.addEventListener('click', () => {
    document.getElementById('cartSidebar')?.classList.remove('active');
  });

  // ✅ CART → CHECKOUT (FIXED)
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (!cart.length) {
      showToast('🛒 Your cart is empty');
      return;
    }
    document.getElementById('cartSidebar')?.classList.remove('active');
    setTimeout(() => openCheckout(), 250);
  });

  document.getElementById('trackOrderBtn')?.addEventListener('click', trackOrder);

  document.querySelectorAll('.close-modal, .close-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal, .cart-sidebar').forEach(el => el.classList.remove('active'));
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.shop-now-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.category-filter')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('nextTipBtn')?.addEventListener('click', () => {
    currentTipIndex++;
    renderHomeTip();
  });

  document.getElementById('describeProblemBtn')?.addEventListener('click', () => {
    showPage('care');
    switchCareTab('guidance');
    setTimeout(() => document.getElementById('symptomInput')?.focus(), 400);
  });

  document.getElementById('addPetBtn')?.addEventListener('click', () => openPetModal());

// ===== EMERGENCY SOS =====
document.getElementById('sosReportBtn')?.addEventListener('click', openSosModal);
document.getElementById('sosPhotoUpload')?.addEventListener('click', handleSosPhotoTap);
document.getElementById('sosForm')?.addEventListener('submit', handleSosSubmit);

  document.getElementById('petForm')?.addEventListener('submit', handlePetFormSubmit);
  document.getElementById('checkoutForm')?.addEventListener('submit', handleCheckoutSubmit);
  document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
  document.getElementById('signupForm')?.addEventListener('submit', handleSignupSubmit);

  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isLogin = tab.dataset.auth === 'login';
      document.getElementById('loginForm').style.display = isLogin ? 'block' : 'none';
      document.getElementById('signupForm').style.display = isLogin ? 'none' : 'block';
    });
  });

  initReviewStars();

  document.getElementById('submitReviewBtn')?.addEventListener('click', handleSubmitReview);

  document.getElementById('settingsDarkMode')?.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
    const drawerToggle = document.getElementById('drawerDarkMode');
    if (drawerToggle) drawerToggle.checked = e.target.checked;
  });

  document.getElementById('exportDataBtn')?.addEventListener('click', handleExportData);
  document.getElementById('clearDataBtn')?.addEventListener('click', handleClearData);
  document.getElementById('notifIcon')?.addEventListener('click', handleNotifIconClick);

  document.getElementById('profileNotifBtn')?.addEventListener('click', () => {
    document.getElementById('notifIcon')?.click();
  });

  document.getElementById('profileWishlistBtn')?.addEventListener('click', () => {
    updateWishlistUI();
    document.getElementById('wishlistModal')?.classList.add('active');
  });

  // ===== EDIT PROFILE =====
  document.getElementById('editProfileBtn')?.addEventListener('click', openEditProfileModal);
  document.getElementById('editProfileForm')?.addEventListener('submit', handleEditProfileSubmit);

  // ===== HEALTH LOG =====
  document.getElementById('addHealthLogBtn')?.addEventListener('click', () => openGenericModal('healthLogModal'));
  document.getElementById('healthLogForm')?.addEventListener('submit', handleAddHealthLog);

  // ===== VACCINATION =====
  document.getElementById('addVaxBtn')?.addEventListener('click', () => openGenericModal('vaxModal'));
  document.getElementById('vaxForm')?.addEventListener('submit', handleAddVax);

  // ===== MEDICATION =====
  document.getElementById('addMedBtn')?.addEventListener('click', () => openGenericModal('medModal'));
  document.getElementById('medForm')?.addEventListener('submit', handleAddMed);

  // ===== REMINDER =====
  document.getElementById('addReminderBtn')?.addEventListener('click', () => openGenericModal('reminderModal'));
  document.getElementById('reminderForm')?.addEventListener('submit', handleAddReminder);
}

// ============================================ //
// FORM HANDLERS                                //
// ============================================ //
function handlePetFormSubmit(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('petName').value.trim(),
    species: document.getElementById('petSpecies').value,
    breed: document.getElementById('petBreed').value.trim(),
    age: parseFloat(document.getElementById('petAge').value) || null,
    weight: parseFloat(document.getElementById('petWeight').value) || null,
    gender: document.getElementById('petGender').value,
    allergies: document.getElementById('petAllergies').value.trim() || 'None known'
  };

  if (!data.name || !data.species) {
    showToast('Please fill required fields');
    return;
  }

  if (editingPetId) {
    const idx = pets.findIndex(p => p.id === editingPetId);
    if (idx !== -1) {
      pets[idx] = { ...pets[idx], ...data };
      if (activePetId === editingPetId) saveActivePet();
    }
    showToast('Pet updated ✓');
  } else {
    const newId = 'pet_' + Date.now();
    pets.push({ id: newId, img: '', ...data });
    activePetId = newId;
    saveActivePet();

    if (!vaccinations[newId]) vaccinations[newId] = [];
    if (!medications[newId]) medications[newId] = [];
    if (!reminders[newId]) reminders[newId] = [];
    saveVaccinations();
    saveMedications();
    saveReminders();

    healthLog.push({
      id: Date.now(),
      petId: newId,
      type: 'note',
      note: `${data.name} added to PetCare 🐾`,
      date: new Date().toISOString()
    });
    saveHealthLog();

    showToast(`${data.name} added ✓`);
  }

  savePets();
  document.getElementById('petModal')?.classList.remove('active');
  editingPetId = null;

  renderCare();
  renderProfile();
  renderGreeting();
  renderHomeCare();
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('.checkout-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
  }

  const name = document.getElementById('checkoutName').value;
  const email = document.getElementById('checkoutEmail').value;
  const phone = document.getElementById('checkoutPhone').value;
  const address = document.getElementById('checkoutAddress').value;

  if (!name || !email || !phone || !address) { showToast('Please fill all fields'); return; }
  if (!cart.length) { showToast('Your cart is empty'); return; }

  const orderId = 'PC-' + Date.now().toString().slice(-8);
  const newOrder = {
    id: orderId, name, email, phone, address,
    items: [...cart],
    total: cart.reduce((s, i) => s + (i.price * i.quantity), 0),
    status: 'pending',
    date: new Date().toISOString()
  };
  allOrders.push(newOrder);
  saveOrders();

  cart = [];
  saveCart();
  document.getElementById('checkoutModal').classList.remove('active');
  document.getElementById('checkoutForm').reset();

  if (typeof canvasConfetti === 'function') {
    canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }

    if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';
  }

  showToast(`Order placed! ID: ${orderId}`);
  addNotification('Order Placed', `Your order #${orderId} has been placed.`);
  renderHomeRecentOrder();
  renderProfile();
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const res = await API.login(email, password);
    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      document.getElementById('loginModal').classList.remove('active');
      showToast('Welcome back, ' + res.user.name + '!');
      addNotification('Login', 'You logged in successfully');
      renderProfile();
      if (typeof refreshDrawer === 'function') refreshDrawer();
    }
  } catch (err) {
    showToast('Login failed');
  }
}

async function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  try {
    const res = await API.signup(name, email, password);
    if (res.success) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      document.getElementById('loginModal').classList.remove('active');
      showToast('Account created!');
      addNotification('Welcome', `Welcome to PetCare, ${name}!`);
      renderProfile();
      if (typeof refreshDrawer === 'function') refreshDrawer();
      if (typeof canvasConfetti === 'function') {
        canvasConfetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
    }
  } catch (err) {
    showToast('Signup failed');
  }
}

function handleSubmitReview() {
  if (!currentReviewProduct || currentRating === 0) { showToast('Please select a rating'); return; }
  const text = document.getElementById('reviewText').value;
  if (!text) { showToast('Please write a review'); return; }
  addReview(currentReviewProduct, currentRating, text);
  document.getElementById('reviewModal').classList.remove('active');
}

function handleExportData() {
  const data = { cart, wishlist, allOrders, productReviews, notifications, pets, healthLog, vaccinations, medications, reminders, dailyCare };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `petcare-data-${Date.now()}.json`;
  a.click();
  showToast('Data exported');
}

function handleClearData() {
  if (confirm('Clear all app data? (Your login will be preserved)')) {
    // Preserve auth
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const theme = localStorage.getItem('theme');

    localStorage.clear();
    sessionStorage.clear();

    // Restore
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', user);
    if (theme) localStorage.setItem('theme', theme);

    showToast('App data cleared ✓');
    setTimeout(() => location.reload(), 800);
  }
}

function handleNotifIconClick() {
  notifications.forEach(n => n.read = true);
  saveNotifications();
  updateNotifBadge();

  const list = document.getElementById('notifList');
  if (list) {
    list.innerHTML = notifications.length ? notifications.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <h4>${n.title}</h4>
        <p>${n.message}</p>
        <small>${new Date(n.date).toLocaleString()}</small>
      </div>
    `).join('') : '<p class="empty-state">No notifications</p>';
  }
  document.getElementById('notifModal')?.classList.add('active');
}

// ============================================ //
// EDIT PROFILE                                 //
// ============================================ //
function openEditProfileModal() {
  const user = JSON.parse(localStorage.getItem('user') || 'null') || {
    name: 'Guest User',
    email: 'guest@petcare.shop',
    phone: '',
    city: ''
  };
  document.getElementById('editProfileName').value = user.name || '';
  document.getElementById('editProfileEmail').value = user.email || '';
  document.getElementById('editProfilePhone').value = user.phone || '';
  document.getElementById('editProfileCity').value = user.city || '';
  document.getElementById('editProfileModal')?.classList.add('active');
}

function handleEditProfileSubmit(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user') || 'null') || {};
  user.name = document.getElementById('editProfileName').value.trim();
  user.email = document.getElementById('editProfileEmail').value.trim();
  user.phone = document.getElementById('editProfilePhone').value.trim();
  user.city = document.getElementById('editProfileCity').value.trim();

  localStorage.setItem('user', JSON.stringify(user));
  document.getElementById('editProfileModal')?.classList.remove('active');
  showToast('Profile updated ✓');

  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

// ============================================ //
// ADD HEALTH LOG                               //
// ============================================ //
function handleAddHealthLog(e) {
  e.preventDefault();
  const pet = getActivePet();
  if (!pet) { showToast('Add a pet first'); return; }

  const type = document.getElementById('healthLogType').value;
  const note = document.getElementById('healthLogNote').value.trim();
  if (!note) { showToast('Please enter a note'); return; }

  healthLog.push({
    id: Date.now(),
    petId: pet.id,
    type: type,
    note: note,
    date: new Date().toISOString()
  });
  saveHealthLog();

  if (type === 'weight') {
    const match = note.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const w = parseFloat(match[1]);
      if (!isNaN(w) && w > 0) {
        const idx = pets.findIndex(p => p.id === pet.id);
        if (idx !== -1) {
          pets[idx].weight = w;
          savePets();
        }
      }
    }
  }

  document.getElementById('healthLogModal')?.classList.remove('active');
  document.getElementById('healthLogForm').reset();
  showToast('Health log added ✓');
  renderCareHealth();
  addNotification('Health Log', `${pet.name}: ${note}`);
}

// ============================================ //
// ADD VACCINATION                              //
// ============================================ //
function handleAddVax(e) {
  e.preventDefault();
  const pet = getActivePet();
  if (!pet) { showToast('Add a pet first'); return; }

  const name = document.getElementById('vaxName').value.trim();
  const done = document.getElementById('vaxDone').checked;
  if (!name) { showToast('Enter vaccine name'); return; }

  if (!vaccinations[pet.id]) vaccinations[pet.id] = [];
  vaccinations[pet.id].push({ name, done });
  saveVaccinations();

  document.getElementById('vaxModal')?.classList.remove('active');
  document.getElementById('vaxForm').reset();
  showToast('Vaccination added ✓');
  renderCareHealth();
}

// ============================================ //
// ADD MEDICATION                               //
// ============================================ //
function handleAddMed(e) {
  e.preventDefault();
  const pet = getActivePet();
  if (!pet) { showToast('Add a pet first'); return; }

  const name = document.getElementById('medName').value.trim();
  const nextDose = document.getElementById('medNextDose').value.trim();
  if (!name || !nextDose) { showToast('Fill all fields'); return; }

  if (!medications[pet.id]) medications[pet.id] = [];
  medications[pet.id].push({ name, nextDose });
  saveMedications();

  document.getElementById('medModal')?.classList.remove('active');
  document.getElementById('medForm').reset();
  showToast('Medication added ✓');
  renderCareHealth();
  addNotification('Medication', `${pet.name}: ${name} — next ${nextDose}`);
}

// ============================================ //
// ADD REMINDER                                 //
// ============================================ //
function handleAddReminder(e) {
  e.preventDefault();
  const pet = getActivePet();
  if (!pet) { showToast('Add a pet first'); return; }

  const type = document.getElementById('reminderType').value;
  const date = document.getElementById('reminderDate').value.trim();
  const label = document.getElementById('reminderLabel').value.trim();
  if (!date || !label) { showToast('Fill all fields'); return; }

  const emojiMap = { medication: '💊', vaccination: '💉', grooming: '✂️', checkup: '🩺' };

  if (!reminders[pet.id]) reminders[pet.id] = [];
  reminders[pet.id].push({
    date,
    type,
    label: `${emojiMap[type] || '🔔'} ${label}`
  });
  saveReminders();

  document.getElementById('reminderModal')?.classList.remove('active');
  document.getElementById('reminderForm').reset();
  showToast('Reminder added ✓');
  renderReminders();
}

// ============================================ //
// BACK TO TOP                                  //
// ============================================ //
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================ //
// MEMORIES SYSTEM                              //
// ============================================ //

let memories = [];
let currentMemoryFilter = 'all';
let currentMemoryPostId = null;
let currentMemPhotoData = null;

function loadMemories() {
  try { memories = JSON.parse(localStorage.getItem('memories') || '[]'); } catch (e) { memories = []; }
  if (!memories.length) {
    memories = [
      { id: 'mem_1', authorName: 'Dr. Aisha Rahman', authorInitial: 'A', authorRole: 'vet',
        authorSpecialty: 'General Veterinarian', authorVetId: 'vet1',
        type: 'tip', title: '5 Signs Your Cat is Dehydrated',
        content: 'Watch for: dry gums, skin tenting, sunken eyes, lethargy, and loss of appetite.',
        image: 'pet-care-images/mem-vet-cat.jpg', date: new Date(Date.now() - 3600000).toISOString(),
        likes: 47, likedBy: [],
        comments: [{ id: 'c1', authorName: 'Sarah', authorInitial: 'S', authorRole: 'user',
                     text: 'Helpful, thanks!', date: new Date().toISOString() }] },
      { id: 'mem_2', authorName: 'Sarah Ahmed', authorInitial: 'S', authorRole: 'user',
        type: 'story', title: "Luna's First Day Home! 🐱",
        content: 'Adopted this beautiful girl today. Any tips for a new cat owner?',
        image: 'pet-care-images/mem-kitten-home.png', date: new Date(Date.now() - 7200000).toISOString(),
        likes: 23, likedBy: [], comments: [] },
      { id: 'mem_3', authorName: 'Dr. Karim Ahmed', authorInitial: 'K', authorRole: 'vet',
        authorSpecialty: 'Veterinary Surgeon', authorVetId: 'vet2',
        type: 'awareness', title: '⚠️ Chocolate Toxicity Alert',
        content: 'Dark chocolate is most dangerous. Rush to emergency vet if ingested.',
        image: 'pet-care-images/mem-chocolate.png', date: new Date(Date.now() - 86400000).toISOString(),
        likes: 128, likedBy: [], comments: [] }
    ];
    saveMemories();
  }
}

function saveMemories() { localStorage.setItem('memories', JSON.stringify(memories)); }

function renderMemoriesPreview() {
  const preview = document.getElementById('memoriesPreview');
  const countEl = document.getElementById('memoriesPostCount');
  const vetEl = document.getElementById('memoriesVetCount');
  if (!preview) return;

  // ✅ Role badge in Memories Page + Home card
  const roleInfo = getRoleLabel();
  const roleBadge = document.getElementById('memoriesRoleBadge');
  const roleBadgeHome = document.getElementById('memoriesRoleBadgeHome');

  [roleBadge, roleBadgeHome].forEach(el => {
    if (el) {
      el.textContent = `${roleInfo.icon} ${roleInfo.label}`;
      el.style.background = roleInfo.color + '20';
      el.style.color = roleInfo.color;
    }
  });

  if (countEl) countEl.textContent = memories.length;
  const vetCount = new Set(memories.filter(m => m.authorRole === 'vet').map(m => m.authorVetId)).size;
  if (vetEl) vetEl.textContent = vetCount || 2;

  const recent = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  preview.innerHTML = recent.map(m => {
    const emoji = { tip: '💡', story: '🐾', awareness: '📢', question: '❓' }[m.type] || '📸';
    return `
      <div class="mem-preview-item ${m.image ? '' : 'no-img'}" onclick="openMemoriesPage('${m.type}')">
        ${m.image ? `<img src="${m.image}" alt="">` : emoji}
        <div class="mem-preview-overlay">${m.authorName.split(' ')[0]}</div>
      </div>
    `;
  }).join('');
}

function openMemoriesPage(filterType) {
  showPage('memories');
  currentMemoryFilter = filterType || 'all';
  document.querySelectorAll('.mem-filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === currentMemoryFilter);
  });
  renderMemoriesFeed();
}

function renderMemoriesFeed() {
  const feed = document.getElementById('memoriesFeed');
  const empty = document.getElementById('memoriesEmpty');
  if (!feed) return;

  let filtered = memories;
  if (currentMemoryFilter !== 'all') filtered = memories.filter(m => m.type === currentMemoryFilter);
  filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!filtered.length) {
    feed.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  feed.innerHTML = filtered.map(m => renderMemPost(m)).join('');
}

function renderMemPost(post) {
  const user = JSON.parse(localStorage.getItem('user') || 'null') || { name: 'You' };
  const isLiked = (post.likedBy || []).includes(user.name);
  const timeAgo = getTimeAgo(post.date);
  const isVet = post.authorRole === 'vet';

  return `
    <div class="mem-post" data-mem-id="${post.id}">
      <div class="mem-post-header">
        <div class="mem-author-avatar ${isVet ? 'vet' : 'user'}"
             onclick="${isVet ? `openVetProfile('${post.authorVetId || 'vet1'}')` : ''}">${post.authorInitial}</div>
        <div class="mem-author-info">
          <p class="mem-author-name">
            ${post.authorName}
            ${isVet ? '<i class="fas fa-circle-check verified"></i>' : ''}
          </p>
          <div class="mem-author-meta">
            <span>${isVet ? post.authorSpecialty || 'Veterinarian' : 'Pet Owner'}</span>
            <span>·</span>
            <span>${timeAgo}</span>
            <span class="mem-type-pill ${post.type}">${post.type}</span>
          </div>
        </div>
      </div>
      <div class="mem-post-body">
        <h4 class="mem-post-title">${post.title}</h4>
        <p class="mem-post-content">${post.content}</p>
      </div>
      ${post.image ? `<img src="${post.image}" alt="" class="mem-post-image">` : ''}
      <div class="mem-post-actions">
        <button class="mem-action ${isLiked ? 'liked' : ''}" onclick="toggleMemoryLike('${post.id}')">
          <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> ${post.likes}
        </button>
        <button class="mem-action" onclick="openCommentModal('${post.id}')">
          <i class="far fa-comment"></i> ${post.comments.length}
        </button>
        <button class="mem-action" onclick="shareMemory('${post.id}')">
          <i class="far fa-share-square"></i> Share
        </button>
      </div>
    </div>
  `;
}

function toggleMemoryLike(postId) {
  const post = memories.find(m => m.id === postId);
  if (!post) return;
  const user = JSON.parse(localStorage.getItem('user') || 'null') || { name: 'You' };
  post.likedBy = post.likedBy || [];
  if (post.likedBy.includes(user.name)) {
    post.likedBy = post.likedBy.filter(n => n !== user.name);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.likedBy.push(user.name);
    post.likes++;
  }
  saveMemories();
  renderMemoriesFeed();
}

function shareMemory(postId) {
  const post = memories.find(m => m.id === postId);
  if (!post) return;
  if (navigator.share) {
    navigator.share({ title: post.title, text: post.content }).catch(() => {});
  } else {
    showToast('🔗 Link copied');
  }
}

function openMemoryPostModal() {
  const modal = document.getElementById('memoryPostModal');
  if (!modal) { showToast('Modal not found'); return; }

  document.getElementById('memoryPostForm')?.reset();
  window.currentMemPhotoData = null;

  const upload = document.getElementById('memPhotoUpload');
  if (upload) {
    upload.classList.remove('attached');
    upload.innerHTML = '<i class="fas fa-camera"></i><span>Tap to add photo</span>';
  }

  // ✅ Show role in title
  const role = getUserRole();
  const titleEl = document.getElementById('memoryPostModalTitle');
  if (titleEl) {
    if (role === 'vet') {
      titleEl.textContent = '👨‍⚕️ Share a Vet Post';
    } else if (role === 'normal') {
      titleEl.textContent = '🐾 Share a Memory';
    } else {
      titleEl.textContent = '📸 Share a Memory';
    }
  }

  modal.classList.add('active');
}

function handleMemoryPostSubmit(e) {
  e.preventDefault();

  // ✅ Simple version — only photo + description
  const content = document.getElementById('memPostContent')?.value?.trim();
  if (!content) { showToast('Please write something'); return; }

  const user = JSON.parse(localStorage.getItem('user') || 'null') || { name: 'Guest User' };
  const role = getUserRole();
  const isVet = role === 'vet';

  // Auto-derive a short title from first line of content
  const firstLine = content.split('\n')[0].trim();
  const title = firstLine.length > 60 ? firstLine.substring(0, 60) + '…' : firstLine;
  const type = isVet ? 'tip' : 'story';

  const newPost = {
    id: 'mem_' + Date.now(),
    authorName: isVet ? (localStorage.getItem('vetName') || user.name || 'Dr. Guest') : (user.name || 'Pet Owner'),
    authorInitial: ((isVet ? localStorage.getItem('vetName') : user.name) || 'U').charAt(0).toUpperCase(),
    authorRole: isVet ? 'vet' : 'user',
    authorSpecialty: isVet ? (localStorage.getItem('vetSpecialty') || 'Veterinarian') : null,
    authorVetId: isVet ? 'vet_self' : null,
    type,
    title,
    content,
    image: window.currentMemPhotoData || null,
    date: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    comments: []
  };

  memories.unshift(newPost);
  saveMemories();

  document.getElementById('memoryPostModal')?.classList.remove('active');
  document.getElementById('memoryPostForm')?.reset();
  window.currentMemPhotoData = null;

  showToast('📸 Memory posted!');
  addNotification('Posted', 'Your memory is now live');
  renderMemoriesFeed();
  renderMemoriesPreview();
  if (typeof canvasConfetti === 'function') {
    canvasConfetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  }
}

function handleMemPhotoUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Image too large (max 2MB)'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    currentMemPhotoData = ev.target.result;
    const upload = document.getElementById('memPhotoUpload');
    if (upload) {
      upload.classList.add('attached');
      upload.innerHTML = '<i class="fas fa-check-circle"></i><span>Photo attached ✓</span>';
    }
  };
  reader.readAsDataURL(file);
}

function openCommentModal(postId) {
  const post = memories.find(m => m.id === postId);
  if (!post) { showToast('Post not found'); return; }
  window.currentMemoryPostId = postId;
  const modal = document.getElementById('commentModal');
  if (!modal) { showToast('Comment modal missing'); return; }
  renderComments();
  setTimeout(() => document.getElementById('commentInput')?.focus(), 300);
  modal.classList.add('active');
}

function renderComments() {
  const post = memories.find(m => m.id === window.currentMemoryPostId);
  const list = document.getElementById('commentList');
  if (!list || !post) return;
  if (!post.comments.length) {
    list.innerHTML = '<p style="text-align:center; color:#94A3B8; padding:20px; font-size:13px;">No comments yet. Be the first!</p>';
    return;
  }
  list.innerHTML = post.comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar ${c.authorRole === 'vet' ? 'vet' : 'user'}">${c.authorInitial}</div>
      <div class="comment-body">
        <p class="comment-author">
          ${c.authorName}
          ${c.authorRole === 'vet' ? '<i class="fas fa-circle-check verified"></i>' : ''}
        </p>
        <p class="comment-text">${c.text}</p>
        <p class="comment-time">${getTimeAgo(c.date)}</p>
      </div>
    </div>
  `).join('');
}
  
function handleCommentSubmit(e) {
  if (e) e.preventDefault();
  const post = memories.find(m => m.id === window.currentMemoryPostId);
  if (!post) { showToast('Post not found'); return; }

  const input = document.getElementById('commentInput');
  const text = input?.value?.trim();
  if (!text) { showToast('Write a comment first'); return; }

  const user = JSON.parse(localStorage.getItem('user') || 'null') || { name: 'Guest User' };
  const role = getUserRole();
  const isVet = role === 'vet';

  post.comments.push({
    id: 'c_' + Date.now(),
    authorName: isVet ? (localStorage.getItem('vetName') || user.name || 'Dr. Guest') : (user.name || 'Guest'),
    authorInitial: ((isVet ? localStorage.getItem('vetName') : user.name) || 'U').charAt(0).toUpperCase(),
    authorRole: isVet ? 'vet' : 'user',
    text,
    date: new Date().toISOString()
  });

  saveMemories();
  input.value = '';

  // ✅ Just re-render comments — DON'T close modal
  renderComments();
  renderMemoriesFeed();
  showToast('💬 Comment posted');
}

// ============================================ //
// ROLE SYSTEM                                  //
// ============================================ //

function getUserRole() { return localStorage.getItem('userRole') || null; }

function getRoleLabel() {
  const role = getUserRole();
  if (role === 'vet') return { icon: '👨‍⚕️', label: 'Vet', color: '#10B981' };
  if (role === 'normal') return { icon: '🐾', label: 'Pet Owner', color: '#3B82F6' };
  return { icon: '❓', label: 'No Role', color: '#94A3B8' };
}

function setUserRole(role) {
  localStorage.setItem('userRole', role);
  applyRoleUI();
}

function applyRoleUI() {
  const role = getUserRole();
  // (profile badge handled in renderProfileHeader)
}

function showRoleChoiceModal() {
  const modal = document.getElementById('userTypeModal');
  if (!modal) { showToast('Role modal missing!'); return; }
  modal.classList.add('active');
}

function openVetLicenseModal() {
  const modal = document.getElementById('vetLicenseModal');
  if (!modal) return;
  const saved = JSON.parse(localStorage.getItem('vetLicense') || 'null');
  if (saved) {
    document.getElementById('vetLicName').value = saved.name || '';
    document.getElementById('vetLicNumber').value = saved.number || '';
    document.getElementById('vetLicSpecialty').value = saved.specialty || '';
    document.getElementById('vetLicExperience').value = saved.experience || '';
    document.getElementById('vetLicHospital').value = saved.hospital || '';
    document.getElementById('vetLicEmail').value = saved.email || '';
  }
  modal.classList.add('active');
}

function handleVetLicenseSubmit(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('vetLicName').value.trim(),
    number: document.getElementById('vetLicNumber').value.trim(),
    specialty: document.getElementById('vetLicSpecialty').value,
    experience: document.getElementById('vetLicExperience').value,
    hospital: document.getElementById('vetLicHospital').value.trim(),
    email: document.getElementById('vetLicEmail').value.trim()
  };
  if (!data.name || !data.number || !data.specialty) { showToast('Fill all required fields'); return; }

  localStorage.setItem('vetLicense', JSON.stringify(data));
  localStorage.setItem('vetName', data.name);
  localStorage.setItem('vetSpecialty', data.specialty);
  localStorage.setItem('userRole', 'vet');

  document.getElementById('vetLicenseModal')?.classList.remove('active');
  showToast('✅ Vet verified! Welcome, ' + data.name);
  addNotification('Vet Verified', `Welcome ${data.name}! Your vet profile is now active.`);

  if (typeof renderProfile === 'function') renderProfile();
  renderMemoriesPreview();
}

// Role card click handler
document.addEventListener('click', (e) => {
  const card = e.target.closest('.role-choice-card');
  if (!card) return;
  const role = card.dataset.role;
  if (role === 'vet') {
    document.getElementById('userTypeModal')?.classList.remove('active');
    setTimeout(() => openVetLicenseModal(), 300);
  } else {
    localStorage.setItem('userRole', 'normal');
    document.getElementById('userTypeModal')?.classList.remove('active');
    showToast('🐾 Pet Owner mode activated');
    if (typeof renderProfile === 'function') renderProfile();
  }
});

// ============================================ //
// TIME AGO HELPER                              //
// ============================================ //
function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  const days = Math.floor(hrs / 24);
  return days + 'd ago';
}

// ============================================ //
// MEMORIES INIT                                //
// ============================================ //
document.addEventListener('DOMContentLoaded', () => {
  loadMemories();
  setTimeout(() => renderMemoriesPreview(), 200);

  // Filter chips
  document.querySelectorAll('.mem-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.mem-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentMemoryFilter = chip.dataset.filter;
      renderMemoriesFeed();
    });
  });

  // Open Memories page
  document.getElementById('openMemoriesBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openMemoriesPage('all');
  });
  document.getElementById('memoriesCard')?.addEventListener('click', (e) => {
    if (e.target.closest('.card-link-btn')) return;
    openMemoriesPage('all');
  });
  document.getElementById('memoriesBackBtn')?.addEventListener('click', () => showPage('home'));

// ✅ Bottom nav Memories tab → opens memories page
document.querySelector('.bottom-nav [data-nav="memories"]')?.addEventListener('click', () => {
  openMemoriesPage('all');
});
  
  // ✅ Post button — role check
  document.getElementById('memoriesPostBtn')?.addEventListener('click', () => {
    const role = getUserRole();
    if (!role) {
      showRoleChoiceModal();
      showToast('👋 Please choose your role first');
      return;
    }
    openMemoryPostModal();
  });

  // ✅ Photo upload trigger
  document.getElementById('memPhotoUpload')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('memPhotoInput')?.click();
  });

  // ✅ Photo input change
  document.getElementById('memPhotoInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image too large (max 2MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      window.currentMemPhotoData = ev.target.result;
      const upload = document.getElementById('memPhotoUpload');
      if (upload) {
        upload.classList.add('attached');
        upload.innerHTML = '<i class="fas fa-check-circle"></i><span>Photo attached ✓ (tap to change)</span>';
      }
    };
    reader.readAsDataURL(file);
  });

  // ✅ Comment form submit — use unified handler
document.getElementById('commentForm')?.addEventListener('submit', handleCommentSubmit);

  // ✅ Memory post form
  document.getElementById('memoryPostForm')?.addEventListener('submit', handleMemoryPostSubmit);
  // ✅ Vet license form
  document.getElementById('vetLicenseForm')?.addEventListener('submit', handleVetLicenseSubmit);
});

// ============================================ //
// GLOBAL ERROR HANDLER                         //
// ============================================ //
window.addEventListener('error', (e) => {
  console.error('Runtime error:', e.error);
  if (typeof showToast === 'function') {
    showToast('⚠️ Something went wrong. Please retry.');
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise:', e.reason);
  if (typeof showToast === 'function') {
    showToast('⚠️ Network error. Check your connection.');
  }
});