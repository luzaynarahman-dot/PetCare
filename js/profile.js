/* ============================================================ */
/* PETCARE v3.0 — MY PROFILE PAGE (OWN)                          */
/* Guest state + Role switcher + Vet application                 */
/* ============================================================ */

let profileState = {
  pickedCover: null,
  pickedAvatar: null,
  vetForm: {
    step: 1,
    specialization: '',
    experience: '',
    clinicName: '',
    clinicAddress: '',
    licenseNumber: '',
    licensePhoto: null
  }
};

/* ============================================================ */
/* LOCAL HELPERS — avoid dependency on other files               */
/* ============================================================ */
function capitalizeLocal(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderProfile() {
  const page = document.getElementById('page-profile');
  if (!page) return;

  // ─── GUEST STATE ───
  if (!isLoggedIn()) {
    page.innerHTML = renderGuestProfile();
    attachGuestProfileHandlers();
    return;
  }

  // ─── LOGGED-IN STATE ───
  const user = getProfileUser();
  const myPosts = getMyPosts();
  const myPets = APP.pets || [];
  const appointments = getUpcomingAppointments();
  const favoriteStores = getFavoriteStores();
  const ownedStores = getOwnedStores(user);
  const isStoreOwner = ownedStores.length > 0;
  const isVetPending = user.vetApplication?.status === 'pending';
  const isVetVerified = user.vetApplication?.status === 'approved';
  const hasVetRole = user.roles.includes('vet');
  const canApplyVet = !hasVetRole && !isVetPending;

  page.innerHTML = `
    <div class="page-container my-profile-page">

      <!-- ═══════ COVER + HEADER ═══════ -->
      <section class="mp-hero-card">
        <div class="mp-cover">
          ${user.coverPhoto
            ? `<img src="${user.coverPhoto}" alt="" class="mp-cover-img" onerror="this.style.display='none'">`
            : `<div class="mp-cover-empty"><i class="fas fa-image"></i><span>Add cover photo</span></div>`
          }
          <button class="mp-cover-edit" onclick="openCoverPicker()" aria-label="Change cover">
            <i class="fas fa-camera"></i>
          </button>
        </div>

        <div class="mp-identity">
          <button class="mp-avatar-btn" onclick="openAvatarPicker()">
            <div class="mp-avatar">
              ${user.avatar
                ? `<img src="${user.avatar}" alt="" onerror="this.style.opacity='0'">`
                : `<div class="mp-avatar-initial">${user.name.charAt(0).toUpperCase()}</div>`
              }
            </div>
            <span class="mp-avatar-edit"><i class="fas fa-camera"></i></span>
          </button>

          <div class="mp-identity-info">
            <h2 class="mp-name">${user.name}</h2>

            <!-- All role badges (display) -->
            <div class="mp-role-chips-row">
              ${renderProfileRoleChips(user, isStoreOwner, isVetVerified, isVetPending)}
            </div>

            ${user.location ? `
              <p class="mp-location">
                <i class="fas fa-map-marker-alt"></i> ${user.location}
              </p>
            ` : ''}

            ${user.bio ? `
              <p class="mp-tagline">"${user.bio}" <i class="far fa-heart"></i></p>
            ` : ''}
          </div>
        </div>

        <!-- ─── ACTIVE ROLE SWITCHER ─── -->
        ${user.roles.length > 1 ? `
          <div class="mp-active-role-bar" id="mpActiveRoleBar">
            <span class="mp-active-role-label">Posting as</span>
            <button class="mp-active-role-btn" onclick="openRoleSwitcher()">
              <i class="fas ${getRoleIcon(getActiveRole())}"></i>
              <span>${getRoleLabel(getActiveRole())}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        ` : ''}

        <!-- Stats Row -->
        <div class="mp-stats-row">
          <button class="mp-stat" onclick="scrollToMyPosts()">
            <p class="mp-stat-value">${myPosts.length}</p>
            <p class="mp-stat-label">Posts</p>
          </button>
          <button class="mp-stat" onclick="showFollowers()">
            <p class="mp-stat-value">${formatCount(user.followers)}</p>
            <p class="mp-stat-label">Followers</p>
          </button>
          <button class="mp-stat" onclick="showFollowing()">
            <p class="mp-stat-value">${formatCount(user.following)}</p>
            <p class="mp-stat-label">Following</p>
          </button>
          <button class="mp-stat" onclick="showMyReviews()">
            <p class="mp-stat-value">${user.reviewCount}</p>
            <p class="mp-stat-label">Reviews</p>
          </button>
        </div>
      </section>

      <!-- ═══════ VET PENDING BANNER ═══════ -->
      ${isVetPending ? `
        <section class="mp-vet-pending-card">
          <div class="mp-vet-pending-icon">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <div class="mp-vet-pending-info">
            <p class="mp-vet-pending-title">Vet Application Under Review</p>
            <p class="mp-vet-pending-sub">Our team will verify your credentials within 24-48 hours.</p>
          </div>
          <button class="mp-vet-simulate-btn" onclick="simulateAdminApproval()">
            <i class="fas fa-flask"></i> Simulate Approval
          </button>
        </section>
      ` : ''}

      <!-- ═══════ BECOME A VET CTA ═══════ -->
      ${canApplyVet ? `
        <section class="mp-become-vet-card">
          <div class="mp-become-vet-icon">
            <i class="fas fa-user-md"></i>
          </div>
          <div class="mp-become-vet-info">
            <p class="mp-become-vet-title">Become a Verified Vet</p>
            <p class="mp-become-vet-sub">Apply to post medical tips and help pet parents</p>
          </div>
          <button class="mp-become-vet-btn" onclick="openVetApplicationModal()">
            Apply <i class="fas fa-arrow-right"></i>
          </button>
        </section>
      ` : ''}

      <!-- ═══════ QUICK ACTIONS ═══════ -->
      <section class="mp-quick-actions">
        <button class="mp-action-card action-blue" onclick="openEditProfileModal()">
          <div class="mp-action-icon"><i class="fas fa-user-pen"></i></div>
          <span class="mp-action-label">Edit Profile</span>
        </button>
        <button class="mp-action-card action-green" onclick="openAddPetFromProfile()">
          <div class="mp-action-icon"><i class="fas fa-paw"></i></div>
          <span class="mp-action-label">My Pets</span>
        </button>
        <button class="mp-action-card action-peach" onclick="openMyOrders()">
          <div class="mp-action-icon"><i class="fas fa-shopping-bag"></i></div>
          <span class="mp-action-label">My Orders</span>
        </button>
        <button class="mp-action-card action-purple" onclick="scrollToAppointments()">
          <div class="mp-action-icon"><i class="fas fa-calendar-check"></i></div>
          <span class="mp-action-label">Appointments</span>
        </button>
      </section>

      <!-- ═══════ MY PETS ═══════ -->
      <section class="mp-section-card" id="mpPetsSection">
        <div class="mp-section-header">
          <h3><i class="fas fa-paw"></i> My Pets</h3>
          <button class="mp-see-all" onclick="openAddPetFromProfile()">
            <i class="fas fa-plus"></i> Add Pet
          </button>
        </div>
        <div class="mp-pets-scroll">
          ${renderMyPets(myPets)}
        </div>
      </section>

      <!-- ═══════ MY POSTS ═══════ -->
      <section class="mp-section-card" id="mpMyPostsSection">
        <div class="mp-section-header">
          <h3><i class="fas fa-camera-retro"></i> My Posts</h3>
          <button class="mp-see-all" onclick="openComposerFromProfile()">
            <i class="fas fa-plus"></i> New Post
          </button>
        </div>
        <div class="mp-posts-feed">
          ${renderMyPosts(myPosts)}
        </div>
      </section>

      <!-- ═══════ MY STORES (conditional) ═══════ -->
      ${isStoreOwner ? `
        <section class="mp-section-card mp-shop-section">
          <div class="mp-section-header">
            <h3><i class="fas fa-store"></i> My Store${ownedStores.length > 1 ? 's' : ''}</h3>
            <button class="mp-see-all" onclick="openCreateStoreModal()">
              <i class="fas fa-plus"></i> New
            </button>
          </div>
          <div class="mp-shops-list">
            ${ownedStores.map(store => renderMyStoreCard(store)).join('')}
          </div>
        </section>
      ` : ''}

      <!-- ═══════ UPCOMING APPOINTMENTS ═══════ -->
      <section class="mp-section-card" id="mpAppointmentsSection">
        <div class="mp-section-header">
          <h3><i class="fas fa-calendar-check"></i> Upcoming Appointments</h3>
          <button class="mp-see-all" onclick="openBookAppointment()">
            <i class="fas fa-plus"></i> Book
          </button>
        </div>
        <div class="mp-appointments-list">
          ${renderUpcomingAppointments(appointments)}
        </div>
      </section>

      <!-- ═══════ QUICK LINKS ═══════ -->
      <section class="mp-quick-links">
        <button class="mp-quick-link" onclick="openWishlist()">
          <div class="mp-quick-icon icon-pink"><i class="fas fa-heart"></i></div>
          <span>Wishlist</span>
        </button>
        <button class="mp-quick-link" onclick="openReminders()">
          <div class="mp-quick-icon icon-yellow"><i class="fas fa-bell"></i></div>
          <span>Reminders</span>
        </button>
        <button class="mp-quick-link" onclick="openHealthRecords()">
          <div class="mp-quick-icon icon-green"><i class="fas fa-file-medical"></i></div>
          <span>Health Records</span>
        </button>
        <button class="mp-quick-link" onclick="openSupport()">
          <div class="mp-quick-icon icon-blue"><i class="fas fa-headset"></i></div>
          <span>Support</span>
        </button>
      </section>

      <!-- ═══════ FAVORITE STORES ═══════ -->
      <section class="mp-section-card">
        <div class="mp-section-header">
          <h3><i class="fas fa-star"></i> Favorite Stores</h3>
          <button class="mp-see-all" onclick="showAllFavoritesModal()">
            View All <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div class="mp-favorites-scroll">
          ${renderFavoriteStores(favoriteStores.slice(0, 6))}
        </div>
      </section>

      <!-- ═══════ SETTINGS ═══════ -->
      <section class="mp-section-card">
        <div class="mp-section-header">
          <h3><i class="fas fa-cog"></i> Settings</h3>
        </div>
        <div class="mp-settings-list">
          <button class="mp-setting-row" onclick="toggleDarkModeSetting()">
            <div class="mp-setting-icon icon-moon"><i class="fas fa-moon"></i></div>
            <div class="mp-setting-info">
              <p class="mp-setting-label">Dark Mode</p>
              <p class="mp-setting-sub">${document.body.classList.contains('dark-mode') ? 'On' : 'Off'}</p>
            </div>
            <div class="mp-toggle ${document.body.classList.contains('dark-mode') ? 'on' : ''}"><div class="mp-toggle-knob"></div></div>
          </button>
          <button class="mp-setting-row" onclick="openNotificationsSettings()">
            <div class="mp-setting-icon icon-bell"><i class="fas fa-bell"></i></div>
            <div class="mp-setting-info">
              <p class="mp-setting-label">Notifications</p>
              <p class="mp-setting-sub">Push, email & reminders</p>
            </div>
            <i class="fas fa-chevron-right mp-setting-arrow"></i>
          </button>
          <button class="mp-setting-row" onclick="openPrivacySettings()">
            <div class="mp-setting-icon icon-lock"><i class="fas fa-lock"></i></div>
            <div class="mp-setting-info">
              <p class="mp-setting-label">Privacy & Security</p>
              <p class="mp-setting-sub">Password, data & permissions</p>
            </div>
            <i class="fas fa-chevron-right mp-setting-arrow"></i>
          </button>
          <button class="mp-setting-row" onclick="openAboutModal()">
            <div class="mp-setting-icon icon-info"><i class="fas fa-info-circle"></i></div>
            <div class="mp-setting-info">
              <p class="mp-setting-label">About PetCare</p>
              <p class="mp-setting-sub">Version 3.0.0</p>
            </div>
            <i class="fas fa-chevron-right mp-setting-arrow"></i>
          </button>
          <button class="mp-setting-row mp-setting-danger" onclick="handleLogoutConfirm()">
            <div class="mp-setting-icon icon-danger"><i class="fas fa-sign-out-alt"></i></div>
            <div class="mp-setting-info">
              <p class="mp-setting-label">Log Out</p>
              <p class="mp-setting-sub">Sign out from this device</p>
            </div>
            <i class="fas fa-chevron-right mp-setting-arrow"></i>
          </button>
        </div>
      </section>

    </div>
  `;
}

/* ============================================================ */
/* 2. GUEST PROFILE STATE                                        */
/* ============================================================ */
function renderGuestProfile() {
  return `
    <div class="page-container my-profile-page">
      <section class="mp-guest-card">
        <div class="mp-guest-icon">
          <i class="fas fa-paw"></i>
        </div>
        <h2 class="mp-guest-title">Welcome to PetCare</h2>
        <p class="mp-guest-sub">
          Sign in to access your pets, appointments, orders, and memories.
        </p>

        <button class="mp-guest-cta" onclick="openLoginFromProfile()">
          <i class="fas fa-sign-in-alt"></i>
          Sign In / Register
        </button>

        <button class="mp-guest-explore" onclick="showPage('home')">
          <i class="fas fa-compass"></i>
          Explore as Guest
        </button>
      </section>

      <section class="mp-guest-features">
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-green"><i class="fas fa-paw"></i></div>
          <p>Manage Pets</p>
        </div>
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-blue"><i class="fas fa-calendar-check"></i></div>
          <p>Book Vets</p>
        </div>
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-peach"><i class="fas fa-shopping-bag"></i></div>
          <p>Shop & Orders</p>
        </div>
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-purple"><i class="fas fa-camera-retro"></i></div>
          <p>Share Memories</p>
        </div>
      </section>
    </div>
  `;
}

function attachGuestProfileHandlers() {
  // All inline onclick — no extra handlers needed
}

function openLoginFromProfile() {
  openModal('loginModal');
  if (typeof renderLoginModal === 'function') renderLoginModal();
}

/* ============================================================ */
/* 3. USER DATA                                                  */
/* ============================================================ */
function getProfileUser() {
  const u = APP.user || {};

  // Real follower/following count from follow map
  let followersCount = u.followers || 0;
  let followingCount = u.following || 0;

  if (typeof ProfileView === 'object' && ProfileView.getFollowers) {
    const myId = u.id || 'user_self';
    try {
      followersCount = ProfileView.getFollowers(myId).length;
      followingCount = ProfileView.getFollowing(myId).length;
    } catch (e) {
      // fallback to stored
    }
  }

  return {
    name: u.name || 'Guest User',
    avatar: u.avatar || null,
    coverPhoto: u.coverPhoto || null,
    location: u.location || '',
    bio: u.bio || '',
    roles: u.roles || ['petOwner'],
    activeRole: u.activeRole || 'petOwner',
    vetApplication: u.vetApplication || getDefaultVetApplication(),
    ownedStores: u.ownedStores || [],
    followers: followersCount,
    following: followingCount,
    reviewCount: u.reviewCount || 0
  };
}

/* ============================================================ */
/* 4. OWNED STORES                                               */
/* ============================================================ */
function getOwnedStores(user) {
  const ids = user.ownedStores || [];
  if (!ids.length) return [];
  return ids.map(id => getStoreById(id)).filter(Boolean);
}

function renderMyStoreCard(store) {
  return `
    <button class="mp-shop-card" onclick="openStoreDetail('${store.id}')">
      <div class="mp-shop-cover">
        <img src="${store.cover}" alt="" onerror="this.style.opacity='0'">
      </div>
      <div class="mp-shop-info">
        <p class="mp-shop-name">${store.name}</p>
        <div class="mp-shop-meta">
          <span><i class="fas fa-star"></i> ${store.rating || 0} (${store.reviewCount || 0})</span>
          <span class="store-tag store-tag-${store.type}">${store.type}</span>
        </div>
        <p class="mp-shop-desc">${(store.description || '').substring(0, 90)}${(store.description || '').length > 90 ? '…' : ''}</p>
      </div>
      <i class="fas fa-chevron-right mp-shop-arrow"></i>
    </button>
  `;
}

/* ============================================================ */
/* 5. ROLE CHIPS (display — sob role)                            */
/* ============================================================ */
function renderProfileRoleChips(user, isStoreOwner, isVetVerified, isVetPending) {
  const roles = user.roles || [];
  const chips = [];

  // Vet chip
  if (roles.includes('vet') && isVetVerified) {
    chips.push(`<span class="mp-role-chip chip-vet"><i class="fas fa-user-md"></i> Verified Vet <i class="fas fa-circle-check"></i></span>`);
  } else if (isVetPending) {
    chips.push(`<span class="mp-role-chip chip-pending"><i class="fas fa-hourglass-half"></i> Vet Pending</span>`);
  }

  // Store owner chip
  if (isStoreOwner || roles.includes('storeOwner')) {
    chips.push(`<span class="mp-role-chip chip-store"><i class="fas fa-store"></i> Store Owner</span>`);
  }

  // Pet owner chip
  if (roles.includes('petOwner')) {
    chips.push(`<span class="mp-role-chip chip-owner"><i class="fas fa-paw"></i> Pet Owner</span>`);
  }

  if (!chips.length) {
    chips.push(`<span class="mp-role-chip chip-owner"><i class="fas fa-paw"></i> Pet Owner</span>`);
  }

  return chips.join('');
}

/* ============================================================ */
/* 6. ROLE SWITCHER MODAL                                        */
/* ============================================================ */
function openRoleSwitcher() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const user = getProfileUser();
  const currentActive = getActiveRole();

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-user-tag"></i> Post As</h2>
    <p style="color:var(--pc-text-2); font-size:12.5px; margin-bottom:14px; line-height:1.5;">
      Your next post will be published under the selected role.
    </p>

    <div class="role-choice-list">
      ${user.roles.map(role => {
        const isActive = role === currentActive;
        const icon = getRoleIcon(role);
        const label = getRoleLabel(role);
        let sub = '';
        if (role === 'petOwner') sub = 'Share stories, photos, and questions';
        if (role === 'storeOwner') sub = 'Promote your store and products';
        if (role === 'vet') sub = 'Post medical tips and advice';

        const chipClass = role === 'vet' ? 'role-choice-vet' :
                          role === 'storeOwner' ? 'role-choice-store' :
                          'role-choice-owner';

        return `
          <button class="role-choice-card ${isActive ? 'active' : ''}" onclick="switchActiveRole('${role}')">
            <div class="role-choice-icon ${chipClass}"><i class="fas ${icon}"></i></div>
            <div class="role-choice-info">
              <p class="role-choice-title">${label}</p>
              <p class="role-choice-sub">${sub}</p>
            </div>
            ${isActive ? '<i class="fas fa-circle-check role-choice-check"></i>' : '<i class="fas fa-chevron-right role-choice-arrow"></i>'}
          </button>
        `;
      }).join('')}
    </div>
  `;

  openModal('quickViewModal');
}

function switchActiveRole(role) {
  const ok = setActiveRole(role);
  if (!ok) return;

  closeModal('quickViewModal');
  showToast('Posting as ' + getRoleLabel(role));
  renderProfile();
}

/* ============================================================ */
/* 7. VET APPLICATION MODAL (2-step)                             */
/* ============================================================ */
function openVetApplicationModal() {
  profileState.vetForm = {
    step: 1,
    specialization: '',
    experience: '',
    clinicName: '',
    clinicAddress: '',
    licenseNumber: '',
    licensePhoto: null
  };

  renderVetApplicationModal();
  openModal('vetApplicationModal');
}

function renderVetApplicationModal() {
  const modal = document.getElementById('vetApplicationModal');
  if (!modal) return;

  const form = profileState.vetForm;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('vetApplicationModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-user-md"></i> Apply as a Verified Vet</h2>

    <div class="vet-steps">
      <div class="vet-step ${form.step >= 1 ? 'active' : ''}">
        <span class="vet-step-dot">1</span>
        <span class="vet-step-label">Basic Info</span>
      </div>
      <div class="vet-step-line"></div>
      <div class="vet-step ${form.step >= 2 ? 'active' : ''}">
        <span class="vet-step-dot">2</span>
        <span class="vet-step-label">Verification</span>
      </div>
    </div>

    ${form.step === 1 ? renderVetStep1(form) : renderVetStep2(form)}
  `;

  if (form.step === 2) {
    attachVetStep2Handlers();
  }
}

