/* ============================================================ */
/* PETCARE v3.0 — STATIC DATA                                    */
/* ============================================================ */

/* 1. CATEGORIES */
const CATEGORIES = [
  { id: 'food',        label: 'Food',        icon: 'fa-bowl-food',         bg: '#D4E4C8', color: '#3A4A3A' },
  { id: 'treats',      label: 'Treats',      icon: 'fa-bone',              bg: '#F5D5B8', color: '#8B6F47' },
  { id: 'toys',        label: 'Toys',        icon: 'fa-baseball',          bg: '#E8D9BF', color: '#6B5443' },
  { id: 'grooming',    label: 'Grooming',    icon: 'fa-scissors',          bg: '#C8D4E4', color: '#3A4A3A' },
  { id: 'accessories', label: 'Accessories', icon: 'fa-tag',               bg: '#E4D4E8', color: '#6B5443' },
  { id: 'health',      label: 'Health',      icon: 'fa-briefcase-medical', bg: '#F5C8C8', color: '#C45A4A' },
  { id: 'training',    label: 'Training',    icon: 'fa-graduation-cap',    bg: '#D4E4E8', color: '#3A4A3A' },
  { id: 'others',      label: 'Others',      icon: 'fa-ellipsis',          bg: '#E0D5C0', color: '#8B6F47' }
];

/* 2. PET AVATARS */
const PET_AVATARS = {
  cat: [
    'assets/avatars/av-cat1.png',
    'assets/avatars/av-cat2.png',
    'assets/avatars/av-cat3.png',
    'assets/avatars/av-cat4.png',
    'assets/avatars/av-cat5.png'
  ],
  dog: [
    'assets/avatars/av-dog1.png',
    'assets/avatars/av-dog2.png',
    'assets/avatars/av-dog3.png',
    'assets/avatars/av-dog4.png',
    'assets/avatars/av-dog5.png'
  ],
  bird: [
    'assets/avatars/av-bird1.png',
    'assets/avatars/av-bird2.png',
    'assets/avatars/av-bird3.png',
    'assets/avatars/av-bird4.png',
    'assets/avatars/av-bird5.png'
  ],
  rabbit: [
    'assets/avatars/av-rabbit1.png',
    'assets/avatars/av-rabbit2.png',
    'assets/avatars/av-rabbit3.png',
    'assets/avatars/av-rabbit4.png',
    'assets/avatars/av-rabbit5.png'
  ],
  other: [
    'assets/avatars/av-other1.png'
  ]
};

function getAvatarsBySpecies(species) {
  return PET_AVATARS[species] || [];
}

/* ============================================================ */
/* COVER PHOTO HELPERS                                           */
/* ============================================================ */
function getCoverUrl(coverId) {
  if (!coverId) return null;
  const map = {
    'cover-1': 'assets/covers/cover-1.jpg',
    'cover-2': 'assets/covers/cover-2.jpg',
    'cover-3': 'assets/covers/cover-3.jpg',
    'cover-4': 'assets/covers/cover-4.jpg',
    'cover-5': 'assets/covers/cover-5.jpg',
    // Backward compat
    'cover_01': 'assets/covers/cover-1.jpg',
    'cover_02': 'assets/covers/cover-2.jpg',
    'cover_03': 'assets/covers/cover-3.jpg',
    'cover_04': 'assets/covers/cover-4.jpg',
    'cover_05': 'assets/covers/cover-5.jpg'
  };
  return map[coverId] || null;
}

function getCoverGradient(coverId) {
  const gradients = {
    'cover-1': 'linear-gradient(135deg, #D4DEC8, #8B9D7E)',
    'cover-2': 'linear-gradient(135deg, #F5D5B8, #C9A961)',
    'cover-3': 'linear-gradient(135deg, #C8D4E4, #7BA3C9)',
    'cover-4': 'linear-gradient(135deg, #E8D9BF, #8B6F47)',
    'cover-5': 'linear-gradient(135deg, #F9A8D4, #D88B9E)',
    // Backward compat
    'cover_01': 'linear-gradient(135deg, #D4DEC8, #8B9D7E)',
    'cover_02': 'linear-gradient(135deg, #F5D5B8, #C9A961)',
    'cover_03': 'linear-gradient(135deg, #C8D4E4, #7BA3C9)',
    'cover_04': 'linear-gradient(135deg, #E8D9BF, #8B6F47)',
    'cover_05': 'linear-gradient(135deg, #F9A8D4, #D88B9E)'
  };
  return gradients[coverId] || gradients['cover-1'];
}

/* ============================================================ */
/* VET APPLICATION DEFAULT STATE                                 */
/* ============================================================ */
function getDefaultVetApplication() {
  return {
    status: 'none',            // 'none' | 'pending' | 'approved' | 'rejected'
    specialization: null,
    experience: null,
    clinicName: null,
    clinicAddress: null,
    licenseNumber: null,
    licensePhoto: null,
    appliedAt: null,
    approvedAt: null
  };
}

