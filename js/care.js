/* ============================================================ */
/* PETCARE v3.0 — CARE PAGE                                      */
/* 5 Tabs: Today, Calendar, Health, Guidance, Tips               */
/* Real-app style: pet-specific, hybrid care, custom items       */
/* ============================================================ */

let careState = {
  activeTab: 'today',
  activePetId: null,
  activeTipCategory: 'all',
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  selectedCalendarDate: null,
  selectedAvatar: null,
  editingPetId: null,
  healthLogFilter: 'all',
  healthLogType: 'note',
  editingHealthLogId: null,
  editingVaxIndex: null,
  editingMedId: null
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderCare() {
  const page = document.getElementById('page-care');
  if (!page) return;

  const activePet = getActivePet();
  careState.activePetId = activePet?.id || null;

  page.innerHTML = `
    <div class="page-container">

      <section class="hero-card">
        <div class="hero-card-body">
          <div class="hero-card-text">
            <h2 class="hero-greeting">Caring today,</h2>
            <p class="hero-sub">healthier tomorrow</p>
          </div>
          <div class="hero-illustration">
            <img src="assets/illustrations/hero-dog-cat.png" alt="Pets" onerror="this.style.opacity='0'">
          </div>
        </div>
      </section>

      <div class="pet-selector" id="petSelector">
        ${renderPetSelector()}
        <button class="pet-add-btn" id="petAddBtn" aria-label="Add pet">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <div class="care-tabs" id="careTabs">
        <button class="care-tab ${careState.activeTab === 'today' ? 'active' : ''}" data-care-tab="today">Today</button>
        <button class="care-tab ${careState.activeTab === 'calendar' ? 'active' : ''}" data-care-tab="calendar">Calendar</button>
        <button class="care-tab ${careState.activeTab === 'health' ? 'active' : ''}" data-care-tab="health">Health</button>
        <button class="care-tab ${careState.activeTab === 'guidance' ? 'active' : ''}" data-care-tab="guidance">Guidance</button>
        <button class="care-tab ${careState.activeTab === 'tips' ? 'active' : ''}" data-care-tab="tips">Tips</button>
      </div>

      <div id="careTabContent">
        ${renderCareTabContent()}
      </div>

    </div>
  `;

  attachCareHandlers();
}

function renderCareTabContent() {
  switch (careState.activeTab) {
    case 'today':    return renderTodayTab();
    case 'calendar': return renderCalendarTab();
    case 'health':   return renderHealthTab();
    case 'guidance': return renderGuidanceTab();
    case 'tips':     return renderTipsTab();
    default:         return renderTodayTab();
  }
}

/* ============================================================ */
/* 2. PET SELECTOR                                               */
/* ============================================================ */
function renderPetSelector() {
  if (!APP.pets.length) {
    return `<p class="pet-selector-empty">No pets yet</p>`;
  }

  return APP.pets.map(pet => {
    const isActive = pet.id === careState.activePetId;
    const avatar = pet.avatar || 'assets/avatars/av-cat1.png';
    return `
      <button class="pet-chip ${isActive ? 'active' : ''}" data-pet-id="${pet.id}">
        <div class="pet-chip-avatar">
          <img src="${avatar}" alt="${pet.name}" onerror="this.style.opacity='0'">
        </div>
        <div class="pet-chip-name-pill">
          <span>${pet.name}</span>
          ${isActive ? `<i class="fas fa-pen pet-edit-icon" data-edit-pet="${pet.id}"></i>` : ''}
        </div>
      </button>
    `;
  }).join('');
}

/* ============================================================ */
/* 3. TAB: TODAY                                                 */
/* ============================================================ */
function renderTodayTab() {
  return `
    <section class="care-section">
      <div class="care-section-header">
        <h3><i class="fas fa-paw"></i> Today's Care</h3>
        <span class="streak-badge">
          <i class="fas fa-fire"></i> ${getStreak()} day
        </span>
      </div>
      <p class="care-section-sub">Keep your pet happy &amp; healthy</p>
      <div class="today-care-list" id="todayCareList">
        ${renderTodayCareList()}
      </div>
    </section>

    <section class="care-section">
      <div class="care-section-header">
        <h3><i class="fas fa-bell"></i> Upcoming Reminders</h3>
        <button class="mini-add-btn" id="addReminderBtn">
          <i class="fas fa-plus"></i> Add
        </button>
      </div>
      <div class="upcoming-list" id="upcomingList">
        ${renderUpcomingReminders()}
      </div>
    </section>
  `;
}

/* ============================================================ */
/* TODAY'S CARE — Hybrid (4 fixed + user custom items)           */
/* ============================================================ */
function renderTodayCareList() {
  const pet = getActivePet();

  if (!pet) {
    return `
      <div class="empty-state" style="padding: 20px;">
        <i class="fas fa-paw" style="font-size: 28px; opacity: 0.4; display: block; margin-bottom: 8px;"></i>
        <p style="font-size: 13px;">No pets added yet</p>
        <button class="btn btn-primary btn-sm" onclick="openPetModal()" style="margin-top: 10px;">
          <i class="fas fa-plus"></i> Add Pet
        </button>
      </div>
    `;
  }

  const care = loadDailyCare(pet.id);

  // Fixed default items
  const defaultItems = [
    { key: 'feeding',  label: 'Feeding',  sub: '2/2 times',  icon: 'fa-bowl-food' },
    { key: 'water',    label: 'Water',    sub: 'Fresh & clean',          icon: 'fa-droplet' },
    { key: 'walk',     label: 'Walk',     sub: '30 minutes',             icon: 'fa-person-walking' },
    { key: 'medicine', label: 'Medicine', sub: 'Deworming (morning)',    icon: 'fa-pills' }
  ];

  const defaultHtml = defaultItems.map(item => `
    <div class="today-care-row ${care[item.key] ? 'done' : ''}" data-care-key="${item.key}">
      <div class="care-check">
        <i class="fas ${care[item.key] ? 'fa-check-circle' : 'fa-circle'}"></i>
      </div>
      <div class="care-info">
        <p class="care-title">${item.label}</p>
        <p class="care-sub">${item.sub}</p>
      </div>
      <i class="fas ${item.icon} care-icon"></i>
    </div>
  `).join('');

  // Custom user items
  const customItems = loadCustomCareItems(pet.id);

  const customHtml = customItems.length ? `
    <div class="custom-care-divider">
      <span>Custom Care</span>
    </div>
    ${customItems.map(item => `
      <div class="today-care-row custom-care-row ${item.done ? 'done' : ''}"
           data-custom-care-id="${item.id}">
        <div class="care-check">
          <i class="fas ${item.done ? 'fa-check-circle' : 'fa-circle'}"></i>
        </div>
        <div class="care-info">
          <p class="care-title">${escapeHtml(item.label)}</p>
          <p class="care-sub">Custom item</p>
        </div>
        <i class="fas ${item.icon} care-icon"></i>
        <button class="custom-care-menu-btn" data-custom-care-menu="${item.id}" aria-label="Options">
          <i class="fas fa-ellipsis-vertical"></i>
        </button>
      </div>
    `).join('')}
  ` : '';

  const addBtnHtml = `
    <button class="add-custom-care-btn" id="addCustomCareBtn">
      <i class="fas fa-plus"></i> Add Custom Care
    </button>
  `;

  // Attach handlers after render
  setTimeout(attachTodayCareHandlers, 50);

  return defaultHtml + customHtml + addBtnHtml;
}

function attachTodayCareHandlers() {
  const pet = getActivePet();
  if (!pet) return;

  // Fixed items — toggle
  document.querySelectorAll('.today-care-row[data-care-key]').forEach(row => {
    row.addEventListener('click', () => {
      toggleCareItem(row.dataset.careKey);
    });
  });

  // Custom items — toggle + menu
  document.querySelectorAll('.today-care-row[data-custom-care-id]').forEach(row => {
    const itemId = row.dataset.customCareId;
    if (!itemId) return;

    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-custom-care-menu]')) return;
      toggleCustomCareItem(pet.id, itemId);
      switchCareTab('today');
    });

    // Long press → menu
    if (typeof attachLongPress === 'function') {
      attachLongPress(row, () => {
        openCustomCareMenu(itemId);
      });
    }

    // Menu button
    const menuBtn = row.querySelector('[data-custom-care-menu]');
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCustomCareMenu(itemId);
      });
    }
  });

  // Add button
  const addBtn = document.getElementById('addCustomCareBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => openCustomCareModal());
  }
}

/* ============================================================ */
/* CUSTOM CARE ITEMS — Storage + CRUD                            */
/* ============================================================ */
function loadCustomCareItems(petId) {
  if (!petId) return [];
  const all = Storage.get('pc_customCare', {});
  return Array.isArray(all[petId]) ? all[petId] : [];
}

function saveCustomCareItems(petId, items) {
  if (!petId) return;
  const all = Storage.get('pc_customCare', {});
  all[petId] = items;
  Storage.set('pc_customCare', all);
}

function addCustomCareItem(petId, label, icon) {
  if (!petId || !label) return;
  const items = loadCustomCareItems(petId);
  items.push({
    id: 'care_' + Date.now(),
    label: label.trim(),
    icon: icon || 'fa-paw',
    done: false,
    createdAt: new Date().toISOString()
  });
  saveCustomCareItems(petId, items);
}

function toggleCustomCareItem(petId, itemId) {
  const items = loadCustomCareItems(petId);
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  item.done = !item.done;
  saveCustomCareItems(petId, items);
}

function deleteCustomCareItem(petId, itemId) {
  const items = loadCustomCareItems(petId);
  const filtered = items.filter(i => i.id !== itemId);
  saveCustomCareItems(petId, filtered);
}

function editCustomCareItem(petId, itemId, newLabel, newIcon) {
  const items = loadCustomCareItems(petId);
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  if (newLabel) item.label = newLabel.trim();
  if (newIcon) item.icon = newIcon;
  saveCustomCareItems(petId, items);
}

