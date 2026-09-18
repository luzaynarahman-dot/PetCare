/* ============================================================ */
/* PETCARE v3.0 — APP CORE                                       */
/* Router, State, Init, Theme, Toast, Utilities                  */
/* Clean version — no errors, no duplicates                      */
/* ============================================================ */

/* ============================================================ */
/* 1. GLOBAL STATE                                               */
/* ============================================================ */
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

  STORAGE_KEYS: {
    TOKEN: 'pc_token',
    USER: 'pc_user',
    THEME: 'pc_theme',
    CART: 'pc_cart',
    WISHLIST: 'pc_wishlist',
    ORDERS: 'pc_orders',
    NOTIFICATIONS: 'pc_notifications',
    PETS: 'pc_pets',
    ACTIVE_PET: 'pc_activePetId',
    MEMORIES: 'pc_memories',
    STORES: 'pc_stores',
    APPOINTMENTS: 'pc_appointments',
    HEALTH_LOG: 'pc_healthLog',
    VACCINATIONS: 'pc_vaccinations',
    MEDICATIONS: 'pc_medications',
    REMINDERSRS: 'pc_reminders',
    DAILY_CARE: 'pc_dailyCare',
    ACTIVE_ROLE: 'pc_activeRole'
  }
};

/* ============================================================ */
/* 2. STORAGE HELPERS                                            */
/* ============================================================ */
const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }
};

/* ============================================================ */
/* 3. ROUTER                                                     */
/* ============================================================ */
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + pageName);
  if (!target) {
    console.warn('Page not found:', pageName);
    return;
  }

  target.classList.add('active');
  APP.currentPage = pageName;

  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === pageName);
  });

  window.scrollTo(0, 0);

  const nav = document.getElementById('topNav');
  if (nav) nav.classList.remove('nav-hidden');

  updateNavbarIcons(pageName);

  if (typeof closeNavSearch === 'function') {
    closeNavSearch();
  }

  // ⭐ SPECIAL CASE: user-profile is rendered directly by ProfileView.open()
  // Skip skeleton + retry logic for this page
  if (pageName === 'user-profile') {
    return;
  }

  renderPageContent(pageName);
}

/* ============================================================ */
/* 4. NAVBAR ICON VISIBILITY                                     */
/* ============================================================ */
function updateNavbarIcons(pageName) {
  const searchIcon = document.getElementById('searchIcon');
  if (!searchIcon) return;

  if (pageName === 'memory') {
    searchIcon.style.display = 'inline-flex';
  } else {
    searchIcon.style.display = 'none';
  }
}

/* ============================================================ */
/* 5. PAGE RENDER (with error boundary)                          */
/* ============================================================ */
function renderPageContent(pageName) {
  // Show skeleton first
  if (typeof showSkeleton === 'function') {
    showSkeleton(pageName);
  }

  // Wait for scripts to load, then render
  var attempts = 0;
  var maxAttempts = 30;

  function attemptRender() {
    attempts++;

    var renderers = {
  home:         typeof renderHome === 'function'         ? renderHome         : null,
  shop:         typeof renderShop === 'function'         ? renderShop         : null,
  care:         typeof renderCare === 'function'         ? renderCare         : null,
  memory:       typeof renderMemory === 'function'       ? renderMemory       : null,
  profile:      typeof renderProfile === 'function'      ? renderProfile      : null,
  appointments: typeof renderAppointments === 'function' ? renderAppointments : null,
  'user-profile': (typeof window.ProfileView === 'object' && window.ProfileView && typeof window.ProfileView.render === 'function')
    ? function() { window.ProfileView.render(); }
    : null
};

    var renderFn = renderers[pageName];

    if (!renderFn && attempts < maxAttempts) {
      // Renderer not ready yet — retry
      setTimeout(attemptRender, 100);
      return;
    }

    if (!renderFn) {
      console.warn('Renderer never loaded:', pageName);
      showErrorBoundary(pageName);
      return;
    }

    try {
      renderFn();
      var page = document.getElementById('page-' + pageName);
      if (page) {
        page.classList.add('content-loaded');
        setTimeout(function() {
          page.classList.remove('content-loaded');
        }, 400);
      }
    } catch (err) {
      console.error('[Render Error] Page:', pageName, err);
      showErrorBoundary(pageName);
    }
  }

  // Start after slight delay
  setTimeout(attemptRender, 300);
}

