/* ============================================================ */
/* PETCARE v3.0 — SKELETON LOADERS                               */
/* HTML generators for loading placeholders                      */
/* ============================================================ */

/* ============================================================ */
/* 1. HOME PAGE SKELETON                                         */
/* ============================================================ */
function skeletonHome() {
  return (
    '<div class="page-container">' +

      // Hero card
      '<section class="skeleton-card">' +
        '<div class="skeleton-hero">' +
          '<div class="skeleton-hero-text">' +
            '<div class="skeleton skeleton-line long" style="height:24px; margin-bottom:12px;"></div>' +
            '<div class="skeleton skeleton-line medium" style="margin-bottom:20px;"></div>' +
            '<div class="skeleton skeleton-pill" style="width:140px; height:38px;"></div>' +
          '</div>' +
          '<div class="skeleton skeleton-rect skeleton-hero-image"></div>' +
        '</div>' +
      '</section>' +

      // SOS banner
      '<section class="skeleton-card" style="min-height:80px;">' +
        '<div style="display:flex; align-items:center; gap:14px;">' +
          '<div class="skeleton skeleton-circle" style="width:46px; height:46px;"></div>' +
          '<div style="flex:1;">' +
            '<div class="skeleton skeleton-line medium" style="height:14px; margin-bottom:8px;"></div>' +
            '<div class="skeleton skeleton-line long"></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      // Week card
      '<section class="skeleton-card">' +
        '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:20px;"></div>' +
        '<div style="display:flex; justify-content:space-between; gap:6px;">' +
          '<div class="skeleton skeleton-circle" style="width:34px; height:34px;"></div>' +
          '<div class="skeleton skeleton-circle" style="width:34px; height:34px;"></div>' +
          '<div class="skeleton skeleton-circle" style="width:34px; height:34px;"></div>' +
          '<div class="skeleton skeleton-circle" style="width:34px; height:34px;"></div>' +
          '<div class="skeleton skeleton-circle" style="width:34px; height:34px;"></div>' +
          '<div class="skeleton skeleton-circle" style="width:34px; height:34px;"></div>' +
          '<div class="skeleton skeleton-circle" style="width:34px; height:34px;"></div>' +
        '</div>' +
      '</section>' +

      // Vets list
      '<section class="skeleton-card">' +
        '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:16px;"></div>' +
        '<div class="skeleton-list-item">' +
          '<div class="skeleton skeleton-circle skeleton-list-icon"></div>' +
          '<div class="skeleton-list-info">' +
            '<div class="skeleton skeleton-line medium" style="height:13px; margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line short"></div>' +
          '</div>' +
          '<div class="skeleton skeleton-circle" style="width:38px; height:38px;"></div>' +
        '</div>' +
        '<div class="skeleton-list-item">' +
          '<div class="skeleton skeleton-circle skeleton-list-icon"></div>' +
          '<div class="skeleton-list-info">' +
            '<div class="skeleton skeleton-line medium" style="height:13px; margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line short"></div>' +
          '</div>' +
          '<div class="skeleton skeleton-circle" style="width:38px; height:38px;"></div>' +
        '</div>' +
      '</section>' +

    '</div>'
  );
}