/* ============================================================ */
/* CUSTOM CARE — Add/Edit Modal                                  */
/* ============================================================ */
function openCustomCareModal(editItemId) {
  const pet = getActivePet();
  if (!pet) {
    showToast('Add a pet first');
    return;
  }

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const isEdit = !!editItemId;
  const items = loadCustomCareItems(pet.id);
  const item = isEdit ? items.find(i => i.id === editItemId) : null;

  const iconOptions = [
    { id: 'fa-paw', label: 'Paw' },
    { id: 'fa-bowl-food', label: 'Food' },
    { id: 'fa-droplet', label: 'Water' },
    { id: 'fa-person-walking', label: 'Walk' },
    { id: 'fa-pills', label: 'Meds' },
    { id: 'fa-scissors', label: 'Groom' },
    { id: 'fa-baseball', label: 'Play' },
    { id: 'fa-heart-pulse', label: 'Health' },
    { id: 'fa-tooth', label: 'Teeth' },
    { id: 'fa-bath', label: 'Bath' }
  ];

  const currentIcon = item ? item.icon : 'fa-paw';

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas ${isEdit ? 'fa-pen' : 'fa-plus'}"></i>
      ${isEdit ? 'Edit Care Item' : 'Add Custom Care'}
    </h2>
    <p style="color:var(--pc-text-muted); font-size:12.5px; margin-bottom:16px;">
      For ${escapeHtml(pet.name)}
    </p>

    <form id="customCareForm">
      <label>Care Item Name *</label>
      <input type="text" id="customCareLabel"
             placeholder="e.g. Brush coat, Play time"
             value="${item ? escapeHtml(item.label) : ''}"
             required maxlength="40">

      <label>Icon</label>
      <div class="custom-care-icon-grid" id="customCareIconGrid">
        ${iconOptions.map(opt => `
          <button type="button"
                  class="custom-care-icon ${opt.id === currentIcon ? 'active' : ''}"
                  data-icon="${opt.id}"
                  aria-label="${opt.label}">
            <i class="fas ${opt.id}"></i>
          </button>
        `).join('')}
      </div>

      <button type="submit" class="btn btn-primary w-full" style="margin-top:16px;">
        <i class="fas fa-check"></i>
        ${isEdit ? 'Save Changes' : 'Add Care Item'}
      </button>
    </form>
  `;

  let selectedIcon = currentIcon;

  const grid = document.getElementById('customCareIconGrid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-icon]');
      if (!btn) return;
      selectedIcon = btn.dataset.icon;
      grid.querySelectorAll('.custom-care-icon').forEach(b => {
        b.classList.toggle('active', b.dataset.icon === selectedIcon);
      });
    });
  }

  const form = document.getElementById('customCareForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const label = document.getElementById('customCareLabel').value.trim();
      if (!label) {
        showToast('Please enter a name');
        return;
      }

      if (isEdit) {
        editCustomCareItem(pet.id, editItemId, label, selectedIcon);
        showToast('Care item updated');
      } else {
        addCustomCareItem(pet.id, label, selectedIcon);
        showToast('Care item added');
      }

      closeModal('quickViewModal');
      switchCareTab('today');
    });
  }

  openModal('quickViewModal');
}

function openCustomCareMenu(itemId) {
  const pet = getActivePet();
  if (!pet) return;

  const items = loadCustomCareItems(pet.id);
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas ${item.icon}"></i> ${escapeHtml(item.label)}
    </h2>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); openCustomCareModal('${itemId}');">
        <i class="fas fa-pen"></i> Edit
      </button>
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); deleteCustomCareConfirm('${itemId}');">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

function deleteCustomCareConfirm(itemId) {
  const pet = getActivePet();
  if (!pet) return;
  if (!confirm('Delete this custom care item?')) return;

  deleteCustomCareItem(pet.id, itemId);
  showToast('Care item deleted');
  switchCareTab('today');
}

/* ============================================================ */
/* UPCOMING REMINDERS                                            */
/* ============================================================ */
function renderUpcomingReminders() {
  const allReminders = getReminders();
  const pet = getActivePet();
  const petId = pet ? pet.id : null;

  const reminders = allReminders.filter(r => {
    return !r.petId || r.petId === petId;
  });

  if (!reminders.length) {
    return `
      <div class="empty-state" style="padding: 28px 20px;">
        <i class="fas fa-bell-slash" style="font-size: 32px; opacity: 0.35; display: block; margin-bottom: 12px;"></i>
        <p style="font-size: 13.5px; font-weight: 700; color: var(--pc-text); margin-bottom: 4px;">
          No reminders yet
        </p>
        <p style="font-size: 12px; color: var(--pc-text-muted); margin-bottom: 14px; line-height: 1.4;">
          Stay on top of ${pet ? escapeHtml(pet.name) + "'s" : "your pet's"} health &amp; care
        </p>
        <button class="btn btn-primary btn-sm" onclick="openReminderModal()">
          <i class="fas fa-plus"></i> Add First Reminder
        </button>
      </div>
    `;
  }

  const iconMap = {
    vaccination: 'fa-syringe',
    grooming: 'fa-scissors',
    checkup: 'fa-stethoscope',
    medication: 'fa-pills',
    reminder: 'fa-bell'
  };

  const html = reminders.slice(0, 5).map(r => {
    const dateStr = r.date || '';
    const timeStr = r.time ? formatTimeStr(r.time) : '';
    return `
      <div class="upcoming-row" data-reminder-id="${r.id || ''}">
        <div class="upcoming-icon">
          <i class="fas ${iconMap[r.type] || 'fa-bell'}"></i>
        </div>
        <div class="upcoming-info">
          <p class="upcoming-label">${escapeHtml(r.label)}</p>
          <p class="upcoming-date">
            <i class="far fa-calendar"></i> ${dateStr}
            ${timeStr ? ` · <i class="far fa-clock"></i> ${timeStr}` : ''}
          </p>
        </div>
        <button class="upcoming-menu-btn" data-reminder-menu="${r.id || ''}" aria-label="Options">
          <i class="fas fa-ellipsis-vertical"></i>
        </button>
      </div>
    `;
  }).join('');

  setTimeout(attachReminderHandlers, 50);

  return html;
}

function attachReminderHandlers() {
  document.querySelectorAll('.upcoming-row[data-reminder-id]').forEach(row => {
    const rid = row.dataset.reminderId;
    if (!rid) return;

    // Long press
    if (typeof attachLongPress === 'function') {
      attachLongPress(row, () => {
        openReminderActionMenu(rid);
      });
    }

    // Menu button
    const menuBtn = row.querySelector('[data-reminder-menu]');
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openReminderActionMenu(rid);
      });
    }
  });
}

function getReminders() {
  const stored = Storage.get('pc_reminders', null);
  return Array.isArray(stored) ? stored : [];
}

function formatTimeStr(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/* ============================================================ */
/* REMINDER ACTIONS — Edit / Delete                              */
/* ============================================================ */
function openReminderActionMenu(reminderId) {
  const reminders = getReminders();
  const reminder = reminders.find(r => String(r.id) === String(reminderId));
  if (!reminder) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-bell"></i> Reminder Options
    </h2>
    <div style="background:var(--pc-paper); padding:14px; border-radius:12px; margin-bottom:16px;">
      <p style="font-size:14px; font-weight:800; color:var(--pc-text); margin-bottom:6px;">
        ${escapeHtml(reminder.label)}
      </p>
      <p style="font-size:12px; color:var(--pc-text-muted); line-height:1.5;">
        <i class="far fa-calendar"></i> ${reminder.date} ·
        <i class="far fa-clock"></i> ${formatTimeStr(reminder.time)}
      </p>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); openReminderEditModal('${reminderId}');">
        <i class="fas fa-pen"></i> Edit Reminder
      </button>
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); deleteReminder('${reminderId}');">
        <i class="fas fa-trash"></i> Delete Reminder
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

function openReminderEditModal(reminderId) {
  const reminders = getReminders();
  const reminder = reminders.find(r => String(r.id) === String(reminderId));
  if (!reminder) return;

  const modal = document.getElementById('reminderModal');
  if (!modal) return;

  const pets = APP.pets || [];
  const petOptions = pets.length
    ? pets.map(p => `<option value="${p.id}" ${p.id === reminder.petId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')
    : '<option value="">No pets added</option>';

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('reminderModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-pen"></i> Edit Reminder</h2>
    <form id="reminderForm">
      <label>For Which Pet? *</label>
      <select id="reminderPet" required>${petOptions}</select>

      <label>Type</label>
      <select id="reminderType" required>
        <option value="vaccination" ${reminder.type === 'vaccination' ? 'selected' : ''}>Vaccination</option>
        <option value="grooming" ${reminder.type === 'grooming' ? 'selected' : ''}>Grooming</option>
        <option value="checkup" ${reminder.type === 'checkup' ? 'selected' : ''}>Vet Checkup</option>
        <option value="medication" ${reminder.type === 'medication' ? 'selected' : ''}>Medication</option>
        <option value="reminder" ${reminder.type === 'reminder' ? 'selected' : ''}>General</option>
      </select>

      <label>Date</label>
      <input type="date" id="reminderDate" required value="${parseReminderDateToISO(reminder.date)}">

      <label>Time</label>
      <input type="time" id="reminderTime" required value="${reminder.time || '10:00'}">

      <label>Label</label>
      <input type="text" id="reminderLabel" required value="${escapeHtml(reminder.label)}">

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Save Changes
      </button>
    </form>
  `;

  const form = document.getElementById('reminderForm');
  if (form) {
    form.addEventListener('submit', (e) => handleEditReminder(e, reminderId));
  }

  openModal('reminderModal');
}

function parseReminderDateToISO(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10);

  if (typeof parseReminderDate === 'function') {
    const d = parseReminderDate(dateStr);
    if (d && !isNaN(d)) return d.toISOString().slice(0, 10);
  }

  const d = new Date(dateStr);
  if (!isNaN(d)) return d.toISOString().slice(0, 10);

  return new Date().toISOString().slice(0, 10);
}

function handleEditReminder(e, reminderId) {
  e.preventDefault();

  const petId = document.getElementById('reminderPet').value;
  const type = document.getElementById('reminderType').value;
  const dateInput = document.getElementById('reminderDate').value;
  const time = document.getElementById('reminderTime').value;
  const label = document.getElementById('reminderLabel').value.trim();

  if (!petId) { showToast('Please select a pet'); return; }
  if (!dateInput || !time || !label) { showToast('Please fill all fields'); return; }

  const reminders = getReminders();
  const idx = reminders.findIndex(r => String(r.id) === String(reminderId));
  if (idx === -1) { showToast('Reminder not found'); return; }

  const d = new Date(dateInput);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  reminders[idx] = {
    ...reminders[idx],
    petId,
    type,
    date: formattedDate,
    time,
    label
  };

  Storage.set('pc_reminders', reminders);

  closeModal('reminderModal');
  showToast('Reminder updated ✓');
  switchCareTab('today');
}

function deleteReminder(reminderId) {
  const reminders = getReminders();
  const reminder = reminders.find(r => String(r.id) === String(reminderId));
  if (!reminder) return;

  if (!confirm(`Delete reminder "${reminder.label}"?`)) return;

  const updated = reminders.filter(r => String(r.id) !== String(reminderId));
  Storage.set('pc_reminders', updated);

  showToast('Reminder deleted');
  switchCareTab('today');
}

/* ============================================================ */
/* REMINDER MODAL — Add                                          */
/* ============================================================ */
function openReminderModal() {
  const modal = document.getElementById('reminderModal');
  if (!modal) return;

  const today = new Date().toISOString().slice(0, 10);
  const pets = APP.pets || [];
  const activePetId = APP.activePetId;

  const petOptions = pets.length
    ? pets.map(p => `<option value="${p.id}" ${p.id === activePetId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')
    : '<option value="">No pets added</option>';

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('reminderModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-bell"></i> Add Reminder</h2>
    <form id="reminderForm">
      <label>For Which Pet? *</label>
      <select id="reminderPet" required>${petOptions}</select>

      <label>Type</label>
      <select id="reminderType" required>
        <option value="vaccination">Vaccination</option>
        <option value="grooming">Grooming</option>
        <option value="checkup">Vet Checkup</option>
        <option value="medication">Medication</option>
        <option value="reminder">General</option>
      </select>

      <label>Date</label>
      <input type="date" id="reminderDate" required min="${today}">

      <label>Time</label>
      <input type="time" id="reminderTime" required value="10:00">

      <label>Label</label>
      <input type="text" id="reminderLabel" placeholder="e.g. Vaccine (Rabies)" required>

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Add Reminder
      </button>
    </form>
  `;

  document.getElementById('reminderForm')?.addEventListener('submit', handleAddReminder);
  openModal('reminderModal');
}

function handleAddReminder(e) {
  e.preventDefault();

  const petId = document.getElementById('reminderPet').value;
  const type = document.getElementById('reminderType').value;
  const date = document.getElementById('reminderDate').value;
  const time = document.getElementById('reminderTime').value;
  const label = document.getElementById('reminderLabel').value.trim();

  if (!petId) { showToast('Please select a pet'); return; }
  if (!date || !time || !label) { showToast('Please fill all fields'); return; }

  const reminders = getReminders();

  const d = new Date(date);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  reminders.push({
    id: 'rem_' + Date.now(),
    petId,
    type,
    date: formattedDate,
    time,
    label
  });
  Storage.set('pc_reminders', reminders);

  closeModal('reminderModal');

  const pet = APP.pets.find(p => p.id === petId);
  showToast('Reminder added for ' + (pet ? pet.name : 'pet'));
  switchCareTab('today');
}

/* ============================================================ */
/* 4. TAB: CALENDAR                                              */
/* ============================================================ */
function renderCalendarTab() {
  const month = careState.calendarMonth;
  const year = careState.calendarYear;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const eventsByDay = getCalendarEventsForMonth();

  let cells = '';
  for (let i = 0; i < firstDay; i++) {
    cells += `<div class="cal-day empty"></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && today.getDate() === d;
    const isSelected = careState.selectedCalendarDate === d;
    const events = eventsByDay[d] || [];
    const dots = events.map(e => `<span class="cal-dot cal-dot-${e.type}"></span>`).join('');

    cells += `
      <button class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-cal-day="${d}">
        <span class="cal-num">${d}</span>
        <div class="cal-dots">${dots}</div>
      </button>
    `;
  }

  return `
    <section class="care-section">
      <div class="calendar-header">
        <button class="cal-nav-btn" id="calPrevBtn" aria-label="Previous month">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h3>${monthNames[month]} ${year}</h3>
        <button class="cal-nav-btn" id="calNextBtn" aria-label="Next month">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="calendar-weekdays">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      <div class="calendar-grid" id="calendarGrid">
        ${cells}
      </div>
    </section>

    <section class="care-section">
      <div class="care-section-header">
        <h3>
          <i class="fas fa-calendar-day"></i>
          ${careState.selectedCalendarDate ? getMonthDateLabel(careState.selectedCalendarDate) : 'Select a date'}
        </h3>
      </div>
      <div class="cal-day-events" id="calDayEvents">
        ${renderCalendarDayEvents()}
      </div>
    </section>
  `;
}

function getCalendarEventsForMonth() {
  const reminders = getReminders();
  const medications = Storage.get('pc_medications', []) || [];
  const pet = getActivePet();
  const petId = pet ? pet.id : null;
  const eventsByDay = {};

  // Reminders
  reminders.forEach(r => {
    if (!r.date) return;
    if (r.petId && r.petId !== petId) return;

    const d = parseReminderDate(r.date);
    if (!d) return;

    if (d.getMonth() === careState.calendarMonth &&
        d.getFullYear() === careState.calendarYear) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push({
        type: r.type || 'reminder',
        label: r.label || '',
        time: r.time || '',
        date: r.date
      });
    }
  });

  // Medications
  medications.forEach(m => {
    if (!m.nextDoseDate) return;
    if (m.petId && m.petId !== petId) return;

    const d = new Date(m.nextDoseDate);
    if (isNaN(d)) return;

    if (d.getMonth() === careState.calendarMonth &&
        d.getFullYear() === careState.calendarYear) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push({
        type: 'medication',
        label: m.name || 'Medication',
        time: m.nextDoseTime || '',
        date: m.nextDoseDate
      });
    }
  });

  return eventsByDay;
}

function parseReminderDate(str) {
  if (!str) return null;
  let d = new Date(str);
  if (!isNaN(d)) return d;
  const match = str.match(/^(\w+)\s+(\d+),\s+(\d+)$/);
  if (match) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = monthNames.indexOf(match[1]);
    if (m >= 0) return new Date(parseInt(match[3]), m, parseInt(match[2]));
  }
  return null;
}

