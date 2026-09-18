/* ============================================================ */
/* PETCARE v3.0 — FOSTER SYSTEM (Hybrid Lite)                    */
/* Community-driven · Verified rescue orgs · Real management     */
/* ============================================================ */

let fosterState = {
  activeFilter: 'all',
  postPhotoData: null
};

/* ============================================================ */
/* 1. HELPERS                                                    */
/* ============================================================ */
function getListedByInfo(pet) {
  if (!pet || !pet.listedBy) return null;

  // Check verified rescue orgs first
  const org = getRescueOrgById(pet.listedBy);
  if (org) return org;

  // Check app users
  const user = typeof getUserById === 'function' ? getUserById(pet.listedBy) : null;
  if (user) {
    return {
      id: user.id,
      name: user.name,
      type: user.roles?.includes('vet') ? 'vet' : 'user',
      verified: false,
      phone: user.phone || null,
      logo: user.avatar || null,
      location: user.location || ''
    };
  }

  // Self
  if (pet.listedBy === 'user_self' && APP.user) {
    return {
      id: 'user_self',
      name: APP.user.name,
      type: 'user',
      verified: false,
      phone: APP.user.phone || null,
      logo: APP.user.avatar || null,
      location: APP.user.location || ''
    };
  }

  return null;
}

function getListedTime(listedAt) {
  if (!listedAt) return null;

  const now = new Date();
  const listed = new Date(listedAt);
  const diffMs = now - listed;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function isOwnListing(pet) {
  if (!pet) return false;
  if (pet.listedBy === 'user_self') return true;
  return APP.user && pet.listedBy === APP.user.id;
}

/* ============================================================ */
/* 2. HOME CARD RENDER                                           */
/* ============================================================ */
function renderFosterPets() {
  const available = getAvailableFosterPets()
    .sort((a, b) => {
      // Sort by most recent
      return new Date(b.listedAt) - new Date(a.listedAt);
    })
    .slice(0, 8);

  if (!available.length) {
    return `
      <div class="foster-empty-state">
        <i class="fas fa-paw"></i>
        <p>No foster pets listed yet</p>
        <button class="btn btn-primary btn-sm" onclick="openAddFosterModal()">
          <i class="fas fa-plus"></i> List a Foster Pet
        </button>
      </div>
    `;
  }

  return available.map(pet => renderFosterCard(pet)).join('');
}

function renderFosterCard(pet) {
  const org = getListedByInfo(pet);
  const listedTime = getListedTime(pet.listedAt);
  const isVerified = org && org.verified;

  return `
    <div class="foster-item" onclick="openFosterDetail('${pet.id}')">
      <div class="foster-img-wrap">
        <img src="${pet.image}" alt="${escapeHtml(pet.name)}" onerror="this.style.opacity='0'">

        ${isVerified ? `
          <div class="foster-verified-ribbon">
            <i class="fas fa-circle-check"></i> Verified
          </div>
        ` : ''}

        <div class="foster-img-overlay">
          <span class="foster-medical-chip ${pet.medical.healthy ? 'healthy' : 'medical'}">
            <i class="fas ${pet.medical.healthy ? 'fa-heart-pulse' : 'fa-notes-medical'}"></i>
            ${pet.medical.healthy ? 'Healthy' : 'Medical Care'}
          </span>
        </div>
      </div>

      <div class="foster-info">
        <div class="foster-name-row">
          <span class="foster-name">${escapeHtml(pet.name)}</span>
          ${pet.gender === 'male'
            ? '<i class="fas fa-mars pet-gender-male"></i>'
            : '<i class="fas fa-venus pet-gender-female"></i>'}
        </div>

        <p class="foster-meta">
          ${pet.age} · ${escapeHtml(pet.breed)}
        </p>

        <p class="foster-location">
          <i class="fas fa-map-marker-alt"></i> ${pet.distance} away
          ${listedTime ? `<span class="foster-listed-time">· ${listedTime}</span>` : ''}
        </p>

        <div class="foster-footer">
          <span class="foster-views">
            <i class="fas fa-eye"></i> ${pet.views}
          </span>
          <span class="foster-applications">
            <i class="fas fa-users"></i> ${pet.applications.length} applied
          </span>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================ */
/* 3. DETAIL MODAL                                               */
/* ============================================================ */
function openFosterDetail(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  // Increment views
  pet.views = (pet.views || 0) + 1;

  const org = getListedByInfo(pet);
  const listedTime = getListedTime(pet.listedAt);
  const donationProgress = Math.min(100, (pet.donationsReceived / pet.donationGoal) * 100);
  const isOwn = isOwnListing(pet);
  const userApplied = pet.applications.some(a => a.applicantId === 'user_self');

  const modal = document.getElementById('fosterDetailModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('fosterDetailModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="foster-modal-hero">
      <img src="${pet.image}" alt="${escapeHtml(pet.name)}" onerror="this.style.opacity='0'">
      ${org && org.verified ? `
        <div class="foster-verified-badge">
          <i class="fas fa-circle-check"></i> Verified Rescue
        </div>
      ` : ''}
    </div>

    <div class="foster-modal-header">
      <div>
        <h2 class="foster-modal-name">${escapeHtml(pet.name)}</h2>
        <p class="foster-modal-meta">
          ${pet.gender === 'male' ? '<i class="fas fa-mars"></i> Male' : '<i class="fas fa-venus"></i> Female'}
          · ${pet.age} · ${escapeHtml(pet.breed)}
        </p>
        ${listedTime ? `
          <p class="foster-modal-listed">
            <i class="fas fa-clock"></i> Listed ${listedTime}
          </p>
        ` : ''}
      </div>
      <button class="foster-icon-btn" onclick="shareFoster('${pet.id}')" aria-label="Share">
        <i class="fas fa-share-alt"></i>
      </button>
    </div>

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
        <i class="fas fa-users"></i>
        <div>
          <p class="foster-info-label">Applications</p>
          <p class="foster-info-value">${pet.applications.length}</p>
        </div>
      </div>
    </div>

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

    <div class="foster-description">
      <h4 class="foster-section-title">
        <i class="fas fa-book-open"></i> About ${escapeHtml(pet.name)}
      </h4>
      <p class="foster-modal-desc">${escapeHtml(pet.description)}</p>
    </div>

    ${org ? `
      <div class="foster-rescuer-card" onclick="handleListerTap('${pet.listedBy}')">
        <div class="foster-rescuer-icon">
          ${org.logo
            ? `<img src="${org.logo}" alt="" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-shield-heart\\'></i>'">`
            : '<i class="fas fa-shield-heart"></i>'
          }
        </div>
        <div class="foster-rescuer-info">
          <p class="foster-rescuer-name">
            ${escapeHtml(org.name)}
            ${org.verified ? '<i class="fas fa-circle-check verified"></i>' : ''}
          </p>
          <p class="foster-rescuer-role">
            ${org.verified ? 'Verified Rescue' : 'Community Member'}
            ${org.rescuedCount ? `· ${org.rescuedCount} rescued` : ''}
          </p>
        </div>
        ${org.phone ? `
          <button class="foster-icon-btn" onclick="event.stopPropagation(); handleVetCall('${escapeHtml(org.name)}', '${org.phone}')">
            <i class="fas fa-phone"></i>
          </button>
        ` : ''}
      </div>
    ` : ''}

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

    ${isOwn ? `
      <div class="foster-own-actions">
        <h4 class="foster-section-title">
          <i class="fas fa-user-cog"></i> Your Listing
        </h4>
        <div class="foster-own-buttons">
          <button class="btn btn-outline" onclick="openEditFosterModal('${pet.id}')">
            <i class="fas fa-pen"></i> Edit
          </button>
          <button class="btn btn-outline" onclick="viewFosterApplications('${pet.id}')">
            <i class="fas fa-users"></i> Applications (${pet.applications.length})
          </button>
          <button class="btn btn-primary" onclick="markFosterAsFostered('${pet.id}')">
            <i class="fas fa-check"></i> Mark as Fostered
          </button>
          <button class="btn btn-danger" onclick="confirmDeleteFoster('${pet.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    ` : `
      <div class="foster-cta-actions">
        <button class="foster-cta-primary" onclick="openFosterApplyModal('${pet.id}')" ${userApplied ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>
          <i class="fas ${userApplied ? 'fa-check' : 'fa-hand-holding-heart'}"></i>
          ${userApplied ? 'Applied' : 'Apply to Foster'}
        </button>
        <button class="foster-cta-secondary" onclick="openFosterDonateModal('${pet.id}')">
          <i class="fas fa-heart"></i> Donate
        </button>
      </div>
    `}

    <button class="foster-cta-share" onclick="shareFoster('${pet.id}')">
      <i class="fas fa-share-alt"></i> Share with Friends
    </button>
  `;

  openModal('fosterDetailModal');
}

function handleListerTap(listerId) {
  if (!listerId) return;

  // Check if it's a rescue org
  const org = getRescueOrgById(listerId);
  if (org) {
    closeModal('fosterDetailModal');
    // Show org profile in a modal (simple)
    setTimeout(() => showOrgProfile(org.id), 250);
    return;
  }

  // Self
  if (listerId === 'user_self') {
    closeModal('fosterDetailModal');
    setTimeout(() => showPage('profile'), 250);
    return;
  }

  // Other user
  if (typeof openUserProfile === 'function') {
    closeModal('fosterDetailModal');
    setTimeout(() => openUserProfile(listerId), 250);
  }
}

function showOrgProfile(orgId) {
  const org = getRescueOrgById(orgId);
  if (!org) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const orgPets = getFosterPetsByLister(orgId).filter(p => p.status === 'available');

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="org-profile-header">
      <div class="org-profile-logo">
        ${org.logo
          ? `<img src="${org.logo}" alt="" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-shield-heart\\'></i>'">`
          : '<i class="fas fa-shield-heart"></i>'
        }
      </div>
      <h2 class="org-profile-name">
        ${escapeHtml(org.name)}
        ${org.verified ? '<i class="fas fa-circle-check verified"></i>' : ''}
      </h2>
      <p class="org-profile-type">Verified Rescue Organization</p>
    </div>

    <div class="org-profile-stats">
      <div class="org-stat">
        <p class="org-stat-value">${org.rescuedCount}</p>
        <p class="org-stat-label">Rescued</p>
      </div>
      <div class="org-stat">
        <p class="org-stat-value">${orgPets.length}</p>
        <p class="org-stat-label">Available</p>
      </div>
      <div class="org-stat">
        <p class="org-stat-value">${org.since}</p>
        <p class="org-stat-label">Since</p>
      </div>
    </div>

    <div class="org-profile-section">
      <p class="foster-section-title"><i class="fas fa-info-circle"></i> About</p>
      <p style="font-size: 13.5px; color: var(--pc-text-2); line-height: 1.6;">${escapeHtml(org.description)}</p>
    </div>

    <div class="org-profile-section">
      <p class="foster-section-title"><i class="fas fa-map-marker-alt"></i> Location</p>
      <p style="font-size: 13.5px; color: var(--pc-text-2);">${escapeHtml(org.location)}</p>
    </div>

    ${orgPets.length ? `
      <div class="org-profile-section">
        <p class="foster-section-title"><i class="fas fa-paw"></i> Currently Listed</p>
        <div class="org-pets-scroll">
          ${orgPets.map(pet => `
            <div class="org-pet-mini" onclick="closeModal('quickViewModal'); setTimeout(()=>openFosterDetail('${pet.id}'), 250);">
              <img src="${pet.image}" alt="" onerror="this.style.opacity='0'">
              <p>${escapeHtml(pet.name)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${org.phone ? `
      <button class="btn btn-primary w-full" style="margin-top: 16px;" onclick="handleVetCall('${escapeHtml(org.name)}', '${org.phone}')">
        <i class="fas fa-phone"></i> Contact Organization
      </button>
    ` : ''}
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* 4. APPLY MODAL                                                */
/* ============================================================ */
function openFosterApplyModal(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  closeModal('fksterDetailModal');

  if (!isLoggedIn()) {
    showToast('Please sign in to apply');
    closeModal('fosterDetailModal');
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
      <i class="fas fa-hand-holding-heart"></i> Apply to Foster ${escapeHtml(pet.name)}
    </h2>

    <form onsubmit="handleFosterApplySubmit(event, '${pet.id}')">
      <label>Your Full Name *</label>
      <input type="text" id="fosterName" value="${escapeHtml(APP.user?.name || '')}" required>

      <label>Phone Number *</label>
      <input type="tel" id="fosterPhone" value="${escapeHtml(APP.user?.phone || '')}" required placeholder="+880 17XX-XXXXXX">

      <label>Your Address *</label>
      <textarea id="fosterAddress" required rows="2" placeholder="Your home address..."></textarea>

      <label>Do you have other pets? *</label>
      <select id="fosterHasPets" required>
        <option value="">Select</option>
        <option value="no">No</option>
        <option value="yes-cats">Yes, cats only</option>
        <option value="yes-dogs">Yes, dogs only</option>
        <option value="yes-mixed">Yes, mixed</option>
      </select>

      <label>Prior fostering experience? *</label>
      <select id="fosterExperience" required>
        <option value="">Select</option>
        <option value="none">First time</option>
        <option value="some">Some experience</option>
        <option value="experienced">Very experienced</option>
      </select>

      <label>Why do you want to foster ${escapeHtml(pet.name)}? *</label>
      <textarea id="fosterReason" required rows="3" placeholder="Tell us a bit about why you'd be a good foster parent..." minlength="20" maxlength="500"></textarea>

      <label class="foster-checkbox-row">
        <input type="checkbox" id="fosterAgree" required>
        <span>I agree to provide a safe, loving temporary home for ${escapeHtml(pet.name)}</span>
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

  const pet = getFosterPetById(petId);
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
    id: 'fapp_' + Date.now(),
    applicantId: 'user_self',
    applicantName: name,
    applicantPhone: phone,
    applicantAddress: address,
    hasPets,
    experience,
    reason,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  pet.applications.push(application);

  // Save globally
  saveFosterPets();

  // Notification to lister
  if (pet.listedBy !== 'user_self') {
    APP.notifications = APP.notifications || [];
    APP.notifications.unshift({
      id: 'notif_' + Date.now(),
      type: 'foster',
      title: '🐾 New Foster Application',
      message: `${name} applied to foster ${pet.name}.`,
      date: new Date().toISOString(),
      read: false
    });
    Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, APP.notifications);
    if (typeof updateNotifBadge === 'function') updateNotifBadge();
    if (typeof refreshDrawer === 'function') refreshDrawer();
  }

  // ⭐ Close apply modal
  closeModal('quickViewModal');

  showToast(`Application for ${pet.name} submitted!`);

  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  // ⭐ Reopen detail modal after short delay
  setTimeout(() => {
    openFosterDetail(petId);
  }, 400);
}
/* ============================================================ */
/* 5. DONATE MODAL                                               */
/* ============================================================ */
function openFosterDonateModal(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  closeModal('openFosterDetailModal');

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const amounts = [5, 10, 25, 50, 100];

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-hand-holding-heart"></i> Donate to ${escapeHtml(pet.name)}
    </h2>

    <div class="foster-donate-hero">
      <img src="${pet.image}" alt="${escapeHtml(pet.name)}" onerror="this.style.opacity='0'">
      <div>
        <p class="foster-donate-pet-name">${escapeHtml(pet.name)}</p>
        <p class="foster-donate-pet-meta">${pet.age} · ${escapeHtml(pet.breed)}</p>
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
        <button type="button" class="foster-donate-chip" onclick="selectDonateAmount(${a}, this)">
          $${a}
        </button>
      `).join('')}
    </div>

    <label class="foster-donate-custom-label">
      Or enter custom amount
      <input type="number" id="fosterDonateCustom" placeholder="$" min="1" max="10000">
    </label>

    <button type="button" class="btn btn-primary w-full" style="margin-top:20px;" onclick="handleFosterDonate('${pet.id}')">
      <i class="fas fa-heart"></i> Donate Now
    </button>

    <p class="foster-donate-disclaimer">
      <i class="fas fa-info-circle"></i>
      Demo donation — no real payment processed
    </p>
  `;

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
  const pet = getFosterPetById(petId);
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

  pet.donationsReceived = (pet.donationsReceived || 0) + amount;

  pet.donatedBy = pet.donatedBy || [];
  pet.donatedBy.push({
    donorId: 'user_self',
    donorName: APP.user?.name || 'Guest',
    amount,
    date: new Date().toISOString()
  });

  saveFosterPets();

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

  // ⭐ Reopen detail modal
  setTimeout(() => {
    openFosterDetail(petId);
  }, 400);
}

/* ============================================================ */
/* 6. ADD / EDIT MODAL                                           */
/* ============================================================ */
function openAddFosterModal() {
  if (!isLoggedIn()) {
    showToast('Please sign in to list a foster pet');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  fosterState.postPhotoData = null;
  renderFosterForm(null);
}

function openEditFosterModal(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  fosterState.postPhotoData = pet.image;
  renderFosterForm(pet);
}

function renderFosterForm(existingPet) {
  const modal = document.getElementById('fosterFormModal');
  if (!modal) return;

  const isEdit = !!existingPet;
  const pet = existingPet || {};

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('fosterFormModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-paw"></i> ${isEdit ? 'Edit Foster Listing' : 'List a Foster Pet'}
    </h2>

    <form onsubmit="handleFosterFormSubmit(event, ${isEdit ? `'${pet.id}'` : 'null'})">
      <label>Photo *</label>
      <div class="mem-photo-upload ${fosterState.postPhotoData ? 'attached' : ''}" id="fosterPhotoUpload">
        <i class="fas ${fosterState.postPhotoData ? 'fa-check-circle' : 'fa-camera'}"></i>
        <span>${fosterState.postPhotoData ? 'Photo attached' : 'Tap to add photo'}</span>
      </div>
      <input type="file" id="fosterPhotoInput" accept="image/*" style="display:none;">

      <label>Pet Name *</label>
      <input type="text" id="fosterPetName" value="${escapeHtml(pet.name || '')}" required maxlength="30">

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label>Species *</label>
          <select id="fosterPetSpecies" required>
            <option value="">Select</option>
            <option value="cat" ${pet.species === 'cat' ? 'selected' : ''}>Cat</option>
            <option value="dog" ${pet.species === 'dog' ? 'selected' : ''}>Dog</option>
            <option value="bird" ${pet.species === 'bird' ? 'selected' : ''}>Bird</option>
            <option value="rabbit" ${pet.species === 'rabbit' ? 'selected' : ''}>Rabbit</option>
            <option value="other" ${pet.species === 'other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
        <div>
          <label>Gender</label>
          <select id="fosterPetGender">
            <option value="">Select</option>
            <option value="male" ${pet.gender === 'male' ? 'selected' : ''}>Male</option>
            <option value="female" ${pet.gender === 'female' ? 'selected' : ''}>Female</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label>Age *</label>
          <input type="text" id="fosterPetAge" value="${escapeHtml(pet.age || '')}" placeholder="e.g. 2 months" required maxlength="20">
        </div>
        <div>
          <label>Breed</label>
          <input type="text" id="fosterPetBreed" value="${escapeHtml(pet.breed || '')}" placeholder="e.g. Mixed" maxlength="30">
        </div>
      </div>

      <label>Location *</label>
      <input type="text" id="fosterPetLocation" value="${escapeHtml(pet.location || '')}" placeholder="e.g. Kolatoli Beach Road, Cox's Bazar" required>

      <label>Foster Duration *</label>
      <input type="text" id="fosterPetDuration" value="${escapeHtml(pet.fosterDuration || '')}" placeholder="e.g. 2-3 weeks" required>

      <label>Monthly Cost (USD) *</label>
      <input type="number" id="fosterPetCost" value="${pet.monthlyCost || ''}" placeholder="25" min="0" max="1000" required>

      <label>Description *</label>
      <textarea id="fosterPetDescription" rows="4" required placeholder="Tell us about this pet..." minlength="30" maxlength="500">${escapeHtml(pet.description || '')}</textarea>

      <label>Medical Status</label>
      <div class="foster-medical-form">
        <label class="foster-checkbox-row">
          <input type="checkbox" id="fosterMedVax" ${pet.medical?.vaccinated ? 'checked' : ''}>
          <span>Vaccinated</span>
        </label>
        <label class="foster-checkbox-row">
          <input type="checkbox" id="fosterMedDeworm" ${pet.medical?.dewormed ? 'checked' : ''}>
          <span>Dewormed</span>
        </label>
        <label class="foster-checkbox-row">
          <input type="checkbox" id="fosterMedNeutered" ${pet.medical?.neutered ? 'checked' : ''}>
          <span>Neutered</span>
        </label>
        <label class="foster-checkbox-row">
          <input type="checkbox" id="fosterMedHealthy" ${pet.medical?.healthy ? 'checked' : ''}>
          <span>Healthy</span>
        </label>
      </div>

      <label>Medical Notes</label>
      <textarea id="fosterMedNotes" rows="2" placeholder="Optional notes about health..." maxlength="200">${escapeHtml(pet.medical?.notes || '')}</textarea>

      <button type="submit" class="btn btn-primary w-full" style="margin-top: 16px;">
        <i class="fas fa-check"></i> ${isEdit ? 'Save Changes' : 'List Foster Pet'}
      </button>
    </form>
  `;

  document.getElementById('fosterPhotoUpload').addEventListener('click', () => {
    document.getElementById('fosterPhotoInput').click();
  });

  document.getElementById('fosterPhotoInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image too large (max 2MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      fosterState.postPhotoData = ev.target.result;
      const upload = document.getElementById('fosterPhotoUpload');
      if (upload) {
        upload.classList.add('attached');
        upload.innerHTML = '<i class="fas fa-check-circle"></i><span>Photo attached</span>';
      }
    };
    reader.readAsDataURL(file);
  });

  openModal('fosterFormModal');
}

function handleFosterFormSubmit(e, petId) {
  e.preventDefault();

  if (!fosterState.postPhotoData) {
    showToast('Please add a photo');
    return;
  }

  const name = document.getElementById('fosterPetName').value.trim();
  const species = document.getElementById('fosterPetSpecies').value;
  const gender = document.getElementById('fosterPetGender').value;
  const age = document.getElementById('fosterPetAge').value.trim();
  const breed = document.getElementById('fosterPetBreed').value.trim();
  const location = document.getElementById('fosterPetLocation').value.trim();
  const fosterDuration = document.getElementById('fosterPetDuration').value.trim();
  const monthlyCost = parseFloat(document.getElementById('fosterPetCost').value) || 0;
  const description = document.getElementById('fosterPetDescription').value.trim();
  const medNotes = document.getElementById('fosterMedNotes').value.trim();

  if (!name || !species || !age || !location || !fosterDuration || !monthlyCost || !description) {
    showToast('Please fill all required fields');
    return;
  }

  const medical = {
    vaccinated: document.getElementById('fosterMedVax').checked,
    dewormed: document.getElementById('fosterMedDeworm').checked,
    neutered: document.getElementById('fosterMedNeutered').checked,
    healthy: document.getElementById('fosterMedHealthy').checked,
    specialNeeds: false,
    notes: medNotes
  };

  if (petId) {
    // Edit
    const pet = getFosterPetById(petId);
    if (pet) {
      Object.assign(pet, {
        name, species, gender, age, breed, location,
        fosterDuration, monthlyCost, description,
        image: fosterState.postPhotoData,
        medical
      });
    }
    showToast('Foster listing updated');
  } else {
    // Create new
    const newPet = {
      id: 'foster_' + Date.now(),
      name, species, gender, age, breed, location,
      fosterDuration, monthlyCost, description,
      image: fosterState.postPhotoData,
      gallery: [fosterState.postPhotoData],
      ageMonths: 0,
      distance: 'Nearby',
      donationsReceived: 0,
      donationGoal: 100,
      views: 0,
      status: 'available',
      listedBy: 'user_self',
      listedAt: new Date().toISOString(),
      applications: [],
      donatedBy: [],
      medical
    };

    FOSTER_PETS.unshift(newPet);
    showToast(`${name} listed for foster!`);

    if (typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  }

  saveFosterPets();
  closeModal('fosterFormModal');

  // Refresh home
  if (APP.currentPage === 'home' && typeof renderHome === 'function') {
    renderHome();
  }
  if (APP.currentPage === 'profile' && typeof renderProfile === 'function') {
    renderProfile();
  }
}

/* ============================================================ */
/* 7. APPLICATIONS MANAGEMENT                                    */
/* ============================================================ */
function viewFosterApplications(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-users"></i> Applications for ${escapeHtml(pet.name)}
    </h2>

    ${!pet.applications.length ? `
      <div class="empty-state" style="padding: 40px 20px;">
        <i class="fas fa-inbox" style="font-size: 40px; opacity: 0.3; display: block; margin-bottom: 12px;"></i>
        <p style="font-size: 14px; font-weight: 700; color: var(--pc-text);">No applications yet</p>
        <p style="font-size: 12px; color: var(--pc-text-muted); margin-top: 4px;">Share this listing to reach more people</p>
      </div>
    ` : `
      <div class="foster-applications-list">
        ${pet.applications.map(app => `
          <div class="foster-application-item">
            <div class="foster-app-header">
              <div class="foster-app-avatar">${app.applicantName.charAt(0).toUpperCase()}</div>
              <div class="foster-app-info">
                <p class="foster-app-name">${escapeHtml(app.applicantName)}</p>
                <p class="foster-app-meta">
                  <i class="fas fa-phone"></i> ${escapeHtml(app.applicantPhone)}
                </p>
                <p class="foster-app-meta">
                  <i class="fas fa-clock"></i> ${timeAgo(app.submittedAt)}
                </p>
              </div>
              <span class="foster-app-status status-${app.status}">
                ${app.status}
              </span>
            </div>
            <div class="foster-app-details">
              <p><strong>Address:</strong> ${escapeHtml(app.applicantAddress)}</p>
              <p><strong>Other pets:</strong> ${escapeHtml(app.hasPets)}</p>
              <p><strong>Experience:</strong> ${escapeHtml(app.experience)}</p>
              <p><strong>Reason:</strong> ${escapeHtml(app.reason)}</p>
            </div>
            ${app.status === 'pending' ? `
              <div class="foster-app-actions">
                <button class="btn btn-primary btn-sm" onclick="acceptFosterApplication('${pet.id}', '${app.id}')">
                  <i class="fas fa-check"></i> Accept
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectFosterApplication('${pet.id}', '${app.id}')">
                  <i class="fas fa-times"></i> Decline
                </button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `}
  `;

  openModal('quickViewModal');
}

function acceptFosterApplication(petId, appId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  const app = pet.applications.find(a => a.id === appId);
  if (!app) return;

  if (!confirm(`Accept ${app.applicantName}'s application? Pet will be marked as Fostered.`)) return;

  app.status = 'accepted';
  pet.status = 'fostered';

  // Reject all other applications
  pet.applications.forEach(a => {
    if (a.id !== appId && a.status === 'pending') {
      a.status = 'rejected';
    }
  });

  saveFosterPets();

  // Notification
  APP.notifications = APP.notifications || [];
  APP.notifications.unshift({
    id: 'notif_' + Date.now(),
    type: 'foster',
    title: '✅ Foster Accepted',
    message: `${pet.name} now has a foster family — ${app.applicantName}.`,
    date: new Date().toISOString(),
    read: false
  });
  Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, APP.notifications);
  if (typeof updateNotifBadge === 'function') updateNotifBadge();

  showToast(`${pet.name} is now fostered!`);
  closeModal('quickViewModal');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  }
}

function rejectFosterApplication(petId, appId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  const app = pet.applications.find(a => a.id === appId);
  if (!app) return;

  if (!confirm(`Decline ${app.applicantName}'s application?`)) return;

  app.status = 'rejected';
  saveFosterPets();

  showToast('Application declined');
  viewFosterApplications(petId);
}

/* ============================================================ */
/* 8. MARK AS FOSTERED / DELETE                                  */
/* ============================================================ */
function markFosterAsFostered(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  if (!confirm(`Mark ${pet.name} as fostered? It will be hidden from the public list.`)) return;

  pet.status = 'fostered';
  saveFosterPets();

  showToast(`${pet.name} marked as fostered 🎉`);
  closeModal('fosterDetailModal');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  if (APP.currentPage === 'home' && typeof renderHome === 'function') renderHome();
  if (APP.currentPage === 'profile' && typeof renderProfile === 'function') renderProfile();
}

function confirmDeleteFoster(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  if (!confirm(`Delete ${pet.name}'s listing permanently? This cannot be undone.`)) return;

  const idx = FOSTER_PETS.findIndex(p => p.id === petId);
  if (idx !== -1) FOSTER_PETS.splice(idx, 1);

  saveFosterPets();

  showToast('Listing deleted');
  closeModal('fosterDetailModal');

  if (APP.currentPage === 'home' && typeof renderHome === 'function') renderHome();
  if (APP.currentPage === 'profile' && typeof renderProfile === 'function') renderProfile();
}

/* ============================================================ */
/* 9. SHARE                                                      */
/* ============================================================ */
function shareFoster(petId) {
  const pet = getFosterPetById(petId);
  if (!pet) return;

  const shareData = {
    title: `Foster ${pet.name} — PetCare`,
    text: `${pet.name} (${pet.age}) needs a foster home. Located near ${pet.location}.`,
    url: window.location.origin
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => showToast('Shared!'))
      .catch(() => {});
  } else {
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
/* 10. SAVE TO STORAGE                                           */
/* ============================================================ */
function saveFosterPets() {
  try {
    localStorage.setItem('pc_fosterPets', JSON.stringify(FOSTER_PETS));
  } catch (e) {
    console.warn('Failed to save foster pets', e);
  }
}

function loadFosterPets() {
  try {
    // ⭐ Check demo user's listings backup first
    const demoListings = localStorage.getItem('pc_demo_myFosterListings');
    if (demoListings) {
      try {
        const demoPets = JSON.parse(demoListings);
        if (Array.isArray(demoPets)) {
          demoPets.forEach(demoPet => {
            const exists = FOSTER_PETS.find(p => p.id === demoPet.id);
            if (!exists) {
              FOSTER_PETS.unshift(demoPet);
            }
          });
        }
      } catch (e) {
        console.warn('Failed to load demo foster listings', e);
      }
    }

    // Load regular foster pets
    const stored = localStorage.getItem('pc_fosterPets');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        parsed.forEach(storedPet => {
          const existing = FOSTER_PETS.find(p => p.id === storedPet.id);
          if (existing) {
            Object.assign(existing, storedPet);
          } else {
            FOSTER_PETS.push(storedPet);
          }
        });
      }
    }
  } catch (e) {
    console.warn('Failed to load foster pets', e);
  }
}

// Auto-load on init
if (typeof Storage !== 'undefined') {
  setTimeout(loadFosterPets, 100);
}

/* ============================================================ */
/* 11. EXPORTS                                                   */
/* ============================================================ */
window.renderFosterPets = renderFosterPets;
window.renderFosterCard = renderFosterCard;
window.openFosterDetail = openFosterDetail;
window.openFosterApplyModal = openFosterApplyModal;
window.handleFosterApplySubmit = handleFosterApplySubmit;
window.openFosterDonateModal = openFosterDonateModal;
window.selectDonateAmount = selectDonateAmount;
window.handleFosterDonate = handleFosterDonate;
window.openAddFosterModal = openAddFosterModal;
window.openEditFosterModal = openEditFosterModal;
window.handleFosterFormSubmit = handleFosterFormSubmit;
window.viewFosterApplications = viewFosterApplications;
window.acceptFosterApplication = acceptFosterApplication;
window.rejectFosterApplication = rejectFosterApplication;
window.markFosterAsFostered = markFosterAsFostered;
window.confirmDeleteFoster = confirmDeleteFoster;
window.shareFoster = shareFoster;
window.handleListerTap = handleListerTap;
window.showOrgProfile = showOrgProfile;
window.getListedTime = getListedTime;
window.getListedByInfo = getListedByInfo;
window.isOwnListing = isOwnListing;
window.saveFosterPets = saveFosterPets;
window.loadFosterPets = loadFosterPets;

console.log('PetCare Foster loaded — Hybrid Lite');