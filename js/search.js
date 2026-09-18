/* ============================================================ */
/* PETCARE v3.0 — SEARCH SYSTEM                                  */
/* In-place navbar expansion + live overlay results              */
/* ============================================================ */

let searchState = {
  isOpen: false,
  query: '',
  results: {
    users: [],
    posts: [],
    tags: []
  }
};

/* ============================================================ */
/* 1. OPEN / CLOSE SEARCH                                        */
/* ============================================================ */
function openNavSearch() {
  const nav = document.getElementById('topNav');
  const input = document.getElementById('navSearchInput');
  if (!nav) return;

  searchState.isOpen = true;
  nav.classList.add('search-mode');

  // Focus input + keyboard auto-open
  setTimeout(() => {
    if (input) {
      input.value = '';
      input.focus();
    }
  }, 100);
}

function closeNavSearch() {
  const nav = document.getElementById('topNav');
  const input = document.getElementById('navSearchInput');
  const clear = document.getElementById('navSearchClear');

  searchState.isOpen = false;
  searchState.query = '';
  searchState.results = { users: [], posts: [], tags: [] };

  if (nav) nav.classList.remove('search-mode');
  if (input) input.value = '';
  if (clear) clear.classList.remove('visible');

  // Close overlay
  hideSearchOverlay();

  // Blur input (close keyboard)
  if (input) input.blur();
}

/* ============================================================ */
/* 2. SEARCH ICON CLICK                                          */
/* ============================================================ */
function initSearchHandlers() {
  const searchIcon = document.getElementById('searchIcon');
  const backBtn = document.getElementById('navSearchBack');
  const input = document.getElementById('navSearchInput');
  const clearBtn = document.getElementById('navSearchClear');

  if (searchIcon) {
    searchIcon.addEventListener('click', openNavSearch);
  }

  if (backBtn) {
    backBtn.addEventListener('click', closeNavSearch);
  }

  if (input) {
    input.addEventListener('input', handleSearchInput);
    input.addEventListener('focus', () => {
      if (searchState.query.length >= 1) {
        showSearchOverlay();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
      }
      searchState.query = '';
      clearBtn.classList.remove('visible');
      hideSearchOverlay();
    });
  }

  // ESC key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchState.isOpen) {
      closeNavSearch();
    }
  });
}

/* ============================================================ */
/* 3. INPUT HANDLER                                              */
/* ============================================================ */
function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  searchState.query = query;

  const clearBtn = document.getElementById('navSearchClear');

  if (query.length > 0) {
    if (clearBtn) clearBtn.classList.add('visible');
  } else {
    if (clearBtn) clearBtn.classList.remove('visible');
    hideSearchOverlay();
    return;
  }

  if (query.length >= 1) {
    performSearch(query);
    showSearchOverlay();
  }
}

/* ============================================================ */
/* 4. SEARCH LOGIC                                               */
/* ============================================================ */
function performSearch(query) {
  if (!query || query.length < 1) {
    searchState.results = { users: [], posts: [], tags: [] };
    return;
  }

  const results = {
    users: searchUsers(query).slice(0, 3),
    posts: searchPosts(query).slice(0, 4),
    tags: searchTags(query).slice(0, 4)
  };

  searchState.results = results;
}

function searchUsers(query) {
  const results = [];

  // Search from USERS data
  if (typeof USERS === 'object' && USERS) {
    Object.values(USERS).forEach(user => {
      if (user.name && user.name.toLowerCase().includes(query)) {
        results.push({
          type: 'user',
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: (user.roles && user.roles[0]) || 'petOwner',
          location: user.location || '',
          isSelf: false
        });
      }
    });
  }

  // Also search APP.user (self)
  if (APP.user && APP.user.name && APP.user.name.toLowerCase().includes(query)) {
    results.unshift({
      type: 'user',
      id: 'user_self',
      name: APP.user.name,
      avatar: APP.user.avatar,
      role: APP.user.activeRole || 'petOwner',
      location: APP.user.location || '',
      isSelf: true
    });
  }

  return results;
}