/* ============================================================ */
/* 6. ERROR BOUNDARY                                             */
/* ============================================================ */
function showErrorBoundary(pageName) {
  const page = document.getElementById('page-' + pageName);
  if (!page) return;

  page.innerHTML =
    '<div class="page-container">' +
      '<div class="error-boundary-card">' +
        '<div class="error-boundary-icon">' +
          '<i class="fas fa-triangle-exclamation"></i>' +
        '</div>' +
        '<h3 class="error-boundary-title">Something went wrong</h3>' +
        '<p class="error-boundary-message">' +
          "This page couldn't load properly. Please try again." +
        '</p>' +
        '<div class="error-boundary-actions">' +
          '<button class="btn btn-primary" onclick="retryPage(\'' + pageName + '\')">' +
            '<i class="fas fa-rotate-right"></i> Retry' +
          '</button>' +
          '<button class="btn btn-outline" onclick="showPage(\'home\')">' +
            '<i class="fas fa-home"></i> Go Home' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  showToast('Something went wrong. Please try again.');
}

function retryPage(pageName) {
  renderPageContent(pageName);
}

/* ============================================================ */
/* 7. INIT                                                       */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadAllData();
  initBottomNav();
  initGlobalHandlers();
  initBackToTop();
  initNavAutoHide();

  updateNavbarIcons(APP.currentPage || 'home');

  renderPageContent('home');

  updateCartBadge();
  updateNotifBadge();

  console.log('PetCare v3.0 initialized');
});

function loadAllData() {
  const K = APP.STORAGE_KEYS;

  APP.token = localStorage.getItem(K.TOKEN) || null;
  APP.user = Storage.get(K.USER, null);
  APP.cart = Storage.get(K.CART, []);
  APP.wishlist = Storage.get(K.WISHLIST, []);
  APP.orders = Storage.get(K.ORDERS, []);
  APP.notifications = Storage.get(K.NOTIFICATIONS, []);
  APP.pets = Storage.get(K.PETS, []);
  APP.activePetId = Storage.get(K.ACTIVE_PET, null);
  APP.memories = Storage.get(K.MEMORIES, []);
  APP.stores = Storage.get(K.STORES, []);
  APP.appointments = Storage.get(K.APPOINTMENTS, []);
}

/* ============================================================ */
/* 8. THEME                                                      */
/* ============================================================ */
function initTheme() {
  const saved = localStorage.getItem(APP.STORAGE_KEYS.THEME) || 'light';
  APP.theme = saved;

  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  const toggle = document.getElementById('drawerDarkMode');
  if (toggle) toggle.checked = saved === 'dark';
}

function toggleTheme(enabled) {
  APP.theme = enabled ? 'dark' : 'light';
  document.body.classList.toggle('dark-mode', enabled);
  localStorage.setItem(APP.STORAGE_KEYS.THEME, APP.theme);
}

/* ============================================================ */
/* 9. BOTTOM NAV                                                 */
/* ============================================================ */
function initBottomNav() {
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.nav;
      if (page) showPage(page);
    });
  });
}

/* ============================================================ */
/* 10. GLOBAL HANDLERS                                           */
/* ============================================================ */
function initGlobalHandlers() {
  const hamburger = document.getElementById('hamburgerBtn');
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof openDrawer === 'function') {
        openDrawer();
      } else {
        console.warn('openDrawer not available');
      }
    });
  }

  const notifIcon = document.getElementById('notifIcon');
  if (notifIcon) {
    notifIcon.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof renderNotificationsModal === 'function') {
        renderNotificationsModal();
      } else {
        showToast('Notifications unavailable');
      }
    });
  }

  const cartIcon = document.getElementById('cartIcon');
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }

  const closeCart = document.getElementById('closeCart');
  if (closeCart) {
    closeCart.addEventListener('click', closeCartPanel);
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof closeDrawer === 'function') closeDrawer();
      closeAllModals();
      closeCartPanel();
    }
  });
}