function getMonthDateLabel(day) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[careState.calendarMonth]} ${day}, ${careState.calendarYear}`;
}

function renderCalendarDayEvents() {
  if (!careState.selectedCalendarDate) {
    return `<p class="empty-state">Tap a date to see events</p>`;
  }

  const eventsByDay = getCalendarEventsForMonth();
  const events = eventsByDay[careState.selectedCalendarDate] || [];

  if (!events.length) {
    return `<p class="empty-state">No events this day</p>`;
  }

  const iconMap = {
    vaccination: 'fa-syringe',
    grooming: 'fa-scissors',
    checkup: 'fa-stethoscope',
    medication: 'fa-pills',
    reminder: 'fa-bell'
  };

  return events.map(e => `
    <div class="cal-event">
      <div class="cal-event-time">${formatTimeStr(e.time) || '—'}</div>
      <div class="cal-event-icon">
        <i class="fas ${iconMap[e.type] || 'fa-bell'}"></i>
      </div>
      <div class="cal-event-info">
        <p class="cal-event-title">${escapeHtml(e.label)}</p>
        <p class="cal-event-sub">${e.type.charAt(0).toUpperCase() + e.type.slice(1)}</p>
      </div>
    </div>
  `).join('');
}

function changeCalendarMonth(direction) {
  if (direction === -1) {
    careState.calendarMonth--;
    if (careState.calendarMonth < 0) {
      careState.calendarMonth = 11;
      careState.calendarYear--;
    }
  } else if (direction === 1) {
    careState.calendarMonth++;
    if (careState.calendarMonth > 11) {
      careState.calendarMonth = 0;
      careState.calendarYear++;
    }
  }

  if (careState.activeTab === 'calendar') {
    const content = document.getElementById('careTabContent');
    if (content) {
      content.innerHTML = renderCalendarTab();
      attachCareTabHandlers();
    }
  }
}

/* ============================================================ */
/* 5. TAB: HEALTH                                                */
/* ============================================================ */
function renderHealthTab() {
  const pet = getActivePet();

  return `
    <section class="care-section">
      <div class="care-section-header">
        <h3><i class="fas fa-notes-medical"></i> Health Log</h3>
        <button class="mini-add-btn" id="addHealthLogBtn">
          <i class="fas fa-plus"></i> Add
        </button>
      </div>

      <div class="health-filter-chips" id="healthFilterChips">
        <button class="health-filter-chip ${careState.healthLogFilter === 'all' ? 'active' : ''}" data-health-filter="all">All</button>
        <button class="health-filter-chip ${careState.healthLogFilter === 'note' ? 'active' : ''}" data-health-filter="note">
          <i class="fas fa-note-sticky"></i> Notes
        </button>
        <button class="health-filter-chip ${careState.healthLogFilter === 'weight' ? 'active' : ''}" data-health-filter="weight">
          <i class="fas fa-weight-scale"></i> Weight
        </button>
        <button class="health-filter-chip ${careState.healthLogFilter === 'temperature' ? 'active' : ''}" data-health-filter="temperature">
          <i class="fas fa-temperature-half"></i> Temp
        </button>
        <button class="health-filter-chip ${careState.healthLogFilter === 'symptom' ? 'active' : ''}" data-health-filter="symptom">
          <i class="fas fa-stethoscope"></i> Symptoms
        </button>
      </div>

      <div class="health-log-list" id="healthLogList">
        ${renderHealthLog()}
      </div>
    </section>

    <section class="care-section">
      <div class="care-section-header">
        <h3><i class="fas fa-syringe"></i> Vaccinations</h3>
      </div>
      <div class="vax-progress-card">
        <div class="vax-progress-top">
          <span class="vax-progress-count" id="vaxProgressCount">${getVaxCompletedCount()}/${getVaxTotal()} completed</span>
          <button class="mini-add-btn" id="addVaxBtn">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="vax-progress-bar">
          <div class="vax-progress-fill" id="vaxProgressFill" style="width:${(getVaxCompletedCount()/Math.max(1,getVaxTotal()))*100}%;"></div>
        </div>
        <div class="vax-list" id="vaxList">
          ${renderVaccinations()}
        </div>
      </div>
    </section>

    <section class="care-section">
      <div class="care-section-header">
        <h3><i class="fas fa-pills"></i> Medications</h3>
        <button class="mini-add-btn" id="addMedBtn">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="med-list-compact" id="medList">
        ${renderMedications()}
      </div>
    </section>

    <section class="care-section">
      <div class="care-section-header">
        <h3><i class="fas fa-chart-line"></i> Weight Chart</h3>
        <span class="weight-badge" id="weightBadge">${getLatestWeight(pet) || '—'} kg</span>
      </div>
      <div class="weight-chart-wrap">
        <canvas id="careWeightChart" height="140"></canvas>
      </div>
    </section>

    <button class="export-health-btn" id="exportHealthBtn">
      <i class="fas fa-file-pdf"></i> Export Health Records
    </button>
  `;
}

/* ---------- HEALTH LOG ---------- */
function getHealthLogsForPet() {
  const pet = getActivePet();
  if (!pet) return [];

  const logs = Storage.get('pc_healthLog', []);
  let petLogs = logs.filter(l => l.petId === pet.id);

  if (careState.healthLogFilter !== 'all') {
    petLogs = petLogs.filter(l => l.type === careState.healthLogFilter);
  }

  return petLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderHealthLog() {
  const pet = getActivePet();

  if (!pet) {
    return `<p class="empty-state">Add a pet first</p>`;
  }

  const logs = getHealthLogsForPet();

  if (!logs.length) {
    return `
      <div class="health-log-empty">
        <i class="fas fa-notes-medical"></i>
        <p>No entries yet</p>
        <span>Tap "Add" to record weight, symptoms, or notes</span>
      </div>
    `;
  }

  return logs.slice(0, 15).map(l => renderHealthLogEntry(l)).join('');
}

function renderHealthLogEntry(log) {
  const typeMap = {
    note:        { icon: 'fa-note-sticky',     label: 'Note',        color: '#8B6F47' },
    weight:      { icon: 'fa-weight-scale',    label: 'Weight',      color: '#3A4A3A' },
    temperature: { icon: 'fa-temperature-half', label: 'Temperature', color: '#C45A4A' },
    symptom:     { icon: 'fa-stethoscope',     label: 'Symptom',     color: '#D9A441' }
  };

  const t = typeMap[log.type] || typeMap.note;
  const timeStr = formatTime(log.date);

  let mainValue = '';
  let extraNote = log.note || '';

  if (log.type === 'weight') {
    const match = extraNote.match(/(\d+(?:\.\d+)?)\s*kg/i) || extraNote.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      mainValue = match[1] + ' kg';
      extraNote = extraNote.replace(match[0], '').replace(/^[\s-]+/, '').trim();
    }
  } else if (log.type === 'temperature') {
    const match = extraNote.match(/(\d+(?:\.\d+)?)\s*°?[FC]?/i);
    if (match) {
      mainValue = match[0].trim();
      extraNote = extraNote.replace(match[0], '').replace(/^[\s-]+/, '').trim();
    }
  }

  return `
    <div class="health-entry health-entry-${log.type}" data-health-id="${log.id}">
      <div class="health-entry-type-icon" style="background:${t.color}15; color:${t.color};">
        <i class="fas ${t.icon}"></i>
      </div>
      <div class="health-entry-info">
        <div class="health-entry-header">
          <span class="health-entry-type-label">${t.label}</span>
          ${mainValue ? `<span class="health-entry-value">${escapeHtml(mainValue)}</span>` : ''}
        </div>
        ${extraNote ? `<p class="health-entry-note">${escapeHtml(extraNote)}</p>` : ''}
        <p class="health-entry-date">
          <i class="far fa-calendar"></i> ${formatDate(log.date)} · ${timeStr}
        </p>
      </div>
      <button class="health-entry-menu" data-health-menu="${log.id}" aria-label="Options">
        <i class="fas fa-ellipsis-vertical"></i>
      </button>
    </div>
  `;
}

/* ---------- VACCINATIONS ---------- */
function getVaxTotal() {
  const vax = Storage.get('pc_vaccinations', null);
  if (Array.isArray(vax)) return vax.length;
  return 0;
}

function getVaxCompletedCount() {
  const vax = Storage.get('pc_vaccinations', null);
  if (!Array.isArray(vax)) return 0;
  return vax.filter(v => v.done).length;
}

function renderVaccinations() {
  const vax = Storage.get('pc_vaccinations', null);

  if (!Array.isArray(vax) || !vax.length) {
    return `
      <div class="empty-state" style="padding: 20px;">
        <i class="fas fa-syringe" style="font-size: 28px; opacity: 0.4; display: block; margin-bottom: 8px;"></i>
        <p style="font-size: 13px;">No vaccinations recorded</p>
        <button class="btn btn-primary btn-sm" onclick="openVaxModal()" style="margin-top: 10px;">
          <i class="fas fa-plus"></i> Add First Vaccine
        </button>
      </div>
    `;
  }

  return vax.map((v, i) => `
    <div class="vax-row ${v.done ? 'done' : ''}" data-vax-index="${i}">
      <i class="fas ${v.done ? 'fa-check-circle' : 'fa-circle'}"></i>
      <span>${escapeHtml(v.name)}</span>
      <span class="vax-status">${v.done ? 'Completed' : 'Pending'}</span>
      ${!v.done ? `
        <button class="vax-complete-btn" data-vax-complete="${i}" title="Mark complete" aria-label="Mark complete">
          <i class="fas fa-check"></i>
        </button>
      ` : `
        <button class="vax-undo-btn" data-vax-undo="${i}" title="Undo complete" aria-label="Undo">
          <i class="fas fa-rotate-left"></i>
        </button>
      `}
    </div>
  `).join('');
}

/* ---------- MEDICATIONS ---------- */
function renderMedications() {
  const allMeds = Storage.get('pc_medications', null) || [];
  const pet = getActivePet();
  const petId = pet ? pet.id : null;

  const meds = allMeds.filter(m => !m.petId || m.petId === petId);

  if (!meds.length) {
    return `
      <div class="med-row med-row-empty">
        <div class="med-icon"><i class="fas fa-pills"></i></div>
        <div class="med-info">
          <p class="med-name">No medications</p>
          <p class="med-dose">Tap + to add</p>
        </div>
      </div>
    `;
  }

  return meds.map(m => `
    <div class="med-row" data-med-id="${m.id}">
      <div class="med-icon"><i class="fas fa-pills"></i></div>
      <div class="med-info">
        <p class="med-name">${escapeHtml(m.name)}</p>
        <p class="med-dose">${escapeHtml(m.nextDose || '')}</p>
      </div>
    </div>
  `).join('');
}

/* ---------- WEIGHT CHART ---------- */
function getWeightHistory(petId) {
  const logs = Storage.get('pc_healthLog', []);
  if (!logs.length || !petId) return [];

  const weightLogs = logs
    .filter(l => l.petId === petId && l.type === 'weight')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return weightLogs.map(l => {
    const match = String(l.note || '').match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    return {
      date: l.date,
      weight: parseFloat(match[1])
    };
  }).filter(w => w && w.weight > 0);
}

function getLatestWeight(pet) {
  if (!pet) return null;
  const history = getWeightHistory(pet.id);
  if (history.length) return history[history.length - 1].weight;
  return pet.weight || null;
}

function initWeightChart() {
  const canvas = document.getElementById('careWeightChart');
  if (!canvas) return;

  const pet = getActivePet();
  if (!pet) return;

  if (window.__careWeightChart) {
    window.__careWeightChart.destroy();
    window.__careWeightChart = null;
  }

  const history = getWeightHistory(pet.id);
  const wrap = canvas.parentElement;

  if (wrap) {
    const existing = wrap.querySelector('.weight-empty-state');
    if (existing) existing.remove();
  }

  if (!history.length) {
    canvas.style.display = 'none';
    if (wrap) {
      const empty = document.createElement('div');
      empty.className = 'weight-empty-state';
      empty.innerHTML = `
        <i class="fas fa-chart-line"></i>
        <p>No weight data yet</p>
        <span>Add via Health Log with type "Weight"</span>
      `;
      wrap.appendChild(empty);
    }
    return;
  }

  canvas.style.display = 'block';

  if (typeof Chart === 'undefined') return;

  const labels = history.map(h => {
    const d = new Date(h.date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const data = history.map(h => h.weight);

  window.__careWeightChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#3A4A3A',
        backgroundColor: 'rgba(58, 74, 58, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3A4A3A',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (ctx) => ctx.parsed.y + ' kg' }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, maxRotation: 0, autoSkip: true }
        }
      }
    }
  });
}

/* ============================================================ */
/* 6. TAB: GUIDANCE                                              */
/* ============================================================ */
function renderGuidanceTab() {
  const concerns = [
    { id: 'vomiting',   label: 'Vomiting',         icon: 'fa-face-tired' },
    { id: 'diarrhea',   label: 'Diarrhea',         icon: 'fa-droplet' },
    { id: 'itching',    label: 'Skin Issues',      icon: 'fa-hand-dots' },
    { id: 'not-eating', label: 'Loss of Appetite', icon: 'fa-bowl-food' },
    { id: 'coughing',   label: 'Cough',            icon: 'fa-lungs' },
    { id: 'lethargy',   label: 'Lethargy',         icon: 'fa-bed' }
  ];

  const firstAid = [
    { key: 'choking',    label: 'Choking',       icon: 'fa-hand-dots',        color: '#D9A441' },
    { key: 'heatstroke', label: 'Heat Stroke',   icon: 'fa-temperature-high', color: '#C45A4A' },
    { key: 'bleeding',   label: 'Cuts & Wounds', icon: 'fa-droplet',          color: '#C45A4A' }
  ];

  return `
    <section class="care-section">
      <div class="guidance-search">
        <i class="fas fa-search"></i>
        <input type="text" id="symptomSearch" placeholder="Search symptoms or ask a question...">
      </div>
    </section>

    <section class="care-section">
      <div class="care-section-header">
        <h3>Common Concerns</h3>
      </div>
      <div class="concern-grid" id="concernGrid">
        ${concerns.map(c => `
          <button class="concern-chip" data-concern="${c.id}">
            <i class="fas ${c.icon}"></i>
            <span>${c.label}</span>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="care-section">
      <div class="care-section-header">
        <h3>First-Aid Quick Links</h3>
        <button class="card-link" id="viewAllGuidesBtn">View All</button>
      </div>
      <div class="firstaid-quick-grid" id="firstaidQuickGrid">
        ${firstAid.map(f => `
          <button class="firstaid-quick" data-firstaid="${f.key}" style="--fa-color:${f.color};">
            <div class="firstaid-quick-icon">
              <i class="fas ${f.icon}"></i>
            </div>
            <span>${f.label}</span>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="care-section">
      <button class="ask-ai-card" id="askAiBtn">
        <div class="ask-ai-icon">
          <i class="fas fa-robot"></i>
        </div>
        <div class="ask-ai-info">
          <p class="ask-ai-title">Ask PetCare AI</p>
          <p class="ask-ai-sub">Get instant answers to your pet care questions</p>
        </div>
        <i class="fas fa-chevron-right ask-ai-arrow"></i>
      </button>
    </section>
  `;
}

/* ============================================================ */
/* 7. TAB: TIPS                                                  */
/* ============================================================ */
function renderTipsTab() {
  const categories = [
    { id: 'all',       label: 'All' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'hygiene',   label: 'Hygiene' },
    { id: 'grooming',  label: 'Grooming' },
    { id: 'training',  label: 'Training' },
    { id: 'behavior',  label: 'Behavior' },
    { id: 'safety',    label: 'Safety' },
    { id: 'care',      label: 'Care' }
  ];

  const tips = getFilteredTips();

  return `
    <section class="care-section">
      <h3 class="tips-title">Pet Care Tips</h3>
      <p class="tips-sub">Small steps, big differences</p>

      <div class="tips-cat-chips" id="tipsCatChips">
        ${categories.map(c => `
          <button class="tip-cat-chip ${careState.activeTipCategory === c.id ? 'active' : ''}" data-tip-cat="${c.id}">
            ${c.label}
          </button>
        `).join('')}
      </div>

      <div class="tips-articles-list" id="tipsArticlesList">
        ${tips.length ? tips.map(t => `
          <button class="tip-article-card" data-tip-id="${t.id}">
            <div class="tip-article-img">
              <img src="${t.image}" alt="${t.title}" onerror="this.style.opacity='0'">
            </div>
            <div class="tip-article-info">
              <p class="tip-article-title">${t.title}</p>
              <div class="tip-article-meta">
                <span class="tip-article-tag">${capitalize(t.category)}</span>
                <span class="tip-dot"></span>
                <span>${t.readTime}</span>
              </div>
            </div>
            <i class="fas fa-chevron-right tip-article-arrow"></i>
          </button>
        `).join('') : '<p class="empty-state">No tips found</p>'}
      </div>
    </section>
  `;
}

function getFilteredTips() {
  if (careState.activeTipCategory === 'all') return TIPS_ARTICLES;
  return TIPS_ARTICLES.filter(t => t.category === careState.activeTipCategory);
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/* ============================================================ */
/* 8. TAB SWITCHING                                              */
/* ============================================================ */
function switchCareTab(tab) {
  careState.activeTab = tab;

  document.querySelectorAll('.care-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.careTab === tab);
  });

  const content = document.getElementById('careTabContent');
  if (content) {
    content.innerHTML = renderCareTabContent();
  }

  attachCareTabHandlers();

  if (tab === 'health') {
    setTimeout(initWeightChart, 50);
  }
}

/* ============================================================ */
/* 9. EVENT HANDLERS                                             */
/* ============================================================ */
function attachCareHandlers() {
  const page = document.getElementById('page-care');
  if (!page) return;

  const petSelector = document.getElementById('petSelector');
  if (petSelector) {
    petSelector.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-edit-pet]');
      if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        openEditPetModal(editBtn.dataset.editPet);
        return;
      }
      const chip = e.target.closest('[data-pet-id]');
      if (chip) {
        e.preventDefault();
        APP.activePetId = chip.dataset.petId;
        Storage.set(APP.STORAGE_KEYS.ACTIVE_PET, APP.activePetId);
        careState.activePetId = APP.activePetId;
        renderCare();
      }
    });
  }

  const addBtn = document.getElementById('petAddBtn');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPetModal();
    });
  }

  const careTabs = document.getElementById('careTabs');
  if (careTabs) {
    careTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.care-tab');
      if (tab && tab.dataset.careTab) {
        switchCareTab(tab.dataset.careTab);
      }
    });
  }

  attachCareTabHandlers();
}

function attachCareTabHandlers() {
  const page = document.getElementById('page-care');
  if (!page) return;

  const addReminderBtn = document.getElementById('addReminderBtn');
  if (addReminderBtn) addReminderBtn.addEventListener('click', openReminderModal);

  const calPrev = document.getElementById('calPrevBtn');
  const calNext = document.getElementById('calNextBtn');
  if (calPrev) calPrev.addEventListener('click', () => changeCalendarMonth(-1));
  if (calNext) calNext.addEventListener('click', () => changeCalendarMonth(1));

  const calGrid = document.getElementById('calendarGrid');
  if (calGrid) {
    calGrid.addEventListener('click', (e) => {
      const day = e.target.closest('[data-cal-day]');
      if (day) {
        careState.selectedCalendarDate = parseInt(day.dataset.calDay);
        if (careState.activeTab === 'calendar') {
          const content = document.getElementById('careTabContent');
          if (content) {
            content.innerHTML = renderCalendarTab();
            attachCareTabHandlers();
          }
        }
      }
    });
  }

  // Health modals
  const addHealthLog = document.getElementById('addHealthLogBtn');
  const addVax = document.getElementById('addVaxBtn');
  const addMed = document.getElementById('addMedBtn');
  const exportHealth = document.getElementById('exportHealthBtn');

  if (addHealthLog) addHealthLog.addEventListener('click', () => openHealthLogModal());
  if (addVax) addVax.addEventListener('click', openVaxModal);
  if (addMed) addMed.addEventListener('click', openMedModal);
  if (exportHealth) exportHealth.addEventListener('click', exportHealthRecords);

  // Health log filter chips
  const filterChips = document.getElementById('healthFilterChips');
  if (filterChips) {
    filterChips.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-health-filter]');
      if (!chip) return;
      careState.healthLogFilter = chip.dataset.healthFilter;

      filterChips.querySelectorAll('.health-filter-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.healthFilter === careState.healthLogFilter);
      });

      const list = document.getElementById('healthLogList');
      if (list) list.innerHTML = renderHealthLog();
      attachHealthLogHandlers();
    });
  }

  attachHealthLogHandlers();

  // Vaccination complete
  page.querySelectorAll('[data-vax-complete]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.vaxComplete);
      completeVaccination(idx);
    });
  });

  // Vaccination undo
  page.querySelectorAll('[data-vax-undo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.vaxUndo);
      undoVaccination(idx);
    });
  });

  // Vaccination long press delete
  page.querySelectorAll('.vax-row[data-vax-index]').forEach(row => {
    attachLongPress(row, () => {
      const idx = parseInt(row.dataset.vaxIndex);
      openVaxActionMenu(idx);
    });
  });

  // Medication long press menu
  page.querySelectorAll('.med-row[data-med-id]').forEach(row => {
    attachLongPress(row, () => {
      const id = row.dataset.medId;
      if (id && !id.startsWith('demo_')) {
        openMedActionMenu(id);
      }
    });
  });

  // Guidance concerns
  const concernGrid = document.getElementById('concernGrid');
  if (concernGrid) {
    concernGrid.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-concern]');
      if (chip) showGuidance(chip.dataset.concern);
    });
  }

  const firstAidGrid = document.getElementById('firstaidQuickGrid');
  if (firstAidGrid) {
    firstAidGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-firstaid]');
      if (btn) openFirstAidModal(btn.dataset.firstaid);
    });
  }

  const viewAllBtn = document.getElementById('viewAllGuidesBtn');
  if (viewAllBtn) viewAllBtn.addEventListener('click', openFirstAidListModal);

  const askAiBtn = document.getElementById('askAiBtn');
  if (askAiBtn) askAiBtn.addEventListener('click', openAiAssistant);

  const symptomInput = document.getElementById('symptomSearch');
  if (symptomInput) {
    symptomInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (q.length > 2) {
        for (const key of Object.keys(HEALTH_GUIDANCE)) {
          if (key.includes(q) || HEALTH_GUIDANCE[key].title.toLowerCase().includes(q)) {
            showGuidance(key);
            return;
          }
        }
      }
    });
  }

  const tipsCatChips = document.getElementById('tipsCatChips');
  if (tipsCatChips) {
    tipsCatChips.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-tip-cat]');
      if (chip) {
        careState.activeTipCategory = chip.dataset.tipCat;
        if (careState.activeTab === 'tips') {
          const content = document.getElementById('careTabContent');
          if (content) {
            content.innerHTML = renderTipsTab();
            attachCareTabHandlers();
          }
        }
      }
    });
  }

  const tipsList = document.getElementById('tipsArticlesList');
  if (tipsList) {
    tipsList.addEventListener('click', (e) => {
      const card = e.target.closest('[data-tip-id]');
      if (card) openTipArticle(card.dataset.tipId);
    });
  }
}

function attachHealthLogHandlers() {
  const list = document.getElementById('healthLogList');
  if (!list) return;

  list.querySelectorAll('[data-health-menu]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openHealthLogActionMenu(btn.dataset.healthMenu);
    });
  });

  list.querySelectorAll('.health-entry').forEach(entry => {
    entry.addEventListener('click', (e) => {
      if (e.target.closest('[data-health-menu]')) return;
      const id = entry.dataset.healthId;
      if (id) openHealthLogDetail(id);
    });
  });
}

/* ============================================================ */
/* 10. LONG PRESS HELPER                                         */
/* ============================================================ */
function attachLongPress(el, callback, duration = 600) {
  let timer = null;
  let isLongPress = false;

  const start = (e) => {
    isLongPress = false;
    timer = setTimeout(() => {
      isLongPress = true;
      if (navigator.vibrate) navigator.vibrate(40);
      callback();
    }, duration);
  };

  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const end = () => cancel();

  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('touchend', end);
  el.addEventListener('touchmove', cancel);
  el.addEventListener('touchcancel', cancel);
  el.addEventListener('mousedown', start);
  el.addEventListener('mouseup', end);
  el.addEventListener('mouseleave', cancel);

  el.addEventListener('click', (e) => {
    if (isLongPress) {
      e.preventDefault();
      e.stopPropagation();
      isLongPress = false;
    }
  }, true);
}

/* ============================================================ */
/* 11. HEALTH LOG — ACTION MENU, DETAIL, EDIT, DELETE            */
/* ============================================================ */
function openHealthLogActionMenu(id) {
  const logs = Storage.get('pc_healthLog', []);
  const log = logs.find(l => String(l.id) === String(id));
  if (!log) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-ellipsis-vertical"></i> Entry Options
    </h2>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); openHealthLogEdit('${id}');">
        <i class="fas fa-pen"></i> Edit Entry
      </button>
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); deleteHealthLog('${id}');">
        <i class="fas fa-trash"></i> Delete Entry
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

function openHealthLogDetail(id) {
  const logs = Storage.get('pc_healthLog', []);
  const log = logs.find(l => String(l.id) === String(id));
  if (!log) return;

  const typeMap = {
    note:        { icon: 'fa-note-sticky',     label: 'Note',        color: '#8B6F47' },
    weight:      { icon: 'fa-weight-scale',    label: 'Weight',      color: '#3A4A3A' },
    temperature: { icon: 'fa-temperature-half', label: 'Temperature', color: '#C45A4A' },
    symptom:     { icon: 'fa-stethoscope',     label: 'Symptom',     color: '#D9A441' }
  };

  const t = typeMap[log.type] || typeMap.note;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <div class="health-detail-header" style="background:${t.color}15; color:${t.color};">
      <i class="fas ${t.icon}"></i>
      <div>
        <p class="health-detail-type">${t.label}</p>
        <p class="health-detail-date">${formatDate(log.date)} · ${formatTime(log.date)}</p>
      </div>
    </div>
    <p class="health-detail-note">${escapeHtml(log.note)}</p>
    <div style="display:flex; gap:8px; margin-top:16px;">
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); openHealthLogEdit('${id}');">
        <i class="fas fa-pen"></i> Edit
      </button>
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); deleteHealthLog('${id}');">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

function openHealthLogEdit(id) {
  const logs = Storage.get('pc_healthLog', []);
  const log = logs.find(l => String(l.id) === String(id));
  if (!log) return;

  careState.editingHealthLogId = id;
  openHealthLogModal(log);
}

function openHealthLogModal(editLog = null) {
  const modal = document.getElementById('healthLogModal');
  if (!modal) return;

  const isEdit = !!editLog;
  const currentType = editLog?.type || 'note';

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('healthLogModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-notes-medical"></i> ${isEdit ? 'Edit Entry' : 'Add Health Entry'}
    </h2>

    <form id="healthLogForm">
      <label>Type</label>
      <div class="health-type-chips" id="healthTypeChips">
        <button type="button" class="health-type-chip ${currentType === 'note' ? 'active' : ''}" data-health-type="note">
          <i class="fas fa-note-sticky"></i> Note
        </button>
        <button type="button" class="health-type-chip ${currentType === 'weight' ? 'active' : ''}" data-health-type="weight">
          <i class="fas fa-weight-scale"></i> Weight
        </button>
        <button type="button" class="health-type-chip ${currentType === 'temperature' ? 'active' : ''}" data-health-type="temperature">
          <i class="fas fa-temperature-half"></i> Temp
        </button>
        <button type="button" class="health-type-chip ${currentType === 'symptom' ? 'active' : ''}" data-health-type="symptom">
          <i class="fas fa-stethoscope"></i> Symptom
        </button>
      </div>

      <div id="healthTypeFields"></div>

      <button type="submit" class="btn btn-primary w-full" style="margin-top:16px;">
        <i class="fas fa-check"></i> ${isEdit ? 'Save Changes' : 'Save Entry'}
      </button>
    </form>
  `;

  careState.healthLogType = currentType;

  document.getElementById('healthTypeChips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-health-type]');
    if (!chip) return;
    careState.healthLogType = chip.dataset.healthType;

    document.querySelectorAll('.health-type-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.healthType === careState.healthLogType);
    });

    renderHealthTypeFields(editLog);
  });

  renderHealthTypeFields(editLog);

  document.getElementById('healthLogForm')?.addEventListener('submit', (e) => {
    handleAddHealthLog(e, editLog);
  });

  openModal('healthLogModal');
}