function renderVetStep1(form) {
  const specializations = [
    'General Veterinarian',
    'Cat & Dog Specialist',
    'Avian / Bird Expert',
    'General Surgeon',
    'Exotic Animals',
    'Dentistry',
    'Dermatology',
    'Emergency Care'
  ];

  return `
    <div class="vet-form">
      <label>Specialization *</label>
      <select id="vetSpec" onchange="updateVetField('specialization', this.value)">
        <option value="">Select specialization</option>
        ${specializations.map(s => `
          <option value="${s}" ${form.specialization === s ? 'selected' : ''}>${s}</option>
        `).join('')}
      </select>

      <label>Years of Experience *</label>
      <input type="number" id="vetExp" placeholder="e.g. 5" min="0" max="60"
             value="${form.experience}"
             oninput="updateVetField('experience', this.value)">

      <label>Clinic / Hospital Name *</label>
      <input type="text" id="vetClinic" placeholder="e.g. City Vet Hospital"
             value="${form.clinicName}"
             oninput="updateVetField('clinicName', this.value)">

      <label>Clinic Address</label>
      <input type="text" id="vetAddress" placeholder="e.g. Dhanmondi, Dhaka"
             value="${form.clinicAddress}"
             oninput="updateVetField('clinicAddress', this.value)">

      <button class="btn btn-primary w-full" style="margin-top:16px;"
              onclick="nextVetStep()" id="vetNextBtn">
        Next <i class="fas fa-arrow-right"></i>
      </button>

      <button class="btn btn-outline w-full" style="margin-top:8px;"
              onclick="closeModal('vetApplicationModal')">
        Cancel
      </button>
    </div>
  `;
}

