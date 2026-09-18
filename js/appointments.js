/* ============================================================ */
/* PETCARE v3.0 — APPOINTMENTS PAGE                              */
/* ============================================================ */

function renderAppointments() {
  const page = document.getElementById('page-appointments');
  if (!page) return;

  const appointments = APP.appointments || [];
  const upcoming = appointments.filter(a => new Date(a.date) >= new Date());
  const past = appointments.filter(a => new Date(a.date) < new Date());

  page.innerHTML = `
    <div class="page-container">

      <section class="hero-card">
        <div class="hero-card-body">
          <div class="hero-card-text">
            <h2 class="hero-greeting">Your appointments</h2>
            <p class="hero-sub">Track your upcoming &amp; past visits</p>
          </div>
          <div class="hero-illustration">
            <img src="assets/illustrations/hero-dog-cat.png" alt=""
                 onerror="this.style.opacity='0'">
          </div>
        </div>
      </section>

      <section class="care-section">
        <div class="care-section-header">
          <h3><i class="fas fa-calendar-check"></i> Upcoming</h3>
          <span class="streak-badge">${upcoming.length}</span>
        </div>
        <div class="appt-list">
          ${upcoming.length
            ? upcoming.map(a => renderApptCard(a)).join('')
            : `<div class="empty-state">
                 <i class="fas fa-calendar"></i>
                 <p>No upcoming appointments</p>
                 <button class="btn btn-primary btn-sm" style="margin-top:12px;"
                         onclick="showPage('shop')">
                   <i class="fas fa-plus"></i> Book Now
                 </button>
               </div>`}
        </div>
      </section>

      ${past.length ? `
        <section class="care-section">
          <div class="care-section-header">
            <h3><i class="fas fa-history"></i> Past</h3>
            <span class="streak-badge">${past.length}</span>
          </div>
          <div class="appt-list">
            ${past.map(a => renderApptCard(a, true)).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
}

function renderApptCard(appt, isPast = false) {
  const store = typeof getStoreById === 'function' ? getStoreById(appt.storeId) : null;
  const date = new Date(appt.date);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });

  const typeLabel = {
    chat: 'Chat Consultation',
    video: 'Video Call',
    inPerson: 'In-Person Visit'
  }[appt.consultationType] || 'Consultation';

  return `
    <div class="appt-card ${isPast ? 'past' : ''}">
      <div class="appt-icon">
        <i class="fas fa-hospital"></i>
      </div>
      <div class="appt-info">
        <div class="appt-top">
          <p class="appt-clinic">${store?.name || 'Vet Clinic'}</p>
          <span class="appt-status status-${appt.status || 'confirmed'}">
            ${(appt.status || 'confirmed').charAt(0).toUpperCase() + (appt.status || 'confirmed').slice(1)}
          </span>
        </div>
        <p class="appt-type">${typeLabel} · $${appt.fee || 0}</p>
        <p class="appt-meta">
          <i class="far fa-calendar"></i> ${dateStr} ·
          <i class="far fa-clock"></i> ${timeStr}
        </p>
        <p class="appt-meta">
          <i class="fas fa-map-marker-alt"></i>
          ${store?.location || "Cox's Bazar"}
        </p>
        ${appt.reason ? `
          <p class="appt-reason">
            <i class="fas fa-comment-medical"></i> ${escapeHtml(appt.reason)}
          </p>
        ` : ''}
      </div>
      ${!isPast ? `
        <button class="appt-menu-btn" onclick="cancelAppointment('${appt.id}')" aria-label="Cancel">
          <i class="fas fa-times"></i>
        </button>
      ` : ''}
    </div>
  `;
}

function cancelAppointment(id) {
  if (!confirm('Cancel this appointment?')) return;

  APP.appointments = (APP.appointments || []).filter(a => a.id !== id);
  Storage.set(APP.STORAGE_KEYS.APPOINTMENTS, APP.appointments);
  showToast('Appointment cancelled');
  renderAppointments();
}

window.renderAppointments = renderAppointments;
window.cancelAppointment = cancelAppointment;

console.log('PetCare Appointments loaded');