/* ============================================================ */
/* 11. AUTO-HIDE NAV                                             */
/* ============================================================ */
function initNavAutoHide() {
  const nav = document.getElementById('topNav');
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY;

    if (currentScrollY < 80) {
      nav.classList.remove('nav-hidden');
    } else if (diff > 10) {
      nav.classList.add('nav-hidden');
    } else if (diff < -10) {
      nav.classList.remove('nav-hidden');
    }

    nav.classList.toggle('scrolled', currentScrollY > 10);
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================ */
/* 12. CART PANEL                                                */
/* ============================================================ */
function openCart() {
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar) {
    sidebar.classList.add('active');
    APP.isCartOpen = true;
    renderCartItems();
  }
}

function closeCartPanel() {
  const sidebar = document.getElementById('cartSidebar');
  if (sidebar) {
    sidebar.classList.remove('active');
    APP.isCartOpen = false;
  }
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;

  if (!APP.cart.length) {
    container.innerHTML =
      '<div class="empty-cart">' +
        '<i class="fas fa-shopping-bag"></i>' +
        '<p>Your cart is empty</p>' +
      '</div>';
    updateCartTotal();
    return;
  }

  let html = '';
  for (const item of APP.cart) {
    const img = item.img || 'assets/illustrations/mascot-cat-lying.png';
    html +=
      '<div class="cart-item" data-id="' + item.id + '">' +
        '<div class="cart-item-img">' +
          '<img src="' + img + '" alt="' + escapeHtml(item.name) + '" onerror="this.style.opacity=\'0\'">' +
        '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-title">' + escapeHtml(item.name) + '</div>' +
          '<div class="cart-item-price">$' + item.price.toFixed(2) + '</div>' +
          '<div class="cart-item-quantity">' +
            '<button data-action="dec" data-id="' + item.id + '">' +
              '<i class="fas fa-minus"></i>' +
            '</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button data-action="inc" data-id="' + item.id + '">' +
              '<i class="fas fa-plus"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" data-action="remove" data-id="' + item.id + '" aria-label="Remove">' +
          '<i class="fas fa-trash"></i>' +
        '</button>' +
      '</div>';
  }
  container.innerHTML = html;

  container.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = APP.cart.find(i => i.id === id);

      if (action === 'remove') {
        APP.cart = APP.cart.filter(i => i.id !== id);
      } else if (item) {
        if (action === 'inc') item.quantity++;
        if (action === 'dec') item.quantity--;
        if (item.quantity <= 0) {
          APP.cart = APP.cart.filter(i => i.id !== id);
        }
      }

      Storage.set(APP.STORAGE_KEYS.CART, APP.cart);
      renderCartItems();
      updateCartBadge();
    });
  });

  updateCartTotal();
}

function updateCartTotal() {
  const totalEl = document.getElementById('cartTotal');
  if (!totalEl) return;
  const total = APP.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = '$' + total.toFixed(2);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count');
  const count = APP.cart.reduce((sum, item) => sum + item.quantity, 0);

  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function updateNotifBadge() {
  const icons = document.querySelectorAll('.notif-icon');
  const unread = (APP.notifications || []).filter(n => !n.read).length;

  icons.forEach(icon => {
    icon.setAttribute('data-count', unread);
  });
}

function handleCheckout() {
  if (!APP.cart.length) {
    showToast('Your cart is empty');
    return;
  }
  closeCartPanel();
  if (typeof openCheckout === 'function') {
    openCheckout();
  } else {
    showToast('Checkout coming soon');
  }
}

/* ============================================================ */
/* 13. BACK TO TOP                                               */
/* ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================ */
/* 14. TOAST                                                     */
/* ============================================================ */
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMessage');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ============================================================ */
/* 15. MODALS                                                    */
/* ============================================================ */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    return;
  }

  const closeBtn = e.target.closest('.close-modal, [data-close-modal]');
  if (closeBtn) {
    const modal = closeBtn.closest('.modal');
    if (modal) modal.classList.remove('active');
  }
});

