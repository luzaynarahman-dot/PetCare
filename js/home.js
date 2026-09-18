/* ============================================================ */
/* PETCARE v3.0 — HOME PAGE                                      */
/* ============================================================ */

let currentTipIndex = 0;

/* ============================================================ */
/* SAFETY CHECK — Data Availability                              */
/* ============================================================ */
function isDataReady() {
  return typeof NEARBY_VETS !== 'undefined' &&
         typeof FOSTER_PETS !== 'undefined' &&
         typeof DAILY_TIPS !== 'undefined' &&
         typeof CATEGORIES !== 'undefined';
}

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderHome() {
  const page = document.getElementById('page-home');
  if (!page) return;

  // ⭐ SAFETY: Check data ready
  if (!isDataReady()) {
    console.warn('[Home] Data not ready yet, retrying...');
    setTimeout(renderHome, 200);
    return;
  }

  const activePet = getActivePet();
  const petName = activePet ? activePet.name : 'Luna';

  page.innerHTML = `
    <div class="page-container">

      <!-- HERO CARD -->
      <section class="hero-card">
        <div class="hero-card-body">
          <div class="hero-card-text">
            <h2 class="hero-greeting">${getGreetingText()} ${petName}</h2>
            <p class="hero-sub">How is our little <strong>${petName}</strong> doing today? <i class="far fa-heart" style="color:var(--pc-pink);"></i></p>
            <button class="hero-cta-btn" onclick="showPage('care')">
              <i class="fas fa-paw"></i> Check In Today
            </button>
          </div>
          <div class="hero-illustration">
            <img src="assets/illustrations/hero-dog-cat.png" alt="Pets" onerror="this.style.opacity='0'">
          </div>
        </div>
      </section>

      <!-- EMERGENCY SOS -->
      <section class="sos-banner">
        <div class="sos-banner-left">
          <div class="sos-icon-wrap">
            <i class="fas fa-triangle-exclamation"></i>
          </div>
          <div>
            <h3>Emergency SOS</h3>
            <p>Report injured, lost or abused animal near you</p>
            ${getActiveSosCount() > 0 ? `
              <span class="sos-active-badge">
                <span class="sos-active-dot"></span>
                ${getActiveSosCount()} active report${getActiveSosCount() > 1 ? 's' : ''}
              </span>
            ` : ''}
          </div>
        </div>
        <div class="sos-banner-actions">
          <button class="sos-btn" onclick="openSosModal()">
            <i class="fas fa-bullhorn"></i> Report
          </button>
          <button class="sos-history-btn" onclick="openSosHistory()" aria-label="History">
            <i class="fas fa-clock-rotate-left"></i>
          </button>
        </div>
      </section>

      <!-- WEEK TIMELINE -->
      <section class="card week-card">
        <div class="week-header">
          <div>
            <h3 class="week-title">
              <i class="fas fa-paw"></i> ${petName}'s Week <i class="far fa-heart" style="color:var(--pc-pink); font-size:12px;"></i>
            </h3>
            <p class="week-subtitle">Keep track of your pet's routine</p>
          </div>
          <span class="week-streak-badge">
            <i class="fas fa-fire"></i> ${getStreak()} day streak
          </span>
        </div>

        <div class="week-timeline" id="weekTimeline">
          ${renderWeekTimeline()}
        </div>

        <div class="week-footer">
          ${renderWeekFooter()}
        </div>
      </section>

      <!-- NEARBY VETS -->
      <section class="card vets-card">
        <div class="card-header">
          <h3><i class="fas fa-hospital"></i> Nearby Emergency Vets</h3>
          <button class="card-link">See all</button>
        </div>
        <div class="vets-list">
          ${renderNearbyVets()}
        </div>
      </section>

      <!-- FIRST-AID -->
      <section class="card firstaid-card">
        <div class="card-header">
          <h3><i class="fas fa-kit-medical"></i> Quick First-Aid</h3>
          <span class="badge badge-warning">3-MIN GUIDES</span>
        </div>
        <div class="firstaid-grid">
          ${renderFirstAidChips()}
        </div>
      </section>

      <!-- MEMORIES PREVIEW -->
      <section class="card memories-card">
        <div class="card-header">
          <h3><i class="fas fa-camera-retro"></i> Memories</h3>
          <button class="card-link" onclick="showPage('memory')">Open</button>
        </div>
        <p class="card-subtitle">Share moments, learn from vets, spread awareness</p>
        <div class="memories-preview-row">
          ${renderMemoriesPreview()}
        </div>
        <div class="memories-footer">
          <span><i class="fas fa-images"></i> ${MEMORIES_DATA.length} posts</span>
          <span><i class="fas fa-user-md"></i> 2 vets</span>
        </div>
      </section>

      <!-- FOSTER -->
      <section class="card foster-card">
        <div class="card-header">
          <h3><i class="fas fa-heart"></i> Foster & Adopt</h3>
          <button class="card-link" onclick="openAddFosterModal()">
            <i class="fas fa-plus"></i> List
          </button>
        </div>
        <p class="card-subtitle" style="margin-top:-4px; margin-bottom: 12px;">
          Help a rescue find a temporary home
        </p>
        <div class="foster-scroll">
          ${renderFosterPets()}
        </div>
      </section>

      <!-- TODAY'S CARE -->
      <section class="card today-care-card">
        <div class="card-header">
          <h3><i class="fas fa-paw"></i> Today's Care</h3>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="today-care-progress">${getTodayCareProgress()}</span>
            <button class="card-link" onclick="showPage('care')">View</button>
          </div>
        </div>
        <div class="today-care-grid" id="todayCareGrid">
          ${renderTodayCare()}
        </div>
      </section>

      <!-- TIP -->
      <section class="card tip-card">
        <div class="card-header">
          <h3><i class="fas fa-lightbulb"></i> Today's Tip</h3>
          <button class="card-link" onclick="nextHomeTip()">Next</button>
        </div>
        <p class="tip-text" id="homeTipText">${DAILY_TIPS[currentTipIndex % DAILY_TIPS.length]}</p>
        <button class="card-link card-link-full" onclick="showPage('care')">
          See all care tips
        </button>
      </section>

      <!-- RECOMMENDED -->
      <section class="card recommended-card">
        <div class="card-header">
          <h3><i class="fas fa-star"></i> Recommended for <span class="text-brown">${petName}</span></h3>
          <button class="card-link" onclick="showPage('shop')">Shop</button>
        </div>
        <div class="recommended-scroll">
          ${renderRecommended()}
        </div>
      </section>

    </div>
  `;
}

/* ============================================================ */
/* 2. GREETING + ACTIVE PET                                      */
/* ============================================================ */
function getGreetingText() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function getActivePet() {
  if (!APP.pets || !APP.pets.length) return null;
  return APP.pets.find(p => p.id === APP.activePetId) || APP.pets[0];
}

/* ============================================================ */
/* 3. WEEK TIMELINE — REAL TODAY + REAL STREAK                   */
/* ============================================================ */
function getTodayIndex() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function getStreak() {
  const activePet = getActivePet();
  if (!activePet) return 0;

  // ⭐ Use real calculation
  if (typeof calculateRealStreak === 'function') {
    const realStreak = calculateRealStreak(activePet.id);
    // Sync to storage for consistency
    Storage.set('pc_weekStreak', realStreak);
    return realStreak;
  }

  // Fallback (shouldn't happen)
  return Storage.get('pc_weekStreak', 0);
}

/**
 * Count active (unresolved) SOS reports
 */
