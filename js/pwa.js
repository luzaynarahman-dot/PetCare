/* ============================================================ */
/* PETCARE v3.0 — PWA BOOTSTRAP                                  */
/* Service worker registration + install prompt                  */
/* ============================================================ */

/* ============================================================ */
/* 1. REGISTER SERVICE WORKER                                    */
/* ============================================================ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60000);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[PWA] New service worker installing');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version available');
              showUpdateToast();
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

/* ============================================================ */
/* 2. HANDLE INSTALL PROMPT                                      */
/* ============================================================ */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt available');

  // Prevent automatic mini-infobar
  e.preventDefault();

  // Save event for later use
  deferredPrompt = e;

  // Show custom install button
  showInstallButton();
});

/* ============================================================ */
/* 3. SHOW INSTALL BUTTON                                        */
/* ============================================================ */
function showInstallButton() {
  // Don't show if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return;
  }

  // Don't show if dismissed recently (within 3 days)
  const dismissed = localStorage.getItem('pc_pwa_dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed, 10);
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    if (Date.now() - dismissedTime < threeDays) {
      return;
    }
  }

  // Remove existing banner
  const existing = document.getElementById('pwaInstallBanner');
  if (existing) existing.remove();

  // Create banner
  const banner = document.createElement('div');
  banner.id = 'pwaInstallBanner';
  banner.className = 'pwa-install-banner';

  banner.innerHTML =
    '<div class="pwa-install-content">' +
      '<div class="pwa-install-icon">' +
        '<i class="fas fa-paw"></i>' +
      '</div>' +
      '<div class="pwa-install-text">' +
        '<p class="pwa-install-title">Install PetCare</p>' +
        '<p class="pwa-install-sub">Add to home screen for the best experience</p>' +
      '</div>' +
      '<button class="pwa-install-btn" id="pwaInstallBtn">Install</button>' +
      '<button class="pwa-install-close" id="pwaInstallClose" aria-label="Close">' +
        '<i class="fas fa-times"></i>' +
      '</button>' +
    '</div>';

  document.body.appendChild(banner);

  // Trigger animation
  requestAnimationFrame(() => {
    banner.classList.add('active');
  });

  // Install button click
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) {
    installBtn.addEventListener('click', () => {
      handleInstallClick();
    });
  }

  // Close button click
  const closeBtn = document.getElementById('pwaInstallClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideInstallBanner();
      localStorage.setItem('pc_pwa_dismissed', Date.now().toString());
    });
  }
}

/* ============================================================ */
/* 4. HANDLE INSTALL CLICK                                       */
/* ============================================================ */
async function handleInstallClick() {
  if (!deferredPrompt) {
    if (typeof showToast === 'function') {
      showToast('App already installed or not supported');
    }
    return;
  }

  // Show install prompt
  deferredPrompt.prompt();

  // Wait for user choice
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[PWA] User choice:', outcome);

  if (outcome === 'accepted') {
    if (typeof showToast === 'function') {
      showToast('🎉 Thanks for installing PetCare!');
    }
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  } else {
    if (typeof showToast === 'function') {
      showToast('Installation cancelled');
    }
  }

  // Clear deferred prompt
  deferredPrompt = null;

  // Hide banner
  hideInstallBanner();
}

/* ============================================================ */
/* 5. HIDE INSTALL BANNER                                        */
/* ============================================================ */
function hideInstallBanner() {
  const banner = document.getElementById('pwaInstallBanner');
  if (!banner) return;

  banner.classList.remove('active');
  setTimeout(() => {
    if (banner.parentNode) banner.remove();
  }, 300);
}

/* ============================================================ */
/* 6. DETECT INSTALLED APP                                       */
/* ============================================================ */
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');

  // Hide banner
  hideInstallBanner();

  // Clear prompt
  deferredPrompt = null;

  // Show toast
  if (typeof showToast === 'function') {
    showToast('🎉 PetCare installed!');
  }
});

/* ============================================================ */
/* 7. UPDATE AVAILABLE TOAST                                     */
/* ============================================================ */
function showUpdateToast() {
  if (typeof showToast !== 'function') return;

  // Show toast with update option
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMessage');
  if (!toast || !msg) return;

  msg.innerHTML =
    'New version available. ' +
    '<button onclick="window.location.reload()" style="background:transparent;color:inherit;border:1px solid currentColor;padding:2px 8px;border-radius:4px;margin-left:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">Reload</button>';

  toast.classList.add('show');

  // Keep visible longer
  setTimeout(() => {
    toast.classList.remove('show');
  }, 8000);
}

/* ============================================================ */
/* 8. STANDALONE MODE DETECTION                                  */
/* ============================================================ */
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

if (isStandalone()) {
  console.log('[PWA] Running in standalone mode');
  document.documentElement.classList.add('pwa-standalone');
}

/* ============================================================ */
/* 9. EXPORT                                                     */
/* ============================================================ */
window.pwaShowInstall = showInstallButton;
window.pwaHideInstall = hideInstallBanner;
window.pwaIsStandalone = isStandalone;

console.log('PetCare PWA loaded');