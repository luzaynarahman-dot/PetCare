/* ============================================================ */
/* PETCARE v3.0 — NOTIFICATIONS                                  */
/* ============================================================ */

function renderNotificationsModal() {
  const modal = document.getElementById('notifModal');
  if (!modal) return;

  const notifications = APP.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('notifModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-bell"></i> Notifications
      ${unreadCount > 0 ? `<span class="modal-title-count">(${unreadCount} new)</span>` : ''}
    </h2>

    ${notifications.length === 0 ? `
      <div class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <p>No notifications yet</p>
        <span style="font-size:12px; color:var(--pc-text-muted); display:block; margin-top:6px;">
          We'll notify you about orders, reminders & more
        </span>
      </div>
    ` : `
      <div class="notif-list">
        ${notifications.map(n => renderNotificationItem(n)).join('')}
      </div>

      ${unreadCount > 0 ? `
        <button class="btn btn-outline w-full" style="margin-top:14px;"
                onclick="markAllRead()">
          <i class="fas fa-check-double"></i> Mark all as read
        </button>
      ` : ''}

      <button class="btn btn-outline w-full" style="margin-top:8px;"
              onclick="clearAllNotifications()">
        <i class="fas fa-trash"></i> Clear all
      </button>
    `}
  `;

    modal.querySelectorAll('[data-notif-id]').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.notifId;
      markNotifRead(id);

      // ⭐ CRITICAL: Immediately remove unread class
      item.classList.remove('unread');

      // ⭐ Update header count
      const remainingUnread = (APP.notifications || []).filter(n => !n.read).length;
      const headerCount = modal.querySelector('.modal-title-count');
      if (remainingUnread > 0) {
        if (headerCount) {
          headerCount.textContent = `(${remainingUnread} new)`;
        }
      } else {
        if (headerCount) headerCount.remove();
      }
    });
  });

  openModal('notifModal');
}

function renderNotificationItem(n) {
  const iconMap = {
    order: 'fa-box',
    reminder: 'fa-clock',
    appointment: 'fa-calendar-check',
    social: 'fa-heart',
    system: 'fa-info-circle',
    sos: 'fa-triangle-exclamation'
  };
  const icon = iconMap[n.type] || 'fa-bell';

  return `
    <div class="notif-item ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
      <div class="notif-icon-wrap">
        <i class="fas ${icon}"></i>
      </div>
      <div class="notif-info">
        <p class="notif-title">${escapeHtml(n.title || 'Notification')}</p>
        <p class="notif-message">${escapeHtml(n.message || '')}</p>
        <p class="notif-time">${timeAgo(n.date)}</p>
      </div>
    </div>
  `;
}

function markNotifRead(id) {
  const notifications = APP.notifications || [];
  const n = notifications.find(x => x.id === id);
  if (!n) return;

  if (!n.read) {
    n.read = true;
    Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, notifications);

    // ⭐ Update top nav badge
    updateNotifBadge();

    // ⭐ Update drawer badge
    if (typeof refreshDrawer === 'function') refreshDrawer();

    // NOTE: renderNotificationsModal() সরানো হয়েছে
    // কারণ caller (click handler) নিজেই UI update করে
  }

  // ⭐ Auto-open tracking if order notification
if (n.type === 'order' && typeof renderTrackingModal === 'function') {
  closeModal('notifModal');
  setTimeout(() => renderTrackingModal(), 250);
}

// ⭐ Auto-open SOS tracking if SOS notification
if (n.type === 'sos' && n.sosId && typeof openSosTracking === 'function') {
  closeModal('notifModal');
  setTimeout(() => openSosTracking(n.sosId), 250);
}
}

function markAllRead() {
  const notifications = APP.notifications || [];
  notifications.forEach(n => n.read = true);
  Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, notifications);
  updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();
  renderNotificationsModal();
  showToast('All marked as read');
}

function clearAllNotifications() {
  if (!confirm('Clear all notifications?')) return;
  APP.notifications = [];
  Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, []);
  updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();
  renderNotificationsModal();
  showToast('Notifications cleared');
}

window.renderNotificationsModal = renderNotificationsModal;
window.markNotifRead = markNotifRead;
window.markAllRead = markAllRead;
window.clearAllNotifications = clearAllNotifications;

console.log('PetCare Notifications loaded');