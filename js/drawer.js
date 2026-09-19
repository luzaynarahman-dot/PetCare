/* ============================================================ */
/* PETCARE v3.0 — DRAWER (Hamburger Menu)                        */
/* Fixed version — duplicate cart, wishlist, about modal         */
/* ============================================================ */

const Drawer = {
  isOpen: false,
  els: {},

  init() {
    this.cleanDuplicateItems();
    this.cacheElements();
    this.attachEvents();
    this.refresh();
  },

  /* ⭐ Fix duplicate drawer items (Cart shows twice) */
  cleanDuplicateItems() {
    const drawer = document.getElementById('sideDrawer');
    if (!drawer) return;

    const seen = new Set();
    const items = drawer.querySelectorAll('.drawer-item[data-drawer-action]');

    items.forEach(item => {
      const action = item.dataset.drawerAction;
      if (!action) return;

      if (seen.has(action)) {
        // Duplicate — remove it
        item.remove();
        console.warn('[Drawer] Removed duplicate item:', action);
      } else {
        seen.add(action);
      }
    });
  },

  cacheElements() {
    this.els.drawer = document.getElementById('sideDrawer');
    this.els.backdrop = document.getElementById('drawerBackdrop');
    this.els.hamburgerBtn = document.getElementById('hamburgerBtn');
    this.els.avatar = document.getElementById('drawerAvatar');
    this.els.userName = document.getElementById('drawerUserName');
    this.els.userEmail = document.getElementById('drawerUserEmail');
    this.els.signinBanner = document.getElementById('drawerSigninBanner');
    this.els.signinBtn = document.getElementById('drawerSigninBtn');
    this.els.authBtn = document.getElementById('drawerAuthBtn');
    this.els.authText = document.getElementById('drawerAuthText');
    this.els.authIcon = document.getElementById('drawerAuthIcon');
    this.els.darkToggle = document.getElementById('drawerDarkMode');
    this.els.wishlistCount = document.getElementById('drawerWishlistCount');
    this.els.orderCount = document.getElementById('drawerOrderCount');
    this.els.notifCount = document.getElementById('drawerNotifCount');
  },

  attachEvents() {
    this.els.backdrop?.addEventListener('click', () => this.close());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    this.els.drawer?.addEventListener('click', (e) => {
      const item = e.target.closest('[data-drawer-action]');
      if (!item) return;
      this.handleAction(item.dataset.drawerAction, item);
    });

    this.els.darkToggle?.addEventListener('change', (e) => {
      e.stopPropagation();
      toggleTheme(e.target.checked);
    });

    this.els.signinBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
      setTimeout(() => {
        openModal('loginModal');
        renderLoginModal();
      }, 300);
    });

    this.els.authBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLoggedIn()) {
        this.close();
        setTimeout(logout, 300);
      } else {
        this.close();
        setTimeout(() => {
          openModal('loginModal');
          renderLoginModal();
        }, 300);
      }
    });
  },

  open() {
    this.isOpen = true;
    this.els.drawer?.classList.add('active');
    this.els.backdrop?.classList.add('active');
    this.els.hamburgerBtn?.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.els.drawer?.setAttribute('aria-hidden', 'false');
  },

  close() {
    this.isOpen = false;
    this.els.drawer?.classList.remove('active');
    this.els.backdrop?.classList.remove('active');
    this.els.hamburgerBtn?.classList.remove('active');
    document.body.style.overflow = '';
    this.els.drawer?.setAttribute('aria-hidden', 'true');
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  refresh() {
    const loggedIn = isLoggedIn();
    const user = getCurrentUser();

    if (loggedIn && user) {
      const initial = (user.name || 'U').charAt(0).toUpperCase();
      if (this.els.avatar) {
        this.els.avatar.textContent = initial;
        this.els.avatar.classList.add('logged-in');
      }
      if (this.els.userName) this.els.userName.textContent = user.name || 'User';
      if (this.els.userEmail) this.els.userEmail.textContent = user.email || '';
    } else {
      if (this.els.avatar) {
        this.els.avatar.textContent = '?';
        this.els.avatar.classList.remove('logged-in');
      }
      if (this.els.userName) this.els.userName.textContent = 'Welcome';
      if (this.els.userEmail) this.els.userEmail.textContent = 'Sign in to continue';
    }

    if (loggedIn) {
      this.els.signinBanner?.classList.add('hidden');
    } else {
      this.els.signinBanner?.classList.remove('hidden');
    }

    if (this.els.authText) {
      this.els.authText.textContent = loggedIn ? 'Logout' : 'Login / Sign Up';
    }
    if (this.els.authIcon) {
      this.els.authIcon.className = loggedIn ? 'fas fa-sign-out-alt' : 'fas fa-sign-in-alt';
    }
    if (this.els.authBtn) {
      this.els.authBtn.classList.toggle('logged-in', loggedIn);
    }

    if (this.els.darkToggle) {
      this.els.darkToggle.checked = document.body.classList.contains('dark-mode');
    }

    this.refreshCounts();
  },

  refreshCounts() {
    // ⭐ Wishlist count
    const wishlist = (typeof APP === 'object' && APP) ? (APP.wishlist || []) : [];
    if (this.els.wishlistCount) {
      this.els.wishlistCount.textContent = wishlist.length;
      this.els.wishlistCount.classList.toggle('hidden', wishlist.length === 0);
    }

    // ⭐ Orders count
    const orders = (typeof APP === 'object' && APP) ? (APP.orders || []) : [];
    if (this.els.orderCount) {
      this.els.orderCount.textContent = orders.length;
      this.els.orderCount.classList.toggle('hidden', orders.length === 0);
    }

    // ⭐ Notifications count
    const notifs = (typeof APP === 'object' && APP) ? (APP.notifications || []) : [];
    const unread = notifs.filter(n => !n.read).length;
    if (this.els.notifCount) {
      this.els.notifCount.textContent = unread;
      this.els.notifCount.classList.toggle('hidden', unread === 0);
    }
  },

  handleAction(action, item) {
    if (item?.dataset.requiresAuth === 'true' && !isLoggedIn()) {
      this.close();
      setTimeout(() => {
        showToast('Please sign in first');
        openModal('loginModal');
        renderLoginModal();
      }, 300);
      return;
    }

    switch (action) {
      /* ---------- CART ---------- */
      case 'cart':
        this.close();
        setTimeout(() => {
          if (typeof openCart === 'function') {
            openCart();
          } else {
            showToast('Cart unavailable');
          }
        }, 300);
        break;

      /* ---------- WISHLIST ---------- */
      case 'wishlist':
        this.close();
        setTimeout(() => {
          // Robust fallback chain
          if (typeof window.openWishlist === 'function') {
            window.openWishlist();
            return;
          }

          if (typeof openWishlist === 'function') {
            openWishlist();
            return;
          }

          if (typeof window.renderWishlistModal === 'function') {
            window.renderWishlistModal();
            if (typeof openModal === 'function') {
              openModal('wishlistModal');
            }
            return;
          }

          if (typeof renderWishlistModal === 'function') {
            renderWishlistModal();
            if (typeof openModal === 'function') {
              openModal('wishlistModal');
            }
            return;
          }

          // Last resort — go to profile
          console.warn('[Drawer] Wishlist handler not found');
          if (typeof showPage === 'function') {
            showPage('profile');
          }
        }, 300);
        break;

      /* ---------- ORDERS ---------- */
      case 'orders':
        this.close();
        setTimeout(() => {
          if (typeof openMyOrders === 'function') {
            openMyOrders();
          } else if (typeof window.openMyOrders === 'function') {
            window.openMyOrders();
          } else {
            showPage('profile');
          }
        }, 300);
        break;

      /* ---------- TRACK ORDER ---------- */
      case 'track':
        this.close();
        setTimeout(() => {
          if (typeof renderTrackingModal === 'function') {
            renderTrackingModal();
            openModal('trackingModal');
          } else if (typeof window.renderTrackingModal === 'function') {
            window.renderTrackingModal();
            openModal('trackingModal');
          } else {
            showToast('Track order coming soon');
          }
        }, 300);
        break;

      /* ---------- NOTIFICATIONS ---------- */
      case 'notifications':
        this.close();
        setTimeout(() => {
          if (typeof renderNotificationsModal === 'function') {
            renderNotificationsModal();
            openModal('notifModal');
          } else if (typeof window.renderNotificationsModal === 'function') {
            window.renderNotificationsModal();
            openModal('notifModal');
          } else {
            showToast('Notifications coming soon');
          }
        }, 300);
        break;

      /* ---------- SETTINGS ---------- */
      case 'settings':
        this.close();
        setTimeout(() => showPage('profile'), 300);
        break;

      /* ---------- EXPORT ---------- */
      case 'export':
        this.close();
        setTimeout(handleExportData, 300);
        break;

      /* ---------- CLEAR ---------- */
      case 'clear':
        this.close();
        setTimeout(handleClearData, 300);
        break;

      /* ---------- ABOUT ---------- */
      case 'about':
        this.close();
        setTimeout(() => {
          if (typeof renderAboutModal === 'function') {
            renderAboutModal();
            if (typeof openModal === 'function') {
              openModal('aboutModal');
            }
          } else {
            showToast('About unavailable');
          }
        }, 400);
        break;

      default:
        console.warn('[Drawer] Unknown action:', action);
    }
  }
};

