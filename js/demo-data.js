/* ============================================================ */
/* PETCARE v3.0 — DEMO DATA (Clean v2)                           */
/* Premium realistic dataset · Zero fake feel                    */
/* 3 pets · 48 logs · 10 posts · Foster system integrated        */
/* ============================================================ */

const DEMO_DATA = {

  /* ============================================================ */
  /* 1. USER                                                       */
  /* ============================================================ */
  user: {
    id: 'user_demo',
    name: "Ayesha Khan",
    email: 'demo@petcare.app',
    phone: '+880 1712-345678',
    avatar: 'assets/icons/pfp-milos-mum.png',
    coverPhoto: 'cover-1',
    location: "Cox's Bazar, Bangladesh",
    bio: 'Pet lover • Cat mom to 3 furballs • Coffee enthusiast ☕ • Sharing our small adventures every day.',
    roles: ['petOwner', 'storeOwner'],
    activeRole: 'petOwner',
    vetApplication: {
      status: 'none',
      specialization: null,
      experience: null,
      clinicName: null,
      clinicAddress: null,
      licenseNumber: null,
      licensePhoto: null,
      appliedAt: null,
      approvedAt: null
    },
    ownedStores: ['demo_store_ayesha'],
    followers: 1247,
    following: 342,
    reviewCount: 18,
    rating: 4.8,
    isDemo: true,
    _createdAt: new Date().toISOString()
  },

  /* ============================================================ */
  /* 2. PETS — 3 detailed profiles                                 */
  /* ============================================================ */
  pets: [
    {
      id: 'demo_pet_luna',
      name: 'Luna',
      species: 'cat',
      breed: 'British Shorthair',
      age: 2,
      weight: 4.2,
      gender: 'female',
      avatar: 'assets/avatars/av-cat1.png',
      notes: 'Loves window watching, picky eater'
    },
    {
      id: 'demo_pet_max',
      name: 'Max',
      species: 'dog',
      breed: 'Golden Retriever',
      age: 3,
      weight: 28.5,
      gender: 'male',
      avatar: 'assets/avatars/av-dog1.png',
      notes: 'Very active, loves fetch'
    },
    {
      id: 'demo_pet_bella',
      name: 'Bella',
      species: 'cat',
      breed: 'Persian',
      age: 1,
      weight: 3.8,
      gender: 'female',
      avatar: 'assets/avatars/av-cat3.png',
      notes: 'New addition to family, playful'
    }
  ],

  activePetId: 'demo_pet_luna',

  /* ============================================================ */
  /* 3. HEALTH LOGS — 48 entries across 3 pets                     */
  /* ============================================================ */
  healthLogs: [
    /* ---------- LUNA (18 entries) ---------- */
    { id: 'demo_log_1',  petId: 'demo_pet_luna', type: 'weight',      note: '4.2 kg — Healthy weight, no concerns', date: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'demo_log_2',  petId: 'demo_pet_luna', type: 'weight',      note: '4.1 kg — Slight gain from last week', date: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: 'demo_log_3',  petId: 'demo_pet_luna', type: 'weight',      note: '4.0 kg — Stable', date: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: 'demo_log_4',  petId: 'demo_pet_luna', type: 'weight',      note: '3.9 kg — Baseline', date: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: 'demo_log_5',  petId: 'demo_pet_luna', type: 'weight',      note: '3.8 kg — Slight underweight, increased food', date: new Date(Date.now() - 45 * 86400000).toISOString() },
    { id: 'demo_log_6',  petId: 'demo_pet_luna', type: 'weight',      note: '3.7 kg — Very first checkup', date: new Date(Date.now() - 90 * 86400000).toISOString() },
    { id: 'demo_log_7',  petId: 'demo_pet_luna', type: 'temperature', note: '38.5 °C — Normal', date: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'demo_log_8',  petId: 'demo_pet_luna', type: 'temperature', note: '38.7 °C — Slightly warm, monitored', date: new Date(Date.now() - 12 * 86400000).toISOString() },
    { id: 'demo_log_9',  petId: 'demo_pet_luna', type: 'note',        note: 'Ate well today, energy normal. Played with her favourite toy for 20 min.', date: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'demo_log_10', petId: 'demo_pet_luna', type: 'note',        note: 'Slept more than usual today. Keeping an eye on her.', date: new Date(Date.now() - 6 * 86400000).toISOString() },
    { id: 'demo_log_11', petId: 'demo_pet_luna', type: 'note',        note: 'Vet visit - all vitals normal. Weight on track.', date: new Date(Date.now() - 20 * 86400000).toISOString() },
    { id: 'demo_log_12', petId: 'demo_pet_luna', type: 'symptom',     note: 'Occasional sneezing (mild)', date: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: 'demo_log_13', petId: 'demo_pet_luna', type: 'symptom',     note: 'Slight hairball cough (mild)', date: new Date(Date.now() - 25 * 86400000).toISOString() },
    { id: 'demo_log_14', petId: 'demo_pet_luna', type: 'note',        note: 'Rabies booster administered — no side effects', date: new Date(Date.now() - 90 * 86400000).toISOString() },
    { id: 'demo_log_15', petId: 'demo_pet_luna', type: 'note',        note: 'Grooming session completed. Coat looking healthy.', date: new Date(Date.now() - 35 * 86400000).toISOString() },
    { id: 'demo_log_16', petId: 'demo_pet_luna', type: 'note',        note: 'Moved to new apartment — settling in well.', date: new Date(Date.now() - 75 * 86400000).toISOString() },
    { id: 'demo_log_17', petId: 'demo_pet_luna', type: 'symptom',     note: 'Eye discharge (mild) — cleaned and resolved', date: new Date(Date.now() - 60 * 86400000).toISOString() },
    { id: 'demo_log_18', petId: 'demo_pet_luna', type: 'note',        note: 'First day home! Adopted from local shelter.', date: new Date(Date.now() - 120 * 86400000).toISOString() },

    /* ---------- MAX (16 entries) ---------- */
    { id: 'demo_log_19', petId: 'demo_pet_max', type: 'weight',      note: '28.5 kg — Perfect for his breed', date: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'demo_log_20', petId: 'demo_pet_max', type: 'weight',      note: '28.2 kg — Stable', date: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: 'demo_log_21', petId: 'demo_pet_max', type: 'weight',      note: '27.9 kg — Slight decrease', date: new Date(Date.now() - 18 * 86400000).toISOString() },
    { id: 'demo_log_22', petId: 'demo_pet_max', type: 'weight',      note: '28.0 kg — Baseline', date: new Date(Date.now() - 40 * 86400000).toISOString() },
    { id: 'demo_log_23', petId: 'demo_pet_max', type: 'weight',      note: '27.5 kg — Before summer', date: new Date(Date.now() - 75 * 86400000).toISOString() },
    { id: 'demo_log_24', petId: 'demo_pet_max', type: 'temperature', note: '38.3 °C — Normal', date: new Date(Date.now() - 4 * 86400000).toISOString() },
    { id: 'demo_log_25', petId: 'demo_pet_max', type: 'symptom',     note: 'Slight limping (mild) — resolved after rest', date: new Date(Date.now() - 20 * 86400000).toISOString() },
    { id: 'demo_log_26', petId: 'demo_pet_max', type: 'symptom',     note: 'Scratching left ear (moderate) — vet checked, ear infection cleared', date: new Date(Date.now() - 55 * 86400000).toISOString() },
    { id: 'demo_log_27', petId: 'demo_pet_max', type: 'note',        note: 'Long walk in the park — 45 minutes. Very happy boy!', date: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'demo_log_28', petId: 'demo_pet_max', type: 'note',        note: 'New toys arrived. He\'s obsessed with the squeaky bone.', date: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'demo_log_29', petId: 'demo_pet_max', type: 'note',        note: 'Bath day. Took it like a champion.', date: new Date(Date.now() - 14 * 86400000).toISOString() },
    { id: 'demo_log_30', petId: 'demo_pet_max', type: 'note',        note: 'Nail trim done. Getting better at staying still.', date: new Date(Date.now() - 22 * 86400000).toISOString() },
    { id: 'demo_log_31', petId: 'demo_pet_max', type: 'note',        note: 'Annual vet checkup — clean bill of health.', date: new Date(Date.now() - 60 * 86400000).toISOString() },
    { id: 'demo_log_32', petId: 'demo_pet_max', type: 'note',        note: 'Deworming tablet given (monthly).', date: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: 'demo_log_33', petId: 'demo_pet_max', type: 'temperature', note: '38.5 °C — Normal', date: new Date(Date.now() - 45 * 86400000).toISOString() },
    { id: 'demo_log_34', petId: 'demo_pet_max', type: 'note',        note: 'Learned a new trick: "shake paw"! 🐾', date: new Date(Date.now() - 35 * 86400000).toISOString() },

    /* ---------- BELLA (14 entries) ---------- */
    { id: 'demo_log_35', petId: 'demo_pet_bella', type: 'weight',      note: '3.8 kg — Healthy', date: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'demo_log_36', petId: 'demo_pet_bella', type: 'weight',      note: '3.6 kg — Slight gain', date: new Date(Date.now() - 12 * 86400000).toISOString() },
    { id: 'demo_log_37', petId: 'demo_pet_bella', type: 'weight',      note: '3.4 kg — Growing well', date: new Date(Date.now() - 25 * 86400000).toISOString() },
    { id: 'demo_log_38', petId: 'demo_pet_bella', type: 'weight',      note: '3.2 kg — Baseline', date: new Date(Date.now() - 40 * 86400000).toISOString() },
    { id: 'demo_log_39', petId: 'demo_pet_bella', type: 'weight',      note: '2.9 kg — First weigh-in', date: new Date(Date.now() - 60 * 86400000).toISOString() },
    { id: 'demo_log_40', petId: 'demo_pet_bella', type: 'note',        note: 'First vet visit — all vitals normal', date: new Date(Date.now() - 25 * 86400000).toISOString() },
    { id: 'demo_log_41', petId: 'demo_pet_bella', type: 'note',        note: 'First vaccine administered (FVRCP)', date: new Date(Date.now() - 22 * 86400000).toISOString() },
    { id: 'demo_log_42', petId: 'demo_pet_bella', type: 'note',        note: 'Fully settled in new home. Playing with toys!', date: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: 'demo_log_43', petId: 'demo_pet_bella', type: 'symptom',     note: 'Mild diarrhea (mild) — after food change, resolved', date: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: 'demo_log_44', petId: 'demo_pet_bella', type: 'note',        note: 'Started eating new kitten formula. She loves it!', date: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: 'demo_log_45', petId: 'demo_pet_bella', type: 'temperature', note: '38.6 °C — Normal', date: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 'demo_log_46', petId: 'demo_pet_bella', type: 'note',        note: 'First grooming session — she was very calm!', date: new Date(Date.now() - 18 * 86400000).toISOString() },
    { id: 'demo_log_47', petId: 'demo_pet_bella', type: 'symptom',     note: 'Slight sneezing (mild) — cleared on its own', date: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: 'demo_log_48', petId: 'demo_pet_bella', type: 'note',        note: 'Adoption day! Welcome home, Bella 🐱', date: new Date(Date.now() - 60 * 86400000).toISOString() }
  ],

  /* ============================================================ */
  /* 4. VACCINATIONS — Multi-pet with dates                        */
  /* ============================================================ */
  vaccinations: [
    { name: 'Rabies',     done: true,  date: new Date(Date.now() - 90 * 86400000).toISOString(), petId: 'demo_pet_luna' },
    { name: 'FVRCP',      done: true,  date: new Date(Date.now() - 88 * 86400000).toISOString(), petId: 'demo_pet_luna' },
    { name: 'FeLV',       done: true,  date: new Date(Date.now() - 85 * 86400000).toISOString(), petId: 'demo_pet_luna' },
    { name: 'Distemper',  done: false, dueDate: 'Dec 15, 2026', petId: 'demo_pet_luna' },
    { name: 'Bordetella', done: false, dueDate: 'Jan 20, 2027', petId: 'demo_pet_luna' },
    { name: 'Rabies',     done: true,  date: new Date(Date.now() - 120 * 86400000).toISOString(), petId: 'demo_pet_max' },
    { name: 'DHPP',       done: true,  date: new Date(Date.now() - 118 * 86400000).toISOString(), petId: 'demo_pet_max' },
    { name: 'Bordetella', done: true,  date: new Date(Date.now() - 100 * 86400000).toISOString(), petId: 'demo_pet_max' },
    { name: 'Leptospirosis', done: true, date: new Date(Date.now() - 95 * 86400000).toISOString(), petId: 'demo_pet_max' },
    { name: 'FVRCP',      done: true,  date: new Date(Date.now() - 22 * 86400000).toISOString(), petId: 'demo_pet_bella' },
    { name: 'Rabies',     done: false, dueDate: 'Jan 10, 2027', petId: 'demo_pet_bella' },
    { name: 'FeLV',       done: false, dueDate: 'Feb 15, 2027', petId: 'demo_pet_bella' }
  ],

  /* ============================================================ */
  /* 5. MEDICATIONS — Multi-pet                                    */
  /* ============================================================ */
  medications: [
    { id: 'demo_med_1', petId: 'demo_pet_luna', name: 'Deworming Tablet', nextDose: 'Tomorrow · 8:00 PM · After meal', nextDoseDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), nextDoseTime: '20:00', note: 'After meal', date: new Date().toISOString() },
    { id: 'demo_med_2', petId: 'demo_pet_luna', name: 'Hairball Remedy', nextDose: 'Friday · 9:00 AM · With breakfast', nextDoseDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), nextDoseTime: '09:00', note: 'With breakfast', date: new Date().toISOString() },
    { id: 'demo_med_3', petId: 'demo_pet_max', name: 'Joint Supplement', nextDose: 'Next Monday · 10:00 AM · With food', nextDoseDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10), nextDoseTime: '10:00', note: 'With food', date: new Date().toISOString() },
    { id: 'demo_med_4', petId: 'demo_pet_max', name: 'Flea & Tick Prevention', nextDose: 'Monthly · 1st of month', nextDoseDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), nextDoseTime: '08:00', note: 'Monthly dose', date: new Date().toISOString() },
    { id: 'demo_med_5', petId: 'demo_pet_bella', name: 'Kitten Vitamins', nextDose: 'Daily · 7:00 AM', nextDoseDate: new Date(Date.now() + 1 * 86400000).toISOString().slice(0, 10), nextDoseTime: '07:00', note: 'Daily supplement', date: new Date().toISOString() }
  ],

  /* ============================================================ */
  /* 6. REMINDERS — Distributed across pets                        */
  /* ============================================================ */
  reminders: [
    { id: 'demo_rem_1', petId: 'demo_pet_luna', type: 'vaccination', date: 'Dec 15, 2026', time: '10:00', label: 'Distemper Booster' },
    { id: 'demo_rem_2', petId: 'demo_pet_luna', type: 'grooming',    date: 'Dec 20, 2026', time: '15:00', label: "Luna's Grooming Session" },
    { id: 'demo_rem_3', petId: 'demo_pet_luna', type: 'checkup',     date: 'Jan 15, 2027', time: '11:00', label: "Luna's 6-Month Checkup" },
    { id: 'demo_rem_4', petId: 'demo_pet_max',  type: 'checkup',     date: 'Jan 5, 2027',  time: '11:00', label: "Max's Annual Checkup" },
    { id: 'demo_rem_5', petId: 'demo_pet_max',  type: 'medication',  date: 'Dec 18, 2026', time: '08:00', label: 'Joint Supplement Refill' },
    { id: 'demo_rem_6', petId: 'demo_pet_max',  type: 'grooming',    date: 'Jan 20, 2027', time: '14:00', label: 'Max — Full Grooming' },
    { id: 'demo_rem_7', petId: 'demo_pet_bella', type: 'vaccination', date: 'Jan 10, 2027', time: '09:00', label: "Bella's FeLV Vaccine" },
    { id: 'demo_rem_8', petId: 'demo_pet_bella', type: 'checkup',     date: 'Dec 28, 2026', time: '14:00', label: 'Kitten Weight Check' }
  ],

  /* ============================================================ */
  /* 7. DAILY CARE — Multi-pet state                               */
  /* ============================================================ */
  dailyCare: {
    _multi: true,
    demo_pet_luna:  { date: new Date().toISOString().slice(0, 10), feeding: true, water: true, walk: true, medicine: false, grooming: true,  exercise: true  },
    demo_pet_max:   { date: new Date().toISOString().slice(0, 10), feeding: true, water: true, walk: true, medicine: true,  grooming: false, exercise: true  },
    demo_pet_bella: { date: new Date().toISOString().slice(0, 10), feeding: true, water: false, walk: false, medicine: false, grooming: false, exercise: false }
  },

  /* ============================================================ */
  /* 8. CARE HISTORY — Real streak data                            */
  /* ============================================================ */
  careHistory: (function() {
    const history = {
      demo_pet_luna: {},
      demo_pet_max: {},
      demo_pet_bella: {}
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Luna — 14-day streak
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      history.demo_pet_luna[key] = {
        feeding: true,
        water: true,
        walk: true,
        medicine: i > 0,
        grooming: i % 2 === 0,
        exercise: i % 3 !== 0,
        savedAt: d.toISOString()
      };
    }

    // Max — 10-day streak
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      history.demo_pet_max[key] = {
        feeding: true,
        water: true,
        walk: true,
        medicine: i % 4 === 0,
        grooming: i % 3 === 0,
        exercise: true,
        savedAt: d.toISOString()
      };
    }

    // Bella — 5-day streak
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      history.demo_pet_bella[key] = {
        feeding: true,
        water: i === 0 ? false : true,
        walk: false,
        medicine: false,
        grooming: false,
        exercise: false,
        savedAt: d.toISOString()
      };
    }

    return history;
  })(),

  /* ============================================================ */
  /* 9. CUSTOM CARE                                                */
  /* ============================================================ */
  customCare: {
    demo_pet_luna: [
      { id: 'demo_care_1', label: 'Brush coat',   icon: 'fa-scissors', done: false, createdAt: new Date().toISOString() },
      { id: 'demo_care_2', label: 'Play session', icon: 'fa-baseball', done: true,  createdAt: new Date().toISOString() },
      { id: 'demo_care_3', label: 'Clean litter', icon: 'fa-broom',    done: false, createdAt: new Date().toISOString() }
    ],
    demo_pet_max: [
      { id: 'demo_care_4', label: 'Brush teeth',  icon: 'fa-tooth',    done: false, createdAt: new Date().toISOString() },
      { id: 'demo_care_5', label: 'Fetch time',   icon: 'fa-baseball', done: true,  createdAt: new Date().toISOString() },
      { id: 'demo_care_6', label: 'Paw massage',  icon: 'fa-hand-holding-heart', done: false, createdAt: new Date().toISOString() }
    ],
    demo_pet_bella: [
      { id: 'demo_care_7', label: 'Play with toys', icon: 'fa-baseball', done: false, createdAt: new Date().toISOString() },
      { id: 'demo_care_8', label: 'Kitten cuddles', icon: 'fa-heart',    done: true,  createdAt: new Date().toISOString() }
    ]
  },

  /* ============================================================ */
  /* 10. ORDERS                                                    */
  /* ============================================================ */
  orders: [
    { id: 'ORD-884521', date: new Date(Date.now() - 1 * 86400000).toISOString(),  items: [{ id: 'food7', name: 'Whiskas', price: 14.99, qty: 2 }, { id: 'acc4', name: 'Dog & Cat Bowls', price: 18.99, qty: 1 }], itemsCount: 3, total: 55.97, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'bkash', status: 'confirmed', trackingStage: 2 },
    { id: 'ORD-884520', date: new Date(Date.now() - 5 * 86400000).toISOString(),  items: [{ id: 'food10', name: 'Pedigree', price: 22.99, qty: 1 }, { id: 'acc6', name: 'Dog Toothbrush', price: 8.99, qty: 1 }], itemsCount: 2, total: 36.98, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'cod', status: 'delivered', trackingStage: 3 },
    { id: 'ORD-884518', date: new Date(Date.now() - 10 * 86400000).toISOString(), items: [{ id: 'acc3', name: 'Pet Carrier', price: 55.99, qty: 1 }], itemsCount: 1, total: 60.99, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'card', status: 'delivered', trackingStage: 3 },
    { id: 'ORD-884510', date: new Date(Date.now() - 20 * 86400000).toISOString(), items: [{ id: 'food5', name: 'Viva For Cats', price: 34.99, qty: 1 }, { id: 'food6', name: 'Me-O', price: 12.99, qty: 2 }, { id: 'acc5', name: 'Pet Hair Comb', price: 14.99, qty: 1 }], itemsCount: 4, total: 75.96, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'bkash', status: 'delivered', trackingStage: 3 },
    { id: 'ORD-884498', date: new Date(Date.now() - 35 * 86400000).toISOString(), items: [{ id: 'food1', name: 'Royal Canin Adult Cat Food', price: 24.99, qty: 1 }, { id: 'acc7', name: 'Pet Grooming Kit', price: 39.99, qty: 1 }], itemsCount: 2, total: 69.98, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'cod', status: 'delivered', trackingStage: 3 },
    { id: 'ORD-884475', date: new Date(Date.now() - 50 * 86400000).toISOString(), items: [{ id: 'acc10', name: 'Licking Mat', price: 13.99, qty: 2 }, { id: 'acc8', name: 'Paw Balm', price: 11.99, qty: 1 }], itemsCount: 3, total: 39.97, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'card', status: 'delivered', trackingStage: 3 },
    { id: 'ORD-884460', date: new Date(Date.now() - 65 * 86400000).toISOString(), items: [{ id: 'food2', name: 'Skyler Treats Herring', price: 24.99, qty: 2 }], itemsCount: 2, total: 49.98, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'bkash', status: 'delivered', trackingStage: 3 },
    { id: 'ORD-884450', date: new Date(Date.now() - 80 * 86400000).toISOString(), items: [{ id: 'acc1', name: 'Pet Spa Set', price: 45.99, qty: 1 }, { id: 'acc2', name: 'Pet Nail Cutter', price: 12.99, qty: 1 }], itemsCount: 2, total: 58.98, name: "Ayesha Khan", phone: '+880 1712-345678', address: "Cox's Bazar, Bangladesh", paymentMethod: 'cod', status: 'delivered', trackingStage: 3 }
  ],

  /* ============================================================ */
  /* 11. APPOINTMENTS                                              */
  /* ============================================================ */
  appointments: [
    { id: 'demo_apt_1', storeId: 'store_pet_clinic', vetId: 'vet_ayesha', userId: "Ayesha Khan", petId: 'demo_pet_luna',  date: new Date(Date.now() + 3 * 86400000).toISOString(),  consultationType: 'inPerson', fee: 50, reason: 'Annual health checkup', status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'demo_apt_2', storeId: 'store_pet_clinic', vetId: 'vet_karim',  userId: "Ayesha Khan", petId: 'demo_pet_max',   date: new Date(Date.now() + 12 * 86400000).toISOString(), consultationType: 'video',    fee: 25, reason: 'Follow-up on limping issue', status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'demo_apt_3', storeId: 'store_pet_clinic', vetId: 'vet_ayesha', userId: "Ayesha Khan", petId: 'demo_pet_bella', date: new Date(Date.now() + 20 * 86400000).toISOString(), consultationType: 'chat',     fee: 10, reason: 'Kitten diet advice', status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'demo_apt_4', storeId: 'store_pet_clinic', vetId: 'vet_ayesha', userId: "Ayesha Khan", petId: 'demo_pet_bella', date: new Date(Date.now() - 7 * 86400000).toISOString(),  consultationType: 'inPerson', fee: 50, reason: 'First vaccine visit — completed', status: 'completed', createdAt: new Date().toISOString() },
    { id: 'demo_apt_5', storeId: 'store_pet_clinic', vetId: 'vet_karim',  userId: "Ayesha Khan", petId: 'demo_pet_max',   date: new Date(Date.now() - 60 * 86400000).toISOString(), consultationType: 'inPerson', fee: 50, reason: 'Annual checkup — clean bill', status: 'completed', createdAt: new Date().toISOString() },
    { id: 'demo_apt_6', storeId: 'store_pet_clinic', vetId: 'vet_ayesha', userId: "Ayesha Khan", petId: 'demo_pet_luna',  date: new Date(Date.now() - 90 * 86400000).toISOString(), consultationType: 'inPerson', fee: 50, reason: 'Rabies booster vaccination', status: 'completed', createdAt: new Date().toISOString() }
  ],

  /* ============================================================ */
  /* 12. SOS HISTORY                                               */
  /* ============================================================ */
  sosHistory: [
    {
      id: 'sos_demo_1',
      type: 'injured',
      description: 'Street dog injured near Kolatoli Beach. Bleeding from left paw. Very friendly, needs urgent care.',
      location: "Kolatoli Beach Road, Cox's Bazar",
      phone: '+880 1712-345678',
      status: 'resolved',
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      userId: 'user_demo',
      userName: 'Ayesha Khan',
      assignedVet: { id: 'vet_clinic_1', name: 'Dhaka Pet Emergency', phone: '+880-1700-000001' },
      eta: '12 min',
      currentStage: 4,
      timeline: [
        { stage: 'reported', time: new Date(Date.now() - 25 * 86400000).toISOString() },
        { stage: 'assigned', time: new Date(Date.now() - 25 * 86400000 + 300000).toISOString() },
        { stage: 'enroute',  time: new Date(Date.now() - 25 * 86400000 + 600000).toISOString() },
        { stage: 'onscene',  time: new Date(Date.now() - 25 * 86400000 + 1200000).toISOString() },
        { stage: 'resolved', time: new Date(Date.now() - 25 * 86400000 + 3600000).toISOString() }
      ]
    },
    {
      id: 'sos_demo_2',
      type: 'lost',
      description: 'Lost pet cat near Sugandha Beach Point. Orange tabby with white chest. Answers to "Milo".',
      location: "Sugandha Beach Point, Cox's Bazar",
      phone: null,
      status: 'resolved',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      userId: 'user_demo',
      userName: 'Ayesha Khan',
      assignedVet: { id: 'vet_clinic_2', name: 'Animal Rescue BD', phone: '+880-1700-000002' },
      eta: '15 min',
      currentStage: 4,
      timeline: [
        { stage: 'reported', time: new Date(Date.now() - 60 * 86400000).toISOString() },
        { stage: 'resolved', time: new Date(Date.now() - 60 * 86400000 + 7200000).toISOString() }
      ]
    }
  ],

  /* ============================================================ */
  /* 13. NOTIFICATIONS                                             */
  /* ============================================================ */
  notifications: [
    { id: 'demo_notif_1', type: 'order',       title: '🚚 Order Shipped',          message: 'Your order ORD-884521 is out for delivery. Arriving today!',                      date: new Date(Date.now() - 30 * 60000).toISOString(),   read: false },
    { id: 'demo_notif_2', type: 'appointment', title: '📅 Appointment Reminder',   message: "Luna's checkup with Dr. Ayesha is in 3 days.",                                  date: new Date(Date.now() - 2 * 3600000).toISOString(),  read: false },
    { id: 'demo_notif_3', type: 'reminder',    title: '💉 Vaccination Due',        message: 'Distemper booster is due on Dec 15. Book soon!',                                date: new Date(Date.now() - 5 * 3600000).toISOString(),  read: false },
    { id: 'demo_notif_4', type: 'social',      title: '❤️ Dr. Karim liked your post', message: 'Your post "Luna\'s first day at the beach" just hit 50 likes!',              date: new Date(Date.now() - 8 * 3600000).toISOString(),  read: false },
    { id: 'demo_notif_5', type: 'sos',         title: '✅ SOS Resolved',           message: 'Emergency report sos_demo_1 has been successfully resolved. Thank you!',        date: new Date(Date.now() - 24 * 3600000).toISOString(), read: true, sosId: 'sos_demo_1' },
    { id: 'demo_notif_6', type: 'reminder',    title: '💊 Medication Due',         message: 'Time for Max\'s joint supplement. Don\'t forget!',                              date: new Date(Date.now() - 12 * 3600000).toISOString(), read: true },
    { id: 'demo_notif_7', type: 'social',      title: '💬 New Comment',            message: 'Dr. Ayesha replied to your question about cat nutrition.',                      date: new Date(Date.now() - 1 * 86400000).toISOString(), read: true },
    { id: 'demo_notif_8', type: 'system',      title: '🎉 Welcome to PetCare',     message: 'Explore all features. We\'re here whenever you need us.',                        date: new Date(Date.now() - 2 * 86400000).toISOString(), read: true },
    { id: 'demo_notif_9', type: 'order',       title: '✅ Order Delivered',        message: 'Your order ORD-884520 was delivered successfully.',                              date: new Date(Date.now() - 3 * 86400000).toISOString(), read: true }
  ],

  /* ============================================================ */
  /* 14. WISHLIST + CART + FAVORITES                               */
  /* ============================================================ */
  wishlist: ['acc3', 'food5', 'acc7', 'food1', 'acc10', 'food7'],

  favoriteStores: ['store_pet_clinic', 'store_grooming_house', 'store_arfas', 'store_kimi_kawai'],

  savedPosts: ['demo_post_3', 'demo_post_5', 'demo_post_6'],

  cart: [
    { id: 'food7', name: 'Whiskas', price: 14.99, img: 'assets/products/whiskas.jpg', quantity: 1 },
    { id: 'acc5', name: 'Pet Hair Comb', price: 14.99, img: 'assets/products/accessories5.jpg', quantity: 1 }
  ],

  /* ============================================================ */
  /* 15. POSTS — 10 rich demo posts                                */
  /* ============================================================ */
  demoPosts: [
    {
      id: 'demo_post_1',
      authorId: 'user_demo',
      authorName: 'Ayesha Khan',
      authorRole: 'petOwner',
      type: 'story',
      title: 'Luna discovered the window seat today',
      content: "She sat there for 4 hours straight watching birds. I think I've lost my cat to a window 😂☀️\n\nAny other cat parents relate? Share your stories below!",
      image: null,
      products: null,
      date: new Date(Date.now() - 3 * 3600000).toISOString(),
      likes: 47,
      likedBy: ['Dr. Ayesha Rahman', 'Dr. Karim Ahmed', 'Milo\'s Mum'],
      comments: [
        {
          id: 'demo_c_1',
          authorId: 'user_ayesha',
          authorName: 'Dr. Ayesha Rahman',
          authorRole: 'vet',
          text: "Cats love watching birds! It's excellent mental stimulation 🐦 Just make sure the window is secure.",
          date: new Date(Date.now() - 2 * 3600000).toISOString(),
          likes: 5,
          likedBy: [],
          replies: []
        },
        {
          id: 'demo_c_2',
          authorId: 'user_milos_mum',
          authorName: "Milo's Mum",
          authorRole: 'petOwner',
          text: 'Milo does the exact same thing! Window cats unite 🐱',
          date: new Date(Date.now() - 1 * 3600000).toISOString(),
          likes: 3,
          likedBy: [],
          replies: []
        }
      ]
    },
    {
      id: 'demo_post_2',
      authorId: 'user_demo',
      authorName: 'Ayesha Khan',
      authorRole: 'petOwner',
      type: 'question',
      title: 'Best food for senior cats?',
      content: "Luna is turning 3 soon. Any recommendations for premium cat food? She's a bit picky and I want to make sure she's getting all the nutrients she needs.\n\nBudget: flexible. Location: Cox's Bazar. Would love local store suggestions! 🐱",
      image: null,
      products: null,
      date: new Date(Date.now() - 1 * 86400000).toISOString(),
      likes: 12,
      likedBy: ['Dr. Ayesha Rahman'],
      comments: [
        {
          id: 'demo_c_3',
          authorId: 'user_pretty_pet',
          authorName: 'Pretty Pet',
          authorRole: 'storeOwner',
          text: 'We have Royal Canin Adult — perfect for Luna at this age! Come visit our store 🏪',
          date: new Date(Date.now() - 20 * 3600000).toISOString(),
          likes: 2,
          likedBy: [],
          replies: []
        }
      ]
    },
    {
      id: 'demo_post_3',
      authorId: 'user_ayesha',
      authorName: 'Dr. Ayesha Rahman',
      authorRole: 'vet',
      type: 'tip',
      title: '5 Signs Your Cat is Dehydrated',
      content: "Watch for these warning signs:\n\n1. Dry gums\n2. Skin tenting (slow return)\n3. Sunken eyes\n4. Lethargy\n5. Loss of appetite\n\nIf you notice any of these, offer fresh water and consult a vet immediately. Dehydration can become serious quickly in cats.",
      image: null,
      products: null,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      likes: 234,
      likedBy: ['Ayesha Khan', 'Milo\'s Mum', 'Tanzim Hasan', 'Dr. Karim Ahmed'],
      comments: [
        {
          id: 'demo_c_4',
          authorId: 'user_milos_mum',
          authorName: "Milo's Mum",
          authorRole: 'petOwner',
          text: 'This is SO helpful. Bookmarked! 🔖',
          date: new Date(Date.now() - 40 * 3600000).toISOString(),
          likes: 8,
          likedBy: [],
          replies: []
        }
      ]
    },
    {
      id: 'demo_post_4',
      authorId: 'user_milos_mum',
      authorName: "Milo's Mum",
      authorRole: 'petOwner',
      type: 'story',
      title: 'Milo is home!',
      content: 'Adopted this beautiful boy today! He is so playful and loving. Any tips for a new cat owner? So excited to start this journey with him!',
      image: 'assets/pets/milo.png',
      products: null,
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      likes: 128,
      likedBy: ['Ayesha Khan', 'Dr. Ayesha Rahman', 'Dr. Karim Ahmed'],
      comments: []
    },
    {
      id: 'demo_post_5',
      authorId: 'user_karim',
      authorName: 'Dr. Karim Ahmed',
      authorRole: 'vet',
      type: 'awareness',
      title: '⚠️ Chocolate Toxicity Alert',
      content: "Chocolate is EXTREMELY toxic for both cats and dogs. The darker and more bitter the chocolate, the greater the danger.\n\nIf you suspect your pet has eaten chocolate:\n- Do NOT wait for symptoms\n- Contact your vet immediately\n- Note how much and what type they ate\n\nEven small amounts can be dangerous for small pets.",
      image: 'assets/mems/mem-chocolate.png',
      products: null,
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      likes: 456,
      likedBy: ['Ayesha Khan', 'Milo\'s Mum'],
      comments: []
    },
    {
      id: 'demo_post_6',
      authorId: 'user_pretty_pet',
      authorName: 'Pretty Pet',
      authorRole: 'storeOwner',
      type: 'awareness',
      title: '🎉 New Arrivals at Pretty Pet!',
      content: 'New shipment just arrived! Premium cat food from Royal Canin, Whiskas, Pedigree and Me-O — all your favourites under one roof. Visit us today and get 20% off on your first purchase!',
      image: null,
      products: [
        'assets/products/pedigree.jpg',
        'assets/products/whiskas.jpg',
        'assets/products/me-o.jpg',
        'assets/products/pedigree.jpg'
      ],
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      likes: 96,
      likedBy: ['Ayesha Khan'],
      comments: []
    },
    {
      id: 'demo_post_7',
      authorId: 'user_demo',
      authorName: 'Ayesha Khan',
      authorRole: 'petOwner',
      type: 'story',
      title: "Max's first beach day!",
      content: "Took Max to the beach for the very first time. He was terrified of the waves at first but by the end he was chasing them! Absolutely priceless memories 🐕🏖️",
      image: 'assets/pets/milo.png',
      products: null,
      date: new Date(Date.now() - 6 * 86400000).toISOString(),
      likes: 189,
      likedBy: ['Dr. Ayesha Rahman', 'Milo\'s Mum'],
      comments: []
    },
    {
      id: 'demo_post_8',
      authorId: 'user_tanzim',
      authorName: 'Tanzim Hasan',
      authorRole: 'petOwner',
      type: 'question',
      title: "Lost my cat's favourite toy",
      content: "My cat's favourite toy was this little knitted mouse (in the photo). It's recently gone missing and I can't find a similar one online. Can anyone suggest where I can find one? Any help would be appreciated!",
      image: 'assets/mems/mem-kitten-home.png',
      products: null,
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      likes: 45,
      likedBy: [],
      comments: [
        {
          id: 'demo_c_5',
          authorId: 'user_kimi',
          authorName: 'Kimi Kawai',
          authorRole: 'storeOwner',
          text: 'Check our store! We have similar knitted toys in stock 🧶',
          date: new Date(Date.now() - 6 * 86400000).toISOString(),
          likes: 3,
          likedBy: [],
          replies: [
            {
              id: 'demo_r_1',
              authorId: 'user_tanzim',
              authorName: 'Tanzim Hasan',
              authorRole: 'petOwner',
              text: 'Thanks! Just ordered ❤️',
              date: new Date(Date.now() - 5 * 86400000).toISOString()
            }
          ]
        }
      ]
    },
    {
      id: 'demo_post_9',
      authorId: 'user_demo',
      authorName: 'Ayesha Khan',
      authorRole: 'petOwner',
      type: 'story',
      title: 'Bella finally settled in 🐱',
      content: "It took 3 weeks but Bella is finally comfortable in her new home. She's now sleeping on my bed and following me everywhere. Patience pays off!",
      image: null,
      products: null,
      date: new Date(Date.now() - 10 * 86400000).toISOString(),
      likes: 234,
      likedBy: ['Dr. Ayesha Rahman', 'Milo\'s Mum', 'Dr. Karim Ahmed'],
      comments: []
    },
    {
      id: 'demo_post_10',
      authorId: 'user_ayesha',
      authorName: 'Dr. Ayesha Rahman',
      authorRole: 'vet',
      type: 'tip',
      title: 'The 3-3-3 Rule for Newly Adopted Pets',
      content: "When you bring a new pet home, remember the 3-3-3 rule:\n\n• 3 DAYS to decompress\n• 3 WEEKS to learn your routine\n• 3 MONTHS to feel completely at home\n\nBe patient. Give them space. Don't rush the bonding process. Every pet adjusts at their own pace.",
      image: null,
      products: null,
      date: new Date(Date.now() - 12 * 86400000).toISOString(),
      likes: 312,
      likedBy: ['Ayesha Khan', 'Milo\'s Mum'],
      comments: []
    }
  ],

  /* ============================================================ */
  /* 16. USER-CREATED FOSTER LISTINGS                              */
  /* ============================================================ */
  myFosterListings: [
    {
      id: 'foster_demo_001',
      name: 'Simba',
      species: 'cat',
      breed: 'Orange Tabby',
      gender: 'male',
      age: '3 months',
      ageMonths: 3,
      image: 'assets/pets/simba.png',
      gallery: ['assets/pets/simba.png'],
      description: 'Simba was rescued from a construction site. He is playful and healthy, looking for a loving foster family until he finds his forever home.',
      medical: {
        vaccinated: true,
        dewormed: true,
        neutered: false,
        healthy: true,
        specialNeeds: false,
        notes: 'Healthy kitten. Needs regular playtime.'
      },
      location: "Kolatoli Beach Road, Cox's Bazar",
      distance: '0.5 km',
      fosterDuration: '2-3 weeks',
      monthlyCost: 20,
      donationsReceived: 15,
      donationGoal: 80,
      views: 42,
      status: 'available',
      listedBy: 'user_self',
      listedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      applications: [
        {
          id: 'fapp_demo_001',
          applicantId: 'user_milos_mum',
          applicantName: "Milo's Mum",
          applicantPhone: '+880-1712-000010',
          applicantAddress: "Sugandha Beach Point, Cox's Bazar",
          hasPets: 'yes-cats',
          experience: 'experienced',
          reason: 'I have 2 cats already and would love to foster Simba. My home is cat-friendly and safe.',
          status: 'pending',
          submittedAt: new Date(Date.now() - 1 * 86400000).toISOString()
        },
        {
          id: 'fapp_demo_002',
          applicantId: 'user_tanzim',
          applicantName: 'Tanzim Hasan',
          applicantPhone: '+880-1712-000011',
          applicantAddress: 'Marine Drive, Cox\'s Bazar',
          hasPets: 'no',
          experience: 'some',
          reason: 'First foster but very enthusiastic. I have a quiet home perfect for Simba.',
          status: 'pending',
          submittedAt: new Date(Date.now() - 12 * 3600000).toISOString()
        }
      ],
      donatedBy: []
    },
    {
      id: 'foster_demo_002',
      name: 'Lily',
      species: 'dog',
      breed: 'Beagle Mix',
      gender: 'female',
      age: '1 year',
      ageMonths: 12,
      image: 'assets/pets/lily.png',
      gallery: ['assets/pets/lily.png'],
      description: 'Lily is a sweet Beagle mix who was abandoned near the beach. She is gentle, house-trained, and needs a temporary home while we find her a permanent family.',
      medical: {
        vaccinated: true,
        dewormed: true,
        neutered: true,
        healthy: true,
        specialNeeds: false,
        notes: 'Fully healthy and spayed. Loves children.'
      },
      location: "Laboni Beach Point, Cox's Bazar",
      distance: '1.2 km',
      fosterDuration: '3-4 weeks',
      monthlyCost: 40,
      donationsReceived: 55,
      donationGoal: 150,
      views: 78,
      status: 'available',
      listedBy: 'user_self',
      listedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      applications: [],
      donatedBy: []
    }
  ],

  /* ============================================================ */
  /* 17. USER'S OWN FOSTER APPLICATIONS                            */
  /* ============================================================ */
  myFosterApplications: [
    {
      id: 'fapp_demo_applicant_001',
      petId: 'foster_003',
      applicantId: 'user_self',
      applicantName: 'Ayesha Khan',
      applicantPhone: '+880 1712-345678',
      applicantAddress: "Cox's Bazar, Bangladesh",
      hasPets: 'yes-cats',
      experience: 'some',
      reason: 'Rocky needs medical care and I have a quiet home with space for him to recover peacefully.',
      status: 'pending',
      submittedAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ],

  /* ============================================================ */
  /* 18. FOLLOWING MAP                                             */
  /* ============================================================ */
  followingMap: {
    user_demo: ['user_ayesha', 'user_karim', 'user_milos_mum', 'user_pretty_pet', 'user_kimi']
  },

  /* ============================================================ */
  /* 19. USER CREATED STORE                                        */
  /* ============================================================ */
  userStore: {
    id: 'demo_store_ayesha',
    name: "Ayesha's Pet Boutique",
    owner: 'Ayesha Khan',
    ownerId: 'user_demo',
    type: 'hybrid',
    category: 'Accessories',
    isClinic: false,
    showWorkers: false,
    rating: 4.9,
    reviewCount: 47,
    location: "Cox's Bazar",
    phone: '+880 1712-345678',
    hours: '10 AM - 9 PM',
    description: "Premium handpicked pet accessories and grooming products. Curated with love for your furry friends.",
    cover: 'assets/stores/grooming-house.png',
    logo: 'assets/icons/pfp-milos-mum.png',
    gallery: [],
    products: ['acc1', 'acc4', 'acc5', 'acc7'],
    workers: [],
    reviews: [],
    isFavorite: false,
    isUserCreated: true
  }
};

/* ============================================================ */
/* EXPORT                                                        */
/* ============================================================ */
window.DEMO_DATA = DEMO_DATA;

console.log('PetCare Demo Data loaded — Clean v2');
console.log('📊 Stats: 3 pets · 48 logs · 12 vaccines · 8 reminders · 8 orders · 10 posts · 2 foster listings');