function renderVetStep2(form) {
  const hasPhoto = !!form.licensePhoto;
  const licenseValid = /^[A-Z]{2,4}-\d{4,8}$/.test(form.licenseNumber);

  return `
    <div class="vet-form">
      <label>License / Registration Number *</label>
      <input type="text" id="vetLicense" placeholder="e.g. VET-12345"
             value="${form.licenseNumber}"
             oninput="updateVetField('licenseNumber', this.value.toUpperCase())">
      <p class="vet-hint">
        <i class="fas fa-info-circle"></i> Format: VET-12345 (min 6 chars)
      </p>

      <label>Upload Certificate / License *</label>
      <label class="vet-upload-zone ${hasPhoto ? 'has-image' : ''}" for="vetLicensePhoto">
        ${hasPhoto
          ? `<img src="${form.licensePhoto}" alt="License">`
          : `<i class="fas fa-cloud-arrow-up"></i>
             <p>Tap to upload</p>
             <span>JPG, PNG · max 5MB</span>`
        }
      </label>
      <input type="file" id="vetLicensePhoto" accept="image/*"
             style="display:none;" onchange="handleVetLicenseUpload(event)">

      <div class="vet-actions-row">
        <button class="btn btn-outline w-full" onclick="prevVetStep()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button class="btn btn-primary w-full" onclick="submitVetApplication()"
                ${(!licenseValid || !hasPhoto) ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
          Submit Application
        </button>
      </div>
    </div>
  `;
}

