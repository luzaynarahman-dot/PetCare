/* ============================================================ */
/* PETCARE v3.0 — MEMORY (SOCIAL FEED)                           */
/* FB/IG-style logic: avatar sudhu authorId theke lookup          */
/* Feed · Composer · Likes · Comments · Replies · Bottom Sheet   */
/* ============================================================ */

let memoryState = {
  activeFilter: 'all',
  activeCommentPostId: null,
  postPhotoData: null,
  commentReplyToId: null
};

/* ============================================================ */
/* SAVED POSTS HELPERS                                           */
/* ============================================================ */
function isSavedPost(postId) {
  const saved = Storage.get('pc_saved_posts', []);
  return Array.isArray(saved) && saved.includes(postId);
}

function toggleSavePost(postId) {
  let saved = Storage.get('pc_saved_posts', []);
  if (!Array.isArray(saved)) saved = [];

  if (saved.includes(postId)) {
    saved = saved.filter(id => id !== postId);
    showToast('Removed from saved');
  } else {
    saved.push(postId);
    showToast('Saved to bookmarks');
  }

  Storage.set('pc_saved_posts', saved);
  return saved.includes(postId);
}

/* ============================================================ */
/* 1. AVATAR HELPERS — FB/IG REAL LOGIC                          */
/* Rule: Avatar kokhono post/comment object e save hoy na.       */
/*       Sob jaygay sudhu authorId theke live lookup.            */
/* ============================================================ */

/**
 * Get user avatar by authorId
 * @param {string} authorId
 * @returns {string|null} image URL or null
 */
function getUserAvatar(authorId) {
  if (!authorId) return null;

  // Self — always from APP.user
  if (authorId === 'user_self') {
    return APP.user?.avatar || null;
  }

  // Other user — from USERS object
  const u = typeof getUserById === 'function' ? getUserById(authorId) : null;
  return u?.avatar || null;
}

/**
 * Get user initial letter by authorId
 * @param {string} authorId
 * @param {string} fallbackName
 * @returns {string} single character
 */
function getUserInitial(authorId, fallbackName) {
  // Self — check APP.user first
  if (authorId === 'user_self') {
    const name = APP.user?.name || fallbackName || 'You';
    if (!name || name.length === 0) return '?';
    return name.charAt(0).toUpperCase();
  }

  // Other user
  const u = typeof getUserById === 'function' ? getUserById(authorId) : null;
  const name = u?.name || fallbackName || 'U';
  if (!name || name.length === 0) return '?';
  return name.charAt(0).toUpperCase();
}

/**
 * Get user name by authorId
 */
function getUserName(authorId, fallbackName) {
  if (authorId === 'user_self') {
    return APP.user?.name || fallbackName || 'You';
  }

  const u = typeof getUserById === 'function' ? getUserById(authorId) : null;
  return u?.name || fallbackName || 'User';
}

/**
 * Render avatar HTML — image or initial
 * @param {string} authorId
 * @param {string} fallbackName
 * @param {string} roleClass 'vet' | 'storeOwner' | 'petOwner'
 * @returns {string} HTML
 */
function renderAvatarInner(authorId, fallbackName, roleClass) {
  const avatar = getUserAvatar(authorId);
  const initial = getUserInitial(authorId, fallbackName);

  if (avatar) {
    return `<img src="${avatar}" alt="" style="width:100%;height:100%;min-width:100%;max-width:100%;min-height:100%;max-height:100%;object-fit:cover;object-position:center;border-radius:50%;display:block;padding:0;margin:0;" onerror="this.style.display='none';this.parentElement.textContent='${initial}';">`;
  }

  return initial;
}

/**
 * Get role class for avatar background
 */
function getAvatarRoleClass(role) {
  if (role === 'vet') return 'vet';
  if (role === 'storeOwner') return 'storeOwner';
  return 'petOwner';
}

/* ============================================================ */
/* 2. MAIN RENDER                                                */
/* ============================================================ */
function renderMemory() {
  const page = document.getElementById('page-memory');
  if (!page) return;

  page.innerHTML = `
    <div class="page-container">

      <section class="memories-banner">
        <div class="memories-banner-text">
          <p class="memories-banner-title">Little moments</p>
          <p class="memories-banner-sub">make the biggest memories</p>
        </div>
        <div class="memories-banner-illust">
          <img src="assets/illustrations/hero-dog-cat.png" alt="" onerror="this.style.opacity='0'">
        </div>
      </section>

      <button class="memory-composer" id="openPostComposer">
        ${renderComposerAvatar()}
        <span class="memory-composer-text">Share a memory, ask a question, or post a tip...</span>
        <i class="fas fa-camera memory-composer-icon"></i>
      </button>

      <div class="memory-filters" id="memoryFilters">
        <button class="mem-filter-chip ${memoryState.activeFilter === 'all' ? 'active' : ''}" data-mem-filter="all">
          <i class="fas fa-globe"></i> All
        </button>
        <button class="mem-filter-chip ${memoryState.activeFilter === 'tip' ? 'active' : ''}" data-mem-filter="tip">
          <i class="fas fa-lightbulb"></i> Vet Tips
        </button>
        <button class="mem-filter-chip ${memoryState.activeFilter === 'story' ? 'active' : ''}" data-mem-filter="story">
          <i class="fas fa-paw"></i> Stories
        </button>
        <button class="mem-filter-chip ${memoryState.activeFilter === 'awareness' ? 'active' : ''}" data-mem-filter="awareness">
          <i class="fas fa-bullhorn"></i> Awareness
        </button>
        <button class="mem-filter-chip ${memoryState.activeFilter === 'question' ? 'active' : ''}" data-mem-filter="question">
          <i class="fas fa-question"></i> Questions
        </button>
      </div>

      <div class="memory-feed" id="memoryFeed">
        ${renderMemoryFeed()}
      </div>

    </div>
  `;

  attachMemoryHandlers();
}