/* 3. USERS (for profile view) */
const USERS = {
  user_ayesha: {
    id: 'user_ayesha',
    name: 'Dr. Ayesha Rahman',
    avatar: 'assets/icons/pfp-ayesha.png',
    coverPhoto: 'cover-3',
    bio: 'Veterinarian with 8+ years of experience in small animal care. Passionate about preventive care, animal welfare, and helping pet parents understand their pets better.',
    location: "Cox's Bazar",
    phone: '+880-1712-345678',
    email: 'ayesha@petcare.com',

    roles: ['vet', 'petOwner'],
    activeRole: 'vet',

    vetApplication: {
      status: 'approved',
      specialization: 'General Veterinarian',
      experience: 8,
      clinicName: 'Pet Clinic',
      clinicAddress: "Cox's Bazar",
      licenseNumber: 'VET-89210',
      licensePhoto: null,
      appliedAt: '2024-01-15T10:00:00.000Z',
      approvedAt: '2024-01-17T14:30:00.000Z'
    },

    ownedStores: [],
    showPets: false,

    followers: 1240,
    following: 320,
    postsCount: 248,
    reviewCount: 86,
    rating: 4.9
  },

  user_karim: {
    id: 'user_karim',
    name: 'Dr. Karim Ahmed',
    avatar: 'assets/icons/pfp-karim.png',
    coverPhoto: 'cover-2',
    bio: 'Veterinary surgeon specialized in orthopedic and soft tissue surgery. Dedicated to helping pets recover and live pain-free lives.',
    location: "Cox's Bazar",
    phone: '+880-1712-000002',
    email: 'karim@petcare.com',

    roles: ['vet', 'petOwner'],
    activeRole: 'vet',

    vetApplication: {
      status: 'approved',
      specialization: 'Veterinary Surgeon',
      experience: 12,
      clinicName: 'Pet Clinic',
      clinicAddress: "Cox's Bazar",
      licenseNumber: 'VET-45123',
      licensePhoto: null,
      appliedAt: '2023-06-10T09:00:00.000Z',
      approvedAt: '2023-06-12T11:00:00.000Z'
    },

    ownedStores: [],
    showPets: false,

    followers: 892,
    following: 210,
    postsCount: 156,
    reviewCount: 78,
    rating: 4.7
  },

  user_milos_mum: {
    id: 'user_milos_mum',
    name: "Milo's Mum",
    avatar: 'assets/icons/pfp-milos-mum.png',
    coverPhoto: 'cover-4',
    bio: 'Cat mom. Coffee lover. Sharing my journey with Milo and learning from other pet parents.',
    location: "Cox's Bazar",
    phone: null,
    email: 'milosmum@petcare.com',

    roles: ['petOwner'],
    activeRole: 'petOwner',

    vetApplication: getDefaultVetApplication(),

    ownedStores: [],
    showPets: true,

    followers: 342,
    following: 189,
    postsCount: 42,
    reviewCount: 0,
    rating: 0
  },

  user_pretty_pet: {
    id: 'user_pretty_pet',
    name: 'Pretty Pet',
    avatar: 'assets/icons/pfp-pretty-pet.png',
    coverPhoto: 'cover-1',
    bio: 'Your favourite pet store. Premium quality products for your beloved pets.',
    location: "Cox's Bazar",
    phone: '+880-1712-000006',
    email: 'hello@prettypet.com',

    roles: ['petOwner', 'storeOwner'],
    activeRole: 'storeOwner',

    vetApplication: getDefaultVetApplication(),

    ownedStores: ['store_pretty_pet'],
    showPets: false,

    followers: 567,
    following: 98,
    postsCount: 89,
    reviewCount: 54,
    rating: 4.6
  },

  user_tanzim: {
    id: 'user_tanzim',
    name: 'Tanzim Hasan',
    avatar: null,
    coverPhoto: 'cover-5',
    bio: 'Pet owner. Cat dad. Just trying to give my cat the best life possible.',
    location: "Cox's Bazar",
    phone: null,
    email: 'tanzim@petcare.com',

    roles: ['petOwner'],
    activeRole: 'petOwner',

    vetApplication: getDefaultVetApplication(),

    ownedStores: [],
    showPets: true,

    followers: 156,
    following: 234,
    postsCount: 28,
    reviewCount: 0,
    rating: 0
  },

  user_kimi: {
    id: 'user_kimi',
    name: 'Kimi Kawai',
    avatar: 'assets/icons/pfp-milos-mum.png',
    coverPhoto: 'cover-4',
    bio: 'Kimi Kawai — your all-in-one pet store with everything your pet needs.',
    location: "Cox's Bazar",
    phone: '+880-1712-000004',
    email: 'hello@kimikawai.com',

    roles: ['petOwner', 'storeOwner'],
    activeRole: 'storeOwner',

    vetApplication: getDefaultVetApplication(),

    ownedStores: ['store_kimi_kawai'],
    showPets: false,

    followers: 412,
    following: 145,
    postsCount: 67,
    reviewCount: 62,
    rating: 4.4
  }
};

