// ============================================
// API SERVICE LAYER - Backend Ready
// USE_MOCK = true → localStorage (demo)
// USE_MOCK = false → Real backend fetch()
// ============================================

const API_BASE_URL = 'https://api.petcare.shop/v1';
// DEMO MODE: Mock API (localStorage)
// Set to false + deploy backend to enable real API
const USE_MOCK = true;

const API = {
  // ---------- AUTH ----------
  async login(email, password) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      return { success: true, token: 'mock-token-' + Date.now(), user: { email, name: email.split('@')[0] } };
    }
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json());
  },

  async signup(name, email, password) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      return { success: true, token: 'mock-token-' + Date.now(), user: { name, email } };
    }
    return fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }).then(r => r.json());
  },

  // ---------- PRODUCTS ----------
  async getProducts(category = 'all') {
    if (USE_MOCK) {
      const all = [...products.adoption, ...products.food, ...products.accessories];
      return category === 'all' ? all : all.filter(p => p.category === category);
    }
    return fetch(`${API_BASE_URL}/products?category=${category}`).then(r => r.json());
  },

  // ---------- CART ----------
  async syncCart(cart) {
    if (USE_MOCK) return { success: true };
    return fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ cart })
    }).then(r => r.json());
  },

  // ---------- ORDERS ----------
  async placeOrder(order) {
    if (USE_MOCK) return { success: true, orderId: 'ORD-' + Date.now() };
    return fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(order)
    }).then(r => r.json());
  },

  async getOrders() {
    if (USE_MOCK) return allOrders;
    return fetch(`${API_BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());
  },

  // ---------- WISHLIST ----------
  async syncWishlist(wishlist) {
    if (USE_MOCK) return { success: true };
    return fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ wishlist })
    }).then(r => r.json());
  },

  // ---------- REVIEWS ----------
  async getReviews(productId) {
    if (USE_MOCK) return productReviews[productId] || [];
    return fetch(`${API_BASE_URL}/products/${productId}/reviews`).then(r => r.json());
  },

  async postReview(productId, review) {
    if (USE_MOCK) return { success: true };
    return fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(review)
    }).then(r => r.json());
  },

  // ---------- VET MODE ----------
  async getVets() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 300));
      return [
        { id: 1, name: 'Dr. Aisha Rahman', specialty: 'General Vet', rating: 4.9, available: true },
        { id: 2, name: 'Dr. Karim Ahmed', specialty: 'Surgery', rating: 4.7, available: false },
        { id: 3, name: 'Dr. Nusrat Jahan', specialty: 'Dermatology', rating: 4.8, available: true }
      ];
    }
    return fetch(`${API_BASE_URL}/vets`).then(r => r.json());
  },

  async bookAppointment(vetId, date) {
    if (USE_MOCK) return { success: true, appointmentId: 'APT-' + Date.now() };
    return fetch(`${API_BASE_URL}/vets/${vetId}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ date })
    }).then(r => r.json());
  },

  // ---------- EMERGENCY & RESCUE (v2.0) ----------
  async reportEmergency(payload) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        success: true,
        reportId: 'SOS-' + Date.now(),
        etaMinutes: 12,
        assignedTeam: 'Animal Rescue BD',
        teamDistance: '2.3 km',
        teamPhone: '+880-1700-000002'
      };
    }
    return fetch(`${API_BASE_URL}/emergency/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    }).then(r => r.json());
  },

  async getNearbyVets(lat, lng) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 300));
      return [
        { id: 1, name: 'Dhaka Pet Emergency', distance: '0.8 km', open: true, type: '24/7 Clinic', phone: '+880-1700-000001' },
        { id: 2, name: 'Animal Rescue BD', distance: '2.3 km', open: true, type: 'Rescue Center', phone: '+880-1700-000002' },
        { id: 3, name: 'City Vet Hospital', distance: '3.1 km', open: false, type: 'Clinic', phone: '+880-1700-000003' }
      ];
    }
    return fetch(`${API_BASE_URL}/vets/nearby?lat=${lat}&lng=${lng}`).then(r => r.json());
  },

  async getFosterPets() {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 300));
      return [
        { id: 'foster1', name: 'Milo', age: '3 months', status: 'Injured · Foster needed', urgent: true },
        { id: 'foster2', name: 'Bella', age: '1 year', status: 'Rescue · Ready to adopt', urgent: false },
        { id: 'foster3', name: 'Rocky', age: '6 months', status: 'Urgent · Medical care', urgent: true }
      ];
    }
    return fetch(`${API_BASE_URL}/rescue/foster`).then(r => r.json());
  },

  async getFirstAidGuides() {
    if (USE_MOCK) return null;
    return fetch(`${API_BASE_URL}/firstaid/guides`).then(r => r.json());
  },

  async contactFoster(petId) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        success: true,
        requestId: 'FOST-' + Date.now(),
        message: 'Rescue team will contact you within 24 hours'
      };
    }
    return fetch(`${API_BASE_URL}/rescue/foster/${petId}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(r => r.json());
  },

  // ---------- PET TRACKER ----------
  async getPetHealth(petId) {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 300));
      return {
        weight: [12.5, 12.8, 13.0, 13.2, 13.5],
        vaccinations: ['Rabies', 'Distemper', 'Parvo'],
        nextCheckup: '2025-12-15',
        activity: [80, 90, 75, 95, 88]
      };
    }
    return fetch(`${API_BASE_URL}/pets/${petId}/health`).then(r => r.json());
  },

    async addVaccination(petId, vaccine) {
    if (USE_MOCK) return { success: true };
    return fetch(`${API_BASE_URL}/pets/${petId}/vaccinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ vaccine })
    }).then(r => r.json());
  },

  // ---------- NOTIFICATIONS (নতুন) ----------
  async getNotifications() {
    if (USE_MOCK) {
      return JSON.parse(localStorage.getItem('notifications') || '[]');
    }
    return fetch(`${API_BASE_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());
  },

  async markNotificationsRead() {
    if (USE_MOCK) return { success: true };
    return fetch(`${API_BASE_URL}/notifications/read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json());
  }
};