function renderHealthTypeFields(editLog = null) {
  const container = document.getElementById('healthTypeFields');
  if (!container) return;

  const type = careState.healthLogType;
  const currentNote = editLog?.note || '';

  let existingValue = '';
  let existingExtra = '';

  if (editLog) {
    if (type === 'weight') {
      const m = currentNote.match(/(\d+(?:\.\d+)?)/);
      existingValue = m ? m[1] : '';
      existingExtra = currentNote.replace(m ? m[0] : '', '').replace(/^[\s-]+/, '').trim();
    } else if (type === 'temperature') {
      const m = currentNote.match(/(\d+(?:\.\d+)?)/);
      existingValue = m ? m[1] : '';
      existingExtra = currentNote.replace(m ? m[0] : '', '').replace(/^[\s-]+/, '').trim();
    } else {
      existingExtra = currentNote;
    }
  }

  switch (type) {
    case 'weight':
      container.innerHTML = `
        <label>Weight (kg) *</label>
        <input type="number" id="healthValue" placeholder="e.g. 4.5" step="0.1" min="0" value="${existingValue}" required>
        <label>Note (optional)</label>
        <input type="text" id="healthExtra" placeholder="e.g. Feels healthy today" value="${existingExtra}">
      `;
      break;

    case 'temperature':
      container.innerHTML = `
        <label>Temperature (°C) *</label>
        <input type="number" id="healthValue" placeholder="e.g. 38.5" step="0.1" min="0" value="${existingValue}" required>
        <label>Note (optional)</label>
        <input type="text" id="healthExtra" placeholder="e.g. Slightly warm" value="${existingExtra}">
      `;
      break;

    case 'symptom':
      container.innerHTML = `
        <label>Symptom *</label>
        <input type="text" id="healthExtra" placeholder="e.g. Coughing, Vomiting" value="${existingExtra}" required>
        <label>Severity</label>
        <select id="healthSeverity">
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
      `;
      break;

    case 'note':
    default:
      container.innerHTML = `
        <label>Note *</label>
        <textarea id="healthExtra" placeholder="e.g. Ate well today, energy normal" rows="4" required>${existingExtra}</textarea>
      `;
      break;
  }
}

