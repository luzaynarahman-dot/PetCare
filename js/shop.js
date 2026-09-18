/* ============================================================ */
/* PETCARE v3.0 — SHOP PAGE                                      */
/* Products, Stores, Detail, Booking, Fav, History Back          */
/* ============================================================ */

let shopState = {
  activeTab: 'products',
  activeCategory: 'all',
  activeStoreFilter: 'all',
  searchQuery: '',
  sortBy: 'default',
  currentStoreId: null,
  showAllProducts: false
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderShop() {
  const page = document.getElementById('page-shop');
  if (!page) return;

  page.innerHTML = `
    <div class="page-container">

      <!-- HERO -->
      <section class="hero-card shop-hero">
        <div class="hero-card-body">
          <div class="hero-card-text">
            <h2 class="hero-greeting">Shop for your pet</h2>
            <p class="hero-sub">Everything your furry friend needs</p>
          </div>
          <div class="hero-illustration">
            <img src="assets/stores/hero-shop.png" alt="Shop" onerror="this.style.opacity='0'">
          </div>
        </div>
      </section>

      <!-- TAB SWITCHER -->
      <div class="shop-tabs">
        <button class="shop-tab ${shopState.activeTab === 'products' ? 'active' : ''}" data-shop-tab="products">
          <i class="fas fa-shopping-bag"></i> Products
        </button>
        <button class="shop-tab ${shopState.activeTab === 'stores' ? 'active' : ''}" data-shop-tab="stores">
          <i class="fas fa-store"></i> Stores
        </button>
      </div>

      <div id="shopTabContent">
        ${shopState.activeTab === 'products' ? renderProductsTab() : renderStoresTab()}
      </div>

    </div>
  `;

  attachShopHandlers();
}

/* ============================================================ */
/* 2. PRODUCTS TAB                                               */
/* ============================================================ */
function renderProductsTab() {
  const isAllCategory = shopState.activeCategory === 'all';

  return `
    <!-- Featured Stores -->
    <section class="shop-section">
      <div class="shop-section-header">
        <h3>Featured Stores</h3>
        <button class="card-link" data-shop-tab="stores">See all <i class="fas fa-arrow-right"></i></button>
      </div>
      <div class="featured-stores-scroll">
        ${STORES.slice(0, 3).map(store => `
          <div class="featured-store-card" data-store-id="${store.id}">
            <div class="featured-store-img">
              <img src="${store.cover}" alt="${store.name}" onerror="this.style.opacity='0'">
            </div>
            <div class="featured-store-info">
              <p class="featured-store-name">${store.name}</p>
              <div class="featured-store-rating">
                <i class="fas fa-star"></i> ${store.rating} (${store.reviewCount})
              </div>
              <p class="featured-store-loc">${store.location}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Shop by Category -->
    <section class="shop-section">
      <div class="shop-section-header">
        <h3>Shop by Category</h3>
      </div>
      <div class="category-grid">
        <!-- All (All Products) -->
        <button class="category-circle ${isAllCategory ? 'active' : ''}" data-category="all">
          <div class="category-circle-icon" style="background:#E0D5C0; color:#8B6F47;">
            <i class="fas fa-border-all"></i>
          </div>
          <span class="category-circle-label">All</span>
        </button>

        <!-- 7 Categories (Others removed) -->
        ${CATEGORIES.filter(c => c.id !== 'others').map(cat => `
          <button class="category-circle ${shopState.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
            <div class="category-circle-icon" style="background:${cat.bg}; color:${cat.color};">
              <i class="fas ${cat.icon}"></i>
            </div>
            <span class="category-circle-label">${cat.label}</span>
          </button>
        `).join('')}
      </div>
    </section>

    <!-- Top Picks -->
    <section class="shop-section">
      <div class="shop-section-header">
        <h3>Top Picks</h3>
      </div>
      <div class="top-picks-scroll">
        ${getAllProducts()
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 6)
          .map(p => renderProductCard(p))
          .join('')}
      </div>
    </section>

    <!-- All Products -->
    <section class="shop-section">
      <div class="shop-section-header">
        <h3>${isAllCategory ? 'All Products' : getCategoryLabel(shopState.activeCategory)}</h3>
        ${isAllCategory ? `
          <button class="see-all-btn" id="seeAllProductsBtn">
            ${shopState.showAllProducts ? 'Show Less' : 'See All'}
          </button>
        ` : `
          <button class="clear-category-btn" id="clearCategoryBtn">
            <i class="fas fa-times"></i> Clear
          </button>
        `}
      </div>

      <div class="shop-search-wrap">
        <i class="fas fa-search"></i>
        <input type="text" id="shopSearch" placeholder="Search products..." value="${shopState.searchQuery}">
      </div>

      <div class="shop-filters-row">
        <select id="shopSort">
          <option value="default" ${shopState.sortBy === 'default' ? 'selected' : ''}>Sort: Default</option>
          <option value="price-low" ${shopState.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
          <option value="price-high" ${shopState.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
          <option value="rating" ${shopState.sortBy === 'rating' ? 'selected' : ''}>Rating: Highest</option>
        </select>
      </div>

      <div class="products-grid" id="productsGrid">
        ${renderFilteredProducts()}
      </div>
    </section>
  `;
}

function getCategoryLabel(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.label : 'Products';
}

function renderFilteredProducts() {
  let products = getAllProducts();

  if (shopState.activeCategory !== 'all') {
    products = products.filter(p => p.category === shopState.activeCategory);
  }

  if (shopState.searchQuery) {
    const q = shopState.searchQuery.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q));
  }

  switch (shopState.sortBy) {
    case 'price-low':  products.sort((a, b) => a.price - b.price); break;
    case 'price-high': products.sort((a, b) => b.price - a.price); break;
    case 'rating':     products.sort((a, b) => b.rating - a.rating); break;
  }

  if (!shopState.showAllProducts && shopState.activeCategory === 'all' && !shopState.searchQuery) {
    products = products.slice(0, 6);
  }

  if (!products.length) {
    return `<p class="empty-state">No products found</p>`;
  }

  return products.map(p => renderProductCard(p)).join('');
}

function renderProductCard(product) {
  const store = getStoreById(product.storeId);
  const storeName = store ? store.name : 'PetCare';

  // ⭐ Wishlist state check
  const wishlist = Storage.get('pc_wishlist', []);
  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(product.id);

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card-img">
        <img src="${product.img}" alt="${product.name}" onerror="this.style.opacity='0'">
        ${product.discount ? `<span class="product-discount-badge">-${product.discount}%</span>` : ''}
        <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}"
                data-wishlist-toggle="${product.id}"
                aria-label="Add to wishlist"
                onclick="event.stopPropagation(); toggleProductWishlist('${product.id}');">
          <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
        </button>
      </div>
      <div class="product-card-body">
        <p class="product-store-tag">
          <i class="fas fa-store"></i> ${storeName}
        </p>
        <p class="product-card-name">${product.name}</p>
        <div class="product-card-rating">
          <i class="fas fa-star"></i> ${product.rating} (${product.reviews})
        </div>
        <div class="product-card-price">
          <span class="price-current">$${product.price}</span>
          ${product.oldPrice ? `<span class="price-old">$${product.oldPrice}</span>` : ''}
        </div>
      </div>
      <button class="product-add-btn" data-add-cart="${product.id}" title="Add to cart" aria-label="Add to cart">
        <i class="fas fa-cart-plus"></i>
      </button>
    </div>
  `;
}

/* ============================================================ */
/* 3. STORES TAB                                                 */
/* ============================================================ */
function renderStoresTab() {
  return `
    <section class="shop-section">
      <div class="shop-section-header">
        <h3>All Stores</h3>
        <button class="create-store-btn" onclick="openCreateStoreModal()">
          <i class="fas fa-plus"></i> Add Store
        </button>
      </div>

      <div class="shop-search-wrap">
        <i class="fas fa-search"></i>
        <input type="text" id="storeSearch" placeholder="Search stores..." value="${shopState.searchQuery}">
      </div>

      <div class="store-filter-chips">
        ${[
          { id: 'all', label: 'All' },
          { id: 'local', label: 'Local' },
          { id: 'online', label: 'Online' },
          { id: 'hybrid', label: 'Hybrid' }
        ].map(f => `
          <button class="chip ${shopState.activeStoreFilter === f.id ? 'active' : ''}" data-store-filter="${f.id}">
            ${f.label}
          </button>
        `).join('')}
      </div>

      <div class="stores-list">
        ${renderFilteredStores()}
      </div>
    </section>
  `;
}

function renderFilteredStores() {
  let stores = STORES;

  if (shopState.activeStoreFilter !== 'all') {
    stores = stores.filter(s => s.type === shopState.activeStoreFilter);
  }

  if (shopState.searchQuery) {
    const q = shopState.searchQuery.toLowerCase();
    stores = stores.filter(s => s.name.toLowerCase().includes(q));
  }

  if (!stores.length) {
    return `<p class="empty-state">No stores found</p>`;
  }

  return stores.map(store => {
    const isFav = isStoreFavorite(store.id);
    return `
      <div class="store-card" data-store-id="${store.id}">
        <div class="store-card-cover">
          <img src="${store.cover}" alt="${store.name}" onerror="this.style.opacity='0'">
          <button class="store-fav-icon ${isFav ? 'active' : ''}" data-fav-store="${store.id}" aria-label="Favorite">
            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
          </button>
        </div>
        <div class="store-card-body">
          <div class="store-card-top">
            <div class="store-card-logo">
              <img src="${store.logo}" alt="" onerror="this.style.opacity='0'">
            </div>
            <div class="store-card-info">
              <h3 class="store-card-name">${store.name}</h3>
              <p class="store-card-cat">${store.category}</p>
              <div class="store-card-rating">
                <i class="fas fa-star"></i> ${store.rating} (${store.reviewCount})
              </div>
              <p class="store-card-loc"><i class="fas fa-map-marker-alt"></i> ${store.location}</p>
            </div>
            <button class="store-view-btn" data-store-id="${store.id}">Visit</button>
          </div>
          <div class="store-card-tags">
            <span class="store-tag store-tag-${store.type}">${store.type.charAt(0).toUpperCase() + store.type.slice(1)}</span>
            <span class="store-tag">${store.category}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ============================================================ */
/* 4. FAVORITE STORES                                            */
/* ============================================================ */
function getFavoriteStores() {
  return Storage.get('pc_favoriteStores', []);
}

function isStoreFavorite(storeId) {
  return getFavoriteStores().includes(storeId);
}

function toggleStoreFavorite(storeId) {
  let favs = getFavoriteStores();
  if (favs.includes(storeId)) {
    favs = favs.filter(id => id !== storeId);
    showToast('Removed from favorites');
  } else {
    favs.push(storeId);
    showToast('Added to favorites');
  }
  Storage.set('pc_favoriteStores', favs);
  if (typeof refreshDrawer === 'function') refreshDrawer();
  return favs.includes(storeId);
}

/* ============================================================ */
/* 5. STORE DETAIL PAGE                                          */
/* ============================================================ */
function openStoreDetail(storeId) {
  const store = getStoreById(storeId);
  if (!store) {
    showToast('Store not found');
    return;
  }

  shopState.currentStoreId = storeId;

  // Push history — mobile back button support
  history.pushState({ page: 'store-detail', storeId }, '', '#store-' + storeId);

  const page = document.getElementById('page-shop');
  if (!page) return;

  const isFav = isStoreFavorite(store.id);

  page.innerHTML = `
    <div class="page-container store-detail-page">

      <!-- COVER with BACK + FAV overlay -->
      <div class="store-detail-cover-wrap">
        <div class="store-detail-cover">
          <img src="${store.cover}" alt="${store.name}" onerror="this.style.opacity='0'">
        </div>
        <button class="store-detail-back" onclick="closeStoreDetail()" aria-label="Back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <button class="store-detail-fav ${isFav ? 'active' : ''}" id="storeDetailFav" data-fav-store="${store.id}" aria-label="Favorite">
          <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
        </button>
      </div>

      <!-- Header -->
      <div class="store-detail-header">
        <div class="store-detail-logo">
          <img src="${store.logo}" alt="" onerror="this.style.opacity='0'">
        </div>
        <div class="store-detail-title-wrap">
          <h2 class="store-detail-name">${store.name}</h2>
          <div class="store-detail-rating">
            <i class="fas fa-star"></i> ${store.rating} (${store.reviewCount} reviews)
          </div>
          <p class="store-detail-loc"><i class="fas fa-map-marker-alt"></i> ${store.location}</p>
          <div class="store-detail-tags">
            <span class="store-tag store-tag-${store.type}">${store.type.charAt(0).toUpperCase() + store.type.slice(1)}</span>
            <span class="store-tag">${store.category}</span>
          </div>
        </div>
        <button class="store-call-btn" onclick="handleStoreCall('${store.name}', '${store.phone}')" aria-label="Call">
          <i class="fas fa-phone"></i>
        </button>
      </div>

      <div class="store-detail-section">
        <h3 class="store-detail-section-title">About Store</h3>
        <p class="store-detail-desc">${store.description}</p>
      </div>

      <div class="store-detail-info-grid">
        <div class="store-info-item">
          <i class="fas fa-user"></i>
          <div>
            <p class="store-info-label">Owner</p>
            <p class="store-info-value">${store.owner}</p>
          </div>
        </div>
        <div class="store-info-item">
          <i class="fas fa-phone"></i>
          <div>
            <p class="store-info-label">Phone</p>
            <p class="store-info-value">${store.phone}</p>
          </div>
        </div>
        <div class="store-info-item">
          <i class="fas fa-clock"></i>
          <div>
            <p class="store-info-label">Hours</p>
            <p class="store-info-value">${store.hours}</p>
          </div>
        </div>
        <div class="store-info-item">
          <i class="fas fa-map-marker-alt"></i>
          <div>
            <p class="store-info-label">Location</p>
            <p class="store-info-value">${store.location}</p>
          </div>
        </div>
      </div>

      <div class="store-detail-tabs">
        <button class="store-detail-tab active" data-store-tab="products">Products</button>
        <button class="store-detail-tab" data-store-tab="reviews">Reviews</button>
        <button class="store-detail-tab" data-store-tab="info">Info</button>
        ${store.isClinic ? '<button class="store-detail-tab" data-store-tab="vets">Our Vets</button>' : ''}
      </div>

      <div id="storeDetailTabContent">
        ${renderStoreProducts(store)}
      </div>

      <div class="store-detail-cta">
        ${store.isClinic ? `
          <button class="btn btn-primary w-full" onclick="openBookingModal('${store.id}')">
            <i class="fas fa-calendar-check"></i> Book Appointment
          </button>
        ` : ''}
        <button class="btn btn-outline w-full" onclick="handleStoreCall('${store.name}', '${store.phone}')">
          <i class="fas fa-phone"></i> Contact Store
        </button>
      </div>

    </div>
  `;

  attachStoreDetailHandlers();
}

function closeStoreDetail() {
  shopState.currentStoreId = null;
  renderShop();
  history.pushState({ page: 'shop' }, '', '#shop');
}

function renderStoreProducts(store) {
  if (!store.products || !store.products.length) {
    return `<p class="empty-state">No products available</p>`;
  }

  const products = store.products.map(id => getProductById(id)).filter(Boolean);

  if (!products.length) {
    return `<p class="empty-state">No products available</p>`;
  }

  return `
    <div class="products-grid">
      ${products.map(p => renderProductCard(p)).join('')}
    </div>
  `;
}

function renderStoreReviews(store) {
  if (!store.reviews || !store.reviews.length) {
    return `<p class="empty-state">No reviews yet. Be the first to review.</p>`;
  }

  return store.reviews.map(r => `
    <div class="store-review-item">
      <div class="store-review-header">
        <div class="store-review-avatar">${r.userName.charAt(0)}</div>
        <div>
          <p class="store-review-name">${r.userName}</p>
          <p class="store-review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</p>
        </div>
        <span class="store-review-date">${r.date}</span>
      </div>
      <p class="store-review-text">${r.text}</p>
    </div>
  `).join('');
}

function renderStoreInfo(store) {
  return `
    <div class="store-info-list">
      <div class="store-info-row"><span class="store-info-key">Owner</span><span class="store-info-val">${store.owner}</span></div>
      <div class="store-info-row"><span class="store-info-key">Phone</span><span class="store-info-val">${store.phone}</span></div>
      <div class="store-info-row"><span class="store-info-key">Hours</span><span class="store-info-val">${store.hours}</span></div>
      <div class="store-info-row"><span class="store-info-key">Location</span><span class="store-info-val">${store.location}</span></div>
      <div class="store-info-row"><span class="store-info-key">Type</span><span class="store-info-val">${store.type.charAt(0).toUpperCase() + store.type.slice(1)}</span></div>
      <div class="store-info-row"><span class="store-info-key">Category</span><span class="store-info-val">${store.category}</span></div>
    </div>
  `;
}

function renderStoreVets(store) {
  if (!store.workers || !store.workers.length) {
    return `<p class="empty-state">No vets listed</p>`;
  }

  return store.workers.map(vet => `
    <div class="store-vet-card">
      <div class="store-vet-avatar">
        <img src="${vet.avatar}" alt="${vet.name}" onerror="this.style.opacity='0'">
      </div>
      <div class="store-vet-info">
        <p class="store-vet-name">${vet.name}</p>
        <p class="store-vet-specialty">${vet.specialty}</p>
        <p class="store-vet-exp">${vet.experience} years experience</p>
        <div class="store-vet-rating"><i class="fas fa-star"></i> ${vet.rating}</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openBookingModal('${store.id}', '${vet.id}')">
        Book
      </button>
    </div>
  `).join('');
}

/* ============================================================ */
/* 6. BOOKING MODAL                                              */
/* ============================================================ */
function openBookingModal(storeId, vetId = null) {
  const store = getStoreById(storeId);
  if (!store) return;

  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  const pets = APP.pets || [];
  const petOptions = pets.length
    ? pets.map(p => `<option value="${p.id}">${p.name}</option>`).join('')
    : '<option value="">No pets added</option>';

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('bookingModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-calendar-check"></i> Book Appointment
    </h2>
    <p style="color:var(--pc-text-2); margin-bottom:18px; font-size:13.5px;">
      <strong>${store.name}</strong> &middot; ${store.location}
    </p>

    <form onsubmit="handleBookingSubmit(event, '${storeId}', '${vetId || ''}')">
      <label>Select Date</label>
      <input type="date" id="bookingDate" required min="${new Date().toISOString().slice(0, 10)}">

      <label>Select Time</label>
      <select id="bookingTime" required>
        <option value="">Choose a slot</option>
        <option value="10:00">10:00 AM</option>
        <option value="11:00">11:00 AM</option>
        <option value="14:00">2:00 PM</option>
        <option value="15:00">3:00 PM</option>
        <option value="16:00">4:00 PM</option>
      </select>

      <label>Consultation Type</label>
      <select id="bookingType" required>
        <option value="chat">Chat Consultation &middot; $10</option>
        <option value="video">Video Call &middot; $25</option>
        <option value="inPerson" selected>In-Person Visit &middot; $50</option>
      </select>

      <label>Which Pet?</label>
      <select id="bookingPet" required>${petOptions}</select>

      <label>Reason (optional)</label>
      <textarea id="bookingReason" placeholder="Describe the issue..."></textarea>

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Confirm Booking
      </button>
    </form>
  `;

  openModal('bookingModal');
}

function handleBookingSubmit(e, storeId, vetId) {
  e.preventDefault();

  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;
  const type = document.getElementById('bookingType').value;
  const petId = document.getElementById('bookingPet').value;
  const reason = document.getElementById('bookingReason').value;

  if (!date || !time || !petId) {
    showToast('Please fill all fields');
    return;
  }

  const feeMap = { chat: 10, video: 25, inPerson: 50 };

  const appointment = {
    id: 'apt_' + Date.now(),
    storeId,
    vetId: vetId || null,
    userId: APP.user?.name || 'Guest',
    petId,
    date: `${date}T${time}`,
    consultationType: type,
    fee: feeMap[type],
    reason: reason || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  APP.appointments.push(appointment);
  Storage.set(APP.STORAGE_KEYS.APPOINTMENTS, APP.appointments);

  closeModal('bookingModal');
  showToast('Appointment confirmed');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }
}

function handleStoreCall(name, phone) {
  showToast('Calling ' + name);
}

/* ============================================================ */
/* 7. CREATE STORE MODAL                                         */
/* ============================================================ */
function openCreateStoreModal() {
  const modal = document.getElementById('createStoreModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('createStoreModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-store"></i> Create Your Store
    </h2>
    <p style="color:var(--pc-text-2); margin-bottom:18px; font-size:13.5px;">
      Open your own pet store or clinic on PetCare
    </p>

    <form onsubmit="handleCreateStoreSubmit(event)">
      <label>Store Name *</label>
      <input type="text" id="newStoreName" placeholder="e.g. Happy Paws Store" required>

      <label>Category *</label>
      <select id="newStoreCategory" required>
        <option value="">Select</option>
        <option value="Grooming">Grooming</option>
        <option value="Vet Care">Vet Care</option>
        <option value="Food">Food</option>
        <option value="Training">Training</option>
        <option value="Accessories">Accessories</option>
        <option value="All-in-one">All-in-one</option>
      </select>

      <label>Type *</label>
      <select id="newStoreType" required>
        <option value="local">Local</option>
        <option value="online">Online</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <label>Phone *</label>
      <input type="tel" id="newStorePhone" placeholder="+880-1712-000000" required>

      <label>Location *</label>
      <input type="text" id="newStoreLocation" placeholder="City, Area" required>

      <label>Hours</label>
      <input type="text" id="newStoreHours" placeholder="9 AM - 9 PM" value="9 AM - 9 PM">

      <label>Description</label>
      <textarea id="newStoreDesc" placeholder="Tell customers about your store..."></textarea>

      <label class="modal-checkbox-row" style="display:flex; align-items:center; gap:10px; padding:12px; background:var(--pc-paper); border-radius:10px; margin-bottom:14px; cursor:pointer;">
        <input type="checkbox" id="newStoreIsClinic" style="width:18px; height:18px; accent-color:var(--pc-success);">
        <span style="font-size:13.5px;">This is a clinic (veterinary services)</span>
      </label>

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Create Store
      </button>
    </form>
  `;

  openModal('createStoreModal');
}

function handleCreateStoreSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('newStoreName').value.trim();
  const category = document.getElementById('newStoreCategory').value;
  const type = document.getElementById('newStoreType').value;
  const phone = document.getElementById('newStorePhone').value.trim();
  const location = document.getElementById('newStoreLocation').value.trim();
  const hours = document.getElementById('newStoreHours').value.trim();
  const description = document.getElementById('newStoreDesc').value.trim();
  const isClinic = document.getElementById('newStoreIsClinic').checked;

  if (!name || !category || !phone || !location) {
    showToast('Please fill all required fields');
    return;
  }

  const newStore = {
    id: 'store_' + Date.now(),
    name, owner: APP.user?.name || 'You',
    ownerId: APP.user?.email || 'self',
    type, category, isClinic,
    showWorkers: false,
    rating: 0, reviewCount: 0,
    location, phone,
    hours: hours || '9 AM - 9 PM',
    description: description || 'A new pet store on PetCare.',
    cover: 'assets/stores/hero-shop.png',
    logo: 'assets/icons/pfp-pretty-pet.png',
    gallery: [], products: [], workers: [], reviews: [],
    isFavorite: false,
    isUserCreated: true
  };

  // Add to user's owned stores (for profile display)
if (APP.user) {
  APP.user.roles = APP.user.roles || ['petOwner'];
  if (!APP.user.roles.includes('storeOwner')) {
    APP.user.roles.push('storeOwner');
  }
  APP.user.ownedStores = APP.user.ownedStores || [];
  if (!APP.user.ownedStores.includes(newStore.id)) {
    APP.user.ownedStores.push(newStore.id);
  }
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));
}

  const userStores = Storage.get(APP.STORAGE_KEYS.STORES, []);
  userStores.push(newStore.id);
  Storage.set(APP.STORAGE_KEYS.STORES, userStores);

  closeModal('createStoreModal');
  showToast('Store created');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  if (shopState.activeTab === 'stores') {
    const content = document.getElementById('shopTabContent');
    if (content) content.innerHTML = renderStoresTab();
    attachStoreTabHandlers();
  }
}

/* ============================================================ */
/* 8. EVENT HANDLERS                                             */
/* ============================================================ */
function attachShopHandlers() {
  const page = document.getElementById('page-shop');
  if (!page) return;

  page.querySelectorAll('[data-shop-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.shopTab;
      if (tab !== 'products' && tab !== 'stores') return;
      shopState.activeTab = tab;
      shopState.searchQuery = '';
      shopState.activeCategory = 'all';
      shopState.showAllProducts = false;
      renderShop();
    });
  });

  if (shopState.activeTab === 'products') attachProductsHandlers();
  if (shopState.activeTab === 'stores') attachStoreTabHandlers();
}

function attachProductsHandlers() {
  const page = document.getElementById('page-shop');
  if (!page) return;

  // Category circles
  page.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      shopState.activeCategory = btn.dataset.category;
      shopState.showAllProducts = false;
      shopState.searchQuery = '';
      renderShop();
    });
  });

  // Store cards
  page.querySelectorAll('[data-store-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-add-cart]') || e.target.closest('[data-fav-store]')) return;
      openStoreDetail(card.dataset.storeId);
    });
  });

  // Product cards
  page.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-add-cart]')) return;
      openQuickView(card.dataset.productId);
    });
  });

  // Add to cart
  page.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.addCart);
    });
  });

  // See all
  const seeAllBtn = document.getElementById('seeAllProductsBtn');
  if (seeAllBtn) {
    seeAllBtn.addEventListener('click', () => {
      shopState.showAllProducts = !shopState.showAllProducts;
      const grid = document.getElementById('productsGrid');
      if (grid) grid.innerHTML = renderFilteredProducts();
      seeAllBtn.textContent = shopState.showAllProducts ? 'Show Less' : 'See All';
      attachProductGridHandlers();
    });
  }

  // Clear category
  const clearBtn = document.getElementById('clearCategoryBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      shopState.activeCategory = 'all';
      shopState.showAllProducts = false;
      shopState.searchQuery = '';
      renderShop();
    });
  }

  // Search
  const searchInput = document.getElementById('shopSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      shopState.searchQuery = e.target.value.toLowerCase();
      const grid = document.getElementById('productsGrid');
      if (grid) grid.innerHTML = renderFilteredProducts();
      attachProductGridHandlers();
    });
  }

  // Sort
  const sortSelect = document.getElementById('shopSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      shopState.sortBy = e.target.value;
      const grid = document.getElementById('productsGrid');
      if (grid) grid.innerHTML = renderFilteredProducts();
      attachProductGridHandlers();
    });
  }
}

// Wishlist toggle
page.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleProductWishlist(btn.dataset.wishlistToggle);
  });
});

function attachProductGridHandlers() {
  const page = document.getElementById('page-shop');
  if (!page) return;

  page.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-add-cart]')) return;
      openQuickView(card.dataset.productId);
    });
  });

  page.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.addCart);
    });
  });
}

function attachStoreTabHandlers() {
  const page = document.getElementById('page-shop');
  if (!page) return;

  page.querySelectorAll('[data-store-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      shopState.activeStoreFilter = chip.dataset.storeFilter;
      const content = document.getElementById('shopTabContent');
      if (content) content.innerHTML = renderStoresTab();
      attachStoreTabHandlers();
    });
  });

  page.querySelectorAll('.store-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.store-view-btn') || e.target.closest('[data-fav-store]')) return;
      openStoreDetail(card.dataset.storeId);
    });
  });

  page.querySelectorAll('.store-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openStoreDetail(btn.dataset.storeId);
    });
  });

  page.querySelectorAll('[data-fav-store]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const storeId = btn.dataset.favStore;
      const isFav = toggleStoreFavorite(storeId);
      btn.classList.toggle('active', isFav);
      btn.querySelector('i').className = isFav ? 'fas fa-heart' : 'far fa-heart';
    });
  });

  const searchInput = document.getElementById('storeSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      shopState.searchQuery = e.target.value.toLowerCase();
      const list = document.querySelector('.stores-list');
      if (list) list.innerHTML = renderFilteredStores();
      attachStoreTabHandlers();
    });
  }
}

function attachStoreDetailHandlers() {
  const page = document.getElementById('page-shop');
  if (!page) return;

  page.querySelectorAll('[data-store-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.storeTab;
      const store = getStoreById(shopState.currentStoreId);
      if (!store) return;

      page.querySelectorAll('[data-store-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const content = document.getElementById('storeDetailTabContent');
      if (!content) return;

      switch (tabName) {
        case 'products':
          content.innerHTML = renderStoreProducts(store);
          attachProductGridHandlers();
          break;
        case 'reviews':
          content.innerHTML = renderStoreReviews(store);
          break;
        case 'info':
          content.innerHTML = renderStoreInfo(store);
          break;
        case 'vets':
          content.innerHTML = renderStoreVets(store);
          break;
      }
    });
  });

  const favBtn = document.getElementById('storeDetailFav');
  if (favBtn) {
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const storeId = favBtn.dataset.favStore;
      const isFav = toggleStoreFavorite(storeId);
      favBtn.classList.toggle('active', isFav);
      favBtn.querySelector('i').className = isFav ? 'fas fa-heart' : 'far fa-heart';
    });
  }

  page.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-add-cart]')) return;
      openQuickView(card.dataset.productId);
    });
  });

  page.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.addCart);
    });
  });
}

/* ============================================================ */
/* 9. HISTORY BACK — Mobile back button                          */
/* ============================================================ */
window.addEventListener('popstate', (e) => {
  const state = e.state;

  if (shopState.currentStoreId && (!state || state.page !== 'store-detail')) {
    shopState.currentStoreId = null;
    if (APP.currentPage === 'shop') renderShop();
    return;
  }

  if (state?.page === 'shop' && APP.currentPage === 'shop') {
    renderShop();
    return;
  }
});

/* ============================================================ */
/* PRODUCT WISHLIST TOGGLE                                       */
/* ============================================================ */
function toggleProductWishlist(productId) {
  if (!productId) return;

  let wishlist = Storage.get('pc_wishlist', []);
  if (!Array.isArray(wishlist)) wishlist = [];

  let nowWishlisted;

  if (wishlist.includes(productId)) {
    // Remove
    wishlist = wishlist.filter(id => id !== productId);
    nowWishlisted = false;
    showToast('Removed from wishlist');
  } else {
    // Add
    wishlist.push(productId);
    nowWishlisted = true;
    showToast('Added to wishlist ❤️');
  }

  Storage.set('pc_wishlist', wishlist);
  APP.wishlist = wishlist;

  // Update ALL matching buttons on page
  document.querySelectorAll(`[data-wishlist-toggle="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', nowWishlisted);
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = nowWishlisted ? 'fas fa-heart' : 'far fa-heart';
    }
  });

  // Refresh drawer badge
  if (typeof refreshDrawer === 'function') {
    refreshDrawer();
  }
}



/* ============================================================ */
/* 10. EXPORT                                                    */
/* ============================================================ */
window.toggleProductWishlist = toggleProductWishlist;
window.toggleProductWishlist = toggleProductWishlist;
window.renderShop = renderShop;
window.openStoreDetail = openStoreDetail;
window.closeStoreDetail = closeStoreDetail;
window.openBookingModal = openBookingModal;
window.handleBookingSubmit = handleBookingSubmit;
window.handleStoreCall = handleStoreCall;
window.openCreateStoreModal = openCreateStoreModal;
window.handleCreateStoreSubmit = handleCreateStoreSubmit;
window.getFavoriteStores = getFavoriteStores;
window.isStoreFavorite = isStoreFavorite;
window.toggleStoreFavorite = toggleStoreFavorite;

console.log('PetCare Shop loaded');