/* 4. STORES */
const STORES = [
  {
    id: 'store_grooming_house',
    name: 'Grooming House',
    owner: 'Ahmed',
    ownerId: 'user_ahmed',
    type: 'local',
    category: 'Grooming',
    isClinic: false,
    showWorkers: false,
    rating: 4.8,
    reviewCount: 124,
    location: "Cox's Bazar",
    phone: '+880-1712-345678',
    hours: '9 AM - 9 PM',
    description: "Grooming House is a trusted pet care center in Cox's Bazar, specializing in grooming, hygiene and overall pet well-being. We treat your pets like family!",
    cover: 'assets/stores/grooming-house.png',
    logo: 'assets/icons/pfp-pretty-pet.png',
    gallery: [],
    products: ['acc1', 'acc2', 'acc5', 'acc7', 'acc8'],
    workers: [],
    reviews: [
      {
        id: 'rev_001',
        userName: 'Sadia Rahman',
        rating: 5,
        text: 'Always a great experience! My cat loves the grooming service. Highly recommend!',
        date: '2026-08-30'
      }
    ],
    isFavorite: false
  },
  {
    id: 'store_pet_clinic',
    name: 'Pet Clinic',
    owner: 'Dr. Ahmed',
    ownerId: 'user_clinic',
    type: 'local',
    category: 'Vet Care',
    isClinic: true,
    showWorkers: true,
    rating: 4.6,
    reviewCount: 98,
    location: "Cox's Bazar",
    phone: '+880-1712-345678',
    hours: '24/7',
    description: "Pet Clinic provides 24/7 veterinary care for your furry friends. Our experienced vets are always ready to help.",
    cover: 'assets/stores/vet-clinic.png',
    logo: 'assets/icons/pfp-ayesha.png',
    gallery: [],
    products: ['acc9'],
    workers: [
      {
        id: 'vet_ayesha',
        name: 'Dr. Ayesha Rahman',
        specialty: 'General Veterinarian',
        experience: 8,
        rating: 4.9,
        avatar: 'assets/icons/pfp-ayesha.png'
      },
      {
        id: 'vet_karim',
        name: 'Dr. Karim Ahmed',
        specialty: 'Veterinary Surgeon',
        experience: 12,
        rating: 4.7,
        avatar: 'assets/icons/pfp-karim.png'
      }
    ],
    reviews: [],
    isFavorite: false
  },
  {
    id: 'store_arfas',
    name: "Arfa's Pet & Vet",
    owner: 'Arfa',
    ownerId: 'user_arfa',
    type: 'online',
    category: 'Food',
    isClinic: false,
    showWorkers: false,
    rating: 4.5,
    reviewCount: 76,
    location: "Cox's Bazar",
    phone: '+880-1712-000003',
    hours: '10 AM - 10 PM',
    description: "Arfa's Pet & Vet — your one-stop shop for premium pet food and supplies.",
    cover: "assets/stores/arfa's-pet-vet.png",
    logo: 'assets/icons/pfp-pretty-pet.png',
    gallery: [],
    products: ['food1', 'food2', 'food3', 'food4'],
    workers: [],
    reviews: [],
    isFavorite: false
  },
  {
    id: 'store_kimi_kawai',
    name: 'Kimi Kawai',
    owner: 'Kimi',
    ownerId: 'user_kimi',
    type: 'local',
    category: 'All-in-one',
    isClinic: false,
    showWorkers: false,
    rating: 4.4,
    reviewCount: 62,
    location: "Cox's Bazar",
    phone: '+880-1712-000004',
    hours: '9 AM - 9 PM',
    description: 'Kimi Kawai — your all-in-one pet store with everything your pet needs.',
    cover: 'assets/stores/kimi-kawai.png',
    logo: 'assets/icons/pfp-milos-mum.png',
    gallery: [],
    products: ['food5', 'food6', 'food7', 'food8', 'food9', 'food10', 'acc3', 'acc4', 'acc6', 'acc10'],
    workers: [],
    reviews: [],
    isFavorite: false
  },
  {
    id: 'store_pawsome',
    name: 'Pawsome Fitness',
    owner: 'Pawsome Team',
    ownerId: 'user_pawsome',
    type: 'local',
    category: 'Training',
    isClinic: false,
    showWorkers: false,
    rating: 4.7,
    reviewCount: 39,
    location: "Cox's Bazar",
    phone: '+880-1712-000005',
    hours: '6 AM - 8 PM',
    description: 'Pawsome Fitness — professional pet training sessions and fitness programs.',
    cover: 'assets/stores/pawsome-fitness.png',
    logo: 'assets/icons/pfp-karim.png',
    gallery: [],
    products: [],
    workers: [],
    reviews: [],
    isFavorite: false
  },
  {
    id: 'store_pretty_pet',
    name: 'Pretty Pet',
    owner: 'Pretty Pet',
    ownerId: 'user_pretty_pet',
    type: 'local',
    category: 'Accessories',
    isClinic: false,
    showWorkers: false,
    rating: 4.6,
    reviewCount: 54,
    location: "Cox's Bazar",
    phone: '+880-1712-000006',
    hours: '10 AM - 9 PM',
    description: 'Pretty Pet — beautiful accessories and products for your beloved pets.',
    cover: 'assets/stores/grooming-house.png',
    logo: 'assets/icons/pfp-pretty-pet.png',
    gallery: [],
    products: [],
    workers: [],
    reviews: [],
    isFavorite: false
  }
];

