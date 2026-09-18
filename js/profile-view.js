/* ============================================================ */
/* PETCARE v3.0 — PROFILE VIEW (Public)                          */
/* Real-world FB/IG style                                        */
/* Full rewrite — all functions exported, stats aligned          */
/* ============================================================ */

/* ============================================================ */
/* 1. STATE                                                      */
/* ============================================================ */
const ProfileView = {
  state: {
    userId: null,
    activeTab: 'posts'
  },

  reset() {
    this.state.userId = null;
    this.state.activeTab = 'posts';
  },

  /* ---------- Open Profile ---------- */
  open(userId) {
    if (!userId) {
      showToast('User not found');
      return;
    }

    if (userId === 'user_self') {
      showPage('profile');
      return;
    }

    const user = this.getUser(userId);
    if (!user) {
      showToast('Profile not available');
      return;
    }

    this.state.userId = userId;
    this.state.activeTab = 'posts';

    history.pushState({ page: 'user-profile', userId }, '', '#user-' + userId);
    showPage('user-profile');
    this.render();
  },

  close() {
    this.reset();
    showPage('memory');
    if (history.state?.page === 'user-profile') {
      history.back();
    }
  },

  /* ---------- Data helpers ---------- */
  getUser(userId) {
    if (!userId) return null;
    if (userId === 'user_self') return APP.user;
    return typeof getUserById === 'function' ? getUserById(userId) : null;
  },

  getUserPosts(userId) {
    if (!userId || !Array.isArray(MEMORIES_DATA)) return [];
    return MEMORIES_DATA
      .filter(p => p.authorId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getUserPets(userId) {
    const allPets = Storage.get('pc_pets', []);
    if (!Array.isArray(allPets)) return [];

    if (userId === 'user_self') {
      return allPets.filter(p => !p.ownerId || p.ownerId === 'user_self');
    }
    return allPets.filter(p => p.ownerId === userId);
  },

  getFollowers(userId) {
    const followMap = Storage.get('pc_following_map', {});
    if (!followMap || typeof followMap !== 'object') return [];

    const followerIds = Object.entries(followMap)
      .filter(([_, followingList]) => Array.isArray(followingList) && followingList.includes(userId))
      .map(([followerId]) => followerId);

    return followerIds.map(id => ProfileView.getUser(id)).filter(Boolean);
  },

  getFollowing(userId) {
    const followMap = Storage.get('pc_following_map', {});
    const followingIds = followMap[userId] || [];
    if (!Array.isArray(followingIds)) return [];
    return followingIds.map(id => ProfileView.getUser(id)).filter(Boolean);
  },

  isFollowing(userId) {
    if (!APP.user) return false;
    const myId = APP.user.id || 'user_self';
    const followMap = Storage.get('pc_following_map', {});
    const myFollowing = followMap[myId] || [];
    return Array.isArray(myFollowing) && myFollowing.includes(userId);
  },

  isOwnProfile(user) {
    if (!APP.user || !user) return false;
    if (user.id === 'user_self') return true;

    const myEmail = APP.user.email?.toLowerCase();
    const theirEmail = user.email?.toLowerCase();
    if (myEmail && theirEmail && myEmail === theirEmail) return true;

    return false;
  },

  /* ---------- Type checks ---------- */
  isVet(user) {
    return user.roles?.includes('vet') && user.vetApplication?.status === 'approved';
  },

  isStoreOwner(user) {
    return user.roles?.includes('storeOwner');
  },

  /* ============================================================ */
  /* RENDER MAIN                                                   */
  /* ============================================================ */
  render() {
    const page = document.getElementById('page-user-profile');
    if (!page) return;

    const userId = this.state.userId;
    const user = this.getUser(userId);

    if (!user) {
      page.innerHTML = this.renderNotFound();
      return;
    }

    const isOwn = this.isOwnProfile(user);
    const tabs = this.getTabs(user);

    page.innerHTML = `
      <div class="page-container user-profile-page">
        ${this.renderHeroCard(user, isOwn)}
        ${this.renderTabs(tabs)}
        <div id="profileTabContent" class="prof-tab-content">
          ${this.renderTabContent(user)}
        </div>
      </div>
    `;

    this.attachHandlers();
  },

  renderNotFound() {
    return `
      <div class="page-container">
        <div class="prof-hero-card" style="padding:40px 20px; text-align:center;">
          <div class="prof-avatar" style="margin:0 auto 16px; width:80px; height:80px;">
            <div class="prof-avatar-initial"><i class="fas fa-user-slash"></i></div>
          </div>
          <h3 style="font-size:16px; font-weight:800; color:var(--pc-text); margin-bottom:6px;">
            User not found
          </h3>
          <p style="font-size:13px; color:var(--pc-text-muted); margin-bottom:16px;">
            This profile may have been removed
          </p>
          <button class="btn btn-primary btn-sm" onclick="ProfileView.close()">
            <i class="fas fa-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    `;
  },

  /* ============================================================ */
  /* HERO CARD                                                     */
  /* ============================================================ */
  renderHeroCard(user, isOwn) {
    const postsCount = this.getUserPosts(user.id).length;
    const followersCount = this.getFollowers(user.id).length;
    const followingCount = this.getFollowing(user.id).length;

    const isVet = this.isVet(user);
    const isStore = this.isStoreOwner(user);

    return `
      <section class="prof-hero-card">
        <div class="prof-cover" style="background:${this.getCoverGradient(user.coverPhoto)}">
          ${user.coverPhoto
            ? `<img src="${user.coverPhoto}" alt="" class="prof-cover-img" onerror="this.style.display='none'">`
            : ''
          }

          <button class="prof-back-btn" onclick="ProfileView.close()" aria-label="Back">
            <i class="fas fa-arrow-left"></i>
          </button>

          ${!isOwn ? `
            <button class="prof-follow-top ${this.isFollowing(user.id) ? 'following' : ''}"
                    id="profFollowBtn"
                    data-user-id="${user.id}"
                    aria-label="Follow">
              <i class="${this.isFollowing(user.id) ? 'fas fa-check' : 'fas fa-plus'}"></i>
              <span>${this.isFollowing(user.id) ? 'Following' : 'Follow'}</span>
            </button>
          ` : `
            <button class="prof-follow-top" onclick="showPage('profile')" aria-label="Edit Profile">
              <i class="fas fa-pen"></i>
              <span>Edit</span>
            </button>
          `}
        </div>

        <div class="prof-identity">
          <div class="prof-avatar-wrap">
            <div class="prof-avatar">
              ${user.avatar
                ? `<img src="${user.avatar}" alt="${user.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'prof-avatar-initial\\'>${user.name.charAt(0).toUpperCase()}</div>'">`
                : `<div class="prof-avatar-initial">${user.name.charAt(0).toUpperCase()}</div>`
              }
            </div>
            ${isVet ? `
              <span class="prof-verified-chip">
                <i class="fas fa-circle-check"></i> Verified
              </span>
            ` : ''}
          </div>

          <div class="prof-identity-info">
            <h2 class="prof-name">
              ${escapeHtml(user.name)}
              ${isVet ? '<i class="fas fa-circle-check prof-name-tick"></i>' : ''}
            </h2>

            <div class="prof-role-chips">
              ${this.renderRoleChips(user)}
            </div>

            <div class="prof-meta-row">
              ${this.renderRoleSubtitle(user)}
              ${user.location ? `
                <span class="prof-meta-item">
                  <i class="fas fa-map-marker-alt"></i> ${escapeHtml(user.location)}
                </span>
              ` : ''}
            </div>

            ${user.bio ? `
              <p class="prof-tagline">
                "${escapeHtml(user.bio.split('.')[0])}." <i class="far fa-heart"></i>
              </p>
            ` : ''}
          </div>
        </div>

        <div class="prof-stats-row">
          <button class="prof-stat" data-stat="posts" aria-label="Posts">
            <i class="fas fa-file-lines prof-stat-icon"></i>
            <p class="prof-stat-value">${postsCount}</p>
            <p class="prof-stat-label">Posts</p>
          </button>

          <button class="prof-stat prof-stat-clickable"
                  data-stat="followers"
                  aria-label="Followers">
            <i class="fas fa-user-group prof-stat-icon"></i>
            <p class="prof-stat-value">${formatCount(followersCount)}</p>
            <p class="prof-stat-label">Followers</p>
          </button>

          <button class="prof-stat prof-stat-clickable"
                  data-stat="following"
                  aria-label="Following">
            <i class="fas fa-user-plus prof-stat-icon"></i>
            <p class="prof-stat-value">${formatCount(followingCount)}</p>
            <p class="prof-stat-label">Following</p>
          </button>

          <div class="prof-stat prof-stat-highlight">
            <i class="fas fa-${isVet ? 'stethoscope' : isStore ? 'store' : 'paw'} prof-stat-icon"></i>
            <p class="prof-stat-value">${this.getRoleStatValue(user)}</p>
            <p class="prof-stat-label">${this.getRoleStatLabel(user)}</p>
          </div>
        </div>
      </section>
    `;
  },

  renderRoleChips(user) {
    const roles = user.roles || ['petOwner'];
    const chips = [];

    if (roles.includes('vet')) {
      chips.push(`<span class="prof-role-chip chip-vet"><i class="fas fa-user-md"></i> Veterinarian</span>`);
    }
    if (roles.includes('storeOwner')) {
      chips.push(`<span class="prof-role-chip chip-store"><i class="fas fa-store"></i> Store Owner</span>`);
    }
    if (roles.includes('petOwner') && chips.length === 0) {
      chips.push(`<span class="prof-role-chip chip-owner"><i class="fas fa-paw"></i> Pet Owner</span>`);
    }

    return chips.join('');
  },

  renderRoleSubtitle(user) {
    const roles = user.roles || [];

    if (roles.includes('vet') && user.vetApplication?.clinicName) {
      return `
        <span class="prof-meta-item">
          <i class="fas fa-hospital"></i> ${escapeHtml(user.vetApplication.clinicName)}
        </span>
        <span class="prof-online-chip">
          <span class="prof-online-dot"></span> Available
        </span>
      `;
    }

    if (roles.includes('storeOwner') && user.ownedStores?.length) {
      const store = getStoreById(user.ownedStores[0]);
      if (store) {
        return `
          <span class="prof-meta-item">
            <i class="fas fa-store"></i> ${escapeHtml(store.name)}
          </span>
        `;
      }
    }

    return '';
  },

  getRoleStatValue(user) {
    const roles = user.roles || [];
    if (roles.includes('vet')) {
      return user.vetApplication?.experience ? user.vetApplication.experience + '+' : 'Pro';
    }
    if (roles.includes('storeOwner')) {
      return (user.ownedStores || []).length;
    }
    return this.getUserPets(user.id).length;
  },

  getRoleStatLabel(user) {
    const roles = user.roles || [];
    if (roles.includes('vet')) return 'Yrs Exp';
    if (roles.includes('storeOwner')) return 'Stores';
    return 'Pets';
  },

  /* ============================================================ */
  /* TABS                                                          */
  /* ============================================================ */
  getTabs(user) {
    const roles = user.roles || ['petOwner'];
    const tabs = [
      { id: 'posts', label: 'Posts', icon: 'fa-th' },
      { id: 'about', label: 'About', icon: 'fa-info-circle' }
    ];

    const hasPets = this.getUserPets(user.id).length > 0;
    const isPetOnly = roles.includes('petOwner') && !roles.includes('vet') && !roles.includes('storeOwner');

    if (isPetOnly || hasPets) {
      tabs.push({ id: 'pets', label: 'Pets', icon: 'fa-paw' });
    }

    tabs.push({ id: 'reviews', label: 'Reviews', icon: 'fa-star' });
    return tabs;
  },

  renderTabs(tabs) {
    return `
      <div class="prof-tabs" id="profileTabs" role="tablist">
        ${tabs.map(t => `
          <button class="prof-tab ${this.state.activeTab === t.id ? 'active' : ''}"
                  data-profile-tab="${t.id}"
                  role="tab"
                  aria-selected="${this.state.activeTab === t.id}">
            <i class="fas ${t.icon}"></i>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  },

  renderTabContent(user) {
    switch (this.state.activeTab) {
      case 'posts':   return this.renderPostsTab(user);
      case 'about':   return this.renderAboutTab(user);
      case 'pets':    return this.renderPetsTab(user);
      case 'reviews': return this.renderReviewsTab(user);
      default:        return this.renderPostsTab(user);
    }
  },

  /* ============================================================ */
  /* TAB: POSTS                                                    */
  /* ============================================================ */
  renderPostsTab(user) {
    const posts = this.getUserPosts(user.id);

    if (!posts.length) {
      return `
        <div class="prof-section-card">
          <div class="prof-section-header">
            <h3><i class="fas fa-paw"></i> Recent Posts</h3>
          </div>
          <div class="prof-empty">
            <i class="fas fa-camera-retro"></i>
            <p>No posts yet</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-paw"></i> Recent Posts</h3>
          <span class="prof-section-count">${posts.length}</span>
        </div>
        <div class="prof-posts-feed">
          ${posts.map(p => this.renderPostCard(p, user)).join('')}
        </div>
      </div>
    `;
  },

  renderPostCard(post, author) {
    const timeText = this.getSafeTimeAgo(post.date);
    const likes = post.likes || 0;
    const comments = (post.comments || []).length;
    const isSaved = typeof isSavedPost === 'function' && isSavedPost(post.id);

    return `
      <article class="prof-post-card" data-post-id="${post.id}" onclick="openPostDetail('${post.id}')">
        <header class="prof-post-head">
          <div class="prof-post-author">
            <div class="prof-post-avatar">
              ${author.avatar
                ? `<img src="${author.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${author.name.charAt(0).toUpperCase()}'">`
                : author.name.charAt(0).toUpperCase()
              }
            </div>
            <div class="prof-post-author-info">
              <p class="prof-post-author-name">
                ${escapeHtml(author.name)}
                ${this.isVet(author) ? '<i class="fas fa-circle-check"></i>' : ''}
              </p>
              <p class="prof-post-author-time">${timeText}</p>
            </div>
            <button class="prof-post-menu"
                    data-post-menu="${post.id}"
                    aria-label="Options"
                    onclick="event.stopPropagation(); openPostMenuDropdown(event, '${post.id}');">
              <i class="fas fa-ellipsis"></i>
            </button>
          </div>
        </header>

        <div class="prof-post-body">
          ${post.title ? `<p class="prof-post-title">${escapeHtml(post.title)}</p>` : ''}
          <p class="prof-post-text">
            ${escapeHtml((post.content || '').substring(0, 180))}${(post.content || '').length > 180 ? '…' : ''}
          </p>
        </div>

        ${post.image && typeof post.image === 'string' && post.image.trim().length > 0 ? `
        <div class="prof-post-image">
          <img src="${post.image}" 
               alt="" 
               loading="lazy" 
               onerror="this.parentElement.remove()">
        </div>
      ` : ''}

        <footer class="prof-post-actions">
          <span class="prof-post-stat">
            <i class="fas fa-heart"></i> ${likes}
          </span>
          <span class="prof-post-stat">
            <i class="fas fa-comment"></i> ${comments}
          </span>
          <span class="prof-post-stat prof-post-stat-right">
            <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
          </span>
        </footer>
      </article>
    `;
  },

  /* ============================================================ */
  /* TAB: ABOUT                                                    */
  /* ============================================================ */
  renderAboutTab(user) {
    const roles = user.roles || [];

    if (roles.includes('vet') && user.vetApplication) return this.renderVetAbout(user);
    if (roles.includes('storeOwner')) return this.renderStoreAbout(user);
    return this.renderPetOwnerAbout(user);
  },

  renderVetAbout(user) {
    const vet = user.vetApplication;
    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-seedling"></i> About</h3>
        </div>

        <div class="prof-about-grid">
          <div class="prof-about-left">
            <p class="prof-about-text">${escapeHtml(user.bio || 'No bio yet.')}</p>
          </div>
          <div class="prof-about-right">
            ${vet.specialization ? `
              <div class="prof-about-item">
                <i class="fas fa-stethoscope"></i>
                <div>
                  <p class="prof-about-key">Specialization</p>
                  <p class="prof-about-val">${escapeHtml(vet.specialization)}</p>
                </div>
              </div>
            ` : ''}
            ${vet.clinicName ? `
              <div class="prof-about-item">
                <i class="fas fa-hospital"></i>
                <div>
                  <p class="prof-about-key">Workplace</p>
                  <p class="prof-about-val">${escapeHtml(vet.clinicName)}</p>
                </div>
              </div>
            ` : ''}
            ${user.location ? `
              <div class="prof-about-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <p class="prof-about-key">Location</p>
                  <p class="prof-about-val">${escapeHtml(user.location)}</p>
                </div>
              </div>
            ` : ''}
            ${vet.experience ? `
              <div class="prof-about-item">
                <i class="fas fa-briefcase"></i>
                <div>
                  <p class="prof-about-key">Experience</p>
                  <p class="prof-about-val">${vet.experience}+ years</p>
                </div>
              </div>
            ` : ''}
            <div class="prof-online-status">
              <span class="prof-online-dot"></span> Available Online
            </div>
          </div>
        </div>

        ${vet.licenseNumber ? `
          <div class="prof-specializations">
            <p class="prof-about-key">License</p>
            <div class="prof-spec-tags">
              <span class="prof-spec-tag">
                <i class="fas fa-id-badge"></i> ${escapeHtml(vet.licenseNumber)}
              </span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  renderStoreAbout(user) {
    const store = user.ownedStores?.[0] ? getStoreById(user.ownedStores[0]) : null;
    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-seedling"></i> About Store</h3>
        </div>
        <div class="prof-about-grid">
          <div class="prof-about-left">
            <p class="prof-about-text">${escapeHtml(user.bio || 'No bio yet.')}</p>
          </div>
          <div class="prof-about-right">
            ${store ? `
              <div class="prof-about-item">
                <i class="fas fa-store"></i>
                <div>
                  <p class="prof-about-key">Store</p>
                  <p class="prof-about-val">${escapeHtml(store.name)}</p>
                </div>
              </div>
              <div class="prof-about-item">
                <i class="fas fa-tag"></i>
                <div>
                  <p class="prof-about-key">Category</p>
                  <p class="prof-about-val">${escapeHtml(store.category)}</p>
                </div>
              </div>
              <div class="prof-about-item">
                <i class="fas fa-clock"></i>
                <div>
                  <p class="prof-about-key">Hours</p>
                  <p class="prof-about-val">${escapeHtml(store.hours)}</p>
                </div>
              </div>
            ` : ''}
            ${user.location ? `
              <div class="prof-about-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <p class="prof-about-key">Location</p>
                  <p class="prof-about-val">${escapeHtml(user.location)}</p>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderPetOwnerAbout(user) {
    const petCount = this.getUserPets(user.id).length;
    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-seedling"></i> About</h3>
        </div>
        <div class="prof-about-grid">
          <div class="prof-about-left">
            <p class="prof-about-text">${escapeHtml(user.bio || 'No bio yet.')}</p>
          </div>
          <div class="prof-about-right">
            ${petCount > 0 ? `
              <div class="prof-about-item">
                <i class="fas fa-paw"></i>
                <div>
                  <p class="prof-about-key">Pets</p>
                  <p class="prof-about-val">${petCount} ${petCount === 1 ? 'pet' : 'pets'}</p>
                </div>
              </div>
            ` : ''}
            ${user.location ? `
              <div class="prof-about-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <p class="prof-about-key">Location</p>
                  <p class="prof-about-val">${escapeHtml(user.location)}</p>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  /* ============================================================ */
  /* TAB: PETS                                                     */
  /* ============================================================ */
  renderPetsTab(user) {
    const pets = this.getUserPets(user.id);

    if (!pets.length) {
      return `
        <div class="prof-section-card">
          <div class="prof-empty">
            <i class="fas fa-paw"></i>
            <p>No pets to show</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-paw"></i> Pets</h3>
          <span class="prof-section-count">${pets.length}</span>
        </div>
        <div class="prof-pets-grid">
          ${pets.map(pet => `
            <button class="prof-pet-card"
                    onclick="ProfileView.openPetModal('${pet.id}', '${user.id}')"
                    aria-label="${escapeHtml(pet.name)}">
              <div class="prof-pet-img">
                <img src="${pet.avatar || 'assets/avatars/av-cat1.png'}"
                     alt="${escapeHtml(pet.name)}"
                     loading="lazy"
                     onerror="this.style.opacity='0'">
              </div>
              <p class="prof-pet-name">${escapeHtml(pet.name)}</p>
              <p class="prof-pet-meta">
                ${this.capitalize(pet.species || '')}${pet.breed ? ' · ' + escapeHtml(pet.breed) : ''}
              </p>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  /* ============================================================ */
  /* TAB: REVIEWS                                                  */
  /* ============================================================ */
  renderReviewsTab(user) {
    const roles = user.roles || [];

    if (roles.includes('vet')) {
      const rating = 4.8;
      const count = 0;
      return `
        <div class="prof-section-card">
          <div class="prof-section-header">
            <h3><i class="fas fa-star"></i> Reviews</h3>
          </div>
          ${count > 0 ? `
            <div class="prof-reviews-hero">
              <p class="prof-reviews-big">${rating.toFixed(1)}</p>
              <div class="prof-reviews-stars">${this.renderStars(rating)}</div>
              <p class="prof-reviews-count">${count} reviews</p>
            </div>
          ` : this.renderEmptyReviews('No reviews yet', 'Be the first to share your experience')}
        </div>
      `;
    }

    if (roles.includes('storeOwner')) {
      const store = user.ownedStores?.[0] ? getStoreById(user.ownedStores[0]) : null;
      if (!store) {
        return this.renderEmptyReviewsCard('No store', "This user hasn't added a store yet");
      }
      return `
        <div class="prof-section-card">
          <div class="prof-section-header">
            <h3><i class="fas fa-star"></i> Store Reviews</h3>
          </div>
          ${(store.reviewCount || 0) > 0 ? `
            <div class="prof-reviews-hero">
              <p class="prof-reviews-big">${(store.rating || 0).toFixed(1)}</p>
              <div class="prof-reviews-stars">${this.renderStars(store.rating || 0)}</div>
              <p class="prof-reviews-count">${store.reviewCount} reviews</p>
            </div>
          ` : this.renderEmptyReviews('No reviews yet', 'This store has no reviews yet')}
        </div>
      `;
    }

    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-award"></i> Community Reputation</h3>
        </div>
        <div class="prof-community-rep">
          <div class="prof-community-stat">
            <p class="prof-community-value">${this.getUserPosts(user.id).length}</p>
            <p class="prof-community-label">Helpful Posts</p>
          </div>
          <div class="prof-community-stat">
            <p class="prof-community-value">${this.getTotalLikes(user.id)}</p>
            <p class="prof-community-label">Total Likes</p>
          </div>
        </div>
      </div>
    `;
  },

  getTotalLikes(userId) {
    return this.getUserPosts(userId).reduce((sum, p) => sum + (p.likes || 0), 0);
  },

  renderEmptyReviews(title, sub) {
    return `
      <div class="prof-empty-reviews">
        <div class="prof-empty-reviews-icon"><i class="fas fa-star"></i></div>
        <h4>${title}</h4>
        <p>${sub}</p>
      </div>
    `;
  },

  renderEmptyReviewsCard(title, sub) {
    return `
      <div class="prof-section-card">
        <div class="prof-empty-reviews">
          <div class="prof-empty-reviews-icon"><i class="fas fa-store"></i></div>
          <h4>${title}</h4>
          <p>${sub}</p>
        </div>
      </div>
    `;
  },

  renderStars(rating) {
    const rounded = Math.round(rating * 2) / 2;
    const full = Math.floor(rounded);
    const hasHalf = rounded - full === 0.5;

    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (hasHalf) html += '<i class="fas fa-star-half-alt"></i>';

    const empty = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
    return html;
  },

  capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  },

  getSafeTimeAgo(date) {
    if (typeof timeAgo === 'function') return timeAgo(date);
    if (typeof formatDate === 'function') return formatDate(date);
    return '';
  },

  getCoverGradient(coverId) {
    if (typeof getCoverGradient === 'function') return getCoverGradient(coverId);
    return 'linear-gradient(135deg, #D4DEC8, #8B9D7E)';
  },

  /* ============================================================ */
  /* ATTACH HANDLERS                                               */
  /* ============================================================ */
  attachHandlers() {
    const page = document.getElementById('page-user-profile');
    if (!page) return;

    const followBtn = page.querySelector('#profFollowBtn');
    if (followBtn) {
      followBtn.addEventListener('click', () => this.handleFollowToggle(followBtn));
    }

    page.querySelectorAll('[data-profile-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.profileTab;
        this.state.activeTab = tabId;

        page.querySelectorAll('[data-profile-tab]').forEach(t => {
          const isActive = t.dataset.profileTab === tabId;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive);
        });

        const content = document.getElementById('profileTabContent');
        if (content) {
          content.style.opacity = '0';
          content.innerHTML = this.renderTabContent(this.getUser(this.state.userId));
          requestAnimationFrame(() => {
            content.style.transition = 'opacity 0.2s ease';
            content.style.opacity = '1';
          });
        }
      });
    });

    page.querySelectorAll('[data-stat]').forEach(stat => {
      stat.addEventListener('click', () => {
        const type = stat.dataset.stat;
        if (type === 'followers') this.showFollowers();
        if (type === 'following') this.showFollowing();
      });
    });
  },

  /* ============================================================ */
  /* FOLLOW TOGGLE — Fixed: nijer following count barbe              */
  /* ============================================================ */
  handleFollowToggle(btn) {
    if (!isLoggedIn()) {
      showToast('Please sign in to follow');
      if (typeof openModal === 'function') openModal('loginModal');
      if (typeof renderLoginModal === 'function') renderLoginModal();
      return;
    }

    const userId = btn.dataset.userId;
    if (!userId) return;

    btn.classList.add('loading');

    setTimeout(() => {
      const nowFollowing = this.toggleFollow(userId);

      btn.classList.remove('loading');
      btn.classList.toggle('following', nowFollowing);
      btn.classList.add('just-followed');

      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      if (icon) icon.className = nowFollowing ? 'fas fa-check' : 'fas fa-plus';
      if (label) label.textContent = nowFollowing ? 'Following' : 'Follow';

      setTimeout(() => btn.classList.remove('just-followed'), 500);
    }, 250);
  },

  toggleFollow(userId) {
    if (!APP.user) return false;

    const myId = APP.user.id || 'user_self';
    const followMap = Storage.get('pc_following_map', {}) || {};

    // Ensure myFollowing exists
    if (!Array.isArray(followMap[myId])) followMap[myId] = [];
    const myFollowing = followMap[myId];

    let nowFollowing;

    if (myFollowing.includes(userId)) {
      const idx = myFollowing.indexOf(userId);
      myFollowing.splice(idx, 1);
      nowFollowing = false;
      showToast('Unfollowed');
    } else {
      myFollowing.push(userId);
      nowFollowing = true;
      showToast('Following');
    }

    followMap[myId] = myFollowing;
    Storage.set('pc_following_map', followMap);

    // ⭐ Update followers count in the profile view (target user)
    const followersCount = this.getFollowers(userId).length;
    const followersStat = document.querySelector('[data-stat="followers"] .prof-stat-value');
    if (followersStat) followersStat.textContent = formatCount(followersCount);

    // ⭐ Update my own following count (in My Profile page — will reflect on next render)
    // If my own profile is currently rendered, refresh it silently
    if (APP.currentPage === 'profile' && typeof renderProfile === 'function') {
      // Defer to avoid recursion
      setTimeout(() => {
        const myFollowingCount = this.getFollowing(myId).length;
        const myFollowingEl = document.querySelector('#page-profile .mp-stat:nth-child(3) .mp-stat-value');
        if (myFollowingEl) myFollowingEl.textContent = formatCount(myFollowingCount);
      }, 100);
    }

    if (typeof refreshDrawer === 'function') refreshDrawer();
    return nowFollowing;
  },

  /* ============================================================ */
  /* FOLLOWERS / FOLLOWING MODALS                                  */
  /* ============================================================ */
  showFollowers() {
    const user = this.getUser(this.state.userId);
    if (!user) return;

    const followers = this.getFollowers(user.id);
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    modal.querySelector('.modal-content').innerHTML = `
      <button class="close-modal" onclick="closeModal('quickViewModal')">
        <i class="fas fa-times"></i>
      </button>
      <h2 class="modal-title">
        <i class="fas fa-user-group"></i> Followers
        <span class="modal-title-count">(${followers.length})</span>
      </h2>
      ${followers.length ? `
        <div class="follow-list">
          ${followers.map(u => this.renderFollowListItem(u)).join('')}
        </div>
      ` : `
        <div class="follow-list-empty">
          <i class="fas fa-user-group"></i>
          <p>No followers yet</p>
        </div>
      `}
    `;

    this.attachFollowListHandlers();
    openModal('quickViewModal');
  },

  showFollowing() {
    const user = this.getUser(this.state.userId);
    if (!user) return;

    const following = this.getFollowing(user.id);
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    modal.querySelector('.modal-content').innerHTML = `
      <button class="close-modal" onclick="closeModal('quickViewModal')">
        <i class="fas fa-times"></i>
      </button>
      <h2 class="modal-title">
        <i class="fas fa-user-plus"></i> Following
        <span class="modal-title-count">(${following.length})</span>
      </h2>
      ${following.length ? `
        <div class="follow-list">
          ${following.map(u => this.renderFollowListItem(u)).join('')}
        </div>
      ` : `
        <div class="follow-list-empty">
          <i class="fas fa-user-plus"></i>
          <p>Not following anyone yet</p>
        </div>
      `}
    `;

    this.attachFollowListHandlers();
    openModal('quickViewModal');
  },

  renderFollowListItem(user) {
    const roleClass = user.roles?.includes('vet') ? 'vet'
                    : user.roles?.includes('storeOwner') ? 'store'
                    : '';

    const roleLabel = user.roles?.includes('vet') ? 'Veterinarian'
                    : user.roles?.includes('storeOwner') ? 'Store Owner'
                    : 'Pet Owner';

    const isFollowing = this.isFollowing(user.id);

    return `
      <button class="follow-list-item" data-follow-user="${user.id}">
        <div class="follow-list-avatar ${roleClass}">
          ${user.avatar
            ? `<img src="${user.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${user.name.charAt(0).toUpperCase()}'">`
            : user.name.charAt(0).toUpperCase()
          }
        </div>
        <div class="follow-list-info">
          <div class="follow-list-name">
            ${escapeHtml(user.name)}
            ${this.isVet(user) ? '<i class="fas fa-circle-check"></i>' : ''}
          </div>
          <div class="follow-list-role">${roleLabel}</div>
        </div>
        <span class="follow-list-btn ${isFollowing ? 'following' : ''}" data-follow-toggle="${user.id}">
          ${isFollowing ? 'Following' : 'Follow'}
        </span>
      </button>
    `;
  },

  attachFollowListHandlers() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    modal.querySelectorAll('[data-follow-user]').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('[data-follow-toggle]')) return;
        const userId = item.dataset.followUser;
        closeModal('quickViewModal');
        setTimeout(() => this.open(userId), 200);
      });
    });

    modal.querySelectorAll('[data-follow-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = btn.dataset.followToggle;
        const nowFollowing = this.toggleFollow(userId);
        btn.textContent = nowFollowing ? 'Following' : 'Follow';
        btn.classList.toggle('following', nowFollowing);
      });
    });
  },

  /* ============================================================ */
  /* PUBLIC PET MODAL                                              */
  /* ============================================================ */
  openPetModal(petId, ownerId) {
    const pets = this.getUserPets(ownerId);
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    const owner = this.getUser(ownerId);
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    modal.querySelector('.modal-content').innerHTML = `
      <button class="close-modal" onclick="closeModal('quickViewModal')">
        <i class="fas fa-times"></i>
      </button>
      <div class="public-pet-hero">
        <img src="${pet.avatar || 'assets/avatars/av-cat1.png'}" alt="${escapeHtml(pet.name)}" onerror="this.style.opacity='0'">
      </div>
      <h2 class="public-pet-name">${escapeHtml(pet.name)}</h2>
      <p class="public-pet-meta">
        ${this.capitalize(pet.species || '')}${pet.breed ? ' · ' + escapeHtml(pet.breed) : ''}${pet.age ? ' · ' + pet.age + ' ' + (pet.age === 1 ? 'year' : 'years') : ''}
      </p>
      ${pet.healthStatus ? `
        <div style="text-align:center;">
          <div class="public-pet-health healthy">
            <i class="fas fa-heart-pulse"></i> ${escapeHtml(pet.healthStatus)}
          </div>
        </div>
      ` : ''}
      <div class="public-pet-divider"></div>
      <div class="public-pet-owner" onclick="closeModal('quickViewModal'); ProfileView.open('${ownerId}');">
        <div class="public-pet-owner-avatar">
          ${owner?.avatar
            ? `<img src="${owner.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${(owner?.name || 'U').charAt(0).toUpperCase()}'">`
            : (owner?.name || 'U').charAt(0).toUpperCase()
          }
        </div>
        <div class="public-pet-owner-info">
          <p class="public-pet-owner-label">Owner</p>
          <p class="public-pet-owner-name">${escapeHtml(owner?.name || 'Unknown')}</p>
          ${owner?.location ? `<p class="public-pet-owner-loc"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(owner.location)}</p>` : ''}
        </div>
        <i class="fas fa-chevron-right" style="color:var(--pc-text-muted);"></i>
      </div>
    `;

    openModal('quickViewModal');
  }
};