/* ============================================================ */
/* 3. COMPOSER AVATAR                                            */
/* ============================================================ */
function renderComposerAvatar() {
  const initial = getUserInitial('user_self');
  const avatar = getUserAvatar('user_self');

  if (avatar) {
    return `
      <div class="memory-composer-avatar" style="width:38px;height:38px;min-width:38px;max-width:38px;min-height:38px;max-height:38px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;margin:0;box-sizing:border-box;background:linear-gradient(135deg,#FFD966,#FF9B50);">
        <img src="${avatar}" alt="" style="width:38px;height:38px;min-width:38px;max-width:38px;min-height:38px;max-height:38px;object-fit:cover;object-position:center;border-radius:50%;display:block;padding:0;margin:0;" onerror="this.style.display='none';this.parentElement.textContent='${initial}';">
      </div>
    `;
  }

  return `
    <div class="memory-composer-avatar" style="width:38px;height:38px;min-width:38px;max-width:38px;min-height:38px;max-height:38px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;margin:0;box-sizing:border-box;background:linear-gradient(135deg,#FFD966,#FF9B50);color:#2F3A5F;font-size:15px;font-weight:800;">
      ${initial}
    </div>
  `;
}

/* ============================================================ */
/* 4. FEED RENDER                                                */
/* ============================================================ */
function renderMemoryFeed() {
  let posts = MEMORIES_DATA || [];

  if (memoryState.activeFilter !== 'all') {
    posts = posts.filter(p => p.type === memoryState.activeFilter);
  }

  posts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!posts.length) {
    return `
      <div class="memory-empty">
        <i class="fas fa-camera-retro"></i>
        <p>No posts yet. Share your first memory!</p>
      </div>
    `;
  }

  return posts.map(p => renderMemoryPost(p)).join('');
}

/* ============================================================ */
/* 5. POST CARD                                                  */
/* ============================================================ */
function renderMemoryPost(post) {
  const authorName = getUserName(post.authorId, post.authorName);
  const authorRole = post.authorRole || 'petOwner';
  const isVet = authorRole === 'vet';
  const isStoreOwner = authorRole === 'storeOwner';

  const user = APP.user || { name: 'You' };
  const likedBy = post.likedBy || [];
  const isLiked = likedBy.includes(user.name);
  const isSaved = isSavedPost(post.id);

  const timeAgoText = timeAgo(post.date);
  const contentHtml = renderPostContent(post.content);

  const productsHtml = post.products && post.products.length
    ? `
      <div class="memory-post-products">
        ${post.products.map(img => `
          <div class="memory-post-product-img">
            <img src="${img}" alt="" onerror="this.style.opacity='0'">
          </div>
        `).join('')}
      </div>
    `
    : '';

  const imageHtml = post.image
    ? `<div class="memory-post-image-wrap"><img src="${post.image}" alt="" onerror="this.style.opacity='0'"></div>`
    : '';

  // ⭐ FB/IG Logic: Avatar from authorId
  const avatarInner = renderAvatarInner(post.authorId, post.authorName, authorRole);
  const avatarRoleClass = getAvatarRoleClass(authorRole);

  const roleBadge = renderRoleBadge(authorRole);

  return `
    <article class="memory-post" data-post-id="${post.id}">
      <header class="memory-post-header">
        <div class="memory-post-author-avatar ${avatarRoleClass}" data-open-profile="${post.authorId || ''}" style="width:42px;height:42px;min-width:42px;max-width:42px;min-height:42px;max-height:42px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;margin:0;box-sizing:border-box;">
          ${avatarInner}
        </div>
        <div class="memory-post-author-info">
          <div class="memory-post-author-name" data-open-profile="${post.authorId || ''}">
            <span>${authorName}</span>
            ${isVet ? '<i class="fas fa-circle-check verified"></i>' : ''}
          </div>
          <div class="memory-post-author-meta">
            <span>${timeAgoText}</span>
            ${roleBadge}
          </div>
        </div>
        <button class="memory-post-menu" data-mem-menu="${post.id}" aria-label="Menu">
          <i class="fas fa-ellipsis"></i>
        </button>
      </header>

      <div class="memory-post-body">
        ${contentHtml}
      </div>

      ${imageHtml}
      ${productsHtml}

      <footer class="memory-post-actions">
        <button class="mem-action-btn ${isLiked ? 'liked' : ''}" data-mem-like="${post.id}">
          <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
          <span>${post.likes || 0}</span>
        </button>
        <button class="mem-action-btn" data-mem-comment="${post.id}">
          <i class="far fa-comment"></i>
          <span>${(post.comments || []).length}</span>
        </button>
        <button class="mem-action-btn" data-mem-share="${post.id}">
          <i class="far fa-share-square"></i>
          <span>Share</span>
        </button>
        <button class="mem-action-btn" data-mem-save="${post.id}">
          <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
        </button>
      </footer>
    </article>
  `;
}