function updateVetField(field, value) {
  profileState.vetForm[field] = value;

  // Live validation for Next button on step 1
  if (profileState.vetForm.step === 1) {
    const btn = document.getElementById('vetNextBtn');
    if (!btn) return;
    const f = profileState.vetForm;
    const valid = f.specialization && f.experience && f.clinicName;
    btn.disabled = !valid;
    btn.style.opacity = valid ? '1' : '0.5';
    btn.style.cursor = valid ? 'pointer' : 'not-allowed';
  }

  // Live validation for Submit button on step 2
  if (profileState.vetForm.step === 2) {
    const licenseValid = /^[A-Z]{2,4}-\d{4,8}$/.test(profileState.vetForm.licenseNumber);
    const hasPhoto = !!profileState.vetForm.licensePhoto;
    const modal = document.getElementById('vetApplicationModal');
    if (!modal) return;
    const submitBtns = modal.querySelectorAll('.btn-primary');
    const submitBtn = submitBtns[submitBtns.length - 1];
    if (submitBtn && submitBtn.textContent.includes('Submit')) {
      const valid = licenseValid && hasPhoto;
      submitBtn.disabled = !valid;
      submitBtn.style.opacity = valid ? '1' : '0.5';
      submitBtn.style.cursor = valid ? 'pointer' : 'not-allowed';
    }
  }
}

function nextVetStep() {
  const f = profileState.vetForm;
  if (!f.specialization || !f.experience || !f.clinicName) {
    showToast('Please fill all required fields');
    return;
  }
  f.step = 2;
  renderVetApplicationModal();
}

function prevVetStep() {
  profileState.vetForm.step = 1;
  renderVetApplicationModal();
}

function attachVetStep2Handlers() {
  // no-op — inline onchange already attached
}

function handleVetLicenseUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('File too large (max 5MB)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    profileState.vetForm.licensePhoto = ev.target.result;
    renderVetApplicationModal();
  };
  reader.readAsDataURL(file);
}

function submitVetApplication() {
  const f = profileState.vetForm;

  if (!APP.user) {
    showToast('Please log in first');
    return;
  }

  APP.user.vetApplication = {
    status: 'pending',
    specialization: f.specialization,
    experience: parseInt(f.experience, 10) || 0,
    clinicName: f.clinicName,
    clinicAddress: f.clinicAddress,
    licenseNumber: f.licenseNumber,
    licensePhoto: f.licensePhoto,
    appliedAt: new Date().toISOString(),
    approvedAt: null
  };

  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));

  closeModal('vetApplicationModal');
  showToast('Application submitted. Under review.');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 8. SIMULATE ADMIN APPROVAL (demo)                             */
/* ============================================================ */
function simulateAdminApproval() {
  if (!APP.user || APP.user.vetApplication?.status !== 'pending') return;

  APP.user.vetApplication.status = 'approved';
  APP.user.vetApplication.approvedAt = new Date().toISOString();

  APP.user.roles = APP.user.roles || ['petOwner'];
  if (!APP.user.roles.includes('vet')) {
    APP.user.roles.push('vet');
  }

  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));

  showToast('🎉 Vet role approved!');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 9. MY POSTS                                                   */