function searchPosts(query) {
  if (!MEMORIES_DATA || !MEMORIES_DATA.length) return [];

  return MEMORIES_DATA.filter(post => {
    const titleMatch = (post.title || '').toLowerCase().includes(query);
    const contentMatch = (post.content || '').toLowerCase().includes(query);
    const authorMatch = (post.authorName || '').toLowerCase().includes(query);
    return titleMatch || contentMatch || authorMatch;
  }).map(post => ({
    type: 'post',
    id: post.id,
    title: post.title || (post.content || '').substring(0, 50),
    authorName: post.authorName,
    image: post.image,
    authorRole: post.authorRole || 'petOwner',
    date: post.date
  }));
}

function searchTags(query) {
  const tags = [
    { id: 'tip', label: 'Vet Tips', icon: 'fa-lightbulb' },
    { id: 'story', label: 'Stories', icon: 'fa-paw' },
    { id: 'awareness', label: 'Awareness', icon: 'fa-bullhorn' },
    { id: 'question', label: 'Questions', icon: 'fa-question' }
  ];

  return tags.filter(tag =>
    tag.label.toLowerCase().includes(query) ||
    tag.id.toLowerCase().includes(query)
  );
}

/* ============================================================ */
/* 5. OVERLAY SHOW / HIDE                                        */
/* ============================================================ */
function showSearchOverlay() {
  // Create overlay if not exists
  let backdrop = document.getElementById('searchBackdrop');
  let panel = document.getElementById('searchResultsPanel');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'searchBackdrop';
    backdrop.className = 'search-overlay-backdrop';
    backdrop.addEventListener('click', () => {
      hideSearchOverlay();
      // Blur input — do not close search mode
      const input = document.getElementById('navSearchInput');
      if (input) input.blur();
    });
    document.body.appendChild(backdrop);
  }

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'searchResultsPanel';
    panel.className = 'search-results-panel';
    document.body.appendChild(panel);
  }

  renderSearchResults();

  // Show
  requestAnimationFrame(() => {
    backdrop.classList.add('active');
    panel.classList.add('active');
  });
}

function hideSearchOverlay() {
  const backdrop = document.getElementById('searchBackdrop');
  const panel = document.getElementById('searchResultsPanel');
  if (backdrop) backdrop.classList.remove('active');
  if (panel) panel.classList.remove('active');
}