/* ============================================================ */
/* 2. SHOP PAGE SKELETON                                         */
/* ============================================================ */
function skeletonShop() {
  var cards = '';
  for (var i = 0; i < 6; i++) {
    cards +=
      '<div class="skeleton-product">' +
        '<div class="skeleton skeleton-product-img"></div>' +
        '<div class="skeleton-product-body">' +
          '<div class="skeleton skeleton-product-name"></div>' +
          '<div class="skeleton skeleton-product-meta"></div>' +
          '<div class="skeleton skeleton-product-price"></div>' +
        '</div>' +
      '</div>';
  }

  return (
    '<div class="page-container">' +

      // Hero
      '<section class="skeleton-card" style="min-height:130px;">' +
        '<div class="skeleton-hero">' +
          '<div class="skeleton-hero-text">' +
            '<div class="skeleton skeleton-line long" style="height:22px; margin-bottom:12px;"></div>' +
            '<div class="skeleton skeleton-line medium"></div>' +
          '</div>' +
          '<div class="skeleton skeleton-rect" style="width:100px; height:100px;"></div>' +
        '</div>' +
      '</section>' +

      // Tabs
      '<div style="display:flex; gap:10px; margin-bottom:20px;">' +
        '<div class="skeleton skeleton-pill" style="flex:1; height:44px;"></div>' +
        '<div class="skeleton skeleton-pill" style="flex:1; height:44px;"></div>' +
      '</div>' +

      // Featured stores
      '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:14px;"></div>' +
      '<div style="display:flex; gap:12px; margin-bottom:24px; overflow:hidden;">' +
        '<div class="skeleton skeleton-rect" style="min-width:200px; height:150px;"></div>' +
        '<div class="skeleton skeleton-rect" style="min-width:200px; height:150px;"></div>' +
        '<div class="skeleton skeleton-rect" style="min-width:200px; height:150px;"></div>' +
      '</div>' +

      // Category circles
      '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:14px;"></div>' +
      '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:24px;">' +
        '<div class="skeleton skeleton-circle" style="width:100%; aspect-ratio:1;"></div>' +
        '<div class="skeleton skeleton-circle" style="width:100%; aspect-ratio:1;"></div>' +
        '<div class="skeleton skeleton-circle" style="width:100%; aspect-ratio:1;"></div>' +
        '<div class="skeleton skeleton-circle" style="width:100%; aspect-ratio:1;"></div>' +
      '</div>' +

      // Products grid
      '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:14px;"></div>' +
      '<div class="skeleton-products-grid">' + cards + '</div>' +

    '</div>'
  );
}

/* ============================================================ */
/* 3. MEMORY PAGE SKELETON                                       */
/* ============================================================ */
function skeletonMemory() {
  var posts = '';
  for (var i = 0; i < 3; i++) {
    posts +=
      '<div class="skeleton-post">' +
        '<div class="skeleton-post-header">' +
          '<div class="skeleton skeleton-post-avatar"></div>' +
          '<div class="skeleton-post-author">' +
            '<div class="skeleton skeleton-line short" style="height:13px; margin-bottom:5px;"></div>' +
            '<div class="skeleton skeleton-line" style="width:30%; height:10px;"></div>' +
          '</div>' +
        '</div>' +
        '<div class="skeleton-post-body">' +
          '<div class="skeleton skeleton-line long" style="height:14px; margin-bottom:8px;"></div>' +
          '<div class="skeleton skeleton-line full"></div>' +
          '<div class="skeleton skeleton-line short"></div>' +
        '</div>' +
        '<div class="skeleton skeleton-post-image"></div>' +
        '<div class="skeleton-post-actions">' +
          '<div class="skeleton skeleton-post-action"></div>' +
          '<div class="skeleton skeleton-post-action"></div>' +
          '<div class="skeleton skeleton-post-action"></div>' +
        '</div>' +
      '</div>';
  }

  return (
    '<div class="page-container">' +

      // Banner
      '<section class="skeleton-card" style="min-height:110px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center;">' +
          '<div style="flex:1;">' +
            '<div class="skeleton skeleton-line long" style="height:20px; margin-bottom:10px;"></div>' +
            '<div class="skeleton skeleton-line medium"></div>' +
          '</div>' +
          '<div class="skeleton skeleton-rect" style="width:100px; height:70px;"></div>' +
        '</div>' +
      '</section>' +

      // Composer
      '<div class="skeleton skeleton-pill" style="width:100%; height:56px; margin-bottom:16px;"></div>' +

      // Filter chips
      '<div style="display:flex; gap:8px; margin-bottom:16px; overflow:hidden;">' +
        '<div class="skeleton skeleton-pill" style="width:80px; height:36px;"></div>' +
        '<div class="skeleton skeleton-pill" style="width:100px; height:36px;"></div>' +
        '<div class="skeleton skeleton-pill" style="width:90px; height:36px;"></div>' +
        '<div class="skeleton skeleton-pill" style="width:110px; height:36px;"></div>' +
      '</div>' +

      // Posts
      posts +

    '</div>'
  );
}