/* ============================================================ */
/* 6. POST CONTENT — first line bold, rest normal                */
/* ============================================================ */
function renderPostContent(content) {
  if (!content) return '';

  // Split by newline
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Only 1 line — split by first sentence (period/exclamation/question)
  if (lines.length === 1) {
    const singleLine = lines[0];
    
    // Find first sentence end (. ! ?)
    const match = singleLine.match(/^(.+?[.!?])\s+(.*)$/);
    
    if (match) {
      const firstSentence = match[1].trim();
      const rest = match[2].trim();
      return `
        <p class="memory-post-title-text"><strong>${escapeHtml(firstSentence)}</strong></p>
        ${rest ? `<p class="memory-post-content">${escapeHtml(rest)}</p>` : ''}
      `;
    }
    
    // No sentence break — show whole thing as bold title
    return `<p class="memory-post-title-text"><strong>${escapeHtml(singleLine)}</strong></p>`;
  }

  // Multiple lines — first line bold, rest normal
  const firstLine = lines[0];
  const restLines = lines.slice(1).join('\n');

  return `
    <p class="memory-post-title-text"><strong>${escapeHtml(firstLine)}</strong></p>
    ${restLines ? `<p class="memory-post-content">${escapeHtml(restLines)}</p>` : ''}
  `;
}

/* ============================================================ */
/* 7. ROLE BADGE                                                 */
/* ============================================================ */
function renderRoleBadge(role) {
  if (role === 'vet') {
    return `<span class="mem-role-badge mem-role-vet"><i class="fas fa-user-md"></i> Vet</span>`;
  }
  if (role === 'storeOwner') {
    return `<span class="mem-role-badge mem-role-store"><i class="fas fa-store"></i> Store Owner</span>`;
  }
  return `<span class="mem-role-badge mem-role-user"><i class="fas fa-paw"></i> Pet Owner</span>`;
}

/* ============================================================ */
/* 8. EVENT HANDLERS                                             */
/* ============================================================ */
function attachMemoryHandlers() {
  const page = document.getElementById('page-memory');
  if (!page) return;

  const composer = document.getElementById('openPostComposer');
  if (composer) {
    composer.addEventListener('click', openMemoryComposer);
  }

  const filters = document.getElementById('memoryFilters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-mem-filter]');
      if (!chip) return;
      memoryState.activeFilter = chip.dataset.memFilter;

      page.querySelectorAll('.mem-filter-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.memFilter === memoryState.activeFilter);
      });

      const feed = document.getElementById('memoryFeed');
      if (feed) feed.innerHTML = renderMemoryFeed();

      attachMemoryFeedHandlers();
    });
  }

  attachMemoryFeedHandlers();
}

function attachMemoryFeedHandlers() {
  const feed = document.getElementById('memoryFeed');
  if (!feed) return;

  feed.querySelectorAll('[data-mem-like]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMemoryLike(btn.dataset.memLike);
    });
  });

  feed.querySelectorAll('[data-mem-comment]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCommentModal(btn.dataset.memComment);
    });
  });

  feed.querySelectorAll('[data-mem-share]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      shareMemory(btn.dataset.memShare);
    });
  });

  feed.querySelectorAll('[data-mem-save]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = btn.dataset.memSave;
      const isSaved = toggleSavePost(postId);
      const icon = btn.querySelector('i');
      if (icon) icon.className = isSaved ? 'fas fa-bookmark' : 'far fa-bookmark';
    });
  });

  feed.querySelectorAll('[data-mem-menu]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMemoryMenu(btn.dataset.memMenu);
    });
  });

  feed.querySelectorAll('[data-open-profile]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAuthorTap(el.dataset.openProfile);
    });
  });
}

/* ============================================================ */
/* 9. AUTHOR TAP                                                 */
/* ============================================================ */
function handleAuthorTap(userId) {
  if (!userId) return;

  if (userId === 'user_self') {
    showPage('profile');
    return;
  }

  if (typeof openUserProfile === 'function') {
    openUserProfile(userId);
  }
}