/* ============================================================ */
function getMyPosts() {
  const userName = APP.user?.name || 'Guest';

  return (MEMORIES_DATA || [])
    .filter(p => p.authorId === 'user_self' || p.authorName === userName)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderMyPosts(posts) {
  if (!posts.length) {
    return `
      <div class="mp-posts-empty">
        <i class="fas fa-camera-retro"></i>
        <p>You haven't posted anything yet</p>
        <button class="btn btn-primary btn-sm" onclick="openComposerFromProfile()">
          <i class="fas fa-plus"></i> Share Your First Post
        </button>
      </div>
    `;
  }

  return posts.map(p => `
    <button class="mp-post-card" onclick="openPostDetail('${p.id}')">
      ${p.image
        ? `<div class="mp-post-img"><img src="${p.image}" alt="" onerror="this.style.opacity='0'"></div>`
        : `<div class="mp-post-text-only">
             <i class="fas fa-quote-left"></i>
             <p>${(p.title || p.content || '').substring(0, 80)}</p>
           </div>`
      }
      <div class="mp-post-footer">
        <span><i class="fas fa-heart"></i> ${p.likes || 0}</span>
        <span><i class="fas fa-comment"></i> ${(p.comments || []).length}</span>
      </div>
    </button>
  `).join('');
}

function openComposerFromProfile() {
  showPage('memory');
  setTimeout(() => {
    if (typeof openMemoryComposer === 'function') openMemoryComposer();
  }, 200);
}

/* ============================================================ */
/* 10. MY PETS                                                   */
/* ============================================================ */
function renderMyPets(pets) {
  if (!pets.length) {
    return `
      <div class="mp-pets-empty">
        <i class="fas fa-paw"></i>
        <p>No pets added yet</p>
        <button class="btn btn-primary btn-sm" onclick="openAddPetFromProfile()">
          <i class="fas fa-plus"></i> Add Pet
        </button>
      </div>
    `;
  }

  return pets.map(pet => `
    <div class="mp-pet-card">
      <button class="mp-pet-main" onclick="openMyPetDetail('${pet.id}')">
        <div class="mp-pet-image">
          <img src="${pet.avatar || 'assets/avatars/av-cat1.png'}" alt="${pet.name}" onerror="this.style.opacity='0'">
        </div>
        <div class="mp-pet-info">
          <div class="mp-pet-name-row">
            <span class="mp-pet-name">${pet.name}</span>
            ${pet.gender === 'male' ? '<i class="fas fa-mars pet-gender-male"></i>' : pet.gender === 'female' ? '<i class="fas fa-venus pet-gender-female"></i>' : ''}
          </div>
          <p class="mp-pet-breed">${pet.breed || capitalizeLocal(pet.species)}</p>
          <div class="mp-pet-tags">
            ${pet.age ? `<span class="mp-pet-tag">${pet.age} ${pet.age === 1 ? 'year' : 'years'}</span>` : ''}
            <span class="mp-pet-tag mp-pet-tag-healthy"><i class="fas fa-heart-pulse"></i> Healthy</span>
          </div>
        </div>
      </button>
      <button class="mp-pet-menu" onclick="openPetMenu('${pet.id}')" aria-label="Options">
        <i class="fas fa-ellipsis-vertical"></i>
      </button>
    </div>
  `).join('');
}

/* ============================================================ */
/* 11. APPOINTMENTS                                              */
/* ============================================================ */
function getUpcomingAppointments() {
  const stored = APP.appointments || [];
  return stored.slice(0, 3).map(a => {
    const store = getStoreById(a.storeId);
    return {
      id: a.id,
      clinic: store?.name || 'Vet Clinic',
      type: a.consultationType || 'General Checkup',
      date: formatAppointmentDate(a.date),
      location: store?.location || "Cox's Bazar",
      status: a.status || 'confirmed'
    };
  });
}

function formatAppointmentDate(dateStr) {
  if (!dateStr) return 'Soon';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;
  return `${formatDate(d)}, ${time}`;
}

function renderUpcomingAppointments(appointments) {
  if (!appointments.length) {
    return `
      <div class="mp-appt-empty">
        <i class="fas fa-calendar"></i>
        <p>No upcoming appointments</p>
        <button class="btn btn-primary btn-sm" onclick="openBookAppointment()">
          <i class="fas fa-plus"></i> Book Now
        </button>
      </div>
    `;
  }

  return appointments.map(apt => `
    <div class="mp-appt-card">
      <div class="mp-appt-icon"><i class="fas fa-hospital"></i></div>
      <div class="mp-appt-info">
        <div class="mp-appt-top">
          <p class="mp-appt-clinic">${apt.clinic}</p>
          <span class="mp-appt-status status-${apt.status}">${apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span>
        </div>
        <p class="mp-appt-type">${apt.type}</p>
        <p class="mp-appt-meta"><i class="far fa-calendar"></i> ${apt.date}</p>
        <p class="mp-appt-meta"><i class="fas fa-map-marker-alt"></i> ${apt.location}</p>
      </div>
      <button class="mp-appt-menu" onclick="openAppointmentMenu('${apt.id}')" aria-label="Options">
        <i class="fas fa-ellipsis-vertical"></i>
      </button>
    </div>
  `).join('');
}

/* ============================================================ */
/* 12. FAVORITE STORES                                           */
/* ============================================================ */
function renderFavoriteStores(storeIds) {
  if (!storeIds.length) {
    return `
      <div class="mp-fav-empty">
        <i class="fas fa-store"></i>
        <p>No favorite stores yet</p>
        <button class="btn btn-outline btn-sm" onclick="showPage('shop')">Browse Stores</button>
      </div>
    `;
  }

  return storeIds.map(id => {
    const store = getStoreById(id);
    if (!store) return '';
    return `
      <div class="mp-fav-card-wrap">
        <button class="mp-fav-card" onclick="openStoreDetail('${store.id}')">
          <div class="mp-fav-logo"><img src="${store.logo}" alt="" onerror="this.style.opacity='0'"></div>
          <div class="mp-fav-info">
            <p class="mp-fav-name">${store.name}</p>
            <p class="mp-fav-cat">${store.category}</p>
          </div>
        </button>
        <button class="mp-fav-remove" onclick="removeFavoriteStore('${store.id}')" aria-label="Remove">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  }).join('');
}

/* ============================================================ */
/* 13. AVATAR PICKER                                             */
/* ============================================================ */
function openAvatarPicker() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-user-circle"></i> Change Profile Picture</h2>

    <label class="avatar-upload-zone" for="avatarUploadInput">
      <i class="fas fa-cloud-arrow-up"></i>
      <p>Tap to choose from gallery</p>
      <span>JPG, PNG · max 2MB</span>
    </label>
    <input type="file" id="avatarUploadInput" accept="image/*" style="display:none;" onchange="handleAvatarUpload(event)">

    <div class="avatar-upload-preview" id="avatarPreview"></div>

    <button class="btn btn-primary w-full" style="margin-top:16px;" onclick="saveAvatar()" id="saveAvatarBtn" disabled>
      <i class="fas fa-check"></i> Save
    </button>

    ${APP.user?.avatar ? `
      <button class="btn btn-outline w-full" style="margin-top:8px;" onclick="removeAvatar()">
        <i class="fas fa-trash"></i> Remove Photo
      </button>
    ` : ''}
  `;

  profileState.pickedAvatar = null;
  openModal('quickViewModal');
}

function handleAvatarUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast('Image too large (max 2MB)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    profileState.pickedAvatar = ev.target.result;

    const preview = document.getElementById('avatarPreview');
    if (preview) preview.innerHTML = `<img src="${ev.target.result}" alt="Preview">`;

    const btn = document.getElementById('saveAvatarBtn');
    if (btn) btn.disabled = false;
  };
  reader.readAsDataURL(file);
}

function saveAvatar() {
  if (!profileState.pickedAvatar) {
    showToast('Choose a photo first');
    return;
  }
  if (!APP.user) {
    showToast('Please log in first');
    return;
  }

  APP.user.avatar = profileState.pickedAvatar;
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));

  closeModal('quickViewModal');
  showToast('Profile picture updated');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function removeAvatar() {
  if (!APP.user) return;
  if (!confirm('Remove profile picture?')) return;

  delete APP.user.avatar;
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));

  closeModal('quickViewModal');
  showToast('Profile picture removed');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 14. COVER PICKER                                              */
/* ============================================================ */
function getCoverOptions() {
  return [
    { id: 'cover-1', url: 'assets/covers/cover-1.jpg', label: 'Cover 1' },
    { id: 'cover-2', url: 'assets/covers/cover-2.jpg', label: 'Cover 2' },
    { id: 'cover-3', url: 'assets/covers/cover-3.jpg', label: 'Cover 3' },
    { id: 'cover-4', url: 'assets/covers/cover-4.jpg', label: 'Cover 4' },
    { id: 'cover-5', url: 'assets/covers/cover-5.jpg', label: 'Cover 5' }
  ];
}