/* ============================================================ */
/* 4. PROFILE PAGE SKELETON                                      */
/* ============================================================ */
function skeletonProfile() {
  return (
    '<div class="page-container">' +

      // Hero card
      '<section class="skeleton-profile-hero">' +
        '<div class="skeleton skeleton-profile-cover"></div>' +
        '<div class="skeleton-profile-identity">' +
          '<div class="skeleton skeleton-profile-avatar"></div>' +
          '<div class="skeleton-profile-info">' +
            '<div class="skeleton skeleton-line medium" style="height:18px; margin-bottom:10px;"></div>' +
            '<div class="skeleton skeleton-line short" style="height:12px; margin-bottom:8px;"></div>' +
            '<div class="skeleton skeleton-line long" style="height:12px;"></div>' +
          '</div>' +
        '</div>' +
        '<div class="skeleton-profile-stats">' +
          '<div class="skeleton skeleton-profile-stat"></div>' +
          '<div class="skeleton skeleton-profile-stat"></div>' +
          '<div class="skeleton skeleton-profile-stat"></div>' +
          '<div class="skeleton skeleton-profile-stat"></div>' +
        '</div>' +
      '</section>' +

      // Quick actions
      '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:16px;">' +
        '<div class="skeleton skeleton-rect" style="height:80px;"></div>' +
        '<div class="skeleton skeleton-rect" style="height:80px;"></div>' +
        '<div class="skeleton skeleton-rect" style="height:80px;"></div>' +
        '<div class="skeleton skeleton-rect" style="height:80px;"></div>' +
      '</div>' +

      // Section card
      '<section class="skeleton-card">' +
        '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:16px;"></div>' +
        '<div style="display:flex; gap:10px; overflow:hidden;">' +
          '<div class="skeleton skeleton-rect" style="min-width:175px; height:180px;"></div>' +
          '<div class="skeleton skeleton-rect" style="min-width:175px; height:180px;"></div>' +
        '</div>' +
      '</section>' +

      // Another section
      '<section class="skeleton-card">' +
        '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:16px;"></div>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">' +
          '<div class="skeleton skeleton-rect" style="aspect-ratio:1;"></div>' +
          '<div class="skeleton skeleton-rect" style="aspect-ratio:1;"></div>' +
        '</div>' +
      '</section>' +

    '</div>'
  );
}

/* ============================================================ */
/* 5. CARE PAGE SKELETON                                         */
/* ============================================================ */
function skeletonCare() {
  return (
    '<div class="page-container">' +

      // Hero
      '<section class="skeleton-card" style="min-height:130px;">' +
        '<div class="skeleton-hero">' +
          '<div class="skeleton-hero-text">' +
            '<div class="skeleton skeleton-line long" style="height:22px; margin-bottom:12px;"></div>' +
            '<div class="skeleton skeleton-line medium"></div>' +
          '</div>' +
          '<div class="skeleton skeleton-rect" style="width:100px; height:100px;"></div>' +
        '</div>' +
      '</section>' +

      // Pet selector
      '<div class="skeleton-pet-row">' +
        '<div class="skeleton skeleton-circle skeleton-pet-chip"></div>' +
        '<div class="skeleton skeleton-circle skeleton-pet-chip"></div>' +
        '<div class="skeleton skeleton-circle skeleton-pet-chip"></div>' +
        '<div class="skeleton skeleton-circle skeleton-pet-chip"></div>' +
      '</div>' +

      // Tabs
      '<div class="skeleton skeleton-pill" style="width:100%; height:48px; margin:16px 0;"></div>' +

      // Content
      '<section class="skeleton-card">' +
        '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:16px;"></div>' +
        '<div class="skeleton-list-item">' +
          '<div class="skeleton skeleton-circle skeleton-list-icon"></div>' +
          '<div class="skeleton-list-info">' +
            '<div class="skeleton skeleton-line medium" style="height:13px; margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line short"></div>' +
          '</div>' +
        '</div>' +
        '<div class="skeleton-list-item">' +
          '<div class="skeleton skeleton-circle skeleton-list-icon"></div>' +
          '<div class="skeleton-list-info">' +
            '<div class="skeleton skeleton-line medium" style="height:13px; margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line short"></div>' +
          '</div>' +
        '</div>' +
        '<div class="skeleton-list-item">' +
          '<div class="skeleton skeleton-circle skeleton-list-icon"></div>' +
          '<div class="skeleton-list-info">' +
            '<div class="skeleton skeleton-line medium" style="height:13px; margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line short"></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

    '</div>'
  );
}