/* ============================================================ */
/* 10. LIKE                                                      */
/* ============================================================ */
function toggleMemoryLike(postId) {
  const post = MEMORIES_DATA.find(p => p.id === postId);
  if (!post) return;

  const user = APP.user || { name: 'You' };
  post.likedBy = post.likedBy || [];

  if (post.likedBy.includes(user.name)) {
    post.likedBy = post.likedBy.filter(n => n !== user.name);
    post.likes = Math.max(0, (post.likes || 0) - 1);
  } else {
    post.likedBy.push(user.name);
    post.likes = (post.likes || 0) + 1;
  }

  Storage.set('pc_memories', MEMORIES_DATA);

  const feed = document.getElementById('memoryFeed');
  if (feed) feed.innerHTML = renderMemoryFeed();
  attachMemoryFeedHandlers();
}

/* ============================================================ */
/* 11. SHARE                                                     */
/* ============================================================ */
function shareMemory(postId) {
  const post = MEMORIES_DATA.find(p => p.id === postId);
  if (!post) return;

  if (navigator.share) {
    navigator.share({ title: post.title || 'PetCare Post', text: post.content }).catch(() => {});
  } else {
    showToast('Link copied to clipboard');
  }
}

/* ============================================================ */
/* 12. POST MENU                                                 */
/* ============================================================ */
function openMemoryMenu(postId) {
  const post = MEMORIES_DATA.find(p => p.id === postId);
  if (!post) return;

  const isOwn = post.authorId === 'user_self';

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-ellipsis"></i> Post Options
    </h2>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); shareMemory('${postId}');">
        <i class="fas fa-share"></i> Share Post
      </button>
      <button class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); toggleSavePost('${postId}');">
        <i class="fas fa-bookmark"></i> Save Post
      </button>
      ${isOwn ? `
        <button class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); deleteMemoryPost('${postId}');">
          <i class="fas fa-trash"></i> Delete Post
        </button>
      ` : ''}
    </div>
  `;

  openModal('quickViewModal');
}

function deleteMemoryPost(postId) {
  const post = MEMORIES_DATA.find(p => p.id === postId);
  if (!post) return;

  if (!confirm('Delete this post?')) return;

  const idx = MEMORIES_DATA.findIndex(p => p.id === postId);
  if (idx >= 0) MEMORIES_DATA.splice(idx, 1);

  Storage.set('pc_memories', MEMORIES_DATA);
  showToast('Post deleted');

  const feed = document.getElementById('memoryFeed');
  if (feed) feed.innerHTML = renderMemoryFeed();
  attachMemoryFeedHandlers();
}

/* ============================================================ */
/* 13. COMPOSER MODAL                                            */
/* ============================================================ */
function openMemoryComposer() {
  if (!isLoggedIn()) {
    showToast('Please sign in to post');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  memoryState.postPhotoData = null;

  const modal = document.getElementById('memoryPostModal');
  if (!modal) return;

  const activeRole = typeof getActiveRole === 'function' ? getActiveRole() : 'petOwner';
  const userName = getUserName('user_self');
  const userInitial = getUserInitial('user_self');
  const userAvatar = getUserAvatar('user_self');

  const roleLabel = typeof getRoleLabel === 'function' ? getRoleLabel(activeRole) : 'Pet Owner';
  const roleIcon = typeof getRoleIcon === 'function' ? getRoleIcon(activeRole) : 'fa-paw';

  const avatarHtml = userAvatar
    ? `<img src="${userAvatar}" alt="" style="width:40px;height:40px;min-width:40px;max-width:40px;min-height:40px;max-height:40px;object-fit:cover;object-position:center;border-radius:50%;display:block;padding:0;margin:0;" onerror="this.style.display='none';this.parentElement.textContent='${userInitial}';">`
    : userInitial;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('memoryPostModal')">
      <i class="fas fa-times"></i>
    </button>

    <h2 class="modal-title">
      <i class="fas fa-camera-retro"></i> Share a Memory
    </h2>

    <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--pc-paper);border-radius:14px;margin-bottom:16px;overflow:hidden;">
      <div style="width:40px;height:40px;min-width:40px;max-width:40px;min-height:40px;max-height:40px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;margin:0;box-sizing:border-box;background:linear-gradient(135deg,#FFD966,#FF9B50);color:#2F3A5F;font-weight:800;font-size:15px;">
        ${avatarHtml}
      </div>
      <div style="flex:1;min-width:0;">
        <p style="font-size:14px;font-weight:800;color:var(--pc-text);margin-bottom:2px;">${userName}</p>
        <p style="font-size:11.5px;color:var(--pc-text-muted);font-weight:700;display:flex;align-items:center;gap:5px;text-transform:uppercase;letter-spacing:0.3px;">
          <i class="fas ${roleIcon}" style="font-size:10px;color:var(--pc-accent);"></i> ${roleLabel}
        </p>
      </div>
    </div>

    <form id="memoryPostForm">
      <label>Photo (optional)</label>
      <div class="mem-photo-upload" id="memPhotoUpload">
        <i class="fas fa-camera"></i>
        <span>Tap to add photo</span>
      </div>
      <input type="file" id="memPhotoInput" accept="image/*" style="display:none;">

      <label>What's on your mind?</label>
      <textarea id="memPostContent" placeholder="Write your memory, tip, or question here..." rows="5" required></textarea>

      <button type="submit" class="btn btn-primary w-full">
        <i class="fas fa-paper-plane"></i> Publish
      </button>
    </form>
  `;

  document.getElementById('memPhotoUpload')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('memPhotoInput')?.click();
  });

  document.getElementById('memPhotoInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image too large (max 2MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      memoryState.postPhotoData = ev.target.result;
      const upload = document.getElementById('memPhotoUpload');
      if (upload) {
        upload.classList.add('attached');
        upload.innerHTML = '<i class="fas fa-check-circle"></i><span>Photo attached</span>';
      }
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('memoryPostForm')?.addEventListener('submit', handleMemoryPostSubmit);
  openModal('memoryPostModal');
}