/* ============================================================ */
/* 16. UTILITIES                                                 */
/* ============================================================ */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 7) return days + 'd ago';
  return formatDate(date);
}

function generateId(prefix = 'id') {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================ */
/* 17. AUTH                                                      */
/* ============================================================ */
function isLoggedIn() {
  return !!APP.token && !!APP.user;
}

function getCurrentUser() {
  return APP.user;
}

function logout() {
  APP.token = null;
  APP.user = null;
  Storage.remove(APP.STORAGE_KEYS.TOKEN);
  Storage.remove(APP.STORAGE_KEYS.USER);
  showToast('Logged out');
  showPage('home');
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 18. ROLE MANAGEMENT                                           */
/* ============================================================ */
function getActiveRole() {
  if (!APP.user) return 'petOwner';

  const roles = APP.user.roles || ['petOwner'];
  const active = APP.user.activeRole || 'petOwner';

  if (roles.includes(active)) return active;
  return roles[0] || 'petOwner';
}

function setActiveRole(role) {
  if (!APP.user) return false;

  const roles = APP.user.roles || ['petOwner'];
  if (!roles.includes(role)) {
    showToast('You do not have this role');
    return false;
  }

  APP.user.activeRole = role;
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));
  return true;
}

function hasRole(role) {
  if (!APP.user) return false;
  const roles = APP.user.roles || ['petOwner'];
  return roles.includes(role);
}

function isVerifiedVet() {
  if (!APP.user) return false;
  return APP.user.vetApplication && APP.user.vetApplication.status === 'approved' &&
         APP.user.roles && APP.user.roles.includes('vet');
}

function isVetPending() {
  if (!APP.user) return false;
  return APP.user.vetApplication && APP.user.vetApplication.status === 'pending';
}

function getRoleLabel(role) {
  const labels = {
    petOwner: 'Pet Owner',
    storeOwner: 'Store Owner',
    vet: 'Veterinarian'
  };
  return labels[role] || 'Pet Owner';
}

function getRoleIcon(role) {
  const icons = {
    petOwner: 'fa-paw',
    storeOwner: 'fa-store',
    vet: 'fa-user-md'
  };
  return icons[role] || 'fa-paw';
}

function addUserRole(role) {
  if (!APP.user) return false;

  APP.user.roles = APP.user.roles || ['petOwner'];
  if (!APP.user.roles.includes(role)) {
    APP.user.roles.push(role);
    localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));
  }
  return true;
}

/* ============================================================ */
/* 19. GLOBAL ERROR HANDLERS                                     */
/* ============================================================ */
window.addEventListener('error', (e) => {
  console.error('Runtime error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise:', e.reason);
});

/* ============================================================ */
/* 20. EXPORT                                                    */
/* ============================================================ */
window.APP = APP;
window.Storage = Storage;
window.showPage = showPage;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.openCart = openCart;
window.closeCartPanel = closeCartPanel;
window.renderCartItems = renderCartItems;
window.updateCartBadge = updateCartBadge;
window.updateNotifBadge = updateNotifBadge;
window.toggleTheme = toggleTheme;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.timeAgo = timeAgo;
window.generateId = generateId;
window.escapeHtml = escapeHtml;
window.handleCheckout = handleCheckout;
window.updateNavbarIcons = updateNavbarIcons;
window.initNavAutoHide = initNavAutoHide;
window.renderPageContent = renderPageContent;
window.retryPage = retryPage;

/* ROLE MANAGEMENT EXPORTS */
window.getActiveRole = getActiveRole;
window.setActiveRole = setActiveRole;
window.hasRole = hasRole;
window.isVerifiedVet = isVerifiedVet;
window.isVetPending = isVetPending;
window.getRoleLabel = getRoleLabel;
window.getRoleIcon = getRoleIcon;
window.addUserRole = addUserRole;

console.log('PetCare Core loaded');