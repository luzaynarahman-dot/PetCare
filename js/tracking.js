/* ============================================================ */
/* PETCARE v3.0 — ORDER TRACKING                                 */
/* ============================================================ */

function renderTrackingModal(orderId) {
  const modal = document.getElementById('trackingModal');
  if (!modal) return;

  const orders = APP.orders || [];
  const order = orderId ? orders.find(o => o.id === orderId) : orders[0];

  if (!order) {
    modal.querySelector('.modal-content').innerHTML = `
      <button class="close-modal" onclick="closeModal('trackingModal')">
        <i class="fas fa-times"></i>
      </button>
      <h2 class="modal-title"><i class="fas fa-search-location"></i> Track Order</h2>
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <p>No orders to track yet</p>
        <button class="btn btn-primary btn-sm" style="margin-top:12px;"
                onclick="closeModal('trackingModal'); showPage('shop');">
          <i class="fas fa-shopping-bag"></i> Start Shopping
        </button>
      </div>
    `;
    openModal('trackingModal');
    return;
  }

  const stages = [
    { key: 'confirmed', label: 'Order Confirmed',  icon: 'fa-check-circle' },
    { key: 'packed',    label: 'Packed & Ready',   icon: 'fa-box' },
    { key: 'shipped',   label: 'Out for Delivery', icon: 'fa-truck' },
    { key: 'delivered', label: 'Delivered',        icon: 'fa-home' }
  ];

  const currentStage = order.trackingStage || 0;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('trackingModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-search-location"></i> Track Order</h2>

    <div class="track-order-info">
      <p class="track-order-id">Order ${order.id}</p>
      <p class="track-order-eta">
        <i class="fas fa-clock"></i>
        ${currentStage >= 3 ? 'Delivered' : 'ETA: 2-3 days'}
      </p>
    </div>

    <div class="track-stages">
      ${stages.map((stage, i) => {
        const isDone = i < currentStage;
        const isCurrent = i === currentStage;
        const cls = isDone ? 'done' : (isCurrent ? 'current' : '');
        return `
          <div class="track-stage ${cls}">
            <div class="track-dot">
              <i class="fas ${isDone ? 'fa-check' : stage.icon}"></i>
            </div>
            <div class="track-info">
              <p class="track-label">${stage.label}</p>
              <p class="track-time">
                ${isDone ? 'Completed' : isCurrent ? 'In progress...' : 'Pending'}
              </p>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="margin-top:16px;">
      <button class="btn btn-outline w-full" onclick="advanceTracking('${order.id}')">
        <i class="fas fa-forward"></i> Simulate Next Stage
      </button>
    </div>
  `;

  openModal('trackingModal');
}

function advanceTracking(orderId) {
  const orders = APP.orders || [];
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  if ((order.trackingStage || 0) < 3) {
    order.trackingStage = (order.trackingStage || 0) + 1;
    Storage.set(APP.STORAGE_KEYS.ORDERS, orders);

    if (order.trackingStage === 3) {
      showToast('Order delivered! 🎉');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      showToast('Order status updated');
    }

    renderTrackingModal(orderId);
  } else {
    showToast('Order already delivered');
  }
}

window.renderTrackingModal = renderTrackingModal;
window.advanceTracking = advanceTracking;

console.log('PetCare Tracking loaded');