/* ============================================================ */
/* 14. POST SUBMIT — NO authorAvatar save                        */
/* ============================================================ */
function handleMemoryPostSubmit(e) {
  e.preventDefault();

  const content = document.getElementById('memPostContent')?.value?.trim();
  if (!content) {
    showToast('Please write something');
    return;
  }

  const user = APP.user || { name: 'Guest User', email: '' };
  const activeRole = typeof getActiveRole === 'function' ? getActiveRole() : 'petOwner';

  let postType = 'story';
  if (activeRole === 'vet') postType = 'tip';
  if (activeRole === 'storeOwner') postType = 'awareness';

  const firstLine = content.split('\n')[0].trim();
  const title = firstLine.length > 60 ? firstLine.substring(0, 60) + '…' : firstLine;

  // ⭐ FB/IG: sudhu authorId save, avatar NA
  const newPost = {
    id: 'mem_' + Date.now(),
    authorId: 'user_self',
    authorName: user.name || 'Pet Owner',
    authorInitial: (user.name || 'U').charAt(0).toUpperCase(),
    authorRole: activeRole,
    type: postType,
    title: title,
    content: content,
    image: memoryState.postPhotoData || null,
    products: null,
    date: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    comments: []
  };

  MEMORIES_DATA.unshift(newPost);
  Storage.set('pc_memories', MEMORIES_DATA);

  closeModal('memoryPostModal');
  showToast('Posted as ' + (typeof getRoleLabel === 'function' ? getRoleLabel(activeRole) : 'Pet Owner'));

  if (typeof confetti === 'function') {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  }

  const feed = document.getElementById('memoryFeed');
  if (feed) feed.innerHTML = renderMemoryFeed();
  attachMemoryFeedHandlers();
}