function handleAddHealthLog(e, editLog = null) {
  e.preventDefault();
  const pet = getActivePet();
  if (!pet) { showToast('Add a pet first'); return; }

  const type = careState.healthLogType;
  let note = '';

  if (type === 'weight') {
    const val = document.getElementById('healthValue')?.value;
    const extra = document.getElementById('healthExtra')?.value?.trim() || '';
    const w = parseFloat(val);
    if (isNaN(w) || w <= 0) {
      showToast('Please enter a valid weight');
      return;
    }
    note = w + ' kg' + (extra ? ' — ' + extra : '');

    const petIndex = APP.pets.findIndex(p => p.id === pet.id);
    if (petIndex !== -1) {
      APP.pets[petIndex].weight = w;
      Storage.set(APP.STORAGE_KEYS.PETS, APP.pets);
    }
  } else if (type === 'temperature') {
    const val = document.getElementById('healthValue')?.value;
    const extra = document.getElementById('healthExtra')?.value?.trim() || '';
    const t = parseFloat(val);
    if (isNaN(t) || t <= 0) {
      showToast('Please enter a valid temperature');
      return;
    }
    note = t + ' °C' + (extra ? ' — ' + extra : '');
  } else if (type === 'symptom') {
    const sym = document.getElementById('healthExtra')?.value?.trim();
    const sev = document.getElementById('healthSeverity')?.value || 'mild';
    if (!sym) {
      showToast('Please enter a symptom');
      return;
    }
    note = sym + ' (' + sev + ')';
  } else {
    const val = document.getElementById('healthExtra')?.value?.trim();
    if (!val) {
      showToast('Please write a note');
      return;
    }
    note = val;
  }

  const logs = Storage.get('pc_healthLog', []);

  if (editLog) {
    const idx = logs.findIndex(l => String(l.id) === String(editLog.id));
    if (idx !== -1) {
      logs[idx].type = type;
      logs[idx].note = note;
      logs[idx].date = new Date().toISOString();
    }
    showToast('Entry updated');
  } else {
    logs.push({
      id: 'log_' + Date.now(),
      petId: pet.id,
      type,
      note,
      date: new Date().toISOString()
    });
    showToast('Entry saved');
  }

  Storage.set('pc_healthLog', logs);

  careState.editingHealthLogId = null;
  closeModal('healthLogModal');
  switchCareTab('health');
}