function openCoverPicker() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const covers = getCoverOptions();
  const current = APP.user?.coverPhoto;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-image"></i> Choose Cover</h2>

    <div class="cover-picker-grid">
      ${covers.map(c => `
        <button class="cover-pick-item ${current === c.url ? 'active' : ''}" onclick="pickCover('${c.url}', this)">
          <div class="cover-pick-img">
            <img src="${c.url}" alt="" onerror="this.parentElement.style.background='var(--pc-paper)'; this.style.display='none';">
          </div>
          <span>${c.label}</span>
        </button>
      `).join('')}
    </div>

    <label class="cover-upload-zone" for="coverUploadInput">
      <i class="fas fa-cloud-arrow-up"></i>
      <p>Or upload from gallery</p>
      <span>JPG, PNG · max 3MB</span>
    </label>
    <input type="file" id="coverUploadInput" accept="image/*" style="display:none;" onchange="handleCoverUpload(event)">

    <button class="btn btn-primary w-full" style="margin-top:16px;" onclick="saveCover()">
      <i class="fas fa-check"></i> Save Cover
    </button>
  `;

  profileState.pickedCover = current || null;
  openModal('quickViewModal');
}

function pickCover(url, btn) {
  profileState.pickedCover = url;
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  modal.querySelectorAll('.cover-pick-item').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function handleCoverUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 3 * 1024 * 1024) {
    showToast('Image too large (max 3MB)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    profileState.pickedCover = ev.target.result;
    showToast('Cover ready. Tap Save.');
  };
  reader.readAsDataURL(file);
}

function saveCover() {
  if (!profileState.pickedCover) {
    showToast('Pick a cover first');
    return;
  }
  if (!APP.user) {
    showToast('Please log in first');
    return;
  }

  APP.user.coverPhoto = profileState.pickedCover;
  localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));

  closeModal('quickViewModal');
  showToast('Cover updated');
  renderProfile();
}

/* ============================================================ */
/* 15. EDIT PROFILE                                              */
/* ============================================================ */
function openEditProfileModal() {
  const modal = document.getElementById('editProfileModal');
  if (!modal) return;

  const user = getProfileUser();

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('editProfileModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-user-pen"></i> Edit Profile</h2>

    <form onsubmit="handleEditProfileSubmit(event)">
      <label>Full Name</label>
      <input type="text" id="editName" value="${user.name}" required>

      <label>Location</label>
      <input type="text" id="editLocation" value="${user.location}" placeholder="City, Country">

      <label>Bio / Tagline</label>
      <textarea id="editBio" placeholder="Short bio..." rows="3">${user.bio}</textarea>

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Save Changes
      </button>
    </form>
  `;

  openModal('editProfileModal');
}

function handleEditProfileSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('editName').value.trim();
  const location = document.getElementById('editLocation').value.trim();
  const bio = document.getElementById('editBio').value.trim();

  if (!name) {
    showToast('Name is required');
    return;
  }

  if (APP.user) {
    APP.user.name = name;
    APP.user.location = location;
    APP.user.bio = bio;
    localStorage.setItem(APP.STORAGE_KEYS.USER, JSON.stringify(APP.user));
  }

  closeModal('editProfileModal');
  showToast('Profile updated');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 16. SETTINGS                                                  */
/* ============================================================ */
function toggleDarkModeSetting() {
  const isDark = document.body.classList.contains('dark-mode');
  toggleTheme(!isDark);
  renderProfile();
}

function handleLogoutConfirm() {
  if (!isLoggedIn()) return;
  if (confirm('Log out of PetCare?')) logout();
}

function openNotificationsSettings() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const prefs = Storage.get('pc_notifPrefs', { push: true, email: false, reminders: true });

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-bell"></i> Notifications</h2>
    <div class="mp-settings-list" style="margin-top:8px;">
      <button class="mp-setting-row" onclick="toggleNotifPref('push', this)">
        <div class="mp-setting-icon icon-bell"><i class="fas fa-mobile-screen"></i></div>
        <div class="mp-setting-info"><p class="mp-setting-label">Push Notifications</p><p class="mp-setting-sub">Alerts & updates</p></div>
        <div class="mp-toggle ${prefs.push ? 'on' : ''}"><div class="mp-toggle-knob"></div></div>
      </button>
      <button class="mp-setting-row" onclick="toggleNotifPref('email', this)">
        <div class="mp-setting-icon icon-info"><i class="fas fa-envelope"></i></div>
        <div class="mp-setting-info"><p class="mp-setting-label">Email Notifications</p><p class="mp-setting-sub">Weekly digest</p></div>
        <div class="mp-toggle ${prefs.email ? 'on' : ''}"><div class="mp-toggle-knob"></div></div>
      </button>
      <button class="mp-setting-row" onclick="toggleNotifPref('reminders', this)">
        <div class="mp-setting-icon icon-moon"><i class="fas fa-clock"></i></div>
        <div class="mp-setting-info"><p class="mp-setting-label">Care Reminders</p><p class="mp-setting-sub">Feeding, medicine, walk</p></div>
        <div class="mp-toggle ${prefs.reminders ? 'on' : ''}"><div class="mp-toggle-knob"></div></div>
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

function toggleNotifPref(key, row) {
  const prefs = Storage.get('pc_notifPrefs', { push: true, email: false, reminders: true });
  prefs[key] = !prefs[key];
  Storage.set('pc_notifPrefs', prefs);
  const toggle = row.querySelector('.mp-toggle');
  if (toggle) toggle.classList.toggle('on', prefs[key]);
  showToast(prefs[key] ? 'Enabled' : 'Disabled');
}

