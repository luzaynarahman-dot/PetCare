/* ============================================================ */
/* PETCARE v3.0 — DEMO MODE (RICHEST v2)                         */
/* One-click premium demo with full feature seeding              */
/* ============================================================ */

const DemoMode = {
  STORAGE_KEY: 'pc_demo_mode',
  DEMO_STARTED_KEY: 'pc_demo_started',
  DEMO_VERSION_KEY: 'pc_demo_version',
  CURRENT_VERSION: '2.0',

  isActive() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  },

  markActive() {
    try {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      localStorage.setItem(this.DEMO_STARTED_KEY, Date.now().toString());
      localStorage.setItem(this.DEMO_VERSION_KEY, this.CURRENT_VERSION);
    } catch (e) {}
  },

  clearActive() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.DEMO_STARTED_KEY);
      localStorage.removeItem(this.DEMO_VERSION_KEY);
    } catch (e) {}
  },

  getDemoAge() {
    try {
      const started = localStorage.getItem(this.DEMO_STARTED_KEY);
      if (!started) return null;
      return Math.floor((Date.now() - parseInt(started, 10)) / 1000 / 60);
    } catch (e) {
      return null;
    }
  },

  /* ============================================================ */
  /* LOAD RICH DEMO DATA                                           */
  /* ============================================================ */
  async load() {
    if (!window.DEMO_DATA) {
      console.error('[Demo] DEMO_DATA not loaded');
      if (typeof showToast === 'function') showToast('Demo data unavailable');
      return false;
    }

    const D = window.DEMO_DATA;

    try {
      /* ---------- USER & AUTH ---------- */
      const token = 'demo_' + Date.now();
      if (window.APP) {
        window.APP.user = { ...D.user };
        window.APP.token = token;
      }
      localStorage.setItem('pc_token', token);
      localStorage.setItem('pc_user', JSON.stringify(D.user));

      /* ---------- PETS ---------- */
      if (window.APP) {
        window.APP.pets = [...D.pets];
        window.APP.activePetId = D.activePetId;
      }
      localStorage.setItem('pc_pets', JSON.stringify(D.pets));
      localStorage.setItem('pc_activePetId', JSON.stringify(D.activePetId));

      /* ---------- ORDERS ---------- */
      if (window.APP) window.APP.orders = [...D.orders];
      localStorage.setItem('pc_orders', JSON.stringify(D.orders));

      /* ---------- APPOINTMENTS ---------- */
      if (window.APP) window.APP.appointments = [...D.appointments];
      localStorage.setItem('pc_appointments', JSON.stringify(D.appointments));

      /* ---------- NOTIFICATIONS ---------- */
      if (window.APP) window.APP.notifications = [...D.notifications];
      localStorage.setItem('pc_notifications', JSON.stringify(D.notifications));

      /* ---------- CART ---------- */
      if (window.APP) window.APP.cart = [...D.cart];
      localStorage.setItem('pc_cart', JSON.stringify(D.cart));

      /* ---------- WISHLIST ---------- */
      if (window.APP) window.APP.wishlist = [...D.wishlist];
      localStorage.setItem('pc_wishlist', JSON.stringify(D.wishlist));

      /* ---------- HEALTH DATA ---------- */
      localStorage.setItem('pc_healthLog', JSON.stringify(D.healthLogs));
      localStorage.setItem('pc_vaccinations', JSON.stringify(D.vaccinations));
      localStorage.setItem('pc_medications', JSON.stringify(D.medications));
      localStorage.setItem('pc_reminders', JSON.stringify(D.reminders));

      /* ---------- DAILY CARE (multi-pet) ---------- */
      localStorage.setItem('pc_dailyCare', JSON.stringify(D.dailyCare));

      /* ---------- ⭐ CARE HISTORY (Real Streak Data) ---------- */
      if (D.careHistory) {
        localStorage.setItem('pc_careHistory', JSON.stringify(D.careHistory));
      }

      /* ---------- ⭐ REAL STREAK ---------- */
      // Calculate for each pet and store
      if (typeof calculateRealStreak === 'function' && D.pets) {
        // Set active pet's streak
        const activeStreak = calculateRealStreak(D.activePetId);
        localStorage.setItem('pc_weekStreak', JSON.stringify(activeStreak));
      } else {
        // Fallback — Luna has 14-day streak
        localStorage.setItem('pc_weekStreak', JSON.stringify(14));
      }

      /* ---------- ⭐ SOS HISTORY ---------- */
      if (D.sosHistory) {
        localStorage.setItem('pc_sosHistory', JSON.stringify(D.sosHistory));
      }

      /* ---------- CUSTOM CARE (multi-pet) ---------- */
      if (D.customCare) {
        localStorage.setItem('pc_customCare', JSON.stringify(D.customCare));
      }

      /* ---------- FAVORITE STORES ---------- */
      localStorage.setItem('pc_favoriteStores', JSON.stringify(D.favoriteStores));

      /* ---------- SAVED POSTS ---------- */
      if (D.savedPosts) {
        localStorage.setItem('pc_saved_posts', JSON.stringify(D.savedPosts));
      }

      /* ---------- MEMORIES (posts) ---------- */
      if (window.MEMORIES_DATA && Array.isArray(window.MEMORIES_DATA)) {
        const existingIds = new Set(window.MEMORIES_DATA.map(p => p.id));
        const newPosts = D.demoPosts.filter(p => !existingIds.has(p.id));
        window.MEMORIES_DATA = [...newPosts, ...window.MEMORIES_DATA];
        localStorage.setItem('pc_memories', JSON.stringify(window.MEMORIES_DATA));
      } else {
        localStorage.setItem('pc_memories', JSON.stringify(D.demoPosts));
      }

      /* ---------- FOLLOWING MAP ---------- */
      if (D.followingMap) {
        localStorage.setItem('pc_following_map', JSON.stringify(D.followingMap));
      }

      /* ---------- ⭐ USER CREATED STORE ---------- */
      if (D.userStore) {
        // Add to STORES if not already there
        if (window.STORES && Array.isArray(window.STORES)) {
          const exists = window.STORES.find(s => s.id === D.userStore.id);
          if (!exists) {
            window.STORES.push(D.userStore);
          }
        }
      }

      /* ---------- ⭐ LOCATION (for vets) ---------- */
      localStorage.setItem('pc_userLat', JSON.stringify(21.4272));
      localStorage.setItem('pc_userLng', JSON.stringify(92.0058));
      localStorage.setItem('pc_lastLocation', JSON.stringify("Kolatoli Beach Road, Cox's Bazar"));

      /* ---------- ⭐ NOTIFICATION PREFS ---------- */
      localStorage.setItem('pc_notifPrefs', JSON.stringify({
        push: true,
        email: false,
        reminders: true
      }));

      /* ---------- MARK DEMO ACTIVE ---------- */
      this.markActive();

      return true;
    } catch (err) {
      console.error('[Demo] Load failed:', err);
      if (typeof showToast === 'function') showToast('Demo load failed');
      return false;
    }
  },

  /* ============================================================ */
  /* START DEMO                                                    */
  /* ============================================================ */
  async start() {
    if (typeof closeAllModals === 'function') {
      closeAllModals();
    }

    // Show loading overlay
    this.showLoadingOverlay();

    // Simulate realistic loading with staged messages
    await this.sleep(400);
    this.updateLoadingOverlay('Preparing your pets...');

    await this.sleep(300);
    this.updateLoadingOverlay('Loading health records...');

    const loaded = await this.load();

    if (!loaded) {
      this.hideLoadingOverlay();
      return;
    }

    await this.sleep(400);
    this.updateLoadingOverlay('Restoring care streak...');

    await this.sleep(300);
    this.updateLoadingOverlay('Opening Memories feed...');

    await this.sleep(300);

    // Success animation
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#3A4A3A', '#FFD966', '#FF9B50', '#D88B9E', '#9B8BB4']
      });
    }

    this.updateLoadingOverlay('Ready! 🎉');

    setTimeout(() => {
      window.location.reload();
    }, 1100);
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /* ============================================================ */
  /* EXIT DEMO                                                     */
  /* ============================================================ */
  async exit() {
    const shouldExit = confirm(
      'Exit demo mode?\n\n' +
      '• All demo data will be cleared\n' +
      '• Your theme preference will be saved\n' +
      '• This cannot be undone\n\n' +
      'Continue?'
    );

    if (!shouldExit) return;

    this.clearActive();

    // Preserve important preferences
    const preservedTheme = localStorage.getItem('pc_theme');
    const preservedOnboarding = localStorage.getItem('pc_onboarding_done');

    // Clear everything
    localStorage.clear();

    // Restore preserved
    if (preservedTheme) localStorage.setItem('pc_theme', preservedTheme);
    if (preservedOnboarding) localStorage.setItem('pc_onboarding_done', preservedOnboarding);

    if (typeof showToast === 'function') showToast('Exiting demo...');
    setTimeout(() => window.location.reload(), 700);
  },

  /* ============================================================ */
  /* LOADING OVERLAY                                               */
  /* ============================================================ */
  showLoadingOverlay() {
    const existing = document.getElementById('demoLoadingOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'demoLoadingOverlay';
    overlay.className = 'demo-loading-overlay';

    overlay.innerHTML = `
      <div class="demo-loading-content">
        <div class="demo-loading-icon">
          <i class="fas fa-flask"></i>
        </div>
        <h2 class="demo-loading-title">Preparing your demo</h2>
        <p class="demo-loading-sub" id="demoLoadingSub">
          Loading 3 pets, 48 health logs, 8 orders...
        </p>
        <div class="demo-loading-bar">
          <div class="demo-loading-bar-fill"></div>
        </div>
        <p class="demo-loading-hint">
          <i class="fas fa-info-circle"></i>
          Sample data · Feel free to explore
        </p>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
  },

  updateLoadingOverlay(text) {
    const sub = document.getElementById('demoLoadingSub');
    if (sub) {
      sub.style.opacity = '0';
      setTimeout(() => {
        sub.textContent = text;
        sub.style.opacity = '1';
      }, 150);
    }
  },

  hideLoadingOverlay() {
    const overlay = document.getElementById('demoLoadingOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  },

  /* ============================================================ */
  /* DEMO BANNER                                                   */
  /* ============================================================ */
  showBanner() {
    if (!this.isActive()) return;

    const existing = document.getElementById('demoModeBanner');
    if (existing) existing.remove();

    const age = this.getDemoAge();
    const ageText = age !== null ? `Active for ${age}m` : 'Sample data loaded';

    const banner = document.createElement('div');
    banner.id = 'demoModeBanner';
    banner.className = 'demo-mode-banner';

    banner.innerHTML = `
      <div class="demo-banner-content">
        <div class="demo-banner-icon">
          <i class="fas fa-flask"></i>
        </div>
        <div class="demo-banner-text">
          <p class="demo-banner-title">Demo Mode Active</p>
          <p class="demo-banner-sub">${ageText} · Explore freely</p>
        </div>
        <button class="demo-banner-exit" onclick="DemoMode.exit()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Exit</span>
        </button>
      </div>
    `;

    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('active'));

    // Update age every minute
    setInterval(() => {
      const sub = banner.querySelector('.demo-banner-sub');
      if (sub && this.isActive()) {
        const newAge = this.getDemoAge();
        if (newAge !== null) {
          sub.textContent = `Active for ${newAge}m · Explore freely`;
        }
      }
    }, 60000);
  },

  /* ============================================================ */
  /* RESET & RELOAD (Advanced)                                     */
  /* ============================================================ */
  async reset() {
    if (!this.isActive()) return;

    const shouldReset = confirm(
      'Reset demo data?\n\n' +
      '• All your changes will be lost\n' +
      '• Fresh demo data will be loaded\n' +
      '• Page will reload\n\n' +
      'Continue?'
    );

    if (!shouldReset) return;

    if (typeof showToast === 'function') {
      showToast('Resetting demo...');
    }

    // Preserve theme + onboarding
    const preservedTheme = localStorage.getItem('pc_theme');
    const preservedOnboarding = localStorage.getItem('pc_onboarding_done');

    localStorage.clear();

    if (preservedTheme) localStorage.setItem('pc_theme', preservedTheme);
    if (preservedOnboarding) localStorage.setItem('pc_onboarding_done', preservedOnboarding);

    // Reload with demo
    await this.load();
    setTimeout(() => window.location.reload(), 500);
  }
};

/* ============================================================ */
/* AUTO-INIT                                                     */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  if (DemoMode.isActive()) {
    setTimeout(() => DemoMode.showBanner(), 700);
  }
});

/* ============================================================ */
/* EXPORT                                                        */
/* ============================================================ */
window.DemoMode = DemoMode;
window.startDemo = function () { DemoMode.start(); };
window.exitDemo = function () { DemoMode.exit(); };
window.resetDemo = function () { DemoMode.reset(); };

console.log('PetCare Demo loaded — RICHEST mode ready');