/* 5. PRODUCTS */
const PRODUCTS = {
  food: [
    { id: 'food1', name: 'Royal Canin Adult Cat Food', category: 'food', storeId: 'store_arfas', price: 24.99, oldPrice: 35.99, discount: 30, rating: 4.8, reviews: 89, stock: 'in-stock', img: 'assets/products/pedigree.jpg', popularity: 67 },
    { id: 'food2', name: 'Skyler Treats Herring', category: 'food', storeId: 'store_arfas', price: 24.99, oldPrice: 35.99, discount: 30, rating: 4.8, reviews: 89, stock: 'in-stock', img: 'assets/products/herring-fish.jpg', popularity: 67 },
    { id: 'food3', name: 'Skyler Treats Rabbit', category: 'food', storeId: 'store_arfas', price: 19.99, oldPrice: 28.99, discount: 31, rating: 4.5, reviews: 56, stock: 'in-stock', img: 'assets/products/rabbit-cubes.jpg', popularity: 45 },
    { id: 'food4', name: 'Quail Egg Yolk', category: 'food', storeId: 'store_arfas', price: 15.99, oldPrice: 22.99, discount: 30, rating: 4.9, reviews: 42, stock: 'limited', img: 'assets/products/quail-egg-yolk.jpg', popularity: 38 },
    { id: 'food5', name: 'Viva For Cats', category: 'food', storeId: 'store_kimi_kawai', price: 34.99, oldPrice: 49.99, discount: 30, rating: 4.6, reviews: 78, stock: 'in-stock', img: 'assets/products/vivaforcats.jpg', popularity: 56 },
    { id: 'food6', name: 'Me-O', category: 'food', storeId: 'store_kimi_kawai', price: 12.99, oldPrice: 18.99, discount: 32, rating: 4.4, reviews: 234, stock: 'in-stock', img: 'assets/products/me-o.jpg', popularity: 189 },
    { id: 'food7', name: 'Whiskas', category: 'food', storeId: 'store_kimi_kawai', price: 14.99, oldPrice: 21.99, discount: 32, rating: 4.7, reviews: 312, stock: 'in-stock', img: 'assets/products/whiskas.jpg', popularity: 278 },
    { id: 'food8', name: 'Jinx Biscuit', category: 'food', storeId: 'store_kimi_kawai', price: 9.99, oldPrice: 14.99, discount: 33, rating: 4.3, reviews: 67, stock: 'in-stock', img: 'assets/products/jinx-biscuit.jpg', popularity: 54 },
    { id: 'food9', name: 'Selective Jr', category: 'food', storeId: 'store_kimi_kawai', price: 18.99, oldPrice: 27.99, discount: 32, rating: 4.8, reviews: 45, stock: 'limited', img: 'assets/products/selectivejr.jpg', popularity: 34 },
    { id: 'food10', name: 'Pedigree', category: 'food', storeId: 'store_kimi_kawai', price: 22.99, oldPrice: 32.99, discount: 30, rating: 4.9, reviews: 456, stock: 'in-stock', img: 'assets/products/pedigree.jpg', popularity: 389 }
  ],
  accessories: [
    { id: 'acc1', name: 'Pet Spa Set', category: 'accessories', storeId: 'store_grooming_house', price: 45.99, oldPrice: 65.99, discount: 30, rating: 4.8, reviews: 67, stock: 'in-stock', img: 'assets/products/accessories1.jpg', popularity: 78 },
    { id: 'acc2', name: 'Pet Nail Cutter', category: 'accessories', storeId: 'store_grooming_house', price: 12.99, oldPrice: 19.99, discount: 35, rating: 4.5, reviews: 123, stock: 'in-stock', img: 'assets/products/accessories2.jpg', popularity: 145 },
    { id: 'acc3', name: 'Pet Carrier', category: 'accessories', storeId: 'store_kimi_kawai', price: 55.99, oldPrice: 79.99, discount: 30, rating: 4.7, reviews: 89, stock: 'limited', img: 'assets/products/accessories3.jpg', popularity: 112 },
    { id: 'acc4', name: 'Dog & Cat Bowls', category: 'accessories', storeId: 'store_kimi_kawai', price: 18.99, oldPrice: 27.99, discount: 32, rating: 4.9, reviews: 234, stock: 'in-stock', img: 'assets/products/accessories4.jpg', popularity: 267 },
    { id: 'acc5', name: 'Pet Hair Comb', category: 'accessories', storeId: 'store_grooming_house', price: 14.99, oldPrice: 22.99, discount: 35, rating: 4.6, reviews: 156, stock: 'in-stock', img: 'assets/products/accessories5.jpg', popularity: 134 },
    { id: 'acc6', name: 'Dog Toothbrush', category: 'accessories', storeId: 'store_kimi_kawai', price: 8.99, oldPrice: 13.99, discount: 36, rating: 4.4, reviews: 78, stock: 'in-stock', img: 'assets/products/accessories6.jpg', popularity: 89 },
    { id: 'acc7', name: 'Pet Grooming Kit', category: 'accessories', storeId: 'store_grooming_house', price: 39.99, oldPrice: 59.99, discount: 33, rating: 4.8, reviews: 145, stock: 'in-stock', img: 'assets/products/accessories7.jpg', popularity: 167 },
    { id: 'acc8', name: 'Paw Balm', category: 'accessories', storeId: 'store_grooming_house', price: 11.99, oldPrice: 17.99, discount: 33, rating: 4.7, reviews: 98, stock: 'in-stock', img: 'assets/products/accessories8.jpg', popularity: 76 },
    { id: 'acc9', name: 'Pet Ear-drops', category: 'accessories', storeId: 'store_pet_clinic', price: 9.99, oldPrice: 14.99, discount: 33, rating: 4.5, reviews: 56, stock: 'limited', img: 'assets/products/accessories9.jpg', popularity: 43 },
    { id: 'acc10', name: 'Licking Mat', category: 'accessories', storeId: 'store_kimi_kawai', price: 13.99, oldPrice: 20.99, discount: 33, rating: 4.8, reviews: 112, stock: 'in-stock', img: 'assets/products/accessories10.jpg', popularity: 98 }
  ]
};

