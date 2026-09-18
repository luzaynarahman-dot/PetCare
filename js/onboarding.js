/* ============================================================ */
/* PETCARE v3.0 — ONBOARDING TOUR                                */
/* First-time user welcome flow                                  */
/* ============================================================ */

const Onboarding = {
  STORAGE_KEY: 'pc_onboarding_done',
  currentStep: 0,
  totalSteps: 4,

  /* ---------- State ---------- */
  isDone() {
    try {
      return localStorage.getItem(this.STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  },

  markDone() {
    try {
      localStorage.setItem(this.STORAGE_KEY, 'true');
    } catch (e) {}
  },

  reset() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {}
  },

  /* ---------- Main Open ---------- */
  open() {
    if (this.isDone()) return;

    const modal = document.getElementById('onboardingModal');
    if (!modal) return;

    this.currentStep = 0;
    this.render();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    const modal = document.getElementById('onboardingModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    this.markDone();
  },

  next() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.render();
    } else {
      this.finish();
    }
  },

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  },

  skip() {
    if (confirm('Skip the tour? You can always explore on your own.')) {
      this.close();
    }
  },

  finish() {
    this.close();

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (typeof showToast === 'function') {
      showToast('Welcome to PetCare! 🐾');
    }
  },

  /* ---------- Render ---------- */
  render() {
    const modal = document.getElementById('onboardingModal');
    if (!modal) return;

    const steps = this.getSteps();
    const step = steps[this.currentStep];
    const progress = ((this.currentStep + 1) / this.totalSteps) * 100;

    modal.innerHTML =
      '<div class="ob-container">' +

        // Skip button (top right)
        '<button class="ob-skip" onclick="Onboarding.skip()">' +
          'Skip' +
        '</button>' +

        // Illustration
        '<div class="ob-illustration">' +
          '<div class="ob-icon">' +
            '<i class="fas ' + step.icon + '"></i>' +
          '</div>' +
          (step.emoji ? '<div class="ob-emoji">' + step.emoji + '</div>' : '') +
        '</div>' +

        // Content
        '<div class="ob-content">' +
          '<p class="ob-step-counter">' +
            'Step ' + (this.currentStep + 1) + ' of ' + this.totalSteps +
          '</p>' +
          '<h2 class="ob-title">' + step.title + '</h2>' +
          '<p class="ob-subtitle">' + step.subtitle + '</p>' +

          (step.features ?
            '<ul class="ob-features">' +
              step.features.map(function(f) {
                return '<li class="ob-feature">' +
                  '<i class="fas ' + f.icon + '"></i>' +
                  '<span>' + f.text + '</span>' +
                '</li>';
              }).join('') +
            '</ul>'
          : '') +
        '</div>' +

        // Progress dots
        '<div class="ob-dots">' +
          steps.map(function(s, i) {
            return '<div class="ob-dot' +
              (i === Onboarding.currentStep ? ' active' : '') +
              (i < Onboarding.currentStep ? ' done' : '') +
            '"></div>';
          }).join('') +
        '</div>' +

        // Progress bar
        '<div class="ob-progress">' +
          '<div class="ob-progress-fill" style="width:' + progress + '%;"></div>' +
        '</div>' +

        // Actions
        '<div class="ob-actions">' +
          (this.currentStep > 0 ?
            '<button class="ob-btn ob-btn-ghost" onclick="Onboarding.prev()">' +
              '<i class="fas fa-arrow-left"></i> Back' +
            '</button>'
          :
            '<div style="flex:1;"></div>'
          ) +
          '<button class="ob-btn ob-btn-primary" onclick="Onboarding.next()">' +
            (this.currentStep === this.totalSteps - 1 ?
              'Get Started <i class="fas fa-paw"></i>'
            :
              'Next <i class="fas fa-arrow-right"></i>'
            ) +
          '</button>' +
        '</div>' +

      '</div>';
  },

  /* ---------- Steps Content ---------- */
  getSteps() {
    return [
      {
        icon: 'fa-paw',
        emoji: '🐾',
        title: 'Welcome to PetCare',
        subtitle: 'Your all-in-one companion for happy, healthy pets.',
        features: [
          { icon: 'fa-heart-pulse', text: 'Track health & vaccinations' },
          { icon: 'fa-calendar-check', text: 'Book vet appointments' },
          { icon: 'fa-shopping-bag', text: 'Shop for your pets' },
          { icon: 'fa-camera-retro', text: 'Share memories' }
        ]
      },
      {
        icon: 'fa-user-plus',
        emoji: '👤',
        title: 'Sign in to unlock everything',
        subtitle: 'Save your pets, orders, and memories across sessions.',
        features: [
          { icon: 'fa-lock', text: 'Secure sign-in with any email' },
          { icon: 'fa-mobile-screen', text: 'Works offline as an app' },
          { icon: 'fa-paw', text: 'Multi-pet support' }
        ]
      },
      {
        icon: 'fa-shield-heart',
        emoji: '💚',
        title: 'Track. Shop. Connect.',
        subtitle: 'Everything in one beautiful app — no more juggling tabs.',
        features: [
          { icon: 'fa-notes-medical', text: 'Health logs & weight charts' },
          { icon: 'fa-store', text: 'Verified stores & vets' },
          { icon: 'fa-triangle-exclamation', text: 'Emergency SOS & first-aid' }
        ]
      },
      {
        icon: 'fa-rocket',
        emoji: '🚀',
        title: 'Ready to begin?',
        subtitle: "Let's get started. Add your first pet to see PetCare in action.",
        features: [
          { icon: 'fa-plus', text: 'Tap the + button to add a pet' },
          { icon: 'fa-bookmark', text: 'Explore Memory for tips' },
          { icon: 'fa-moon', text: 'Try dark mode in settings' }
        ]
      }
    ];
  }
};

/* ============================================================ */
/* GLOBAL HELPERS                                                */
/* ============================================================ */
function openOnboarding() {
  Onboarding.open();
}

function closeOnboarding() {
  Onboarding.close();
}

function resetOnboarding() {
  Onboarding.reset();
  if (typeof showToast === 'function') {
    showToast('Onboarding reset. Reload to see tour.');
  }
}

/* ============================================================ */
/* AUTO-SHOW ON FIRST VISIT                                      */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  // Wait for app to initialize
  setTimeout(function() {
    if (!Onboarding.isDone() && typeof showPage === 'function') {
      // Only show if home page is active
      if (APP && APP.currentPage === 'home') {
        Onboarding.open();
      }
    }
  }, 1200);
});

/* ============================================================ */
/* EXPORT                                                        */
/* ============================================================ */
window.Onboarding = Onboarding;
window.openOnboarding = openOnboarding;
window.closeOnboarding = closeOnboarding;
window.resetOnboarding = resetOnboarding;

console.log('PetCare Onboarding loaded');