/* ============================================================ */
/* 6. APPOINTMENTS SKELETON                                      */
/* ============================================================ */
function skeletonAppointments() {
  return (
    '<div class="page-container">' +

      '<section class="skeleton-card" style="min-height:120px;">' +
        '<div class="skeleton skeleton-line long" style="height:20px; margin-bottom:12px;"></div>' +
        '<div class="skeleton skeleton-line medium"></div>' +
      '</section>' +

      '<section class="skeleton-card">' +
        '<div class="skeleton skeleton-line short" style="height:18px; margin-bottom:16px;"></div>' +
        '<div class="skeleton-list-item">' +
          '<div class="skeleton skeleton-circle skeleton-list-icon"></div>' +
          '<div class="skeleton-list-info">' +
            '<div class="skeleton skeleton-line medium" style="height:13px; margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line short" style="margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line long"></div>' +
          '</div>' +
        '</div>' +
        '<div class="skeleton-list-item">' +
          '<div class="skeleton skeleton-circle skeleton-list-icon"></div>' +
          '<div class="skeleton-list-info">' +
            '<div class="skeleton skeleton-line medium" style="height:13px; margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line short" style="margin-bottom:6px;"></div>' +
            '<div class="skeleton skeleton-line long"></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

    '</div>'
  );
}

/* ============================================================ */
/* 7. GENERIC SKELETON (fallback)                                */
/* ============================================================ */
function skeletonGeneric() {
  return (
    '<div class="page-container">' +
      '<section class="skeleton-card">' +
        '<div class="skeleton skeleton-line long" style="height:20px; margin-bottom:16px;"></div>' +
        '<div class="skeleton skeleton-line medium" style="margin-bottom:10px;"></div>' +
        '<div class="skeleton skeleton-line full" style="margin-bottom:10px;"></div>' +
        '<div class="skeleton skeleton-line short"></div>' +
      '</section>' +
    '</div>'
  );
}

/* ============================================================ */
/* 8. HELPER — SHOW SKELETON IN PAGE                             */
/* ============================================================ */
function showSkeleton(pageName) {
  var page = document.getElementById('page-' + pageName);
  if (!page) return;

  var skeletonHTML = '';
  switch (pageName) {
    case 'home':         skeletonHTML = skeletonHome();         break;
    case 'shop':         skeletonHTML = skeletonShop();         break;
    case 'memory':       skeletonHTML = skeletonMemory();       break;
    case 'profile':      skeletonHTML = skeletonProfile();      break;
    case 'care':         skeletonHTML = skeletonCare();         break;
    case 'appointments': skeletonHTML = skeletonAppointments(); break;
    default:             skeletonHTML = skeletonGeneric();
  }

  page.innerHTML = skeletonHTML;
}

/* ============================================================ */
/* 9. EXPORT                                                     */
/* ============================================================ */
window.skeletonHome = skeletonHome;
window.skeletonShop = skeletonShop;
window.skeletonMemory = skeletonMemory;
window.skeletonProfile = skeletonProfile;
window.skeletonCare = skeletonCare;
window.skeletonAppointments = skeletonAppointments;
window.skeletonGeneric = skeletonGeneric;
window.showSkeleton = showSkeleton;

console.log('PetCare Skeleton loaded');