function deleteHealthLog(id) {
  const logs = Storage.get('pc_healthLog', []);
  const log = logs.find(l => String(l.id) === String(id));
  if (!log) return;

  if (!confirm('Delete this entry?')) return;

  const updated = logs.filter(l => String(l.id) !== String(id));
  Storage.set('pc_healthLog', updated);

  showToast('Entry deleted');

  const content = document.getElementById('careTabContent');
  if (content && careState.activeTab === 'health') {
    content.innerHTML = renderHealthTab();
    attachCareTabHandlers();
    attachHealthLogHandlers();
    setTimeout(initWeightChart, 50);
  }
}

/* ============================================================ */
/* 12. VACCINATION — ACTIONS                                     */
/* ============================================================ */
function completeVaccination(index) {
  const vax = Storage.get('pc_vaccinations', null);
  if (!Array.isArray(vax) || !vax[index]) return;

  vax[index].done = true;
  Storage.set('pc_vaccinations', vax);

  showToast(vax[index].name + ' marked complete');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  }

  const content = document.getElementById('careTabContent');
  if (content && careState.activeTab === 'health') {
    content.innerHTML = renderHealthTab();
    attachCareTabHandlers();
    setTimeout(initWeightChart, 50);
  }
}

function undoVaccination(index) {
  const vax = Storage.get('pc_vaccinations', null);
  if (!Array.isArray(vax) || !vax[index]) return;

  vax[index].done = false;
  Storage.set('pc_vaccinations', vax);

  showToast(vax[index].name + ' marked as pending');

  const content = document.getElementById('careTabContent');
  if (content && careState.activeTab === 'health') {
    content.innerHTML = renderHealthTab();
    attachCareTabHandlers();
    setTimeout(initWeightChart, 50);
  }
}

function openVaxActionMenu(index) {
  const vax = Storage.get('pc_vaccinations', null) || [];
  if (!vax[index]) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-syringe"></i> ${escapeHtml(vax[index].name)}
    </h2>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${!vax[index].done ? `
        <button class="btn btn-primary w-full" onclick="closeModal('quickViewModal'); completeVaccination(${index});">
          <i class="fas fa-check"></i> Mark as Complete
        </button>
      ` : `
        <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); undoVaccination(${index});">
          <i class="fas fa-rotate-left"></i> Undo Complete
        </button>
      `}
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); deleteVaccination(${index});">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

function deleteVaccination(index) {
  const vax = Storage.get('pc_vaccinations', null) || [];
  if (!vax[index]) return;

  if (!confirm(`Delete "${vax[index].name}"?`)) return;

  vax.splice(index, 1);
  Storage.set('pc_vaccinations', vax);

  showToast('Vaccination deleted');

  const content = document.getElementById('careTabContent');
  if (content && careState.activeTab === 'health') {
    content.innerHTML = renderHealthTab();
    attachCareTabHandlers();
    setTimeout(initWeightChart, 50);
  }
}

/* ============================================================ */
/* 13. MEDICATION — ACTIONS                                      */
/* ============================================================ */
function openMedActionMenu(id) {
  const meds = Storage.get('pc_medications', []);
  const med = meds.find(m => String(m.id) === String(id));
  if (!med) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-pills"></i> ${escapeHtml(med.name)}
    </h2>
    <div style="background:var(--pc-paper); padding:12px 14px; border-radius:12px; margin-bottom:16px;">
      <p style="font-size:12.5px; color:var(--pc-text-muted);">
        <i class="fas fa-clock"></i> ${escapeHtml(med.nextDose || '')}
      </p>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); openMedEditModal('${id}');">
        <i class="fas fa-pen"></i> Edit
      </button>
      <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); deleteMedication('${id}');">
        <i class="fas fa-trash"></i> Delete
      </button>
    </div>
  `;

  openModal('quickViewModal');
}

function openMedEditModal(id) {
  const meds = Storage.get('pc_medications', []);
  const med = meds.find(m => String(m.id) === String(id));
  if (!med) return;

  const modal = document.getElementById('medModal');
  if (!modal) return;

  const pets = APP.pets || [];
  const petOptions = pets.length
    ? pets.map(p => `<option value="${p.id}" ${p.id === med.petId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')
    : '<option value="">No pets added</option>';

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('medModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-pen"></i> Edit Medication</h2>
    <form id="medForm">
      <label>For Which Pet? *</label>
      <select id="medPet" required>${petOptions}</select>

      <label>Medicine Name *</label>
      <input type="text" id="medName" value="${escapeHtml(med.name)}" required>

      <label>Next Dose Date *</label>
      <input type="date" id="medDate" required value="${med.nextDoseDate || new Date().toISOString().slice(0, 10)}">

      <label>Next Dose Time *</label>
      <input type="time" id="medTime" required value="${med.nextDoseTime || '10:00'}">

      <label>Note (optional)</label>
      <input type="text" id="medNote" value="${escapeHtml(med.note || '')}">

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Save Changes
      </button>
    </form>
  `;

  const form = document.getElementById('medForm');
  if (form) {
    form.addEventListener('submit', (e) => handleEditMed(e, id));
  }

  openModal('medModal');
}

function handleEditMed(e, id) {
  e.preventDefault();

  const petId = document.getElementById('medPet').value;
  const name = document.getElementById('medName').value.trim();
  const dateInput = document.getElementById('medDate').value;
  const timeInput = document.getElementById('medTime').value;
  const note = document.getElementById('medNote').value.trim();

  if (!petId) { showToast('Please select a pet'); return; }
  if (!name || !dateInput || !timeInput) {
    showToast('Please fill required fields');
    return;
  }

  const isoDateTime = `${dateInput}T${timeInput}`;
  const d = new Date(isoDateTime);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const [h, m] = timeInput.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  const formattedTime = `${h12}:${m} ${ampm}`;

  const nextDose = `${formattedDate} · ${formattedTime}${note ? ' · ' + note : ''}`;

  const meds = Storage.get('pc_medications', []);
  const idx = meds.findIndex(m => String(m.id) === String(id));
  if (idx !== -1) {
    meds[idx] = {
      ...meds[idx],
      petId,
      name,
      nextDose,
      nextDoseDate: dateInput,
      nextDoseTime: timeInput,
      note
    };
    Storage.set('pc_medications', meds);
  }

  closeModal('medModal');
  showToast('Medication updated ✓');
  switchCareTab('health');
}

function deleteMedication(id) {
  const meds = Storage.get('pc_medications', []);
  const med = meds.find(m => String(m.id) === String(id));
  if (!med) return;

  if (!confirm(`Delete "${med.name}"?`)) return;

  const updated = meds.filter(m => String(m.id) !== String(id));
  Storage.set('pc_medications', updated);

  showToast('Medication deleted');

  const content = document.getElementById('careTabContent');
  if (content && careState.activeTab === 'health') {
    content.innerHTML = renderHealthTab();
    attachCareTabHandlers();
    setTimeout(initWeightChart, 50);
  }
}

/* ============================================================ */
/* 14. DAILY CARE — Pet-Specific Storage                         */
/* ============================================================ */
function loadDailyCare(petId) {
  const today = new Date().toISOString().slice(0, 10);
  const allCare = Storage.get('pc_dailyCare', { _multi: true });

  if (allCare && allCare.date && !allCare._multi) {
    const migrated = { _multi: true };
    const activePet = getActivePet();
    if (activePet) {
      migrated[activePet.id] = allCare;
    }
    Storage.set('pc_dailyCare', migrated);
    return migrated[petId] || getFreshCare(today);
  }

  if (!allCare || typeof allCare !== 'object') {
    const fresh = { _multi: true };
    Storage.set('pc_dailyCare', fresh);
    return getFreshCare(today);
  }

  if (!petId) {
    const activePet = getActivePet();
    petId = activePet ? activePet.id : null;
  }

  if (!petId) return getFreshCare(today);

  const petCare = allCare[petId];

  if (!petCare || petCare.date !== today) {
    const fresh = getFreshCare(today);
    allCare[petId] = fresh;
    Storage.set('pc_dailyCare', allCare);
    return fresh;
  }

  return petCare;
}

function getFreshCare(today) {
  return {
    date: today,
    feeding: false,
    water: false,
    walk: false,
    medicine: false,
    grooming: false,
    exercise: false
  };
}

/* ============================================================ */
/* REAL STREAK HELPERS                                           */
/* ============================================================ */

/**
 * Save today's care state to history
 * Called every time user toggles a care item
 */
function saveCareToHistory(petId, care) {
  if (!petId || !care || !care.date) return;

  const allHistory = Storage.get('pc_careHistory', {});
  if (!allHistory[petId]) allHistory[petId] = {};

  allHistory[petId][care.date] = {
    feeding: !!care.feeding,
    water: !!care.water,
    walk: !!care.walk,
    medicine: !!care.medicine,
    grooming: !!care.grooming,
    exercise: !!care.exercise,
    savedAt: new Date().toISOString()
  };

  Storage.set('pc_careHistory', allHistory);
}

/**
 * Calculate real streak based on history
 * Rule: A day counts as "done" if >= 3 core items completed
 * (feeding, water, walk, medicine)
 */
function calculateRealStreak(petId) {
  if (!petId) return 0;

  const allHistory = Storage.get('pc_careHistory', {});
  const petHistory = allHistory[petId] || {};

  const coreItems = ['feeding', 'water', 'walk', 'medicine'];
  const today = new Date();
  let streak = 0;
  let missedToday = false;

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateKey = checkDate.toISOString().slice(0, 10);

    const dayData = petHistory[dateKey];

    // Count completed core items for that day
    let completedCount = 0;
    if (dayData) {
      completedCount = coreItems.filter(k => dayData[k]).length;
    }

    if (completedCount >= 3) {
      // Day is complete — count it
      streak++;
    } else if (i === 0) {
      // Today not yet complete — don't break, check yesterday
      missedToday = true;
      continue;
    } else {
      // Previous day missed — break
      break;
    }
  }

  return streak;
}

function toggleCareItem(key) {
  const pet = getActivePet();
  if (!pet) {
    showToast('Add a pet first');
    return;
  }

  const allCare = Storage.get('pc_dailyCare', { _multi: true });
  const care = loadDailyCare(pet.id);
  care[key] = !care[key];
  allCare[pet.id] = care;
  Storage.set('pc_dailyCare', allCare);

  // ⭐ REAL STREAK: Save to history every toggle
  saveCareToHistory(pet.id, care);

  // ⭐ REAL STREAK: Recalculate + store
  const newStreak = calculateRealStreak(pet.id);
  Storage.set('pc_weekStreak', newStreak);

  if (careState.activeTab === 'today') {
    const content = document.getElementById('careTabContent');
    if (content) {
      content.innerHTML = renderTodayTab();
      attachCareTabHandlers();
    }
  }

  if (care[key]) showToast('Marked as done ✓');

  if (typeof renderHome === 'function' && APP.currentPage === 'home') {
    renderHome();
  }
}

/* ============================================================ */
/* 15. GUIDANCE MODAL                                            */
/* ============================================================ */
function showGuidance(symptomKey) {
  const guide = HEALTH_GUIDANCE[symptomKey];
  if (!guide) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-stethoscope"></i> ${guide.title}
    </h2>
    <span class="badge badge-${guide.severity === 'high' ? 'danger' : guide.severity === 'moderate' ? 'warning' : 'success'}" style="margin-bottom:12px;">
      ${guide.severity.toUpperCase()}
    </span>

    <h4 style="margin:16px 0 8px; color:var(--pc-text); font-size:13px; text-transform:uppercase; letter-spacing:0.4px;">What to do</h4>
    <ul style="list-style:none; padding:0; margin-bottom:16px;">
      ${guide.advice.map(a => `
        <li style="padding:8px 0 8px 26px; position:relative; color:var(--pc-text-2); font-size:13.5px; line-height:1.5;">
          <i class="fas fa-check" style="position:absolute; left:0; top:11px; color:var(--pc-success); font-size:11px;"></i>
          ${a}
        </li>
      `).join('')}
    </ul>

    <div style="background:var(--pc-danger-soft); border-left:4px solid var(--pc-danger); padding:14px; border-radius:10px; display:flex; gap:10px;">
      <i class="fas fa-exclamation-triangle" style="color:var(--pc-danger); font-size:16px; margin-top:2px;"></i>
      <p style="color:var(--pc-danger); font-size:13px; line-height:1.5; margin:0;">
        <strong>See a vet if:</strong> ${guide.vetIf}
      </p>
    </div>

    <button class="btn btn-primary w-full" style="margin-top:16px;" onclick="closeModal('quickViewModal')">
      <i class="fas fa-check"></i> Understood
    </button>
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* 16. FIRST-AID LIST MODAL                                      */
/* ============================================================ */
function openFirstAidListModal() {
  const modal = document.getElementById('tipsArticleModal');
  if (!modal) return;

  const guides = Object.entries(FIRST_AID_GUIDES);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('tipsArticleModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-kit-medical"></i> First-Aid Guides
    </h2>
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${guides.map(([key, g]) => `
        <button class="tip-article-card" data-firstaid-list="${key}">
          <div class="tip-article-img" style="background:var(--pc-warning-soft); display:flex; align-items:center; justify-content:center;">
            <i class="fas ${g.icon}" style="font-size:28px; color:var(--pc-warning);"></i>
          </div>
          <div class="tip-article-info">
            <p class="tip-article-title">${g.title}</p>
            <div class="tip-article-meta">
              <span class="tip-article-tag">3-min guide</span>
              <span class="tip-dot"></span>
              <span>${g.subtitle}</span>
            </div>
          </div>
          <i class="fas fa-chevron-right tip-article-arrow"></i>
        </button>
      `).join('')}
    </div>
  `;

  modal.querySelectorAll('[data-firstaid-list]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('tipsArticleModal');
      setTimeout(() => openFirstAidModal(btn.dataset.firstaidList), 250);
    });
  });

  openModal('tipsArticleModal');
}