/* 6. MEMORIES — from localStorage */
function getDemoMemories() {
  return [
    {
      id: 'mem_001',
      authorId: 'user_ayesha',
      authorName: 'Dr. Ayesha Rahman',
      authorInitial: 'A',
      authorAvatar: 'assets/icons/pfp-ayesha.png',
      authorRole: 'vet',
      type: 'tip',
      title: '5 Signs Your Cat is Dehydrated',
      content: 'Watch for: dry gums, skin tenting, sunken eyes, lethargy, and loss of appetite. If you notice any of these signs, consult a vet immediately.',
      image: null,
      products: null,
      date: new Date(Date.now() - 2 * 3600000).toISOString(),
      likes: 47,
      likedBy: [],
      comments: []
    },
    {
      id: 'mem_002',
      authorId: 'user_milos_mum',
      authorName: "Milo's Mum",
      authorInitial: 'M',
      authorAvatar: 'assets/icons/pfp-milos-mum.png',
      authorRole: 'petOwner',
      type: 'story',
      title: 'Milo is home!',
      content: 'Adopted this beautiful boy today! He is so playful and loving. Any tips for a new cat owner? So excited to start this journey with him!',
      image: 'assets/pets/milo.png',
      products: null,
      date: new Date(Date.now() - 5 * 3600000).toISOString(),
      likes: 128,
      likedBy: [],
      comments: []
    },
    {
      id: 'mem_003',
      authorId: 'user_pretty_pet',
      authorName: 'Pretty Pet',
      authorInitial: 'P',
      authorAvatar: 'assets/icons/pfp-pretty-pet.png',
      authorRole: 'storeOwner',
      type: 'awareness',
      title: 'New Arrivals at Pretty Pet!',
      content: 'New shipment just arrived! Premium cat food from Royal Canin, Whiskas, Pedigree and Me-O — all your favourites under one roof. Visit us today!',
      image: null,
      products: [
        'assets/products/pedigree.jpg',
        'assets/products/whiskas.jpg',
        'assets/products/me-o.jpg',
        'assets/products/pedigree.jpg'
      ],
      date: new Date(Date.now() - 86400000).toISOString(),
      likes: 96,
      likedBy: [],
      comments: []
    },
    {
      id: 'mem_004',
      authorId: 'user_tanzim',
      authorName: 'Tanzim Hasan',
      authorInitial: 'T',
      authorAvatar: null,
      authorRole: 'petOwner',
      type: 'question',
      title: "Lost my cat's favourite toy",
      content: "My cat's favourite toy was this little knitted mouse (in the photo). It's recently gone missing and I can't find a similar one online. Can anyone suggest where I can find one? Any help would be appreciated!",
      image: 'assets/mems/mem-kitten-home.png',
      products: null,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      likes: 45,
      likedBy: [],
      comments: [
        {
          id: 'c_001',
          authorId: 'user_kimi',
          authorName: 'Kimi Kawai',
          authorInitial: 'K',
          authorRole: 'storeOwner',
          text: 'Check our store! We have similar knitted toys in stock',
          date: new Date(Date.now() - 1.8 * 86400000).toISOString(),
          likes: 3,
          likedBy: [],
          replies: [
            {
              id: 'r_001',
              authorId: 'user_tanzim',
              authorName: 'Tanzim Hasan',
              authorInitial: 'T',
              authorRole: 'petOwner',
              text: 'Thanks! Just ordered',
              date: new Date(Date.now() - 1.6 * 86400000).toISOString()
            }
          ]
        }
      ]
    },
    {
      id: 'mem_005',
      authorId: 'user_karim',
      authorName: 'Dr. Karim Ahmed',
      authorInitial: 'K',
      authorAvatar: 'assets/icons/pfp-karim.png',
      authorRole: 'vet',
      type: 'awareness',
      title: 'Chocolate Toxicity Alert',
      content: "Chocolate is extremely toxic for both cats and dogs. The darker and more bitter the chocolate, the greater the danger. If you suspect your pet has eaten chocolate, contact your vet immediately — do not wait for symptoms to appear.",
      image: 'assets/mems/mem-chocolate.png',
      products: null,
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      likes: 234,
      likedBy: [],
      comments: []
    }
  ];
}

/* Load memories from localStorage or use demo */
let MEMORIES_DATA = [];

try {
  const storedMemories = localStorage.getItem('pc_memories');
  if (storedMemories) {
    MEMORIES_DATA = JSON.parse(storedMemories);
  }
} catch (err) {
  MEMORIES_DATA = [];
}

if (!MEMORIES_DATA || !MEMORIES_DATA.length) {
  MEMORIES_DATA = getDemoMemories();
  try {
    localStorage.setItem('pc_memories', JSON.stringify(MEMORIES_DATA));
  } catch (err) {
    // ignore storage error
  }
}

/* 7. FOSTER PETS */
const FOSTER_PETS = [
  { id: 'foster_001', name: 'Milo', age: '2 months', breed: 'Mixed', status: 'Foster Needed', urgent: true, image: 'assets/pets/milo.png', description: 'Milo was found alone on the street. He needs a loving foster home.' },
  { id: 'foster_002', name: 'Bella', age: '1 year', breed: 'Rescue', status: 'Ready for foster', urgent: false, image: 'assets/pets/bella.png', description: 'Bella is a gentle rescue cat ready for a foster family.' },
  { id: 'foster_003', name: 'Rocky', age: '3 months', breed: 'Unvaccinated', status: 'Medical care', urgent: true, image: 'assets/pets/rocky.png', description: 'Rocky needs urgent medical care and a foster home.' }
];