function getActiveSosCount() {
  const history = Storage.get('pc_sosHistory', []);
  return history.filter(s => s.status !== 'resolved').length;
}

function getWeekDays() {
  const todayIdx = getTodayIndex();
  const pet = getActivePet();

  const labels = [
    { name: 'MON', label: 'Walk'  },
    { name: 'TUE', label: 'Feed'  },
    { name: 'WED', label: 'Vet'   },
    { name: 'THU', label: 'Groom' },
    { name: 'FRI', label: 'Play'  },
    { name: 'SAT', label: 'Rest'  },
    { name: 'SUN', label: 'Care'  }
  ];

  if (!pet) {
    return labels.map((d, i) => ({
      ...d,
      done: false,
      today: i === todayIdx,
      isFuture: i > todayIdx,
      isPast: i < todayIdx
    }));
  }

  const allHistory = Storage.get('pc_careHistory', {});
  const petHistory = allHistory[pet.id] || {};

  const todayLiveCare = (typeof loadDailyCare === 'function')
    ? loadDailyCare(pet.id)
    : {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
  monday.setDate(monday.getDate() - dayOfWeek);

  const coreItems = ['feeding', 'water', 'walk', 'medicine'];

  return labels.map((d, i) => {
    const checkDate = new Date(monday);
    checkDate.setDate(checkDate.getDate() + i);
    const dateKey = checkDate.toISOString().slice(0, 10);

    const isToday = i === todayIdx;
    const isFuture = checkDate > today;
    const isPast = checkDate < today && !isToday;

    // Today → live data, Past → history, Future → ignore
    const dayData = isToday ? todayLiveCare
                  : isPast ? petHistory[dateKey]
                  : null;

    let completedCount = 0;
    if (dayData) {
      completedCount = coreItems.filter(k => dayData[k]).length;
    }

    // ⭐ Future days never "done"
    const isDone = !isFuture && completedCount >= 3;

    return {
      ...d,
      done: isDone,
      today: isToday,
      isFuture,
      isPast,
      completedCount
    };
  });
}

function renderWeekTimeline() {
  const days = getWeekDays();

  return days.map(d => {
    const classes = [
      'week-day',
      d.done ? 'done' : '',
      d.today ? 'today' : '',
      d.isFuture ? 'future' : '',
      d.isPast ? 'is-past' : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}">
        <div class="week-paw">
          <i class="fas fa-paw"></i>
        </div>
        <span class="week-day-name">${d.name}</span>
        <span class="week-day-label">${d.label}</span>
      </div>
    `;
  }).join('');
}

function renderWeekFooter() {
  const days = getWeekDays();
  const pet = getActivePet();
  const todayIdx = getTodayIndex();

  // Today's real progress
  let todayProgress = 0;
  let todayTotal = 4;

  if (pet) {
    // ⭐ Live data from pc_dailyCare
    const care = (typeof loadDailyCare === 'function')
      ? loadDailyCare(pet.id)
      : {};

    const coreItems = ['feeding', 'water', 'walk', 'medicine'];
    todayProgress = coreItems.filter(k => care[k]).length;
    todayTotal = coreItems.length;
  }

  const completed = days.filter(d => d.done).length;
  const missed = days.filter(d => d.isPast && !d.done).length;

  // Today status
  const todayData = days.find(d => d.today);
  const isTodayDone = todayData && todayData.done;

  let todayStatus;

  if (todayProgress === 0) {
    todayStatus = `<span class="week-footer-today-pending">
      <i class="fas fa-clock"></i> Today pending
    </span>`;
  } else if (isTodayDone) {
    todayStatus = `<span class="week-footer-today-done">
      <i class="fas fa-check-circle"></i> ${todayProgress}/${todayTotal} today
    </span>`;
  } else {
    todayStatus = `<span class="week-footer-today-progress">
      <i class="fas fa-circle-half-stroke"></i> ${todayProgress}/${todayTotal} today
    </span>`;
  }

  return `
    ${todayStatus}
    <span><i class="fas fa-check-circle"></i> ${completed} done</span>
    <span><i class="fas fa-times-circle"></i> ${missed} missed</span>
  `;
}

/* ============================================================ */
/* 4. NEARBY VETS                                                */
/* ============================================================ */
function renderNearbyVets() {
  const vets = getNearbyVetsWithDistance();

  if (!vets.length) {
    return `<p class="empty-state">No vets found nearby</p>`;
  }

  return vets.slice(0, 4).map(vet => `
    <div class="vet-item ${vet.open ? 'vet-open' : 'vet-closed'}">
      <div class="vet-icon ${vet.open ? 'open' : 'closed'}">
        <i class="fas ${vet.open ? 'fa-hospital' : 'fa-building'}"></i>
        ${vet.open ? '<span class="vet-online-dot"></span>' : ''}
      </div>
      <div class="vet-info">
        <div class="vet-header">
          <span class="vet-name">${escapeHtml(vet.name)}</span>
          <span class="vet-status ${vet.open ? 'open' : 'closed'}">
            ${vet.open ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
        <div class="vet-meta">
          <span><i class="fas fa-route"></i> ${vet.distance}</span>
          <span class="vet-dot">·</span>
          <span>${escapeHtml(vet.type)}</span>
        </div>
      </div>
      <button class="vet-call-btn"
              onclick="event.stopPropagation(); handleVetCall('${escapeHtml(vet.name)}', '${vet.phone}')"
              aria-label="Call">
        <i class="fas fa-phone"></i>
      </button>
    </div>
  `).join('');
}

/**
 * Get vets with calculated distance + dynamic open status
 */
function getNearbyVetsWithDistance() {
  if (typeof NEARBY_VETS === 'undefined' || !NEARBY_VETS.length) return [];

  // User location (Cox's Bazar center)
  const userLat = Storage.get('pc_userLat', 21.4272);
  const userLng = Storage.get('pc_userLng', 92.0058);

  const currentHour = new Date().getHours();

  return NEARBY_VETS.map(vet => {
    // Calculate real distance
    const distance = calculateVetDistance(vet, userLat, userLng);

    // Determine open/closed
    let isOpen;
    if (vet.alwaysOpen) {
      isOpen = true;
    } else {
      const opensAt = vet.opensAt || 9;
      const closesAt = vet.closesAt || 21;
      isOpen = currentHour >= opensAt && currentHour < closesAt;
    }

    return {
      ...vet,
      distance: distance.toFixed(1) + ' km',
      distanceNumeric: distance,
      open: isOpen
    };
  }).sort((a, b) => a.distanceNumeric - b.distanceNumeric);
}

/**
 * Haversine formula — real distance calculation
 */
function calculateVetDistance(vet, userLat, userLng) {
  if (!vet.lat || !vet.lng) return 5;

  const R = 6371; // Earth radius km
  const lat1 = userLat;
  const lng1 = userLng;
  const lat2 = vet.lat;
  const lng2 = vet.lng;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function handleVetCall(name, phone) {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <div class="call-modal-header">
      <div class="call-icon-pulse">
        <i class="fas fa-phone-volume"></i>
      </div>
      <h3>Call ${escapeHtml(name)}</h3>
      <p>${escapeHtml(phone)}</p>
    </div>
    <div class="call-actions">
      <a href="tel:${phone}" class="btn btn-primary w-full">
        <i class="fas fa-phone"></i> Call Now
      </a>
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal')">
        Cancel
      </button>
    </div>
  `;

  openModal('quickViewModal');
}
/* ============================================================ */
/* 5. FIRST-AID CHIPS                                            */
/* ============================================================ */
function renderFirstAidChips() {
  return Object.entries(FIRST_AID_GUIDES).map(([key, guide]) => `
    <button class="firstaid-chip" onclick="openFirstAidModal('${key}')">
      <div class="firstaid-chip-icon">
        <i class="fas ${guide.icon}"></i>
      </div>
      <span class="firstaid-chip-label">${guide.title}</span>
    </button>
  `).join('');
}

function openFirstAidModal(key) {
  const guide = FIRST_AID_GUIDES[key];
  if (!guide) return;

  const modal = document.getElementById('firstaidModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('firstaidModal')">
      <i class="fas fa-times"></i>
    </button>
    <div class="firstaid-modal-header">
      <div class="firstaid-modal-icon">
        <i class="fas ${guide.icon}"></i>
      </div>
      <h3>${guide.title}</h3>
      <p>${guide.subtitle}</p>
    </div>
    <h4 class="firstaid-section-title">Do this now</h4>
    <ol class="firstaid-steps">
      ${guide.steps.map(s => `<li>${s}</li>`).join('')}
    </ol>
    <div class="firstaid-dont-box">
      <h4><i class="fas fa-ban"></i> Do NOT</h4>
      <p>${guide.dont}</p>
    </div>
    <button class="btn btn-primary w-full" onclick="handleVetCall('Emergency Vet', '+8801700000001')">
      <i class="fas fa-phone-volume"></i> Call Emergency Vet
    </button>
  `;

  openModal('firstaidModal');
}

/* ============================================================ */
/* 6. MEMORIES PREVIEW                                           */
/* ============================================================ */
function renderMemoriesPreview() {
  return MEMORIES_DATA.slice(0, 4).map(mem => {
    const img = mem.image ? `<img src="${mem.image}" alt="" onerror="this.parentElement.classList.add('no-img'); this.remove();">` : '';
    return `
      <div class="memory-preview-item ${mem.image ? '' : 'no-img'}" onclick="showPage('memory')">
        ${img}
        <div class="memory-preview-overlay">
          <span>${mem.authorName.split(' ')[0]}</span>
        </div>
      </div>
    `;
  }).join('');
}

/* ============================================================ */
/* 7. FOSTER PETS                                                */
/* ============================================================ */


function openFosterModal(petId) {
  const pet = FOSTER_PETS.find(p => p.id === petId);
  if (!pet) return;

  // Increment views
  pet.views = (pet.views || 0) + 1;

  const modal = document.getElementById('fosterModal');
  if (!modal) return;

  const timeLeft = pet.urgencyDeadline ? getTimeRemaining(pet.urgencyDeadline) : null;
  const donationProgress = Math.min(100, (pet.donationsReceived / pet.donationGoal) * 100);

  const urgencyBadge = pet.urgencyLevel === 'critical'
    ? { label: 'CRITICAL', color: 'danger', icon: 'fa-exclamation-triangle' }
    : pet.urgencyLevel === 'high'
      ? { label: 'URGENT', color: 'warning', icon: 'fa-clock' }
      : { label: 'FOSTER NEEDED', color: 'success', icon: 'fa-heart' };

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('fosterModal')">
      <i class="fas fa-times"></i>
    </button>

    <!-- HERO IMAGE -->
    <div class="foster-modal-hero">
      <img src="${pet.image}" alt="${pet.name}" onerror="this.style.opacity='0'">
      <div class="foster-urgent-badge foster-urgent-${urgencyBadge.color} foster-modal-badge">
        <i class="fas ${urgencyBadge.icon}"></i> ${urgencyBadge.label}
      </div>
      ${timeLeft ? `
        <div class="foster-timer foster-modal-timer">
          <i class="fas fa-hourglass-half"></i> ${timeLeft}
        </div>
      ` : ''}
    </div>

    <!-- NAME + META -->
    <div class="foster-modal-header">
      <div>
        <h2 class="foster-modal-name">${pet.name}</h2>
        <p class="foster-modal-meta">
          ${pet.gender === 'male' ? '<i class="fas fa-mars"></i> Male' : '<i class="fas fa-venus"></i> Female'}
          · ${pet.age} · ${pet.breed}
        </p>
      </div>
      <div class="foster-modal-actions">
        <button class="foster-icon-btn" onclick="shareFoster('${pet.id}')" aria-label="Share">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    </div>

    <!-- QUICK INFO GRID -->
    <div class="foster-info-grid">
      <div class="foster-info-item">
        <i class="fas fa-map-marker-alt"></i>
        <div>
          <p class="foster-info-label">Location</p>
          <p class="foster-info-value">${pet.distance} away</p>
        </div>
      </div>
      <div class="foster-info-item">
        <i class="fas fa-clock"></i>
        <div>
          <p class="foster-info-label">Foster Duration</p>
          <p class="foster-info-value">${pet.fosterDuration}</p>
        </div>
      </div>
      <div class="foster-info-item">
        <i class="fas fa-wallet"></i>
        <div>
          <p class="foster-info-label">Monthly Cost</p>
          <p class="foster-info-value">$${pet.monthlyCost}</p>
        </div>
      </div>
      <div class="foster-info-item">
        <i class="fas fa-eye"></i>
        <div>
          <p class="foster-info-label">Views</p>
          <p class="foster-info-value">${pet.views}</p>
        </div>
      </div>
    </div>

    <!-- MEDICAL STATUS -->
    <div class="foster-medical-card">
      <h4 class="foster-section-title">
        <i class="fas fa-heart-pulse"></i> Medical Status
      </h4>
      <div class="foster-medical-chips">
        <span class="foster-medical-badge ${pet.medical.vaccinated ? 'done' : 'pending'}">
          <i class="fas ${pet.medical.vaccinated ? 'fa-check-circle' : 'fa-circle'}"></i>
          ${pet.medical.vaccinated ? 'Vaccinated' : 'Vaccination Pending'}
        </span>
        <span class="foster-medical-badge ${pet.medical.dewormed ? 'done' : 'pending'}">
          <i class="fas ${pet.medical.dewormed ? 'fa-check-circle' : 'fa-circle'}"></i>
          ${pet.medical.dewormed ? 'Dewormed' : 'Deworming Pending'}
        </span>
        <span class="foster-medical-badge ${pet.medical.neutered ? 'done' : 'pending'}">
          <i class="fas ${pet.medical.neutered ? 'fa-check-circle' : 'fa-circle'}"></i>
          ${pet.medical.neutered ? 'Neutered' : 'Neutering Pending'}
        </span>
        <span class="foster-medical-badge ${pet.medical.healthy ? 'done' : 'warning'}">
          <i class="fas ${pet.medical.healthy ? 'fa-heart' : 'fa-notes-medical'}"></i>
          ${pet.medical.healthy ? 'Healthy' : 'Special Care'}
        </span>
      </div>
      ${pet.medical.notes ? `
        <p class="foster-medical-notes">
          <i class="fas fa-info-circle"></i> ${escapeHtml(pet.medical.notes)}
        </p>
      ` : ''}
    </div>

    <!-- DESCRIPTION -->
    <div class="foster-description">
      <h4 class="foster-section-title">
        <i class="fas fa-book-open"></i> About ${pet.name}
      </h4>
      <p class="foster-modal-desc">${escapeHtml(pet.description)}</p>
    </div>

    <!-- RESCUER INFO -->
    <div class="foster-rescuer-card">
      <div class="foster-rescuer-icon">
        <i class="fas fa-shield-heart"></i>
      </div>
      <div class="foster-rescuer-info">
        <p class="foster-rescuer-name">
          ${escapeHtml(pet.rescuers.name)}
          ${pet.rescuers.verified ? '<i class="fas fa-circle-check verified"></i>' : ''}
        </p>
        <p class="foster-rescuer-role">Verified Rescuer</p>
      </div>
      <button class="foster-icon-btn" onclick="handleVetCall('${pet.rescuers.name}', '${pet.rescuers.phone}')">
        <i class="fas fa-phone"></i>
      </button>
    </div>

    <!-- DONATION PROGRESS -->
    <div class="foster-donation-card">
      <div class="foster-donation-header">
        <h4 class="foster-section-title">
          <i class="fas fa-hand-holding-heart"></i> Community Support
        </h4>
        <span class="foster-donation-amount">
          $${pet.donationsReceived} / $${pet.donationGoal}
        </span>
      </div>
      <div class="foster-donation-bar">
        <div class="foster-donation-fill" style="width: ${donationProgress}%"></div>
      </div>
      <p class="foster-donation-hint">
        ${donationProgress >= 100
          ? '🎉 Fully funded!'
          : `${Math.round(donationProgress)}% funded — every donation helps`
        }
      </p>
    </div>

    <!-- CTA ACTIONS -->
    <div class="foster-cta-actions">
      <button class="foster-cta-primary" onclick="openFosterApplyModal('${pet.id}')">
        <i class="fas fa-hand-holding-heart"></i> Apply to Foster
      </button>
      <button class="foster-cta-secondary" onclick="openFosterDonateModal('${pet.id}')">
        <i class="fas fa-heart"></i> Donate
      </button>
    </div>

    <button class="foster-cta-share" onclick="shareFoster('${pet.id}')">
      <i class="fas fa-share-alt"></i> Share with Friends
    </button>
  `;

  openModal('fosterModal');
}

function handleFosterContact(name) {
  closeModal('fosterModal');
  showToast('Request sent for ' + name);
}

/* ============================================================ */
/* 8. TODAY'S CARE                                               */
/* ============================================================ */
/**
 * Get today's care progress as string "2/4"
 * Uses same loadDailyCare from care.js
 */
function getTodayCareProgress() {
  const pet = getActivePet();
  if (!pet) return '';

  const care = (typeof loadDailyCare === 'function')
    ? loadDailyCare(pet.id)
    : {};

  const defaultKeys = ['feeding', 'water', 'walk', 'medicine'];
  const customItems = (typeof loadCustomCareItems === 'function')
    ? loadCustomCareItems(pet.id)
    : [];

  const defaultDone = defaultKeys.filter(k => care[k]).length;
  const customDone = customItems.filter(i => i.done).length;

  const totalDone = defaultDone + customDone;
  const total = defaultKeys.length + customItems.length;

  return `<span class="today-care-count">${totalDone}/${total}</span>`;
}
  
function renderTodayCare() {
  const pet = getActivePet();

  if (!pet) {
    return `
      <div class="empty-state" style="padding: 20px; grid-column: 1/-1;">
        <i class="fas fa-paw" style="font-size: 24px; opacity: 0.4; display: block; margin-bottom: 8px;"></i>
        <p style="font-size: 13px;">Add a pet first</p>
        <button class="btn btn-primary btn-sm" onclick="openPetModal()" style="margin-top: 10px;">
          <i class="fas fa-plus"></i> Add Pet
        </button>
      </div>
    `;
  }

  // Use care.js's loadDailyCare — SINGLE SOURCE OF TRUTH
  const care = (typeof loadDailyCare === 'function')
    ? loadDailyCare(pet.id)
    : (Storage.get('pc_dailyCare', {})[pet.id] || {});

  // SAME 4 fixed items as care.js Today's Care
  const defaultItems = [
    { key: 'feeding',  label: 'Feeding',  icon: 'fa-bowl-food' },
    { key: 'water',    label: 'Water',    icon: 'fa-droplet' },
    { key: 'walk',     label: 'Walk',     icon: 'fa-person-walking' },
    { key: 'medicine', label: 'Medicine', icon: 'fa-pills' }
  ];

  // Custom items
  const customItems = (typeof loadCustomCareItems === 'function')
    ? loadCustomCareItems(pet.id)
    : [];

  // Default 4 items HTML
  const defaultHtml = defaultItems.map(item => `
    <div class="today-care-item ${care[item.key] ? 'done' : ''}"
         onclick="toggleTodayCare('${item.key}')">
      <i class="fas ${item.icon}"></i>
      <span>${item.label}</span>
      <i class="fas ${care[item.key] ? 'fa-check-circle' : 'fa-circle'} status-icon"></i>
    </div>
  `).join('');

  // Custom items — show first 2 only
  const shownCustom = customItems.slice(0, 2);
  const moreCount = customItems.length - shownCustom.length;

  const customHtml = shownCustom.map(item => `
    <div class="today-care-item ${item.done ? 'done' : ''}"
         onclick="toggleTodayCare('custom_${item.id}')">
      <i class="fas ${item.icon}"></i>
      <span>${escapeHtml(item.label)}</span>
      <i class="fas ${item.done ? 'fa-check-circle' : 'fa-circle'} status-icon"></i>
    </div>
  `).join('');

  // "+N more" indicator
  const moreHtml = moreCount > 0 ? `
    <div class="today-care-item today-care-more"
         onclick="showPage('care'); setTimeout(()=>switchCareTab('today'), 100);">
      <i class="fas fa-ellipsis"></i>
      <span>+${moreCount} more</span>
      <i class="fas fa-arrow-right status-icon"></i>
    </div>
  ` : '';

  return defaultHtml + customHtml + moreHtml;
}


function toggleTodayCare(key) {
  const pet = getActivePet();
  if (!pet) {
    showToast('Add a pet first');
    return;
  }

  // ⭐ Custom care item handling
  if (key && key.startsWith('custom_')) {
    const itemId = key.replace('custom_', '');

    if (typeof toggleCustomCareItem === 'function') {
      toggleCustomCareItem(pet.id, itemId);
      renderHome();

      const items = loadCustomCareItems(pet.id);
      const item = items.find(i => i.id === itemId);
      if (item && item.done) showToast('Done ✓');
      return;
    }
  }

  // ⭐ Delegate to care.js — SINGLE SOURCE OF TRUTH
  if (typeof toggleCareItem === 'function') {
    toggleCareItem(key);
    return;
  }

  // Fallback (shouldn't happen)
  const allCare = Storage.get('pc_dailyCare', { _multi: true });
  const care = allCare[pet.id] || {
    date: new Date().toISOString().slice(0, 10),
    feeding: false, water: false, walk: false, medicine: false,
    grooming: false, exercise: false
  };
  care[key] = !care[key];
  allCare[pet.id] = care;
  Storage.set('pc_dailyCare', allCare);

  renderHome();
  if (care[key]) showToast('Done ✓');
}

/* ============================================================ */
/* 9. TIP                                                        */
/* ============================================================ */
function nextHomeTip() {
  currentTipIndex = (currentTipIndex + 1) % DAILY_TIPS.length;
  const el = document.getElementById('homeTipText');
  if (el) el.textContent = DAILY_TIPS[currentTipIndex];
}

/* ============================================================ */
/* 10. RECOMMENDED                                               */
/* ============================================================ */
function renderRecommended() {
  const products = getAllProducts().slice(0, 6);
  return products.map(p => `
    <div class="recommended-item" onclick="openQuickView('${p.id}')">
      <div class="recommended-img-wrap">
        <img src="${p.img}" alt="${p.name}" onerror="this.style.opacity='0'">
      </div>
      <p class="recommended-name">${p.name}</p>
      <p class="recommended-price">$${p.price.toFixed(2)}</p>
    </div>
  `).join('');
}

function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const store = getStoreById(product.storeId);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <img src="${product.img}" alt="${product.name}" class="quickview-img" onerror="this.style.opacity='0'">
    <h2 class="modal-title">${product.name}</h2>
    <p class="product-store-tag" style="margin-bottom:10px;">
      <i class="fas fa-store"></i> ${store ? store.name : 'PetCare'}
    </p>
    <p class="quickview-rating">
      <i class="fas fa-star" style="color:var(--pc-caramel);"></i>
      ${product.rating} (${product.reviews} reviews)
    </p>
    <p class="quickview-price">
      <span class="price-current">$${product.price}</span>
      <span class="price-old">$${product.oldPrice}</span>
      <span class="badge badge-danger">-${product.discount}%</span>
    </p>
    <button class="btn btn-primary w-full" onclick="addToCart('${product.id}')">
      <i class="fas fa-shopping-cart"></i> Add to Cart
    </button>
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* 11. CART ADD                                                  */
/* ============================================================ */
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const existing = APP.cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    APP.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1
    });
  }

  Storage.set(APP.STORAGE_KEYS.CART, APP.cart);
  updateCartBadge();
  closeModal('quickViewModal');
  showToast(product.name + ' added to cart');
}

/* ============================================================ */
/* 12. SOS MODAL                                                 */
/* ============================================================ */
function openSosModal() {
  const modal = document.getElementById('sosModal');
  if (!modal) return;

  // ⭐ Try to get location
  const location = getCurrentLocation();

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('sosModal')">
      <i class="fas fa-times"></i>
    </button>
    <div class="sos-modal-header">
      <i class="fas fa-triangle-exclamation"></i>
      <div>
        <h3>Emergency Report</h3>
        <p>Report injured, lost, or abused animal</p>
      </div>
    </div>

    <form onsubmit="handleSosSubmit(event)">
      <label>What's the situation? *</label>
      <select id="sosType" required>
        <option value="">Select a type</option>
        <option value="injured">Injured animal</option>
        <option value="lost">Lost pet</option>
        <option value="abused">Abused / Neglected</option>
        <option value="trapped">Trapped / Stuck</option>
        <option value="other">Other emergency</option>
      </select>

      <label>Describe briefly *</label>
      <textarea id="sosDescription"
                placeholder="E.g. Injured street dog near Dhanmondi Lake..."
                required
                minlength="10"
                maxlength="300"></textarea>

      <label>Your location</label>
      <div class="sos-location-box" id="sosLocationBox">
        <i class="fas fa-map-marker-alt"></i>
        <span>${location}</span>
      </div>

      <label>Your phone (optional)</label>
      <input type="tel" id="sosPhone"
             placeholder="+880 17XX-XXXXXX"
             value="${APP.user?.phone || ''}">

      <button type="submit" class="btn btn-danger w-full">
        <i class="fas fa-paper-plane"></i> Send Emergency Alert
      </button>
    </form>
  `;

  openModal('sosModal');
}

/**
 * Get realistic mock location
 * Uses cached location if available, otherwise picks from curated list
 */
function getCurrentLocation() {
  // Check if we already saved a location
  const saved = Storage.get('pc_lastLocation', null);
  if (saved) return saved;

  // Pick a realistic Cox's Bazar location
  const locations = [
    "Kolatoli Beach Road, Cox's Bazar",
    "Sugandha Beach Point, Cox's Bazar",
    "Himchari Road, Cox's Bazar",
    "Marine Drive, Cox's Bazar",
    "Laboni Beach Point, Cox's Bazar",
    "Kalar Mor, Cox's Bazar"
  ];

  const picked = locations[Math.floor(Math.random() * locations.length)];
  Storage.set('pc_lastLocation', picked);
  return picked;
}

function handleSosSubmit(e) {
  e.preventDefault();

  const type = document.getElementById('sosType')?.value;
  const description = document.getElementById('sosDescription')?.value?.trim();
  const phone = document.getElementById('sosPhone')?.value?.trim() || null;

  if (!type || !description) {
    showToast('Please fill required fields');
    return;
  }

  if (description.length < 10) {
    showToast('Please describe in at least 10 characters');
    return;
  }

  // ⭐ Get real location
  const location = getCurrentLocation();

  // ⭐ Find nearest open vet
  const assignedVet = pickNearestOpenVet();

  // ⭐ Build SOS report
  const sosReport = {
    id: 'sos_' + Date.now(),
    type,
    description,
    location,
    phone,
    status: 'pending',
    createdAt: new Date().toISOString(),
    userId: APP.user?.id || 'guest',
    userName: APP.user?.name || 'Guest User',
    assignedVet: assignedVet ? {
      id: assignedVet.id,
      name: assignedVet.name,
      phone: assignedVet.phone
    } : null,
    eta: assignedVet ? '12 min' : '15 min',
    timeline: [
      {
        stage: 'reported',
        label: 'Report Submitted',
        time: new Date().toISOString(),
        done: true
      }
    ]
  };

  // ⭐ Save to history
  const sosHistory = Storage.get('pc_sosHistory', []);
  sosHistory.unshift(sosReport);
  Storage.set('pc_sosHistory', sosHistory);

  // ⭐ Create notification
  APP.notifications = APP.notifications || [];
  APP.notifications.unshift({
    id: 'notif_' + Date.now(),
    type: 'sos',
    title: '🚨 Emergency Report Sent',
    message: `Your report is being reviewed. ETA ${sosReport.eta}.`,
    date: new Date().toISOString(),
    read: false,
    sosId: sosReport.id
  });
  Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, APP.notifications);

  // ⭐ Update badges
  if (typeof updateNotifBadge === 'function') updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();

  closeModal('sosModal');
  showToast('🚨 Rescue team alerted! ETA ' + sosReport.eta);

  if (typeof confetti === 'function') {
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  }

  // ⭐ Show tracking modal after short delay
  setTimeout(() => {
    if (typeof openSosTracking === 'function') {
      openSosTracking(sosReport.id);
    }
  }, 700);

  // ⭐ Re-render home to show active badge
  if (APP.currentPage === 'home') {
    setTimeout(() => renderHome(), 300);
  }
}

/**
 * Find nearest open vet from NEARBY_VETS
 */
function pickNearestOpenVet() {
  if (typeof NEARBY_VETS === 'undefined' || !NEARBY_VETS.length) return null;

  // Calculate distance for each
  const vetsWithDistance = NEARBY_VETS.map(vet => {
    const distance = typeof calculateVetDistance === 'function'
      ? calculateVetDistance(vet)
      : 5;
    return { ...vet, distanceNumeric: distance };
  }).filter(v => v.open);

  if (!vetsWithDistance.length) return NEARBY_VETS[0];

  // Sort by distance and return nearest
  vetsWithDistance.sort((a, b) => a.distanceNumeric - b.distanceNumeric);
  return vetsWithDistance[0];
}

/* ============================================================ */
/* SOS TRACKING + HISTORY                                        */
/* ============================================================ */

/**
 * Open SOS tracking modal
 */
function openSosTracking(sosId) {
  const history = Storage.get('pc_sosHistory', []);
  const sos = sosId
    ? history.find(s => s.id === sosId)
    : history[0];

  if (!sos) {
    showToast('SOS report not found');
    return;
  }

  const modal = document.getElementById('trackingModal');
  if (!modal) return;

  // Build stages
  const stages = [
    { key: 'reported',  label: 'Report Submitted',    icon: 'fa-check-circle' },
    { key: 'assigned',  label: 'Team Assigned',       icon: 'fa-user-shield' },
    { key: 'enroute',   label: 'Team En Route',       icon: 'fa-truck-fast' },
    { key: 'onscene',   label: 'On Scene',            icon: 'fa-map-pin' },
    { key: 'resolved',  label: 'Rescued / Resolved',  icon: 'fa-heart-pulse' }
  ];

  const currentStage = sos.currentStage || 0;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('trackingModal')">
      <i class="fas fa-times"></i>
    </button>
    <div class="sos-tracking-header">
      <div class="sos-tracking-icon">
        <i class="fas fa-triangle-exclamation"></i>
      </div>
      <div>
        <h3>Emergency Report</h3>
        <p>${sos.id}</p>
      </div>
    </div>

    <div class="sos-tracking-info">
      <div class="sos-tracking-row">
        <i class="fas fa-tag"></i>
        <span>${capitalize(sos.type)}</span>
      </div>
      <div class="sos-tracking-row">
        <i class="fas fa-map-marker-alt"></i>
        <span>${escapeHtml(sos.location)}</span>
      </div>
      <div class="sos-tracking-row">
        <i class="fas fa-clock"></i>
        <span>ETA: ${sos.eta || 'Calculating...'}</span>
      </div>
      ${sos.assignedVet ? `
        <div class="sos-tracking-row">
          <i class="fas fa-user-shield"></i>
          <span>${escapeHtml(sos.assignedVet.name)}</span>
        </div>
      ` : ''}
    </div>

    <p class="sos-tracking-desc">${escapeHtml(sos.description)}</p>

    <div class="track-stages">
      ${stages.map((stage, i) => {
        const isDone = i < currentStage;
        const isCurrent = i === currentStage;
        const cls = isDone ? 'done' : (isCurrent ? 'current' : '');
        const stageTime = sos.timeline?.find(t => t.stage === stage.key)?.time;

        return `
          <div class="track-stage ${cls}">
            <div class="track-dot">
              <i class="fas ${isDone ? 'fa-check' : stage.icon}"></i>
            </div>
            <div class="track-info">
              <p class="track-label">${stage.label}</p>
              <p class="track-time">
                ${isDone
                  ? (stageTime ? timeAgo(stageTime) : 'Completed')
                  : isCurrent
                    ? 'In progress...'
                    : 'Pending'
                }
              </p>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    ${currentStage < stages.length - 1 ? `
      <button class="btn btn-primary w-full" style="margin-top:16px;"
              onclick="advanceSosStage('${sos.id}')">
        <i class="fas fa-forward"></i> Update Status (Demo)
      </button>
    ` : `
      <div class="sos-resolved-badge">
        <i class="fas fa-check-circle"></i>
        Resolved — Thank you!
      </div>
    `}

    ${sos.assignedVet ? `
      <button class="btn btn-outline w-full" style="margin-top:8px;"
              onclick="handleVetCall('${escapeHtml(sos.assignedVet.name)}', '${sos.assignedVet.phone}')">
        <i class="fas fa-phone"></i> Call Team
      </button>
    ` : ''}
  `;

  openModal('trackingModal');
}

/**
 * Advance SOS tracking stage (simulates real-time updates)
 */
function advanceSosStage(sosId) {
  const history = Storage.get('pc_sosHistory', []);
  const idx = history.findIndex(s => s.id === sosId);
  if (idx === -1) return;

  const sos = history[idx];
  const maxStage = 4;

  if ((sos.currentStage || 0) < maxStage) {
    sos.currentStage = (sos.currentStage || 0) + 1;

    // Add timeline entry
    const stageNames = ['reported', 'assigned', 'enroute', 'onscene', 'resolved'];
    sos.timeline = sos.timeline || [];
    sos.timeline.push({
      stage: stageNames[sos.currentStage],
      time: new Date().toISOString()
    });

    if (sos.currentStage === maxStage) {
      sos.status = 'resolved';
      showToast('🎉 Rescue complete!');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      // Update notification
      APP.notifications = APP.notifications || [];
      APP.notifications.unshift({
        id: 'notif_' + Date.now(),
        type: 'sos',
        title: '✅ Rescue Complete',
        message: `Report ${sos.id} has been resolved. Thank you!`,
        date: new Date().toISOString(),
        read: false,
        sosId: sos.id
      });
      Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, APP.notifications);
      if (typeof updateNotifBadge === 'function') updateNotifBadge();
    } else {
      showToast('Status updated: ' + stageNames[sos.currentStage]);
    }

    Storage.set('pc_sosHistory', history);
    openSosTracking(sosId);
  }
}

/**
 * Open SOS history modal
 */
function openSosHistory() {
  const history = Storage.get('pc_sosHistory', []);
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const typeIconMap = {
    injured: 'fa-bandage',
    lost: 'fa-magnifying-glass',
    abused: 'fa-hand-fist',
    trapped: 'fa-lock',
    other: 'fa-circle-exclamation'
  };

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-clock-rotate-left"></i> Emergency Reports
    </h2>

    ${!history.length ? `
      <div class="empty-state">
        <i class="fas fa-shield-heart"></i>
        <p>No emergency reports yet</p>
        <p style="font-size:12px; color:var(--pc-text-muted); margin-top:6px;">
          Your reports will appear here
        </p>
        <button class="btn btn-primary btn-sm" style="margin-top:14px;"
                onclick="closeModal('quickViewModal'); openSosModal();">
          <i class="fas fa-bullhorn"></i> Report Now
        </button>
      </div>
    ` : `
      <div class="sos-history-list">
        ${history.map(sos => {
          const isResolved = sos.status === 'resolved';
          const icon = typeIconMap[sos.type] || 'fa-circle-exclamation';

          return `
            <button class="sos-history-item"
                    onclick="closeModal('quickViewModal'); setTimeout(()=>openSosTracking('${sos.id}'), 200);">
              <div class="sos-history-icon ${isResolved ? 'resolved' : ''}">
                <i class="fas ${icon}"></i>
              </div>
              <div class="sos-history-info">
                <div class="sos-history-top">
                  <p class="sos-history-type">${capitalize(sos.type)}</p>
                  <span class="sos-history-status status-${sos.status}">
                    ${sos.status}
                  </span>
                </div>
                <p class="sos-history-desc">${escapeHtml(sos.description.substring(0, 60))}${sos.description.length > 60 ? '…' : ''}</p>
                <p class="sos-history-meta">
                  <i class="fas fa-map-marker-alt"></i> ${escapeHtml(sos.location.split(',')[0])}
                  <span class="sos-dot">·</span>
                  <i class="far fa-clock"></i> ${timeAgo(sos.createdAt)}
                </p>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    `}
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* FOSTER — APPLY MODAL                                          */
/* ============================================================ */
function openFosterApplyModal(petId) {
  const pet = FOSTER_PETS.find(p => p.id === petId);
  if (!pet) return;

  if (!isLoggedIn()) {
    showToast('Please sign in to apply');
    closeModal('fosterModal');
    setTimeout(() => {
      openModal('loginModal');
      if (typeof renderLoginModal === 'function') renderLoginModal();
    }, 300);
    return;
  }

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-hand-holding-heart"></i> Apply to Foster ${pet.name}
    </h2>

    <form onsubmit="handleFosterApplySubmit(event, '${pet.id}')">
      <label>Your Full Name *</label>
      <input type="text" id="fosterName"
             value="${APP.user?.name || ''}"
             required placeholder="Full name">

      <label>Phone Number *</label>
      <input type="tel" id="fosterPhone"
             value="${APP.user?.phone || ''}"
             required placeholder="+880 17XX-XXXXXX">

      <label>Your Address *</label>
      <textarea id="fosterAddress" required rows="2"
                placeholder="Your home address..."></textarea>

      <label>Do you have other pets? *</label>
      <select id="fosterHasPets" required>
        <option value="">Select</option>
        <option value="no">No</option>
        <option value="yes-cats">Yes, cats only</option>
        <option value="yes-dogs">Yes, dogs only</option>
        <option value="yes-mixed">Yes, mixed</option>
      </select>

      <label>Do you have prior experience? *</label>
      <select id="fosterExperience" required>
        <option value="">Select</option>
        <option value="none">First time</option>
        <option value="some">Some experience</option>
        <option value="experienced">Very experienced</option>
      </select>

      <label>Why do you want to foster ${pet.name}? *</label>
      <textarea id="fosterReason" required rows="3"
                placeholder="Tell us a bit about why you'd be a good foster parent..."
                minlength="20" maxlength="500"></textarea>

      <label class="foster-checkbox-row">
        <input type="checkbox" id="fosterAgree" required>
        <span>I agree to provide a safe, loving temporary home for ${pet.name}</span>
      </label>

      <button type="submit" class="btn btn-primary w-full" style="margin-top:16px;">
        <i class="fas fa-paper-plane"></i> Submit Application
      </button>
    </form>
  `;

  openModal('quickViewModal');
}

function handleFosterApplySubmit(e, petId) {
  e.preventDefault();

  const pet = FOSTER_PETS.find(p => p.id === petId);
  if (!pet) return;

  const name = document.getElementById('fosterName').value.trim();
  const phone = document.getElementById('fosterPhone').value.trim();
  const address = document.getElementById('fosterAddress').value.trim();
  const hasPets = document.getElementById('fosterHasPets').value;
  const experience = document.getElementById('fosterExperience').value;
  const reason = document.getElementById('fosterReason').value.trim();
  const agree = document.getElementById('fosterAgree').checked;

  if (!name || !phone || !address || !hasPets || !experience || !reason || !agree) {
    showToast('Please fill all fields');
    return;
  }

  const application = {
    id: 'foster_app_' + Date.now(),
    petId: petId,
    petName: pet.name,
    petImage: pet.image,
    applicantName: name,
    applicantPhone: phone,
    applicantAddress: address,
    hasPets,
    experience,
    reason,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  // Save application
  const applications = Storage.get('pc_fosterApplications', []);
  applications.unshift(application);
  Storage.set('pc_fosterApplications', applications);

  // Update pet count
  pet.applicationsCount = (pet.applicationsCount || 0) + 1;

  // Create notification
  APP.notifications = APP.notifications || [];
  APP.notifications.unshift({
    id: 'notif_' + Date.now(),
    type: 'foster',
    title: '🐾 Foster Application Submitted',
    message: `Your application for ${pet.name} is being reviewed.`,
    date: new Date().toISOString(),
    read: false
  });
  Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, APP.notifications);
  if (typeof updateNotifBadge === 'function') updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();

  closeModal('quickViewModal');
  showToast(`Application for ${pet.name} submitted!`);

  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
}

/* ============================================================ */
/* FOSTER — DONATE MODAL                                         */
/* ============================================================ */
function openFosterDonateModal(petId) {
  const pet = FOSTER_PETS.find(p => p.id === petId);
  if (!pet) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const amounts = [5, 10, 25, 50, 100];

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-hand-holding-heart"></i> Donate to ${pet.name}
    </h2>

    <div class="foster-donate-hero">
      <img src="${pet.image}" alt="${pet.name}" onerror="this.style.opacity='0'">
      <div>
        <p class="foster-donate-pet-name">${pet.name}</p>
        <p class="foster-donate-pet-meta">${pet.age} · ${pet.breed}</p>
      </div>
    </div>

    <div class="foster-donate-progress">
      <div class="foster-donate-header">
        <span>Raised</span>
        <span>$${pet.donationsReceived} / $${pet.donationGoal}</span>
      </div>
      <div class="foster-donate-bar">
        <div class="foster-donate-fill" style="width: ${Math.min(100, (pet.donationsReceived / pet.donationGoal) * 100)}%"></div>
      </div>
    </div>

    <p class="foster-donate-label">Choose amount:</p>
    <div class="foster-donate-amounts">
      ${amounts.map(a => `
        <button class="foster-donate-chip" onclick="selectDonateAmount(${a}, this)">
          $${a}
        </button>
      `).join('')}
    </div>

    <label class="foster-donate-custom-label">
      Or enter custom amount
      <input type="number" id="fosterDonateCustom" placeholder="$" min="1" max="10000">
    </label>

    <button class="btn btn-primary w-full" style="margin-top:20px;" onclick="handleFosterDonate('${pet.id}')">
      <i class="fas fa-heart"></i> Donate Now
    </button>

    <p class="foster-donate-disclaimer">
      <i class="fas fa-info-circle"></i>
      Demo donation — no real payment processed
    </p>
  `;

  // Reset selected
  window.__selectedDonateAmount = null;

  openModal('quickViewModal');
}

function selectDonateAmount(amount, btn) {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelectorAll('.foster-donate-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  window.__selectedDonateAmount = amount;

  const customInput = document.getElementById('fosterDonateCustom');
  if (customInput) customInput.value = '';
}

function handleFosterDonate(petId) {
  const pet = FOSTER_PETS.find(p => p.id === petId);
  if (!pet) return;

  const customInput = document.getElementById('fosterDonateCustom');
  const customAmount = customInput?.value ? parseFloat(customInput.value) : 0;
  const amount = customAmount > 0 ? customAmount : window.__selectedDonateAmount;

  if (!amount || amount <= 0) {
    showToast('Please select or enter an amount');
    return;
  }

  if (amount > 10000) {
    showToast('Max donation is $10,000');
    return;
  }

  // Update pet
  pet.donationsReceived = (pet.donationsReceived || 0) + amount;

  // Save donation history
  const donations = Storage.get('pc_donations', []);
  donations.unshift({
    id: 'don_' + Date.now(),
    petId,
    petName: pet.name,
    amount,
    date: new Date().toISOString()
  });
  Storage.set('pc_donations', donations);

  // Notification
  APP.notifications = APP.notifications || [];
  APP.notifications.unshift({
    id: 'notif_' + Date.now(),
    type: 'donation',
    title: '❤️ Thank You for Donating!',
    message: `Your $${amount} donation to ${pet.name} has been received.`,
    date: new Date().toISOString(),
    read: false
  });
  Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, APP.notifications);
  if (typeof updateNotifBadge === 'function') updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();

  closeModal('quickViewModal');
  showToast(`Thank you! $${amount} donated to ${pet.name}`);

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD966', '#D88B9E', '#9B8BB4', '#6B9E5F']
    });
  }
}

/* ============================================================ */
/* FOSTER — SHARE                                                */
/* ============================================================ */
function shareFoster(petId) {
  const pet = FOSTER_PETS.find(p => p.id === petId);
  if (!pet) return;

  const shareData = {
    title: `Foster ${pet.name} — PetCare`,
    text: `${pet.name} (${pet.age}) needs a foster home urgently. Located near ${pet.location}.`,
    url: window.location.origin
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => showToast('Shared!'))
      .catch(() => {});
  } else {
    // Fallback — copy to clipboard
    navigator.clipboard.writeText(
      `${shareData.title}\n${shareData.text}\n${shareData.url}`
    ).then(() => {
      showToast('Link copied to clipboard');
    }).catch(() => {
      showToast('Could not share');
    });
  }
}