/* ============================================================ */
/* 17. TIP ARTICLE MODAL                                         */
/* ============================================================ */
function openTipArticle(tipId) {
  const tip = TIPS_ARTICLES.find(t => t.id === tipId);
  if (!tip) return;

  const modal = document.getElementById('tipsArticleModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('tipsArticleModal')">
      <i class="fas fa-times"></i>
    </button>
    <img src="${tip.image}" alt="${tip.title}" style="width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:14px; margin-bottom:16px; background:var(--pc-paper);" onerror="this.style.opacity='0'">
    <span class="badge badge-accent" style="margin-bottom:10px;">${capitalize(tip.category)}</span>
    <h2 class="modal-title" style="margin-top:10px;">${tip.title}</h2>
    <p style="color:var(--pc-text-muted); font-size:12.5px; margin-bottom:16px;">
      <i class="fas fa-clock"></i> ${tip.readTime}
    </p>
    <p style="color:var(--pc-text-2); line-height:1.6; margin-bottom:16px; font-size:14px;">
      ${tip.content}
    </p>
    <ul style="list-style:none; padding:0;">
      ${tip.body.map(b => `
        <li style="padding:10px 0 10px 26px; position:relative; color:var(--pc-text-2); font-size:13.5px; line-height:1.5; border-bottom:1px dashed var(--pc-border-light);">
          <i class="fas fa-check" style="position:absolute; left:0; top:13px; color:var(--pc-accent); font-size:11px;"></i>
          ${b}
        </li>
      `).join('')}
    </ul>
  `;

  openModal('tipsArticleModal');
}

/* ============================================================ */
/* 18. VACCINATION MODAL                                         */
/* ============================================================ */
function openVaxModal() {
  const modal = document.getElementById('vaxModal');
  if (!modal) return;
  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('vaxModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-syringe"></i> Add Vaccination</h2>
    <form id="vaxForm">
      <label>Vaccine Name</label>
      <input type="text" id="vaxName" placeholder="e.g. Rabies" required>
      <label class="modal-checkbox-row" style="display:flex; align-items:center; gap:10px; padding:12px; background:var(--pc-paper); border-radius:10px; margin-bottom:14px;">
        <input type="checkbox" id="vaxDone" style="width:18px; height:18px; accent-color:var(--pc-success);">
        <span>Already completed</span>
      </label>
      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Add
      </button>
    </form>
  `;

  document.getElementById('vaxForm')?.addEventListener('submit', handleAddVax);
  openModal('vaxModal');
}

function handleAddVax(e) {
  e.preventDefault();
  const name = document.getElementById('vaxName').value.trim();
  const done = document.getElementById('vaxDone').checked;
  if (!name) return;

  const vax = Storage.get('pc_vaccinations', null) || [];
  vax.push({ name, done });
  Storage.set('pc_vaccinations', vax);

  closeModal('vaxModal');
  showToast('Vaccination added');
  switchCareTab('health');
}

/* ============================================================ */
/* 19. MEDICATION MODAL (Add)                                    */
/* ============================================================ */
function openMedModal() {
  const modal = document.getElementById('medModal');
  if (!modal) return;

  const pets = APP.pets || [];
  const activePetId = APP.activePetId;
  const petOptions = pets.length
    ? pets.map(p => `<option value="${p.id}" ${p.id === activePetId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')
    : '<option value="">No pets added</option>';

  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('medModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-pills"></i> Add Medication</h2>
    <form id="medForm">
      <label>For Which Pet? *</label>
      <select id="medPet" required>${petOptions}</select>

      <label>Medicine Name *</label>
      <input type="text" id="medName" placeholder="e.g. Deworming Tablet" required>

      <label>Next Dose Date *</label>
      <input type="date" id="medDate" required min="${today}" value="${today}">

      <label>Next Dose Time *</label>
      <input type="time" id="medTime" required value="${defaultTime}">

      <label>Note (optional)</label>
      <input type="text" id="medNote" placeholder="e.g. After meal">

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-check"></i> Add Medication
      </button>
    </form>
  `;

  document.getElementById('medForm')?.addEventListener('submit', handleAddMed);
  openModal('medModal');
}

function handleAddMed(e) {
  e.preventDefault();

  const petId = document.getElementById('medPet').value;
  const name = document.getElementById('medName').value.trim();
  const dateInput = document.getElementById('medDate').value;
  const timeInput = document.getElementById('medTime').value;
  const note = document.getElementById('medNote').value.trim();

  if (!petId) { showToast('Please select a pet'); return; }
  if (!name || !dateInput || !timeInput) {
    showToast('Please fill required fields');
    return;
  }

  const isoDateTime = `${dateInput}T${timeInput}`;
  const d = new Date(isoDateTime);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const [h, m] = timeInput.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  const formattedTime = `${h12}:${m} ${ampm}`;

  const nextDose = `${formattedDate} · ${formattedTime}${note ? ' · ' + note : ''}`;

  const meds = Storage.get('pc_medications', []);
  meds.push({
    id: 'med_' + Date.now(),
    petId,
    name,
    nextDose,
    nextDoseDate: dateInput,
    nextDoseTime: timeInput,
    note,
    date: new Date().toISOString()
  });
  Storage.set('pc_medications', meds);

  closeModal('medModal');
  const pet = APP.pets.find(p => p.id === petId);
  showToast('Medication added for ' + (pet ? pet.name : 'pet'));
  switchCareTab('health');
}

/* ============================================================ */
/* 20. PET MODAL                                                 */
/* ============================================================ */
function openPetModal() {
  careState.selectedAvatar = null;
  careState.editingPetId = null;
  renderPetModalForm();
  openModal('petModal');
}

function openEditPetModal(petId) {
  const pet = APP.pets.find(p => p.id === petId);
  if (!pet) return;

  careState.editingPetId = petId;
  careState.selectedAvatar = pet.avatar || null;
  renderPetModalForm(pet);
  openModal('petModal');
}

function renderPetModalForm(pet = null) {
  const modal = document.getElementById('petModal');
  if (!modal) return;

  const isEdit = !!pet;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('petModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-paw"></i> ${isEdit ? 'Edit Pet' : 'Add Your Pet'}
    </h2>

    <form id="petForm">
      <label>Pet Name *</label>
      <input type="text" id="petName" placeholder="e.g. Luna" value="${pet?.name || ''}" required>

      <label>Species *</label>
      <select id="petSpecies" required>
        <option value="">Select species</option>
        <option value="cat" ${pet?.species === 'cat' ? 'selected' : ''}>Cat</option>
        <option value="dog" ${pet?.species === 'dog' ? 'selected' : ''}>Dog</option>
        <option value="bird" ${pet?.species === 'bird' ? 'selected' : ''}>Bird</option>
        <option value="rabbit" ${pet?.species === 'rabbit' ? 'selected' : ''}>Rabbit</option>
        <option value="other" ${pet && !['cat','dog','bird','rabbit'].includes(pet.species) ? 'selected' : ''}>Other</option>
      </select>

      <div id="otherSpeciesWrap" style="display:${pet && !['cat','dog','bird','rabbit'].includes(pet.species) ? 'block' : 'none'};">
        <label>What species?</label>
        <input type="text" id="petOtherSpecies" placeholder="e.g. Hamster, Fish" value="${pet && !['cat','dog','bird','rabbit'].includes(pet.species) ? pet.species : ''}">
      </div>

      <label>Breed</label>
      <input type="text" id="petBreed" placeholder="e.g. British Shorthair" value="${pet?.breed || ''}">

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div>
          <label>Age (years)</label>
          <input type="number" id="petAge" placeholder="2" step="0.1" min="0" value="${pet?.age || ''}">
        </div>
        <div>
          <label>Weight (kg)</label>
          <input type="number" id="petWeight" placeholder="4.2" step="0.1" min="0" value="${pet?.weight || ''}">
        </div>
      </div>

      <label>Gender</label>
      <select id="petGender">
        <option value="">Select</option>
        <option value="male" ${pet?.gender === 'male' ? 'selected' : ''}>Male</option>
        <option value="female" ${pet?.gender === 'female' ? 'selected' : ''}>Female</option>
      </select>

      <label>Choose Avatar *</label>
      <div id="avatarOptions" class="avatar-options">
        ${renderAvatarOptionsHtml(pet?.species || '')}
      </div>

      <button type="submit" class="btn btn-primary w-full" style="margin-top:16px;">
        <i class="fas fa-check"></i> ${isEdit ? 'Save Changes' : 'Save Pet'}
      </button>

      ${isEdit ? `
        <button type="button" class="btn btn-danger w-full" style="margin-top:10px;" onclick="handleDeletePet('${pet.id}')">
          <i class="fas fa-trash"></i> Delete Pet
        </button>
      ` : ''}
    </form>
  `;

  const speciesSelect = document.getElementById('petSpecies');
  if (speciesSelect) {
    speciesSelect.addEventListener('change', () => {
      const val = speciesSelect.value;
      const wrap = document.getElementById('otherSpeciesWrap');
      if (wrap) wrap.style.display = val === 'other' ? 'block' : 'none';

      careState.selectedAvatar = null;

      const avatarWrap = document.getElementById('avatarOptions');
      if (avatarWrap) {
        avatarWrap.innerHTML = renderAvatarOptionsHtml(val);
        attachAvatarOptionHandlers();
      }
    });
  }

  document.getElementById('petForm')?.addEventListener('submit', handlePetFormSubmit);
  attachAvatarOptionHandlers();
}

function renderAvatarOptionsHtml(species) {
  if (!species) {
    return `<p class="avatar-hint">Select a species to see avatar options</p>`;
  }

  const avatars = getAvatarsBySpecies(species);
  if (!avatars.length) {
    return `<p class="avatar-hint">No avatars available</p>`;
  }

  return avatars.map((path, i) => `
    <button type="button" class="avatar-option ${careState.selectedAvatar === path ? 'active' : ''}" data-avatar="${path}">
      <img src="${path}" alt="Avatar ${i + 1}" onerror="this.style.opacity='0'">
    </button>
  `).join('');
}

function attachAvatarOptionHandlers() {
  document.querySelectorAll('.avatar-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      careState.selectedAvatar = btn.dataset.avatar;
      document.querySelectorAll('.avatar-option').forEach(b => {
        b.classList.toggle('active', b.dataset.avatar === careState.selectedAvatar);
      });
    });
  });
}

function handlePetFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('petName').value.trim();
  const species = document.getElementById('petSpecies').value;
  const otherSpecies = document.getElementById('petOtherSpecies')?.value.trim() || '';
  const breed = document.getElementById('petBreed').value.trim();
  const age = parseFloat(document.getElementById('petAge').value) || null;
  const weight = parseFloat(document.getElementById('petWeight').value) || null;
  const gender = document.getElementById('petGender').value;

  if (!name || !species) {
    showToast('Please fill required fields');
    return;
  }

  if (species === 'other' && !otherSpecies) {
    showToast('Please specify the species');
    return;
  }

  if (!careState.selectedAvatar) {
    showToast('Please select an avatar');
    return;
  }

  const finalSpecies = species === 'other' ? otherSpecies : species;
  const finalAvatar = careState.selectedAvatar;

  if (careState.editingPetId) {
    const pet = APP.pets.find(p => p.id === careState.editingPetId);
    if (pet) {
      pet.name = name;
      pet.species = finalSpecies;
      pet.breed = breed;
      pet.age = age;
      pet.weight = weight;
      pet.gender = gender;
      pet.avatar = finalAvatar;
    }
    Storage.set(APP.STORAGE_KEYS.PETS, APP.pets);
    showToast('Pet updated');
  } else {
    const newPet = {
      id: 'pet_' + Date.now(),
      name,
      species: finalSpecies,
      breed,
      age,
      weight,
      gender,
      avatar: finalAvatar
    };
    APP.pets.push(newPet);
    Storage.set(APP.STORAGE_KEYS.PETS, APP.pets);
    APP.activePetId = newPet.id;
    Storage.set(APP.STORAGE_KEYS.ACTIVE_PET, newPet.id);
    careState.activePetId = newPet.id;
    showToast(name + ' added');

    if (typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  }

  closeModal('petModal');
  renderCare();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function handleDeletePet(petId) {
  const pet = APP.pets.find(p => p.id === petId);
  if (!pet) return;

  if (!confirm(`Delete ${pet.name}? This cannot be undone.`)) return;

  APP.pets = APP.pets.filter(p => p.id !== petId);
  Storage.set(APP.STORAGE_KEYS.PETS, APP.pets);

  if (APP.activePetId === petId) {
    APP.activePetId = APP.pets[0]?.id || null;
    Storage.set(APP.STORAGE_KEYS.ACTIVE_PET, APP.activePetId);
  }

  closeModal('petModal');
  showToast(pet.name + ' deleted');
  renderCare();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 21. EXPORT HEALTH RECORDS                                     */
/* ============================================================ */
function exportHealthRecords() {
  const pet = getActivePet();
  if (!pet) { showToast('Add a pet first'); return; }

  if (typeof window.jspdf === 'undefined') {
    showToast('PDF library not loaded');
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(58, 74, 58);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PetCare', 15, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Digital Pet Health Passport', 15, 27);

    let y = 50;
    doc.setTextColor(58, 74, 58);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pet Information', 15, y);
    y += 3;
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const petInfo = [
      ['Name', pet.name || 'N/A'],
      ['Species', pet.species || 'N/A'],
      ['Breed', pet.breed || 'N/A'],
      ['Age', pet.age ? pet.age + ' years' : 'N/A'],
      ['Weight', pet.weight ? pet.weight + ' kg' : 'N/A'],
      ['Gender', pet.gender || 'N/A']
    ];

    petInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label + ':', 15, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(value), 60, y);
      y += 8;
    });

    y += 6;
    doc.setTextColor(58, 74, 58);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Vaccinations', 15, y);
    y += 3;
    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const vaccinations = Storage.get('pc_vaccinations', null) || [];

    vaccinations.forEach(v => {
      doc.text('- ' + v.name, 20, y);
      doc.text(v.done ? 'Completed' : 'Pending', pageWidth - 50, y);
      y += 7;
    });

    y += 8;
    doc.setTextColor(58, 74, 58);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Health Log', 15, y);
    y += 3;
    doc.line(15, y, pageWidth - 15, y);
    y += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const logs = Storage.get('pc_healthLog', null) || [];
    const petLogs = logs.filter(l => l.petId === pet.id).slice(0, 8);

    petLogs.forEach(l => {
      doc.setFont('helvetica', 'bold');
      doc.text(formatDate(l.date), 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(l.note || '', 65, y);
      y += 7;
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(220, 220, 220);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by PetCare v3.0 - ' + new Date().toLocaleDateString(), 15, pageHeight - 12);

    doc.save(`PetCare-Health-${pet.name}-${Date.now()}.pdf`);
    showToast('Health report downloaded');
  } catch (err) {
    console.error('PDF export error:', err);
    showToast('PDF generation failed');
  }
}

/* ============================================================ */
/* 22. AI ASSISTANT                                              */
/* ============================================================ */
function openAiAssistant() {
  const modal = document.getElementById('tipsArticleModal');
  if (!modal) return;

  const quickQuestions = [
    'Why is my cat not eating?',
    'How often should I walk my dog?',
    'Signs of dehydration in pets',
    'Best food for kittens'
  ];

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('tipsArticleModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-robot"></i> Ask PetCare AI
    </h2>
    <p style="color:var(--pc-text-muted); font-size:12.5px; margin-bottom:16px;">
      Get instant answers to your pet care questions
    </p>

    <div id="aiChatMessages" style="background:var(--pc-paper); border-radius:12px; padding:14px; max-height:200px; overflow-y:auto; margin-bottom:14px; min-height:100px;">
      <div style="display:flex; gap:8px; margin-bottom:10px;">
        <div style="width:30px; height:30px; border-radius:50%; background:var(--pc-purple-soft); color:var(--pc-purple); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i class="fas fa-robot" style="font-size:12px;"></i>
        </div>
        <div style="background:var(--pc-card); padding:10px 12px; border-radius:10px; font-size:13px; color:var(--pc-text-2); line-height:1.5;">
          Hi! I'm your PetCare AI assistant. Ask me anything about your pet's health or care.
        </div>
      </div>
    </div>

    <p style="font-size:11.5px; color:var(--pc-text-muted); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.3px; font-weight:700;">Quick questions</p>
    <div id="aiQuickQuestions" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
      ${quickQuestions.map((q, i) => `
        <button class="chip" style="font-size:11px; padding:6px 12px;" data-ai-quick="${i}">
          ${q}
        </button>
      `).join('')}
    </div>

    <form id="aiForm" style="display:flex; gap:8px;">
      <input type="text" id="aiInput" placeholder="Type your question..." style="flex:1; padding:12px 16px; border-radius:50px; border:1.5px solid var(--pc-border-light); background:var(--pc-card); font-family:inherit; font-size:13px;" required>
      <button type="submit" style="width:44px; height:44px; border-radius:50%; background:var(--pc-primary); color:var(--pc-text-on-dark); border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0;">
        <i class="fas fa-paper-plane" style="font-size:14px;"></i>
      </button>
    </form>
  `;

  document.getElementById('aiForm')?.addEventListener('submit', handleAiSubmit);
  modal.querySelectorAll('[data-ai-quick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.aiQuick);
      const input = document.getElementById('aiInput');
      if (input) {
        input.value = quickQuestions[idx];
        handleAiSubmit(new Event('submit'));
      }
    });
  });

  openModal('tipsArticleModal');
}