/* ============================================================ */
/* 2. POST DETAIL MODAL — Global export                          */
/* ============================================================ */
function openPostDetail(postId) {
  const post = (MEMORIES_DATA || []).find(p => p.id === postId);
  if (!post) {
    showToast('Post not found');
    return;
  }

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const author = ProfileView.getUser(post.authorId) || {
    name: post.authorName || 'Unknown',
    avatar: post.authorAvatar || null,
    roles: [post.authorRole || 'petOwner']
  };

  const likes = post.likes || 0;
  const comments = post.comments || [];

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <header class="pd-header">
      <div class="pd-author">
        <div class="pd-avatar">
          ${author.avatar
            ? `<img src="${author.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${author.name.charAt(0).toUpperCase()}'">`
            : author.name.charAt(0).toUpperCase()
          }
        </div>
        <div class="pd-author-info">
          <p class="pd-author-name">
            ${escapeHtml(author.name)}
            ${ProfileView.isVet(author) ? '<i class="fas fa-circle-check"></i>' : ''}
          </p>
          <p class="pd-author-time">${ProfileView.getSafeTimeAgo(post.date)}</p>
        </div>
      </div>
    </header>

    ${post.title ? `<p class="pd-title">${escapeHtml(post.title)}</p>` : ''}
    <p class="pd-content">${escapeHtml(post.content || '')}</p>

    ${(post.image && typeof post.image === 'string' && post.image.trim().length > 0) ? `
      <div class="pd-image">
        <img src="${post.image}" alt="" onerror="this.style.opacity='0'">
      </div>
    ` : ''}

    ${post.products && post.products.length ? `
      <div class="pd-products">
        ${post.products.map(img => `
          <div class="pd-product-img">
            <img src="${img}" alt="" onerror="this.style.opacity='0'">
          </div>
        `).join('')}
      </div>
    ` : ''}

    <footer class="pd-actions">
      <button class="pd-action" onclick="toggleMemoryLike('${post.id}'); closeModal('quickViewModal');">
        <i class="far fa-heart"></i>
        <span>${likes}</span>
      </button>
      <button class="pd-action">
        <i class="far fa-comment"></i>
        <span>${comments.length}</span>
      </button>
      <button class="pd-action" onclick="shareMemory('${post.id}')">
        <i class="far fa-share-square"></i>
        <span>Share</span>
      </button>
    </footer>

    ${comments.length ? `
      <div class="pd-comments">
        <p class="pd-comments-title">Comments</p>
        <div class="pd-comments-list">
          ${comments.slice(0, 5).map(c => {
            const cAuthor = ProfileView.getUser(c.authorId) || {
              name: c.authorName || 'Unknown',
              avatar: c.authorAvatar || null,
              roles: [c.authorRole || 'petOwner']
            };
            return `
              <div class="pd-comment">
                <div class="pd-comment-avatar ${ProfileView.isVet(cAuthor) ? 'vet' : ''}">
                  ${cAuthor.avatar
                    ? `<img src="${cAuthor.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${cAuthor.name.charAt(0).toUpperCase()}'">`
                    : cAuthor.name.charAt(0).toUpperCase()
                  }
                </div>
                <div class="pd-comment-body">
                  <p class="pd-comment-author">
                    ${escapeHtml(cAuthor.name)}
                    ${ProfileView.isVet(cAuthor) ? '<i class="fas fa-circle-check"></i>' : ''}
                  </p>
                  <p class="pd-comment-text">${escapeHtml(c.text || '')}</p>
                  <p class="pd-comment-time">${ProfileView.getSafeTimeAgo(c.date)}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* 3. POST MENU DROPDOWN — Global export                         */
/* ============================================================ */
function openPostMenuDropdown(event, postId) {
  if (event && event.stopPropagation) event.stopPropagation();

  const existing = document.getElementById('postMenuDropdown');
  if (existing) existing.remove();

  const post = (MEMORIES_DATA || []).find(p => p.id === postId);
  if (!post) return;

  const isOwnPost = post.authorId === 'user_self' || post.authorId === APP.user?.id;
  const isSaved = typeof isSavedPost === 'function' && isSavedPost(postId);

  const btn = event.currentTarget;
  const rect = btn.getBoundingClientRect();

  const dropdown = document.createElement('div');
  dropdown.id = 'postMenuDropdown';
  dropdown.className = 'post-menu-dropdown';
  dropdown.style.position = 'fixed';
  dropdown.style.top = (rect.bottom + 4) + 'px';
  dropdown.style.right = (window.innerWidth - rect.right) + 'px';

  dropdown.innerHTML = `
    <button class="post-menu-item" onclick="shareMemory('${postId}'); closePostMenuDropdown();">
      <i class="fas fa-share"></i> Share Post
    </button>
    <button class="post-menu-item" onclick="handleSaveFromMenu('${postId}');">
      <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
      ${isSaved ? 'Unsave Post' : 'Save Post'}
    </button>
    ${isOwnPost ? `
      <button class="post-menu-item danger" onclick="handleDeletePostFromMenu('${postId}');">
        <i class="fas fa-trash"></i> Delete Post
      </button>
    ` : ''}
  `;

  document.body.appendChild(dropdown);

  setTimeout(() => {
    document.addEventListener('click', closePostMenuDropdownOnce);
  }, 0);
}

function closePostMenuDropdownOnce() {
  closePostMenuDropdown();
  document.removeEventListener('click', closePostMenuDropdownOnce);
}

function closePostMenuDropdown() {
  const dropdown = document.getElementById('postMenuDropdown');
  if (dropdown) dropdown.remove();
}

function handleSaveFromMenu(postId) {
  const isSaved = typeof toggleSavePost === 'function' ? toggleSavePost(postId) : false;
  closePostMenuDropdown();

  document.querySelectorAll(`[data-post-id="${postId}"] .prof-post-stat-right i`).forEach(icon => {
    icon.className = isSaved ? 'fas fa-bookmark' : 'far fa-bookmark';
  });
}

function handleDeletePostFromMenu(postId) {
  closePostMenuDropdown();
  if (typeof deleteMemoryPost === 'function') {
    deleteMemoryPost(postId);
  }
}

/* ============================================================ */
/* 4. PUBLIC API WRAPPERS                                        */
/* ============================================================ */
function openUserProfile(userId) { ProfileView.open(userId); }
function closeUserProfile() { ProfileView.close(); }
function renderUserProfile() { ProfileView.render(); }

/* ============================================================ */
/* 5. POPSTATE                                                   */
/* ============================================================ */
window.addEventListener('popstate', (e) => {
  if (APP.currentPage === 'user-profile') {
    const state = e.state;
    if (state?.page === 'user-profile' && state.userId) {
      ProfileView.state.userId = state.userId;
      showPage('user-profile');
      ProfileView.render();
    } else {
      ProfileView.reset();
      showPage('memory');
    }
  }
});

/* ============================================================ */
/* 6. EXPORT ALL — sob function global                           */
/* ============================================================ */
window.ProfileView = ProfileView;
window.openUserProfile = openUserProfile;
window.closeUserProfile = closeUserProfile;
window.renderUserProfile = renderUserProfile;
window.openPostDetail = openPostDetail;
window.openPostMenuDropdown = openPostMenuDropdown;
window.closePostMenuDropdown = closePostMenuDropdown;
window.handleSaveFromMenu = handleSaveFromMenu;
window.handleDeletePostFromMenu = handleDeletePostFromMenu;


console.log('PetCare ProfileView loaded');