/* ============================================================ */
/* FOSTER — FULL PAGE MODAL                                      */
/* ============================================================ */
function openFosterPage() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const sorted = [...FOSTER_PETS].sort((a, b) => {
    const order = { critical: 0, high: 1, normal: 2 };
    return order[a.urgencyLevel] - order[b.urgencyLevel];
  });

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="foster-page-header">
      <div class="foster-page-icon">
        <i class="fas fa-hand-holding-heart"></i>
      </div>
      <div>
        <h2 class="foster-page-title">Foster & Adopt</h2>
        <p class="foster-page-sub">${FOSTER_PETS.length} pets need your help</p>
      </div>
    </div>

    <div class="foster-page-filters">
      <button class="foster-page-chip active" data-foster-filter="all">
        All (${FOSTER_PETS.length})
      </button>
      <button class="foster-page-chip" data-foster-filter="urgent">
        🚨 Urgent (${FOSTER_PETS.filter(p => p.urgent).length})
      </button>
      <button class="foster-page-chip" data-foster-filter="cat">
        🐱 Cats (${FOSTER_PETS.filter(p => p.species === 'cat').length})
      </button>
      <button class="foster-page-chip" data-foster-filter="dog">
        🐕 Dogs (${FOSTER_PETS.filter(p => p.species === 'dog').length})
      </button>
      <button class="foster-page-chip" data-foster-filter="healthy">
        ✅ Healthy (${FOSTER_PETS.filter(p => p.medical.healthy).length})
      </button>
    </div>

    <div class="foster-page-list" id="fosterPageList">
      ${sorted.map(pet => renderFosterPageItem(pet)).join('')}
    </div>

    <button class="foster-page-cta" onclick="closeModal('quickViewModal'); showToast('Thank you for considering fostering!')">
      <i class="fas fa-heart"></i> Can't foster? Donate to help
    </button>
  `;

  // Attach filter handlers
  const filterContainer = modal.querySelector('.foster-page-filters');
  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-foster-filter]');
      if (!chip) return;

      // Active state
      filterContainer.querySelectorAll('.foster-page-chip').forEach(c => {
        c.classList.toggle('active', c === chip);
      });

      const filter = chip.dataset.fosterFilter;
      let filtered = [...FOSTER_PETS];

      if (filter === 'urgent') {
        filtered = filtered.filter(p => p.urgent);
      } else if (filter === 'cat') {
        filtered = filtered.filter(p => p.species === 'cat');
      } else if (filter === 'dog') {
        filtered = filtered.filter(p => p.species === 'dog');
      } else if (filter === 'healthy') {
        filtered = filtered.filter(p => p.medical.healthy);
      }

      // Sort
      filtered.sort((a, b) => {
        const order = { critical: 0, high: 1, normal: 2 };
        return order[a.urgencyLevel] - order[b.urgencyLevel];
      });

      const list = document.getElementById('fosterPageList');
      if (list) {
        list.innerHTML = filtered.length
          ? filtered.map(pet => renderFosterPageItem(pet)).join('')
          : '<p class="foster-page-empty">No pets match this filter</p>';
      }
    });
  }

  openModal('quickViewModal');
}

/**
 * Render single foster item for the full page
 */
function renderFosterPageItem(pet) {
  const timeLeft = pet.urgencyDeadline ? getTimeRemaining(pet.urgencyDeadline) : null;

  const urgencyBadge = pet.urgencyLevel === 'critical'
    ? { label: 'CRITICAL', color: 'danger', icon: 'fa-exclamation-triangle' }
    : pet.urgencyLevel === 'high'
      ? { label: 'URGENT', color: 'warning', icon: 'fa-clock' }
      : { label: 'FOSTER', color: 'success', icon: 'fa-heart' };

  return `
    <div class="foster-page-item" onclick="closeModal('quickViewModal'); setTimeout(()=>openFosterModal('${pet.id}'), 250);">
      <div class="foster-page-img">
        <img src="${pet.image}" alt="${pet.name}" onerror="this.style.opacity='0'">
        <div class="foster-page-badge foster-page-badge-${urgencyBadge.color}">
          <i class="fas ${urgencyBadge.icon}"></i> ${urgencyBadge.label}
        </div>
        ${timeLeft ? `
          <div class="foster-page-timer">
            <i class="fas fa-hourglass-half"></i> ${timeLeft}
          </div>
        ` : ''}
      </div>

      <div class="foster-page-info">
        <div class="foster-page-name-row">
          <span class="foster-page-name">${pet.name}</span>
          ${pet.gender === 'male'
            ? '<i class="fas fa-mars" style="color:#3B82F6;"></i>'
            : '<i class="fas fa-venus" style="color:#EC4899;"></i>'}
        </div>
        <p class="foster-page-meta">${pet.age} · ${pet.breed}</p>
        <p class="foster-page-location">
          <i class="fas fa-map-marker-alt"></i> ${pet.distance}
        </p>
        <div class="foster-page-stats">
          <span><i class="fas fa-eye"></i> ${pet.views}</span>
          <span><i class="fas fa-users"></i> ${pet.applicationsCount}</span>
          <span class="foster-page-status-chip ${pet.medical.healthy ? 'healthy' : 'medical'}">
            <i class="fas ${pet.medical.healthy ? 'fa-heart-pulse' : 'fa-notes-medical'}"></i>
            ${pet.medical.healthy ? 'Healthy' : 'Medical Care'}
          </span>
        </div>
      </div>

      <i class="fas fa-chevron-right foster-page-arrow"></i>
    </div>
  `;
}

/* ============================================================ */
/* 13. EXPORT                                                    */
/* ============================================================ */
window.renderTodayCare = renderTodayCare;
window.toggleTodayCare = toggleTodayCare;
window.getTodayCareProgress = getTodayCareProgress;
window.getActiveSosCount = getActiveSosCount;
window.getNearbyVetsWithDistance = getNearbyVetsWithDistance;
window.calculateVetDistance = calculateVetDistance;
window.renderHome = renderHome;
window.getGreetingText = getGreetingText;
window.getActivePet = getActivePet;
window.openFirstAidModal = openFirstAidModal;
window.openFosterModal = openFosterModal;
window.handleFosterContact = handleFosterContact;
window.openQuickView = openQuickView;
window.addToCart = addToCart;
window.openSosModal = openSosModal;
window.handleSosSubmit = handleSosSubmit;
window.toggleTodayCare = toggleTodayCare;
window.nextHomeTip = nextHomeTip;
window.handleVetCall = handleVetCall;
window.getStreak = getStreak;
window.openFosterPage = openFosterPage;
window.renderFosterPageItem = renderFosterPageItem;
window.openFosterApplyModal = openFosterApplyModal;
window.handleFosterApplySubmit = handleFosterApplySubmit;
window.openFosterDonateModal = openFosterDonateModal;
window.selectDonateAmount = selectDonateAmount;
window.handleFosterDonate = handleFosterDonate;
window.shareFoster = shareFoster;
window.openSosTracking = openSosTracking;
window.advanceSosStage = advanceSosStage;
window.openSosHistory = openSosHistory;
window.getCurrentLocation = getCurrentLocation;
window.pickNearestOpenVet = pickNearestOpenVet;

console.log('PetCare Home loaded');