function handleAiSubmit(e) {
  if (e?.preventDefault) e.preventDefault();
  const input = document.getElementById('aiInput');
  const messages = document.getElementById('aiChatMessages');
  if (!input || !messages) return;

  const q = input.value.trim();
  if (!q) return;

  messages.innerHTML += `
    <div style="display:flex; gap:8px; margin-bottom:10px; justify-content:flex-end;">
      <div style="background:var(--pc-primary); color:var(--pc-text-on-dark); padding:10px 12px; border-radius:10px; font-size:13px; line-height:1.5; max-width:75%;">
        ${escapeHtml(q)}
      </div>
    </div>
  `;

  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    const answers = {
      'eat': 'If your pet is not eating, try warming food slightly, offering a different flavor, or removing treats for 12 hours. If it lasts more than 24 hours, consult a vet.',
      'walk': 'Most adult dogs need 30-120 minutes of activity daily. Adjust based on breed, age, and health.',
      'dehydrat': 'Signs include dry gums, skin tenting, sunken eyes, and lethargy. Offer fresh water and consult a vet if severe.',
      'kitten': 'Kittens need high-protein kitten-specific food. Feed small meals 3-4 times daily until 6 months.',
      'default': 'Great question! For specific health concerns, I recommend consulting with a veterinarian. In the meantime, keep your pet hydrated, comfortable, and monitor their behavior.'
    };

    let answer = answers.default;
    const lower = q.toLowerCase();
    for (const key of Object.keys(answers)) {
      if (lower.includes(key)) { answer = answers[key]; break; }
    }

    messages.innerHTML += `
      <div style="display:flex; gap:8px; margin-bottom:10px;">
        <div style="width:30px; height:30px; border-radius:50%; background:var(--pc-purple-soft); color:var(--pc-purple); display:flex; align-items: center; justify-content: center; flex-shrink:0;">
          <i class="fas fa-robot" style="font-size:12px;"></i>
        </div>
        <div style="background:var(--pc-card); padding:10px 12px; border-radius:10px; font-size:13px; color:var(--pc-text-2); line-height:1.5; max-width:75%;">
          ${answer}
        </div>
      </div>
    `;

    messages.scrollTop = messages.scrollHeight;
  }, 600);
}

/* ============================================================ */
/* 23. EXPORT                                                    */
/* ============================================================ */
window.renderCare = renderCare;
window.switchCareTab = switchCareTab;
window.changeCalendarMonth = changeCalendarMonth;
window.openPetModal = openPetModal;
window.openEditPetModal = openEditPetModal;
window.handlePetFormSubmit = handlePetFormSubmit;
window.handleDeletePet = handleDeletePet;
window.openHealthLogModal = openHealthLogModal;
window.handleAddHealthLog = handleAddHealthLog;
window.openVaxModal = openVaxModal;
window.handleAddVax = handleAddVax;
window.openMedModal = openMedModal;
window.handleAddMed = handleAddMed;
window.openReminderModal = openReminderModal;
window.handleAddReminder = handleAddReminder;
window.openFirstAidListModal = openFirstAidListModal;
window.openTipArticle = openTipArticle;
window.exportHealthRecords = exportHealthRecords;
window.openAiAssistant = openAiAssistant;
window.handleAiSubmit = handleAiSubmit;
window.completeVaccination = completeVaccination;
window.undoVaccination = undoVaccination;
window.deleteVaccination = deleteVaccination;
window.deleteHealthLog = deleteHealthLog;
window.deleteMedication = deleteMedication;
window.openHealthLogActionMenu = openHealthLogActionMenu;
window.openHealthLogDetail = openHealthLogDetail;
window.openHealthLogEdit = openHealthLogEdit;
window.openVaxActionMenu = openVaxActionMenu;
window.openMedActionMenu = openMedActionMenu;
window.openMedEditModal = openMedEditModal;
window.handleEditMed = handleEditMed;
window.loadDailyCare = loadDailyCare;
window.toggleCareItem = toggleCareItem;
window.getFreshCare = getFreshCare;
window.getReminders = getReminders;
window.openReminderActionMenu = openReminderActionMenu;
window.openReminderEditModal = openReminderEditModal;
window.handleEditReminder = handleEditReminder;
window.deleteReminder = deleteReminder;
window.parseReminderDateToISO = parseReminderDateToISO;
window.loadCustomCareItems = loadCustomCareItems;
window.saveCustomCareItems = saveCustomCareItems;
window.addCustomCareItem = addCustomCareItem;
window.toggleCustomCareItem = toggleCustomCareItem;
window.deleteCustomCareItem = deleteCustomCareItem;
window.editCustomCareItem = editCustomCareItem;
window.openCustomCareModal = openCustomCareModal;
window.openCustomCareMenu = openCustomCareMenu;
window.deleteCustomCareConfirm = deleteCustomCareConfirm;

console.log('PetCare Care loaded');