/* 8. NEARBY VETS */
const NEARBY_VETS = [
  {
    id: 'vet_clinic_1',
    name: 'Dhaka Pet Emergency',
    type: '24/7 Clinic',
    phone: '+880-1700-000001',
    lat: 21.4280,
    lng: 92.0080,
    storeId: 'store_pet_clinic',
    alwaysOpen: true
  },
  {
    id: 'vet_clinic_2',
    name: 'Animal Rescue BD',
    type: 'Rescue Center',
    phone: '+880-1700-000002',
    lat: 21.4400,
    lng: 92.0200,
    storeId: null,
    alwaysOpen: false,
    opensAt: 8,
    closesAt: 22
  },
  {
    id: 'vet_clinic_3',
    name: 'City Vet Hospital',
    type: 'Clinic',
    phone: '+880-1700-000003',
    lat: 21.4150,
    lng: 91.9950,
    storeId: 'store_pet_clinic',
    alwaysOpen: false,
    opensAt: 9,
    closesAt: 21
  },
  {
    id: 'vet_clinic_4',
    name: 'Coastal Pet Care',
    type: '24/7 Clinic',
    phone: '+880-1700-000004',
    lat: 21.4320,
    lng: 92.0120,
    storeId: null,
    alwaysOpen: true
  },
  {
    id: 'vet_clinic_5',
    name: 'Beach Side Vet',
    type: 'Clinic',
    phone: '+880-1700-000005',
    lat: 21.4200,
    lng: 92.0000,
    storeId: null,
    alwaysOpen: false,
    opensAt: 10,
    closesAt: 20
  }
];

/* 9. FIRST-AID GUIDES */
const FIRST_AID_GUIDES = {
  choking: {
    title: 'Choking', subtitle: 'Object stuck in airway', icon: 'fa-hand-dots',
    steps: ['Stay calm. Do not panic the pet.', 'Open mouth — remove visible object ONLY with fingers.', 'Small pet: hold upside down, give 5 firm back blows.', 'Large pet: Heimlich — 5 abdominal thrusts.', 'If unconscious — begin CPR and call vet NOW.'],
    dont: 'Never stick fingers blindly down throat. Never give water.'
  },
  poison: {
    title: 'Poisoning', subtitle: 'Toxic substance ingested', icon: 'fa-skull-crossbones',
    steps: ['Remove pet from source immediately.', 'Note WHAT was eaten and HOW MUCH.', 'Do NOT induce vomiting unless vet instructs.', 'Collect sample/vomit in a bag for the vet.', 'Call poison hotline or vet — go immediately.'],
    dont: 'Never give milk, oil, or home remedies. Never force vomit.'
  },
  bleeding: {
    title: 'Bleeding', subtitle: 'Wound or cut', icon: 'fa-droplet',
    steps: ['Apply firm pressure with clean cloth for 3 min.', 'Do NOT remove cloth if soaked — add another on top.', 'Elevate the wound above heart if possible.', 'Wrap with bandage — snug but not tight.', "Rush to vet if bleeding doesn't stop in 5 min."],
    dont: 'Never use tourniquet unless trained. Never apply dirt or powder.'
  },
  cpr: {
    title: 'CPR', subtitle: 'Not breathing / no pulse', icon: 'fa-heart-pulse',
    steps: ['Lay pet on right side on firm surface.', 'Close mouth, seal with your hand.', 'Breathe into nose — 2 breaths, watch chest rise.', 'Compress chest 100-120 times/min (30 compressions).', 'Repeat: 30 compressions + 2 breaths until vet arrives.'],
    dont: 'Do NOT press too hard on small pets. Do NOT give up early.'
  },
  heatstroke: {
    title: 'Heat Stroke', subtitle: 'Overheating / panting heavily', icon: 'fa-temperature-high',
    steps: ['Move pet to cool shaded area immediately.', 'Pour cool (NOT cold) water over body.', 'Place wet towel under armpits and groin.', 'Offer small sips of cool water if conscious.', 'Rush to vet — heat stroke can be fatal in 15 min.'],
    dont: 'Never use ice-cold water or ice packs directly. Never leave unattended.'
  },
  fracture: {
    title: 'Fracture', subtitle: 'Broken bone / unable to walk', icon: 'fa-bone',
    steps: ['Do NOT try to reset the bone.', 'Muzzle the pet (pain causes biting).', 'Immobilize with a makeshift splint.', 'Support body with a towel or stretcher.', 'Transport slowly — avoid bumps.'],
    dont: 'Never let pet walk. Never apply pressure on the broken area.'
  }
};