/* ============================================================ */
/* 6. RENDER RESULTS                                             */
/* ============================================================ */
function renderSearchResults() {
  const panel = document.getElementById('searchResultsPanel');
  if (!panel) return;

  const { users, posts, tags } = searchState.results;
  const hasResults = users.length || posts.length || tags.length;

  if (!hasResults) {
    panel.innerHTML = `
      <div class="search-empty">
        <i class="fas fa-search"></i>
        <p>No results for "${searchState.query}"</p>
      </div>
    `;
    return;
  }

  let html = '';

  // USERS SECTION
  if (users.length) {
    html += `
      <div class="search-section">
        <p class="search-section-label">
          <i class="fas fa-user"></i> People
        </p>
        ${users.map(u => renderSearchUser(u)).join('')}
      </div>
    `;
  }

  // POSTS SECTION
  if (posts.length) {
    html += `
      <div class="search-section">
        <p class="search-section-label">
          <i class="fas fa-camera-retro"></i> Posts
        </p>
        ${posts.map(p => renderSearchPost(p)).join('')}
      </div>
    `;
  }

  // TAGS SECTION
  if (tags.length) {
    html += `
      <div class="search-section">
        <p class="search-section-label">
          <i class="fas fa-hashtag"></i> Tags
        </p>
        <div class="search-hints-row">
          ${tags.map(t => `
            <button class="search-hint-item" onclick="handleSearchTagClick('${t.id}')">
              <i class="fas ${t.icon}"></i> ${t.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  panel.innerHTML = html;
}

function renderSearchUser(user) {
  const roleClass = user.role === 'vet' ? 'vet' :
                    user.role === 'storeOwner' ? 'storeOwner' : 'petOwner';

  const roleLabel = user.role === 'vet' ? 'Vet' :
                    user.role === 'storeOwner' ? 'Store' : 'Owner';

  const roleClassChip = user.role === 'vet' ? 'role-vet' :
                        user.role === 'storeOwner' ? 'role-store' : 'role-owner';

  const avatarHtml = user.avatar
    ? `<img src="${user.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${user.name.charAt(0).toUpperCase()}'">`
    : user.name.charAt(0).toUpperCase();

  return `
    <button class="search-result-item" onclick="handleSearchUserClick('${user.id}', ${user.isSelf})">
      <div class="search-result-avatar ${roleClass}">
        ${avatarHtml}
      </div>
      <div class="search-result-info">
        <p class="search-result-title">${user.name}</p>
        <p class="search-result-sub">${user.location || 'PetCare member'}</p>
      </div>
      <span class="search-result-role ${roleClassChip}">${roleLabel}</span>
    </button>
  `;
}

function renderSearchPost(post) {
  const thumbHtml = post.image
    ? `<img src="${post.image}" alt="" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-quote-left\\'></i>'">`
    : `<i class="fas fa-quote-left"></i>`;

  return `
    <button class="search-result-item" onclick="handleSearchPostClick('${post.id}')">
      <div class="search-result-thumb">
        ${thumbHtml}
      </div>
      <div class="search-result-info">
        <p class="search-result-title">${escapeHtml(post.title)}</p>
        <p class="search-result-sub">by ${post.authorName}</p>
      </div>
    </button>
  `;
}

/* ============================================================ */
/* 7. RESULT CLICK HANDLERS                                      */
/* ============================================================ */
function handleSearchUserClick(userId, isSelf) {
  hideSearchOverlay();

  if (isSelf || userId === 'user_self') {
    // Nijer profile → Profile tab
    closeNavSearch();
    setTimeout(() => {
      showPage('profile');
    }, 200);
    return;
  }

  // Onno user → public profile
  closeNavSearch();
  setTimeout(() => {
    if (typeof openUserProfile === 'function') {
      openUserProfile(userId);
    }
  }, 200);
}

function handleSearchPostClick(postId) {
  hideSearchOverlay();
  closeNavSearch();

  setTimeout(() => {
    // Memory page e jao, scroll koro post e
    showPage('memory');

    setTimeout(() => {
      const postEl = document.querySelector(`[data-post-id="${postId}"]`);
      if (postEl) {
        postEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        postEl.style.transition = 'box-shadow 0.4s ease';
        postEl.style.boxShadow = '0 0 0 3px var(--pc-primary)';
        setTimeout(() => {
          postEl.style.boxShadow = '';
        }, 1500);
      } else {
        // Fallback — open detail modal
        if (typeof openPostDetail === 'function') {
          openPostDetail(postId);
        }
      }
    }, 400);
  }, 200);
}

function handleSearchTagClick(tagId) {
  hideSearchOverlay();
  closeNavSearch();

  setTimeout(() => {
    showPage('memory');

    setTimeout(() => {
      // Set filter chip
      if (typeof memoryState === 'object' && memoryState) {
        memoryState.activeFilter = tagId;

        // Update chips
        document.querySelectorAll('.mem-filter-chip').forEach(chip => {
          chip.classList.toggle('active', chip.dataset.memFilter === tagId);
        });

        // Re-render feed
        const feed = document.getElementById('memoryFeed');
        if (feed && typeof renderMemoryFeed === 'function') {
          feed.innerHTML = renderMemoryFeed();
          if (typeof attachMemoryFeedHandlers === 'function') {
            attachMemoryFeedHandlers();
          }
        }
      }
    }, 200);
  }, 200);
}

/* ============================================================ */
/* 8. INIT                                                       */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Slight delay to ensure DOM ready
  setTimeout(() => {
    initSearchHandlers();
  }, 100);
});

/* ============================================================ */
/* 9. EXPORT                                                     */
/* ============================================================ */
window.openNavSearch = openNavSearch;
window.closeNavSearch = closeNavSearch;
window.handleSearchUserClick = handleSearchUserClick;
window.handleSearchPostClick = handleSearchPostClick;
window.handleSearchTagClick = handleSearchTagClick;

console.log('PetCare Search loaded');