/* ============================================================ */
/* GLOBAL HELPERS                                                */
/* ============================================================ */
function openDrawer() { Drawer.open(); }
function closeDrawer() { Drawer.close(); }
function toggleDrawer() { Drawer.toggle(); }
function refreshDrawer() { Drawer.refresh(); }

/* ============================================================ */
/* EXPORT DATA                                                   */
/* ============================================================ */
function handleExportData() {
  const data = {
    user: APP.user,
    cart: APP.cart,
    wishlist: APP.wishlist,
    orders: APP.orders,
    notifications: APP.notifications,
    pets: APP.pets,
    memories: APP.memories,
    appointments: APP.appointments
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `petcare-data-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported');
}

/* ============================================================ */
/* CLEAR DATA                                                    */
/* ============================================================ */
function handleClearData() {
  if (!confirm('Clear all app data? Your login will be preserved.')) return;

  const token = localStorage.getItem(APP.STORAGE_KEYS.TOKEN);
  const user = localStorage.getItem(APP.STORAGE_KEYS.USER);
  const theme = localStorage.getItem(APP.STORAGE_KEYS.THEME);

  Storage.clear();

  if (token) localStorage.setItem(APP.STORAGE_KEYS.TOKEN, token);
  if (user) localStorage.setItem(APP.STORAGE_KEYS.USER, user);
  if (theme) localStorage.setItem(APP.STORAGE_KEYS.THEME, theme);

  showToast('Data cleared');
  setTimeout(() => location.reload(), 800);
}

/* ============================================================ */
/* ABOUT MODAL                                                   */
/* ============================================================ */
function renderAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (!modal) {
    console.warn('[About] aboutModal container not found');
    return;
  }

  const features = [
    { icon: 'fa-paw', text: 'Multi-pet health tracking' },
    { icon: 'fa-pills', text: 'Vaccination & medication reminders' },
    { icon: 'fa-stethoscope', text: 'Rule-based symptom guidance' },
    { icon: 'fa-shopping-bag', text: 'Pet shop with adoption & accessories' },
    { icon: 'fa-box', text: 'Order tracking & history' },
    { icon: 'fa-triangle-exclamation', text: 'Emergency SOS' },
    { icon: 'fa-camera-retro', text: 'Memories social feed' },
    { icon: 'fa-moon', text: 'Dark mode support' }
  ];

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('aboutModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-info-circle"></i> About PetCare
    </h2>
    <div style="color:var(--pc-text); line-height:1.7; font-size:14px;">
      <p style="margin-bottom:12px;"><strong>PetCare v3.0.0</strong></p>
      <p style="margin-bottom:16px; color:var(--pc-text-2);">
        A premium pet care companion — track health, manage daily care, shop for products, and get expert guidance.
      </p>

      <p style="font-weight:700; color:var(--pc-accent); margin-bottom:8px;">Features:</p>
      <ul style="list-style:none; padding:0; color:var(--pc-text-2);">
        ${features.map(f => `
          <li style="padding:8px 0; border-bottom:1px dashed var(--pc-border-light); display:flex; align-items:center; gap:10px;">
            <i class="fas ${f.icon}" style="color:var(--pc-accent); width:18px; text-align:center;"></i>
            <span>${f.text}</span>
          </li>
        `).join('')}
      </ul>

      <p style="text-align:center; font-size:12px; color:var(--pc-text-muted); margin-top:16px;">
        PetCare 2026. All rights reserved.
      </p>
    </div>
  `;
}

/* ============================================================ */
/* LOGIN MODAL                                                   */
/* ============================================================ */
function renderLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('loginModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="auth-header">
      <div class="auth-header-icon">
        <i class="fas fa-paw"></i>
      </div>
      <h2 class="auth-header-title">Welcome to PetCare</h2>
      <p class="auth-header-sub">Happy tails, healthy lives</p>
    </div>

    <div class="auth-tabs">
      <button class="auth-tab active" data-auth="login">Login</button>
      <button class="auth-tab" data-auth="signup">Sign Up</button>
    </div>

    <!-- LOGIN FORM -->
    <form id="loginForm" class="auth-form" onsubmit="handleLoginSubmit(event)">
      <div class="auth-field">
        <label>Email</label>
        <div class="auth-input-wrap">
          <i class="fas fa-envelope"></i>
          <input type="email" id="loginEmail" placeholder="you@example.com" required>
        </div>
      </div>

      <div class="auth-field">
        <label>Password</label>
        <div class="auth-input-wrap">
          <i class="fas fa-lock"></i>
          <input type="password" id="loginPassword" placeholder="Enter your password" required>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-full auth-submit-btn">
        <i class="fas fa-sign-in-alt"></i> Login
      </button>
    </form>

    <!-- SIGNUP FORM -->
    <form id="signupForm" class="auth-form" style="display:none;" onsubmit="handleSignupSubmit(event)">
      <div class="auth-field">
        <label>Full Name</label>
        <div class="auth-input-wrap">
          <i class="fas fa-user"></i>
          <input type="text" id="signupName" placeholder="e.g. Luzayna Rahman" required>
        </div>
      </div>

      <div class="auth-field">
        <label>Email</label>
        <div class="auth-input-wrap">
          <i class="fas fa-envelope"></i>
          <input type="email" id="signupEmail" placeholder="you@example.com" required>
        </div>
      </div>

      <div class="auth-field">
        <label>Password</label>
        <div class="auth-input-wrap">
          <i class="fas fa-lock"></i>
          <input type="password" id="signupPassword" placeholder="Min 6 characters" minlength="6" required>
        </div>
      </div>

      <div class="auth-field">
        <label>Phone <span class="auth-optional">(optional)</span></label>
        <div class="auth-input-wrap">
          <i class="fas fa-phone"></i>
          <input type="tel" id="signupPhone" placeholder="+880 1712-345678">
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-full auth-submit-btn">
        <i class="fas fa-user-plus"></i> Create Account
      </button>
    </form>

    <!-- OR DIVIDER -->
    <div class="auth-divider">
      <span>or continue with</span>
    </div>

    <!-- GOOGLE BUTTON -->
    <button class="auth-google-btn" onclick="handleGoogleSignIn()" type="button">
      <svg width="18" height="18" viewBox="0 0 48 48" style="flex-shrink:0;">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      <span>Continue with Google</span>
    </button>

    <!-- DEMO BUTTON -->
    <div class="auth-demo-wrap">
      <div class="auth-demo-divider">
        <span>Or</span>
      </div>
      <button type="button" class="auth-demo-btn" onclick="DemoMode.start()">
        <i class="fas fa-flask"></i>
        <span>Try Demo Without Signing Up</span>
      </button>
      <p class="auth-demo-hint">
        Explore all features with sample data — no account needed
      </p>
    </div>

    <!-- GUEST LINK -->
    <button class="auth-guest-link" onclick="closeModal('loginModal'); showPage('home');" type="button">
      Continue as Guest
    </button>
  `;

  // Tab switching
  const tabs = modal.querySelectorAll('.auth-tab');
  const loginForm = modal.querySelector('#loginForm');
  const signupForm = modal.querySelector('#signupForm');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isLogin = tab.dataset.auth === 'login';
      loginForm.style.display = isLogin ? 'block' : 'none';
      signupForm.style.display = isLogin ? 'none' : 'block';
    });
  });
}

/* ============================================================ */
/* LOGIN / SIGNUP                                                */
/* ============================================================ */
function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showToast('Please fill all fields');
    return;
  }

  const existingUser = Storage.get(APP.STORAGE_KEYS.USER, null);
  const displayName = (existingUser && existingUser.email === email)
    ? existingUser.name
    : email.split('@')[0];

  const user = existingUser && existingUser.email === email
    ? { ...existingUser }
    : buildNewUser({ name: displayName, email });

  const token = 'mock_' + Date.now();

  APP.user = user;
  APP.token = token;
  localStorage.setItem(APP.STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(user));

  closeModal('loginModal');
  showToast('Welcome back, ' + user.name);

  refreshDrawer();
  if (APP.currentPage === 'profile' && typeof renderProfile === 'function') {
    renderProfile();
  }
  updateCartBadge();
  updateNotifBadge();
}

function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const phone = document.getElementById('signupPhone')?.value?.trim() || null;

  if (!name || !email || !password) {
    showToast('Please fill all fields');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters');
    return;
  }

  const user = buildNewUser({ name, email, phone });
  const token = 'mock_' + Date.now();

  APP.user = user;
  APP.token = token;
  localStorage.setItem(APP.STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(user));

  closeModal('loginModal');
  showToast('Welcome to PetCare, ' + name);

  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  refreshDrawer();
  if (APP.currentPage === 'profile' && typeof renderProfile === 'function') {
    renderProfile();
  }
  updateCartBadge();
  updateNotifBadge();
}

/* ============================================================ */
/* GOOGLE SIGN-IN (Demo)                                         */
/* ============================================================ */
function handleGoogleSignIn() {
  // Real Google OAuth using Google Identity Services
  if (typeof google === 'undefined' || !google.accounts) {
    showToast('Google Sign-In loading... please wait');
    setTimeout(() => {
      if (typeof google !== 'undefined' && google.accounts) {
        handleGoogleSignIn();
      } else {
        showToast('Google Sign-In unavailable. Check connection.');
      }
    }, 1000);
    return;
  }

  try {
    // ⭐ Client ID
    const CLIENT_ID = '76151764783-cqnfet7c1gqlh1armjrj4kmnagcdrjkj.apps.googleusercontent.com';

    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'openid email profile',
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          })
          .then(res => res.json())
          .then(profile => {
            handleGoogleUserProfile(profile);
          })
          .catch(err => {
            console.error('Google profile fetch failed:', err);
            showToast('Could not fetch Google profile');
          });
        }
      },
      error_callback: (err) => {
        console.error('Google OAuth error:', err);
        if (err && err.type === 'popup_closed') {
          showToast('Sign-in cancelled');
        } else {
          showToast('Google Sign-In failed');
        }
      }
    });

    client.requestAccessToken();
  } catch (err) {
    console.error('Google Sign-In error:', err);
    showToast('Google Sign-In unavailable');
  }
}


/* ============================================================ */
/* HANDLE GOOGLE USER PROFILE                                    */
/* ============================================================ */
function handleGoogleUserProfile(profile) {
  if (!profile || !profile.email) {
    showToast('Invalid Google response');
    return;
  }

  // Build real user from Google data
  const user = buildNewUser({
    name: profile.name || profile.email.split('@')[0],
    email: profile.email,
    phone: null
  });

  // Add Google avatar if available
  if (profile.picture) {
    user.avatar = profile.picture;
  }

  // Mark as Google user
  user.provider = 'google';
  user.googleId = profile.sub;
  user.emailVerified = profile.email_verified || false;

  const token = 'google_real_' + Date.now() + '_' + profile.sub;

  // Save to APP state
  APP.user = user;
  APP.token = token;

  localStorage.setItem(APP.STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(user));

  // Close modal + success
  closeModal('loginModal');
  showToast(`Welcome, ${user.name.split(' ')[0]}! 🎉`);

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Refresh everything
  if (typeof refreshDrawer === 'function') refreshDrawer();
  if (APP.currentPage === 'profile' && typeof renderProfile === 'function') {
    renderProfile();
  }
  if (typeof updateCartBadge === 'function') updateCartBadge();
  if (typeof updateNotifBadge === 'function') updateNotifBadge();
}




/* ============================================================ */
/* BUILD NEW USER OBJECT                                         */
/* ============================================================ */
function buildNewUser({ name, email, phone = null }) {
  return {
    id: 'user_self',
    name,
    email,
    phone,
    avatar: null,
    coverPhoto: null,
    location: '',
    bio: '',

    roles: ['petOwner'],
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

    ownedStores: [],

    followers: 0,
    following: 0,
    reviewCount: 0,
    rating: 0
  };
}

/* ============================================================ */
/* AUTO-INIT + EXPORT                                            */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Drawer.init();
});

// Export for global acces
window.handleGoogleUserProfile = handleGoogleUserProfile;
window.Drawer = Drawer;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.toggleDrawer = toggleDrawer;
window.refreshDrawer = refreshDrawer;
window.handleExportData = handleExportData;
window.handleClearData = handleClearData;
window.renderAboutModal = renderAboutModal;
window.renderLoginModal = renderLoginModal;
window.handleLoginSubmit = handleLoginSubmit;
window.handleSignupSubmit = handleSignupSubmit;
window.handleGoogleSignIn = handleGoogleSignIn;

console.log('PetCare Drawer loaded');