/* 10. TIPS LIBRARY */
const TIPS_LIBRARY = {
  nutrition: ['Feed a balanced diet appropriate for your pet\'s age and size.', 'Avoid toxic foods: chocolate, onions, garlic, grapes, xylitol.', 'Fresh water should always be available.', 'Measure portions to prevent obesity.', 'Introduce new foods gradually over 7 days.'],
  hygiene: ['Bathe your pet every 4-6 weeks.', 'Clean food and water bowls daily.', 'Wash bedding weekly to prevent pests.', 'Brush teeth 2-3 times a week.', 'Keep litter boxes and crates clean.'],
  exercise: ['Dogs need 30-120 minutes of activity daily.', 'Cats benefit from 15-20 minutes of play, twice a day.', 'Use puzzle toys for mental stimulation.', 'Adjust exercise for age and health.', 'Avoid walking on hot pavement.'],
  grooming: ['Brush coat 2-3 times a week to reduce shedding.', 'Trim nails every 3-4 weeks.', 'Check ears weekly for dirt or infection.', 'Clean eyes gently with a damp cloth.', 'Start grooming routines early for comfort.'],
  safety: ['Pet-proof your home.', 'Use a secure collar with ID tag.', 'Never leave pets in a hot car.', 'Keep toxic plants out of reach.', 'Microchip your pet for safety.'],
  behavior: ['Use positive reinforcement for training.', 'Socialize puppies and kittens early.', 'Provide a safe, quiet space.', 'Never punish physically.', 'Consult a behaviorist for persistent issues.']
};

/* 11. TIPS ARTICLES */
const TIPS_ARTICLES = [
  {
    id: 'tip_001',
    title: 'Top 5 Foods for a Healthy Cat Diet',
    category: 'nutrition',
    readTime: '2 min read',
    image: 'assets/tips/tip-cat-food.jpg',
    content: 'A balanced diet is the foundation of your cat\'s health.',
    body: [
      'High-quality protein is essential for cats as they are obligate carnivores.',
      'Wet food provides hydration and is closer to a natural diet.',
      'Avoid grains and fillers — cats do not need them.',
      'Introduce new foods gradually over 7 days.',
      'Always provide fresh water alongside food.'
    ]
  },
  {
    id: 'tip_002',
    title: 'How to Keep Your Dog Cool in Summer',
    category: 'care',
    readTime: '3 min read',
    image: 'assets/tips/tip-dog-summer.jpg',
    content: 'Summer heat can be dangerous for dogs.',
    body: [
      'Walk your dog early morning or late evening.',
      'Provide plenty of fresh water throughout the day.',
      'Never leave your dog in a parked car.',
      'Use cooling mats or wet towels for relief.',
      'Watch for signs of heat stroke.'
    ]
  },
  {
    id: 'tip_003',
    title: 'Best Litter Box Habits for a Happier Cat',
    category: 'hygiene',
    readTime: '2 min read',
    image: 'assets/tips/tip-litter-box.jpg',
    content: 'A clean litter box keeps your cat happy and healthy.',
    body: [
      'Scoop the litter box daily.',
      'Place the box in a quiet, accessible location.',
      'One box per cat plus one extra is ideal.',
      'Avoid scented litters.',
      'Clean the box with mild soap.'
    ]
  },
  {
    id: 'tip_004',
    title: 'Simple Training Tips for Better Behavior',
    category: 'training',
    readTime: '3 min read',
    image: 'assets/tips/tip-dog-training.jpg',
    content: 'Training your pet can be fun and rewarding.',
    body: [
      'Use positive reinforcement.',
      'Keep sessions short and consistent.',
      'Start with basic commands: sit, stay, come.',
      'Be patient and never punish physically.',
      'Practice in different environments.'
    ]
  },
  {
    id: 'tip_005',
    title: '5 Signs Your Cat is Stressed',
    category: 'behavior',
    readTime: '2 min read',
    image: 'assets/tips/tip-cat-stress.jpg',
    content: 'Cats show stress in subtle ways.',
    body: [
      'Hiding more than usual.',
      'Over-grooming or hair loss.',
      'Changes in appetite or litter box habits.',
      'Excessive vocalization.',
      'Aggression or irritability.'
    ]
  },
  {
    id: 'tip_006',
    title: 'Keeping Your Pet Hydrated',
    category: 'nutrition',
    readTime: '2 min read',
    image: 'assets/tips/tip-hydration.jpg',
    content: 'Proper hydration is essential for pet health.',
    body: [
      'Fresh water should always be available.',
      'Use pet fountains to encourage drinking.',
      'Add water to dry food.',
      'Offer wet food regularly.',
      'Watch for dehydration signs: dry gums, lethargy.'
    ]
  },
  {
    id: 'tip_007',
    title: 'Seasonal Coat Care for Pets',
    category: 'grooming',
    readTime: '3 min read',
    image: 'assets/tips/tip-seasonal-coat.jpg',
    content: 'Adjust grooming routine with seasons.',
    body: [
      'Spring: brush more to remove winter coat.',
      'Summer: watch for heat and skin issues.',
      'Fall: prepare coat for cooler weather.',
      'Winter: keep paws protected from salt.',
      'Regular grooming prevents matting.'
    ]
  },
  {
    id: 'tip_008',
    title: 'Home Safety Checklist for Pets',
    category: 'safety',
    readTime: '3 min read',
    image: 'assets/tips/tip-home-safety.jpg',
    content: 'Keep your home safe for your pets.',
    body: [
      'Secure trash cans and cabinets.',
      'Hide electrical cords.',
      'Remove toxic plants.',
      'Store medication out of reach.',
      'Check for small objects that could be swallowed.'
    ]
  }
];