/* ============================================================ */
/* 15. COMMENT MODAL                                             */
/* ============================================================ */
function openCommentModal(postId) {
  const post = MEMORIES_DATA.find(p => p.id === postId);
  if (!post) return;

  memoryState.activeCommentPostId = postId;
  memoryState.commentReplyToId = null;

  const modal = document.getElementById('commentModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('commentModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-comments"></i> Comments
    </h2>

    <div class="comment-list" id="commentList">
      ${renderCommentsList(post)}
    </div>

    <form class="comment-form" id="commentForm">
      <input type="text" id="commentInput" placeholder="Write a comment..." required>
      <button type="submit" aria-label="Send">
        <i class="fas fa-paper-plane"></i>
      </button>
    </form>
  `;

  attachCommentHandlers();
  openModal('commentModal');
}

/* ============================================================ */
/* 16. COMMENTS RENDER — FB/IG logic                             */
/* ============================================================ */
function renderCommentsList(post) {
  const comments = post.comments || [];

  if (!comments.length) {
    return `<p class="empty-state">No comments yet. Be the first!</p>`;
  }

  const user = APP.user || { name: 'You' };

  return comments.map(c => {
    const replies = c.replies || [];
    const authorRole = c.authorRole || 'petOwner';
    const isVet = authorRole === 'vet';
    const isLiked = (c.likedBy || []).includes(user.name);
    const isOwnComment = c.authorId === 'user_self';

    const avatarInner = renderAvatarInner(c.authorId, c.authorName, authorRole);
    const authorName = getUserName(c.authorId, c.authorName);

    // Comment meta line (time · like · reply)
    const commentMetaHtml = `
      <div class="comment-meta">
        <span class="comment-meta-time">${timeAgo(c.date)}</span>
        <button class="comment-meta-btn ${isLiked ? 'liked' : ''}" data-comment-like="${c.id}">
          <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
          ${(c.likedBy || []).length > 0 ? `<span>${(c.likedBy || []).length}</span>` : ''}
        </button>
        <button class="comment-meta-btn" data-comment-reply="${c.id}">
          Reply
        </button>
      </div>
    `;

    // Replies
    const repliesHtml = replies.length ? `
      <div class="comment-replies">
        ${replies.map(r => {
          const replyRole = r.authorRole || 'petOwner';
          const replyIsVet = replyRole === 'vet';
          const replyIsOwn = r.authorId === 'user_self';
          const replyIsLiked = (r.likedBy || []).includes(user.name);

          const replyAvatarInner = renderAvatarInner(r.authorId, r.authorName, replyRole);
          const replyAuthorName = getUserName(r.authorId, r.authorName);

          return `
            <div class="comment-item comment-reply-item" data-reply-id="${r.id}" data-parent-comment-id="${c.id}">
              <div class="comment-avatar ${replyIsVet ? 'vet' : 'user'}">
                ${replyAvatarInner}
              </div>
              <div class="comment-body">
                <div class="comment-author">
                  <span>${replyAuthorName}</span>
                  ${replyIsVet ? '<i class="fas fa-circle-check verified"></i>' : ''}
                </div>
                <p class="comment-text">${escapeHtml(r.text)}</p>
                <div class="comment-meta">
                  <span class="comment-meta-time">${timeAgo(r.date)}</span>
                  <button class="comment-meta-btn ${replyIsLiked ? 'liked' : ''}" data-reply-like="${r.id}" data-parent-id="${c.id}">
                    <i class="${replyIsLiked ? 'fas' : 'far'} fa-heart"></i>
                    ${(r.likedBy || []).length > 0 ? `<span>${(r.likedBy || []).length}</span>` : ''}
                  </button>
                  <button class="comment-meta-btn" data-comment-reply="${c.id}">
                    Reply
                  </button>
                </div>
              </div>
              ${replyIsOwn ? `
                <button class="comment-menu-btn" data-reply-menu="${r.id}" data-parent-id="${c.id}" aria-label="Menu">
                  <i class="fas fa-ellipsis-vertical"></i>
                </button>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    ` : '';

    return `
      <div class="comment-item comment-item-parent" data-comment-id="${c.id}">
        <div class="comment-avatar ${isVet ? 'vet' : 'user'}">
          ${avatarInner}
        </div>
        <div class="comment-body">
          <div class="comment-author">
            <span>${authorName}</span>
            ${isVet ? '<i class="fas fa-circle-check verified"></i>' : ''}
          </div>
          <p class="comment-text">${escapeHtml(c.text)}</p>
          ${commentMetaHtml}
          ${repliesHtml}
        </div>
        ${isOwnComment ? `
          <button class="comment-menu-btn" data-comment-menu="${c.id}" aria-label="Menu">
            <i class="fas fa-ellipsis-vertical"></i>
          </button>
        ` : ''}
      </div>
    `;
  }).join('');
}

/* ============================================================ */
/* 17. COMMENT HANDLERS                                          */
/* ============================================================ */
function attachCommentHandlers() {
  const modal = document.getElementById('commentModal');
  if (!modal) return;

  const form = document.getElementById('commentForm');
  if (form) {
    form.removeEventListener('submit', handleCommentSubmit);
    form.addEventListener('submit', handleCommentSubmit);
  }

  modal.querySelectorAll('[data-comment-like]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleCommentLike(btn.dataset.commentLike);
    });
  });

  modal.querySelectorAll('[data-comment-reply]').forEach(btn => {
  btn.addEventListener('click', () => {
    const commentId = btn.dataset.commentReply;
    const comment = findComment(commentId);
    if (!comment) return;

    memoryState.commentReplyToId = commentId;

    const input = document.getElementById('commentInput');
    if (input) {
      input.placeholder = `Reply to ${getUserName(comment.authorId, comment.authorName)}...`;
      input.focus();
    }

    // Show cancel reply button
    showReplyCancelBar(comment);
  });
});

  // Reply like
modal.querySelectorAll('[data-reply-like]').forEach(btn => {
  btn.addEventListener('click', () => {
    toggleReplyLike(btn.dataset.parentId, btn.dataset.replyLike);
  });
});

  // Comment menu
  modal.querySelectorAll('[data-comment-menu]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCommentMenu(btn.dataset.commentMenu);
    });
  });

  // Reply menu
  modal.querySelectorAll('[data-reply-menu]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openReplyMenu(btn.dataset.replyMenu, btn.dataset.parentId);
    });
  });

  // Long press on own comment
  modal.querySelectorAll('.comment-item[data-comment-id]').forEach(item => {
    const commentId = item.dataset.commentId;
    if (!commentId) return;

    const comment = findComment(commentId);
    if (!comment || comment.authorId !== 'user_self') return;

    let pressTimer = null;

    const startPress = () => {
      pressTimer = setTimeout(() => {
        openCommentMenu(commentId);
      }, 600);
    };

    const cancelPress = () => {
      if (pressTimer) clearTimeout(pressTimer);
    };

    item.addEventListener('touchstart', startPress, { passive: true });
    item.addEventListener('touchend', cancelPress);
    item.addEventListener('touchmove', cancelPress);
    item.addEventListener('touchcancel', cancelPress);
    item.addEventListener('mousedown', startPress);
    item.addEventListener('mouseup', cancelPress);
    item.addEventListener('mouseleave', cancelPress);
  });
}

/* ============================================================ */
/* 18. COMMENT ACTION SHEET (Bottom Sheet)                       */
/* ============================================================ */
function openCommentMenu(commentId) {
  const comment = findComment(commentId);
  if (!comment) return;

  showActionSheet({
    title: 'Comment Options',
    deleteLabel: 'Delete Comment',
    onDelete: `deleteComment('${commentId}')`
  });
}

function openReplyMenu(replyId, parentCommentId) {
  showActionSheet({
    title: 'Reply Options',
    deleteLabel: 'Delete Reply',
    onDelete: `deleteReply('${parentCommentId}', '${replyId}')`
  });
}

function showActionSheet({ title, deleteLabel, onDelete }) {
  const existing = document.getElementById('commentActionSheet');
  if (existing) existing.remove();

  const sheet = document.createElement('div');
  sheet.id = 'commentActionSheet';
  sheet.className = 'comment-action-sheet';

  sheet.innerHTML = `
    <div class="comment-action-backdrop" onclick="closeCommentMenu()"></div>
    <div class="comment-action-panel">
      <div class="comment-action-handle"></div>
      <p class="comment-action-title">${title}</p>
      <button class="comment-action-item comment-action-danger" onclick="closeCommentMenu(); ${onDelete};">
        <i class="fas fa-trash"></i>
        <span>${deleteLabel}</span>
      </button>
      <button class="comment-action-item comment-action-cancel" onclick="closeCommentMenu()">
        <span>Cancel</span>
      </button>
    </div>
  `;

  document.body.appendChild(sheet);

// Force reflow — transition trigger korar jonno
void sheet.offsetWidth;

// Ekhon active class add koro
sheet.classList.add('active');
}

function closeCommentMenu() {
  const sheet = document.getElementById('commentActionSheet');
  if (!sheet) return;

  sheet.classList.remove('active');
  setTimeout(() => {
    if (sheet.parentNode) sheet.remove();
  }, 300);
}

/* ============================================================ */
/* 19. DELETE COMMENT / REPLY                                    */
/* ============================================================ */
function deleteComment(commentId) {
  const post = MEMORIES_DATA.find(p => p.id === memoryState.activeCommentPostId);
  if (!post) return;

  post.comments = (post.comments || []).filter(c => c.id !== commentId);

  Storage.set('pc_memories', MEMORIES_DATA);
  showToast('Comment deleted');

  const list = document.getElementById('commentList');
  if (list) {
    list.innerHTML = renderCommentsList(post);
    attachCommentHandlers();
  }

  const feed = document.getElementById('memoryFeed');
  if (feed) feed.innerHTML = renderMemoryFeed();
  attachMemoryFeedHandlers();
}

function deleteReply(parentCommentId, replyId) {
  const post = MEMORIES_DATA.find(p => p.id === memoryState.activeCommentPostId);
  if (!post) return;

  const parent = (post.comments || []).find(c => c.id === parentCommentId);
  if (!parent) return;

  parent.replies = (parent.replies || []).filter(r => r.id !== replyId);

  Storage.set('pc_memories', MEMORIES_DATA);
  showToast('Reply deleted');

  const list = document.getElementById('commentList');
  if (list) {
    list.innerHTML = renderCommentsList(post);
    attachCommentHandlers();
  }

  const feed = document.getElementById('memoryFeed');
  if (feed) feed.innerHTML = renderMemoryFeed();
  attachMemoryFeedHandlers();
}

/* ============================================================ */
/* 20. COMMENT HELPERS                                           */
/* ============================================================ */
function findComment(commentId) {
  const post = MEMORIES_DATA.find(p => p.id === memoryState.activeCommentPostId);
  if (!post) return null;
  return (post.comments || []).find(c => c.id === commentId);
}

function toggleReplyLike(parentCommentId, replyId) {
  const post = MEMORIES_DATA.find(p => p.id === memoryState.activeCommentPostId);
  if (!post) return;

  const parent = (post.comments || []).find(c => c.id === parentCommentId);
  if (!parent) return;

  const reply = (parent.replies || []).find(r => r.id === replyId);
  if (!reply) return;

  const user = APP.user || { name: 'You' };
  reply.likedBy = reply.likedBy || [];

  if (reply.likedBy.includes(user.name)) {
    reply.likedBy = reply.likedBy.filter(n => n !== user.name);
  } else {
    reply.likedBy.push(user.name);
  }

  Storage.set('pc_memories', MEMORIES_DATA);

  const list = document.getElementById('commentList');
  if (list) {
    list.innerHTML = renderCommentsList(post);
    attachCommentHandlers();
  }
}


function toggleCommentLike(commentId) {
  const comment = findComment(commentId);
  if (!comment) return;

  const user = APP.user || { name: 'You' };
  comment.likedBy = comment.likedBy || [];

  if (comment.likedBy.includes(user.name)) {
    comment.likedBy = comment.likedBy.filter(n => n !== user.name);
  } else {
    comment.likedBy.push(user.name);
  }

  Storage.set('pc_memories', MEMORIES_DATA);

  const post = MEMORIES_DATA.find(p => p.id === memoryState.activeCommentPostId);
  const list = document.getElementById('commentList');
  if (list && post) {
    list.innerHTML = renderCommentsList(post);
    attachCommentHandlers();
  }
}

/* ============================================================ */
/* 21. COMMENT SUBMIT — NO authorAvatar save                     */
/* ============================================================ */
function handleCommentSubmit(e) {
  e.preventDefault();

  if (!isLoggedIn()) {
    showToast('Please sign in to comment');
    return;
  }

  const post = MEMORIES_DATA.find(p => p.id === memoryState.activeCommentPostId);
  if (!post) return;

  const input = document.getElementById('commentInput');
  const text = input?.value?.trim();
  if (!text) return;

  const user = APP.user || { name: 'Guest' };
  const activeRole = typeof getActiveRole === 'function' ? getActiveRole() : 'petOwner';

  if (memoryState.commentReplyToId) {
    // Reply
    const parent = findComment(memoryState.commentReplyToId);
    if (parent) {
      parent.replies = parent.replies || [];
      parent.replies.push({
        id: 'r_' + Date.now(),
        authorId: 'user_self',
        authorName: user.name || 'Guest',
        authorInitial: (user.name || 'U').charAt(0).toUpperCase(),
        authorRole: activeRole,
        text,
        date: new Date().toISOString()
        // ⭐ FB/IG: authorAvatar NEI
      });
    }
    memoryState.commentReplyToId = null;
input.placeholder = 'Write a comment...';
const bar = document.getElementById('replyCancelBar');
if (bar) bar.remove();
  } else {
    // Comment
    post.comments = post.comments || [];
    post.comments.push({
      id: 'c_' + Date.now(),
      authorId: 'user_self',
      authorName: user.name || 'Guest',
      authorInitial: (user.name || 'U').charAt(0).toUpperCase(),
      authorRole: activeRole,
      text,
      date: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: []
      // ⭐ FB/IG: authorAvatar NEI
    });
  }

  Storage.set('pc_memories', MEMORIES_DATA);

  input.value = '';

  const list = document.getElementById('commentList');
  if (list) {
    list.innerHTML = renderCommentsList(post);
    attachCommentHandlers();
  }

  showToast(memoryState.commentReplyToId ? 'Reply posted' : 'Comment posted');

  const feed = document.getElementById('memoryFeed');
  if (feed) feed.innerHTML = renderMemoryFeed();
  attachMemoryFeedHandlers();
}

/* ============================================================ */
/* REPLY CANCEL BAR                                              */
/* ============================================================ */
function showReplyCancelBar(comment) {
  // Remove existing
  const existing = document.getElementById('replyCancelBar');
  if (existing) existing.remove();

  const form = document.getElementById('commentForm');
  if (!form) return;

  const bar = document.createElement('div');
  bar.id = 'replyCancelBar';
  bar.className = 'reply-cancel-bar';
  bar.innerHTML = `
    <i class="fas fa-reply"></i>
    <span>Replying to <strong>${getUserName(comment.authorId, comment.authorName)}</strong></span>
    <button type="button" onclick="cancelReply()" aria-label="Cancel">
      <i class="fas fa-times"></i>
    </button>
  `;

  form.parentNode.insertBefore(bar, form);
}

function cancelReply() {
  memoryState.commentReplyToId = null;

  const bar = document.getElementById('replyCancelBar');
  if (bar) bar.remove();

  const input = document.getElementById('commentInput');
  if (input) {
    input.placeholder = 'Write a comment...';
    input.focus();
  }
}

window.cancelReply = cancelReply;

/* ============================================================ */
/* 22. EXPORT                                                    */
/* ============================================================ */
window.renderMemory = renderMemory;
window.openMemoryComposer = openMemoryComposer;
window.handleMemoryPostSubmit = handleMemoryPostSubmit;
window.openCommentModal = openCommentModal;
window.handleCommentSubmit = handleCommentSubmit;
window.toggleMemoryLike = toggleMemoryLike;
window.toggleCommentLike = toggleCommentLike;
window.toggleReplyLike = toggleReplyLike;
window.deleteMemoryPost = deleteMemoryPost;
window.deleteComment = deleteComment;
window.deleteReply = deleteReply;
window.shareMemory = shareMemory;
window.openCommentMenu = openCommentMenu;
window.openReplyMenu = openReplyMenu;
window.closeCommentMenu = closeCommentMenu;

console.log('PetCare Memory loaded');