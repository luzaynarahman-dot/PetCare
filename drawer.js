// ============================================ //
// DRAWER (Hamburger Menu) — v2.0               //
// Real app behavior: dynamic user state        //
// ============================================ //

const Drawer = {
  isOpen: false,

  // ---------- INIT ----------
  init() {
    this.cacheElements();
    this.attachEvents();
    this.refresh(); // initial state
  },

  cacheElements() {
    this.drawer = document.getElementById('sideDrawer');
    this.backdrop = document.getElementById('drawerBackdrop');
    this.hamburgerBtn = document.getElementById('hamburgerBtn');
    this.signinBanner = document.getElementById('drawerSigninBanner');
    this.signinBannerBtn = document.getElementById('drawerSigninBannerBtn');
    this.avatarEl = document.getElementById('drawerAvatar');
    this.nameEl = document.getElementById('drawerUserName');
    this.emailEl = document.getElementById('drawerUserEmail');
    this.authBtn = document.getElementById('drawerAuthBtn');
    this.authText = document.getElementById('drawerAuthText');
    this.authIcon = document.getElementById('drawerAuthIcon');
    this.darkToggle = document.getElementById('drawerDarkMode');
  },

  // ---------- EVENTS ----------
  attachEvents() {
    // Open
    this.hamburgerBtn?.addEventListener('click', () => this.toggle());

    // Close on backdrop
    this.backdrop?.addEventListener('click', () => this.close());

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Sign-in banner button
    this.signinBannerBtn?.addEventListener('click', () => {
      this.close();
      setTimeout(() => {
        document.getElementById('loginModal')?.classList.add('active');
      }, 300);
    });

    // Drawer items (delegated)
    this.drawer?.addEventListener('click', (e) => {
      const item = e.target.closest('[data-drawer-action]');
      if (!item) return;
      const action = item.dataset.drawerAction;
      this.handleAction(action, item);
    });

    // Dark mode toggle
    this.darkToggle?.addEventListener('change', (e) => {
      document.body.classList.toggle('dark-mode', e.target.checked);
      localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
      // sync profile settings checkbox
      const profileToggle = document.getElementById('settingsDarkMode');
      if (profileToggle) profileToggle.checked = e.target.checked;
    });

    // Auth button (bottom)
    this.authBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const loggedIn = !!localStorage.getItem('token');
      if (loggedIn) {
        this.close();
        setTimeout(() => this.logout(), 300);
      } else {
        this.close();
        setTimeout(() => {
          document.getElementById('loginModal')?.classList.add('active');
        }, 300);
      }
    });
  },

  // ---------- OPEN / CLOSE / TOGGLE ----------
  open() {
    this.isOpen = true;
    this.drawer?.classList.add('active');
    this.backdrop?.classList.add('active');
    this.hamburgerBtn?.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.drawer?.setAttribute('aria-hidden', 'false');
  },

  close() {
    this.isOpen = false;
    this.drawer?.classList.remove('active');
    this.backdrop?.classList.remove('active');
    this.hamburgerBtn?.classList.remove('active');
    document.body.style.overflow = '';
    this.drawer?.setAttribute('aria-hidden', 'true');
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  // ---------- REFRESH (auth state) ----------
  refresh() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const loggedIn = !!(token && user);

    // --- User header ---
    if (loggedIn) {
      const initial = (user.name || 'U').charAt(0).toUpperCase();
      this.avatarEl.textContent = initial;
      this.avatarEl.classList.add('logged-in');
      this.nameEl.textContent = user.name || 'User';
      this.emailEl.textContent = user.email || '';
    } else {
      this.avatarEl.textContent = '?';
      this.avatarEl.classList.remove('logged-in');
      this.nameEl.textContent = 'Welcome';
      this.emailEl.textContent = 'Sign in to continue';
    }

    // --- Sign-in banner ---
    if (loggedIn) {
      this.signinBanner?.classList.add('hidden');
    } else {
      this.signinBanner?.classList.remove('hidden');
    }

    // --- Auth button ---
    if (loggedIn) {
      this.authText.textContent = 'Logout';
      this.authIcon.className = 'fas fa-sign-out-alt';
      this.authBtn.classList.add('logged-in');
    } else {
      this.authText.textContent = 'Login / Sign Up';
      this.authIcon.className = 'fas fa-sign-in-alt';
      this.authBtn.classList.remove('logged-in');
    }

    // --- Locked items (wishlist/orders) ---
    document.querySelectorAll('.drawer-item[data-requires-auth="true"]').forEach(item => {
      item.classList.toggle('locked', !loggedIn);
    });

    // --- Dark mode sync ---
    if (this.darkToggle) {
      this.darkToggle.checked = document.body.classList.contains('dark-mode');
    }

    // --- Counts ---
    this.refreshCounts();
  },

  // ---------- COUNTS ----------
  refreshCounts() {
    // Wishlist
    const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wlBadge = document.getElementById('drawerWishlistCount');
    if (wlBadge) {
      wlBadge.textContent = wl.length;
      wlBadge.classList.toggle('hidden', wl.length === 0);
    }

    // Orders
    const orders = JSON.parse(localStorage.getItem('allOrders') || '[]');
    const orderBadge = document.getElementById('drawerOrderCount');
    if (orderBadge) {
      orderBadge.textContent = orders.length;
      orderBadge.classList.toggle('hidden', orders.length === 0);
    }

    // Notifications
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const unread = notifs.filter(n => !n.read).length;
    const notifBadge = document.getElementById('drawerNotifCount');
    if (notifBadge) {
      notifBadge.textContent = unread;
      notifBadge.classList.toggle('hidden', unread === 0);
    }
  },

  // ---------- ACTIONS ----------
  handleAction(action, item) {
    const requiresAuth = item.dataset.requiresAuth === 'true';
    const loggedIn = !!localStorage.getItem('token');

    // Locked items → prompt login
    if (requiresAuth && !loggedIn) {
      this.close();
      setTimeout(() => {
        showToast('Please sign in first');
        document.getElementById('loginModal')?.classList.add('active');
      }, 300);
      return;
    }

    switch (action) {
      case 'wishlist':
        this.close();
        setTimeout(() => {
          updateWishlistUI();
          document.getElementById('wishlistModal')?.classList.add('active');
        }, 300);
        break;

      case 'orders':
        this.close();
        setTimeout(() => {
          showPage('profile');
          setTimeout(() => {
            document.getElementById('orderFilter')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        }, 300);
        break;

      case 'track':
        this.close();
        setTimeout(() => {
          document.getElementById('trackingId').value = '';
          document.getElementById('trackingResult').innerHTML = '';
          document.getElementById('trackingModal')?.classList.add('active');
        }, 300);
        break;

      case 'notifications':
        this.close();
        setTimeout(() => {
          document.getElementById('notifIcon')?.click();
        }, 300);
        break;

      case 'settings':
        this.close();
        setTimeout(() => {
          showPage('profile');
          setTimeout(() => {
            document.getElementById('profileSettingsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 400);
        }, 300);
        break;

      case 'export':
        this.close();
        setTimeout(() => {
          document.getElementById('exportDataBtn')?.click();
        }, 300);
        break;

      case 'clear':
        this.close();
        setTimeout(() => {
          document.getElementById('clearDataBtn')?.click();
        }, 300);
        break;

      case 'about':
        this.close();
        setTimeout(() => {
          document.getElementById('aboutModal')?.classList.add('active');
        }, 300);
        break;

      case 'auth':
        // handled separately
        break;

      case 'darkmode':
        // handled by toggle, ignore row click
        break;
    }
  },

  // ---------- LOGOUT ----------
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out');
    this.refresh();
    if (typeof renderProfile === 'function') renderProfile();
    setTimeout(() => {
      document.getElementById('loginModal')?.classList.add('active');
    }, 400);
  }
};

// ============================================ //
// AUTO-INIT when DOM ready                     //
// ============================================ //
document.addEventListener('DOMContentLoaded', () => {
  Drawer.init();
});

// ============================================ //
// GLOBAL REFRESH HELPER                        //
// (call after login/logout/cart/etc)           //
// ============================================ //
function refreshDrawer() {
  if (typeof Drawer !== 'undefined') Drawer.refresh();
}