/* 12. DAILY TIPS */
const DAILY_TIPS = [
  "Keep your pet's water bowl clean and filled with fresh water daily.",
  "Brush your pet's coat 2-3 times a week to reduce shedding.",
  'Schedule regular vet checkups — at least once a year.',
  "Never feed your pet chocolate, onions, or grapes — they're toxic.",
  'Provide interactive toys to keep your pet mentally stimulated.',
  "Trim your pet's nails every 3-4 weeks to prevent discomfort.",
  'Give your pet a comfortable, quiet place to rest.',
  'Regular exercise prevents obesity and improves mood.'
];

/* 13. HEALTH GUIDANCE */
const HEALTH_GUIDANCE = {
  'not-eating': {
    title: 'Not Eating',
    severity: 'moderate',
    advice: ['Check if food is fresh and at room temperature', 'Try a different flavor or brand temporarily', 'Remove treats for 12 hours to build appetite', 'Ensure fresh water is always available', 'Rule out stress from recent changes'],
    vetIf: 'If your pet has not eaten for more than 24 hours, contact a vet immediately.'
  },
  'vomiting': {
    title: 'Vomiting',
    severity: 'high',
    advice: ['Withhold food for 6-12 hours to rest the stomach', 'Provide small amounts of water frequently', 'Watch for blood or repeated episodes', 'Keep a log of frequency and contents', 'Avoid giving human medications'],
    vetIf: 'If vomiting occurs more than 3 times in 24 hours or contains blood, see a vet.'
  },
  'itching': {
    title: 'Itching / Scratching',
    severity: 'low',
    advice: ['Check for fleas, ticks, or visible rashes', 'Bathe with mild, pet-safe shampoo', 'Apply vet-approved soothing balm', 'Clean bedding and vacuum the environment', 'Consider possible food allergies'],
    vetIf: 'If skin is broken, hair loss occurs, or itching persists over a week, consult a vet.'
  },
  'coughing': {
    title: 'Coughing',
    severity: 'moderate',
    advice: ['Keep the environment dust-free', 'Avoid smoke and strong odors', 'Ensure the pet rests in a humid area', 'Check for foreign objects in the throat', 'Monitor breathing rate and effort'],
    vetIf: 'If coughing persists more than 48 hours or is accompanied by difficulty breathing, see a vet.'
  },
  'diarrhea': {
    title: 'Diarrhea',
    severity: 'high',
    advice: ['Ensure constant access to fresh water', 'Offer bland food (boiled chicken, rice)', 'Avoid dairy and fatty foods', 'Monitor for blood or mucus', 'Keep the pet warm and rested'],
    vetIf: 'If diarrhea lasts more than 24 hours, contains blood, or pet becomes lethargic, contact a vet.'
  },
  'lethargy': {
    title: 'Lethargy',
    severity: 'moderate',
    advice: ['Ensure the pet has a quiet resting place', 'Check for fever or unusual behavior', 'Offer water regularly', 'Monitor appetite and bathroom habits', 'Avoid strenuous activity'],
    vetIf: 'If lethargy lasts more than 24 hours or is combined with other symptoms, see a vet.'
  }
};

/* 14. HELPERS */
function getAllProducts() {
  return [...PRODUCTS.food, ...PRODUCTS.accessories];
}

function getProductById(id) {
  return getAllProducts().find(p => p.id === id);
}

function getStoreById(id) {
  return STORES.find(s => s.id === id);
}

function getProductsByStore(storeId) {
  return getAllProducts().filter(p => p.storeId === storeId);
}

function getProductsByCategory(category) {
  if (category === 'all') return getAllProducts();
  return getAllProducts().filter(p => p.category === category);
}

function getUserById(id) {
  return USERS[id] || null;
}

/* 15. SEED DEFAULT PETS */
function seedDefaultPets() {
  const existing = Storage.get('pc_pets', []);
  if (existing && existing.length) return;

  const lunaId = 'pet_luna_' + Date.now();
  const luna = {
    id: lunaId,
    name: 'Luna',
    species: 'cat',
    breed: 'British Shorthair',
    age: 2,
    weight: 4.2,
    gender: 'female',
    avatar: 'assets/avatars/av-cat1.png'
  };

  Storage.set('pc_pets', [luna]);
  Storage.set('pc_activePetId', lunaId);
}

setTimeout(() => {
  if (typeof Storage !== 'undefined') {
    seedDefaultPets();
  }
}, 50);

/* 16. EXPORT */
window.CATEGORIES = CATEGORIES;
window.PET_AVATARS = PET_AVATARS;
window.USERS = USERS;
window.STORES = STORES;
window.PRODUCTS = PRODUCTS;
window.MEMORIES_DATA = MEMORIES_DATA;
window.FOSTER_PETS = FOSTER_PETS;
window.NEARBY_VETS = NEARBY_VETS;
window.FIRST_AID_GUIDES = FIRST_AID_GUIDES;
window.TIPS_LIBRARY = TIPS_LIBRARY;
window.TIPS_ARTICLES = TIPS_ARTICLES;
window.DAILY_TIPS = DAILY_TIPS;
window.HEALTH_GUIDANCE = HEALTH_GUIDANCE;
window.getAllProducts = getAllProducts;
window.getProductById = getProductById;
window.getStoreById = getStoreById;
window.getProductsByStore = getProductsByStore;
window.getProductsByCategory = getProductsByCategory;
window.getAvatarsBySpecies = getAvatarsBySpecies;
window.getUserById = getUserById;
window.getCoverUrl = getCoverUrl;
window.getCoverGradient = getCoverGradient;
window.getDefaultVetApplication = getDefaultVetApplication;

console.log('PetCare Data loaded');