function openPrivacySettings() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-lock"></i> Privacy & Security</h2>
    <div class="mp-settings-list" style="margin-top:8px;">
      <button class="mp-setting-row" onclick="showToast('Password change coming soon')">
        <div class="mp-setting-icon icon-lock"><i class="fas fa-key"></i></div>
        <div class="mp-setting-info"><p class="mp-setting-label">Change Password</p><p class="mp-setting-sub">Update your password</p></div>
        <i class="fas fa-chevron-right mp-setting-arrow"></i>
      </button>
      <button class="mp-setting-row" onclick="handleExportData()">
        <div class="mp-setting-icon icon-info"><i class="fas fa-download"></i></div>
        <div class="mp-setting-info"><p class="mp-setting-label">Download My Data</p><p class="mp-setting-sub">Export as JSON</p></div>
        <i class="fas fa-chevron-right mp-setting-arrow"></i>
      </button>
      <button class="mp-setting-row mp-setting-danger" onclick="closeModal('quickViewModal'); handleClearData();">
        <div class="mp-setting-icon icon-danger"><i class="fas fa-trash"></i></div>
        <div class="mp-setting-info"><p class="mp-setting-label">Clear All Data</p><p class="mp-setting-sub">Reset app</p></div>
        <i class="fas fa-chevron-right mp-setting-arrow"></i>
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* 17. SCROLL HELPERS                                            */
/* ============================================================ */
function scrollToMyPosts() {
  const el = document.getElementById('mpMyPostsSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToPets() {
  const el = document.getElementById('mpPetsSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToAppointments() {
  const el = document.getElementById('mpAppointmentsSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================ */
/* 18. PET MENU / ACTIONS                                        */
/* ============================================================ */
function openPetMenu(petId) {
  const pet = APP.pets.find(p => p.id === petId);
  if (!pet) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-paw"></i> ${pet.name}</h2>
    <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); openEditPetFromProfile('${pet.id}');">
        <i class="fas fa-pen"></i> Edit Pet
      </button>
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); openMyPetDetail('${pet.id}');">
        <i class="fas fa-eye"></i> View Details
      </button>
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); confirmDeletePet('${pet.id}');">
        <i class="fas fa-trash"></i> Delete Pet
      </button>
    </div>
  `;
  openModal('quickViewModal');
}

function confirmDeletePet(petId) {
  const pet = APP.pets.find(p => p.id === petId);
  if (!pet) return;
  if (!confirm(`Delete ${pet.name}?`)) return;

  APP.pets = APP.pets.filter(p => p.id !== petId);
  Storage.set(APP.STORAGE_KEYS.PETS, APP.pets);

  if (APP.activePetId === petId) {
    APP.activePetId = APP.pets[0]?.id || null;
    Storage.set(APP.STORAGE_KEYS.ACTIVE_PET, APP.activePetId);
  }

  showToast(pet.name + ' deleted');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function openEditPetFromProfile(petId) {
  if (typeof openEditPetModal === 'function') {
    showPage('care');
    setTimeout(() => openEditPetModal(petId), 50);
  }
}

function openAddPetFromProfile() {
  if (typeof openPetModal === 'function') {
    showPage('care');
    setTimeout(() => openPetModal(), 50);
  }
}

function openMyPetDetail(petId) {
  const pet = APP.pets.find(p => p.id === petId);
  if (!pet) return;
  APP.activePetId = petId;
  Storage.set(APP.STORAGE_KEYS.ACTIVE_PET, petId);
  showPage('care');
  showToast(pet.name + ' selected');
}

/* ============================================================ */
/* 19. APPOINTMENT MENU                                          */
/* ============================================================ */
function openAppointmentMenu(aptId) {
  const apt = (APP.appointments || []).find(a => a.id === aptId);
  if (!apt) return;
  const store = getStoreById(apt.storeId);

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-calendar-check"></i> Appointment</h2>
    <div class="mp-appt-detail-modal">
      <p><strong>${store?.name || 'Vet Clinic'}</strong></p>
      <p style="color:var(--pc-text-muted); font-size:12.5px; margin-top:6px;">${formatAppointmentDate(apt.date)}</p>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px; margin-top:14px;">
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); confirmDeleteAppointment('${aptId}');">
        <i class="fas fa-trash"></i> Cancel Appointment
      </button>
    </div>
  `;
  openModal('quickViewModal');
}

function confirmDeleteAppointment(aptId) {
  if (!confirm('Cancel this appointment?')) return;
  APP.appointments = (APP.appointments || []).filter(a => a.id !== aptId);
  Storage.set(APP.STORAGE_KEYS.APPOINTMENTS, APP.appointments);
  showToast('Appointment cancelled');
  renderProfile();
}

/* ============================================================ */
/* 20. FAVORITE STORES REMOVE                                    */
/* ============================================================ */
function removeFavoriteStore(storeId) {
  let favs = getFavoriteStores();
  favs = favs.filter(id => id !== storeId);
  Storage.set('pc_favoriteStores', favs);
  showToast('Removed from favorites');
  renderProfile();
}

/* ============================================================ */
/* 21. WISHLIST                                                  */
/* ============================================================ */
function openWishlist() {
  const modal = document.getElementById('wishlistModal');
  if (!modal) return;

  const wishlist = Storage.get('pc_wishlist', []);
  const products = wishlist.map(id => getProductById(id)).filter(Boolean);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('wishlistModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-heart"></i> My Wishlist</h2>
    ${!products.length ? `
      <div class="empty-state">
        <i class="fas fa-heart"></i>
        <p>Your wishlist is empty</p>
        <button class="btn btn-primary btn-sm" onclick="closeModal('wishlistModal'); showPage('shop');" style="margin-top:12px;">
          <i class="fas fa-shopping-bag"></i> Browse Shop
        </button>
      </div>
    ` : `
      <div class="wishlist-list">
        ${products.map(p => `
          <div class="wishlist-item">
            <div class="wishlist-img"><img src="${p.img}" alt="" onerror="this.style.opacity='0'"></div>
            <div class="wishlist-info">
              <p class="wishlist-name">${p.name}</p>
              <p class="wishlist-price">$${p.price.toFixed(2)}</p>
            </div>
            <div class="wishlist-actions">
              <button class="wishlist-add" onclick="addToCart('${p.id}')" aria-label="Add"><i class="fas fa-cart-plus"></i></button>
              <button class="wishlist-remove" onclick="removeFromWishlist('${p.id}')" aria-label="Remove"><i class="fas fa-times"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
  openModal('wishlistModal');
}

function removeFromWishlist(productId) {
  let wishlist = Storage.get('pc_wishlist', []);
  wishlist = wishlist.filter(id => id !== productId);
  Storage.set('pc_wishlist', wishlist);
  APP.wishlist = wishlist;
  showToast('Removed from wishlist');
  openWishlist();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 22. REMINDERS                                                 */
/* ============================================================ */
function openReminders() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  const reminders = Storage.get('pc_reminders', []);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-bell"></i> Pet Reminders</h2>
    ${!reminders.length ? `
      <div class="empty-state">
        <i class="fas fa-bell"></i><p>No reminders set</p>
        <button class="btn btn-primary btn-sm" onclick="closeModal('quickViewModal'); showPage('care'); setTimeout(()=>switchCareTab('today'),100);" style="margin-top:12px;">
          <i class="fas fa-plus"></i> Add Reminder
        </button>
      </div>
    ` : `
      <div class="reminder-list">
        ${reminders.map((r, idx) => `
          <div class="reminder-item">
            <div class="reminder-icon"><i class="fas fa-bell"></i></div>
            <div class="reminder-info">
              <p class="reminder-label">${r.label}</p>
              <p class="reminder-date"><i class="far fa-calendar"></i> ${r.date}</p>
            </div>
            <button class="reminder-remove" onclick="removeReminder(${idx})" aria-label="Remove"><i class="fas fa-trash"></i></button>
          </div>
        `).join('')}
      </div>
    `}
  `;
  openModal('quickViewModal');
}

function removeReminder(index) {
  const reminders = Storage.get('pc_reminders', []);
  if (!reminders[index]) return;
  if (!confirm('Remove this reminder?')) return;
  reminders.splice(index, 1);
  Storage.set('pc_reminders', reminders);
  showToast('Reminder removed');
  openReminders();
}

/* ============================================================ */
/* 23. HEALTH RECORDS                                            */
/* ============================================================ */
function openHealthRecords() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  const allPets = APP.pets || [];
  const allLogs = Storage.get('pc_healthLog', []);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-file-medical"></i> Health Records</h2>
    ${!allPets.length ? `
      <div class="empty-state">
        <i class="fas fa-paw"></i><p>Add a pet first</p>
        <button class="btn btn-primary btn-sm" onclick="closeModal('quickViewModal'); openAddPetFromProfile();" style="margin-top:12px;">
          <i class="fas fa-plus"></i> Add Pet
        </button>
      </div>
    ` : allPets.map(pet => {
      const petLogs = allLogs.filter(l => l.petId === pet.id).slice(0, 3);
      return `
        <div class="health-record-group">
          <div class="health-record-pet">
            <img src="${pet.avatar || 'assets/avatars/av-cat1.png'}" alt="" onerror="this.style.opacity='0'">
            <p>${pet.name}</p>
          </div>
          ${petLogs.length ? petLogs.map(l => `
            <div class="health-record-item">
              <i class="fas fa-notes-medical"></i>
              <div>
                <p class="health-record-note">${l.note}</p>
                <p class="health-record-date">${formatDate(l.date)}</p>
              </div>
            </div>
          `).join('') : `<p class="health-record-empty">No records yet</p>`}
        </div>
      `;
    }).join('')}
  `;
  openModal('quickViewModal');
}

/* ============================================================ */
/* 24. SUPPORT                                                   */
/* ============================================================ */
function openSupport() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-headset"></i> Support</h2>
    <div class="support-list">
      <a href="mailto:support@petcare.com" class="support-item">
        <div class="support-icon"><i class="fas fa-envelope"></i></div>
        <div><p class="support-label">Email Us</p><p class="support-sub">support@petcare.com</p></div>
        <i class="fas fa-chevron-right"></i>
      </a>
      <a href="tel:+8801700000001" class="support-item">
        <div class="support-icon"><i class="fas fa-phone"></i></div>
        <div><p class="support-label">Call Hotline</p><p class="support-sub">+880 1700-000001</p></div>
        <i class="fas fa-chevron-right"></i>
      </a>
    </div>
  `;
  openModal('quickViewModal');
}

/* ============================================================ */
/* 25. ORDERS                                                    */
/* ============================================================ */
function openMyOrders() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  const orders = Storage.get('pc_orders', []);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')"><i class="fas fa-times"></i></button>
    <h2 class="modal-title"><i class="fas fa-shopping-bag"></i> My Orders</h2>
    ${!orders.length ? `
      <div class="empty-state">
        <i class="fas fa-shopping-bag"></i><p>No orders yet</p>
        <button class="btn btn-primary btn-sm" onclick="closeModal('quickViewModal'); showPage('shop');" style="margin-top:12px;">Start Shopping</button>
      </div>
    ` : `
      <div class="orders-list">
        ${orders.map((o, idx) => `
          <div class="order-item">
            <div class="order-icon"><i class="fas fa-box"></i></div>
            <div class="order-info">
              <p class="order-id">Order #${o.id || idx + 1}</p>
              <p class="order-meta">${o.itemsCount || 0} items · $${(o.total || 0).toFixed(2)}</p>
              <p class="order-date">${formatDate(o.date || new Date())}</p>
            </div>
            <button class="order-delete" onclick="deleteOrder(${idx})" aria-label="Delete"><i class="fas fa-trash"></i></button>
          </div>
        `).join('')}
      </div>
    `}
  `;
  openModal('quickViewModal');
}

function deleteOrder(index) {
  const orders = Storage.get('pc_orders', []);
  if (!orders[index]) return;
  if (!confirm('Delete this order?')) return;
  orders.splice(index, 1);
  Storage.set('pc_orders', orders);
  APP.orders = orders;
  showToast('Order deleted');
  openMyOrders();
}

/* ============================================================ */
/* 26. HELPERS                                                   */
/* ============================================================ */
function openBookAppointment() {
  showPage('shop');
  showToast('Select a clinic to book');
}

function showMyReviews() {
  showToast('Reviews: ' + (APP.user?.reviewCount || 0));
}

function showFollowers() {
  showToast('Followers: ' + (APP.user?.followers || 0));
}

function showFollowing() {
  showToast('Following: ' + (APP.user?.following || 0));
}

function showAllFavoritesModal() {
  showPage('shop');
  if (typeof renderShop === 'function') renderShop();
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function openAboutModal() {
  if (typeof renderAboutModal === 'function') {
    renderAboutModal();
    if (typeof openModal === 'function') {
      openModal('aboutModal');
    }
  } else {
    showToast('About unavailable');
  }
}



/* ============================================================ */
/* 27. EXPORT                                                    */
/* ============================================================ */
window.openAboutModal = openAboutModal;
window.renderProfile = renderProfile;
window.scrollToMyPosts = scrollToMyPosts;
window.scrollToPets = scrollToPets;
window.scrollToAppointments = scrollToAppointments;
window.toggleDarkModeSetting = toggleDarkModeSetting;
window.handleLogoutConfirm = handleLogoutConfirm;
window.openAvatarPicker = openAvatarPicker;
window.openCoverPicker = openCoverPicker;
window.handleAvatarUpload = handleAvatarUpload;
window.handleCoverUpload = handleCoverUpload;
window.pickCover = pickCover;
window.saveAvatar = saveAvatar;
window.saveCover = saveCover;
window.removeAvatar = removeAvatar;
window.openEditProfileModal = openEditProfileModal;
window.handleEditProfileSubmit = handleEditProfileSubmit;
window.openPetMenu = openPetMenu;
window.confirmDeletePet = confirmDeletePet;
window.openEditPetFromProfile = openEditPetFromProfile;
window.openAddPetFromProfile = openAddPetFromProfile;
window.openMyPetDetail = openMyPetDetail;
window.openAppointmentMenu = openAppointmentMenu;
window.confirmDeleteAppointment = confirmDeleteAppointment;
window.removeFavoriteStore = removeFavoriteStore;
window.openWishlist = openWishlist;
window.removeFromWishlist = removeFromWishlist;
window.openReminders = openReminders;
window.removeReminder = removeReminder;
window.openHealthRecords = openHealthRecords;
window.openSupport = openSupport;
window.openMyOrders = openMyOrders;
window.deleteOrder = deleteOrder;
window.openBookAppointment = openBookAppointment;
window.openNotificationsSettings = openNotificationsSettings;
window.toggleNotifPref = toggleNotifPref;
window.openPrivacySettings = openPrivacySettings;
window.showMyReviews = showMyReviews;
window.showFollowers = showFollowers;
window.showFollowing = showFollowing;
window.showAllFavoritesModal = showAllFavoritesModal;
window.openRoleSwitcher = openRoleSwitcher;
window.switchActiveRole = switchActiveRole;
window.openVetApplicationModal = openVetApplicationModal;
window.renderVetApplicationModal = renderVetApplicationModal;
window.updateVetField = updateVetField;
window.nextVetStep = nextVetStep;
window.prevVetStep = prevVetStep;
window.handleVetLicenseUpload = handleVetLicenseUpload;
window.submitVetApplication = submitVetApplication;
window.simulateAdminApproval = simulateAdminApproval;
window.openLoginFromProfile = openLoginFromProfile;
window.openComposerFromProfile = openComposerFromProfile;

console.log('PetCare Profile loaded');