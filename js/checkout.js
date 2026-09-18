/* ============================================================ */
/* PETCARE v3.0 — CHECKOUT & PAYMENT (Mock)                      */
/* ============================================================ */

function openCheckout() {
  if (!isLoggedIn()) {
    showToast('Please sign in to checkout');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  if (!APP.cart.length) {
    showToast('Cart is empty');
    return;
  }

  const modal = document.getElementById('checkoutModal');
  if (!modal) return;

  const user = APP.user || {};
  const subtotal = APP.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = subtotal > 50 ? 0 : 5;
  const grandTotal = subtotal + delivery;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('checkoutModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-credit-card"></i> Checkout</h2>

    <form id="checkoutForm">
      <label>Full Name *</label>
      <input type="text" id="checkName" value="${user.name || ''}" required>

      <label>Phone *</label>
      <input type="tel" id="checkPhone" value="${user.phone || ''}"
             placeholder="+880 17XX-XXXXXX" required>

      <label>Delivery Address *</label>
      <textarea id="checkAddress" placeholder="House, Road, Area, City"
                rows="3" required></textarea>

      <label>Payment Method *</label>
      <div class="payment-methods" id="paymentMethods">
        <button type="button" class="payment-method active" data-pay="cod">
          <i class="fas fa-money-bill-wave"></i>
          <span>Cash on Delivery</span>
        </button>
        <button type="button" class="payment-method" data-pay="bkash">
          <i class="fas fa-mobile-alt"></i>
          <span>bKash</span>
        </button>
        <button type="button" class="payment-method" data-pay="card">
          <i class="fas fa-credit-card"></i>
          <span>Card</span>
        </button>
      </div>

      <div class="checkout-summary">
        <div class="checkout-row">
          <span>Subtotal (${APP.cart.length} items)</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="checkout-row">
          <span>Delivery</span>
          <span>${delivery === 0 ? 'FREE' : '$' + delivery.toFixed(2)}</span>
        </div>
        <div class="checkout-row checkout-total">
          <span>Total</span>
          <span>$${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-full" style="margin-top:16px;">
        <i class="fas fa-check-circle"></i> Place Order — $${grandTotal.toFixed(2)}
      </button>
    </form>
  `;

  modal.querySelectorAll('.payment-method').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.payment-method').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  modal.querySelector('#checkoutForm').addEventListener('submit', (e) => {
    handleCheckoutSubmit(e, grandTotal);
  });

  openModal('checkoutModal');
}

function handleCheckoutSubmit(e, grandTotal) {
  e.preventDefault();

  const name = document.getElementById('checkName')?.value?.trim();
  const phone = document.getElementById('checkPhone')?.value?.trim();
  const address = document.getElementById('checkAddress')?.value?.trim();
  const payMethod = document.querySelector('.payment-method.active')?.dataset?.pay || 'cod';

  if (!name || !phone || !address) {
    showToast('Please fill all fields');
    return;
  }

  const order = {
    id: 'ORD-' + Date.now().toString().slice(-6),
    date: new Date().toISOString(),
    items: APP.cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity })),
    itemsCount: APP.cart.reduce((s, i) => s + i.quantity, 0),
    total: grandTotal,
    name, phone, address,
    paymentMethod: payMethod,
    status: 'confirmed',
    trackingStage: 0
  };

  APP.orders = APP.orders || [];
  APP.orders.unshift(order);
  Storage.set(APP.STORAGE_KEYS.ORDERS, APP.orders);

  APP.cart = [];
  Storage.set(APP.STORAGE_KEYS.CART, APP.cart);
  updateCartBadge();
  renderCartItems();

  APP.notifications = APP.notifications || [];
  APP.notifications.unshift({
    id: 'notif_' + Date.now(),
    type: 'order',
    title: 'Order Placed',
    message: `Your order ${order.id} has been confirmed.`,
    date: new Date().toISOString(),
    read: false
  });
  Storage.set(APP.STORAGE_KEYS.NOTIFICATIONS, APP.notifications);
  updateNotifBadge();

  closeModal('checkoutModal');
  closeCartPanel();
  showToast('Order placed successfully!');

  if (typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }

  if (typeof refreshDrawer === 'function') refreshDrawer();

  setTimeout(() => {
    if (typeof renderTrackingModal === 'function') {
      renderTrackingModal(order.id);
    }
  }, 800);
}

window.openCheckout = openCheckout;
window.handleCheckoutSubmit = handleCheckoutSubmit;

console.log('PetCare Checkout loaded');