(function () {
  const PAGES = [
    { name: '首頁',  href: 'home.html',    match: ['home.html', 'index.html', ''] },
    { name: '關於我', href: 'about.html',   match: ['about.html'] },
    { name: '技能樹', href: 'Skill.html',   match: ['skill.html'] },
    { name: '經歷',  toast: true },
    { name: '論壇',  href: 'article.html', match: ['article.html'] },
    { name: '友站',  href: 'friend.html',  match: ['friend.html'] },
  ];

  const FAVICON_NORMAL = 'images/1276100847951941776.png';
  const FAVICON_HIDDEN = 'images/4751354.webp';
  const TITLE_HIDDEN = '為什麼跑了';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function currentFile() {
    return (location.pathname.split('/').pop() || '').toLowerCase();
  }

  function renderNavbar() {
    const mount = document.getElementById('navbar-mount');
    if (!mount) return;
    const cur = currentFile();
    const items = PAGES.map(p => {
      if (p.toast) {
        return `<button type="button" data-toast>${escapeHtml(p.name)}</button>`;
      }
      const active = p.match && p.match.includes(cur) ? ' class="active"' : '';
      return `<a href="${p.href}"${active}>${escapeHtml(p.name)}</a>`;
    }).join('');

    mount.outerHTML = `
      <div class="navbar">
        <div class="nav-content">
          <div class="nav-left"></div>
          <button class="hamburger" id="hamburger" type="button" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu">&#9776;</button>
          <nav class="nav-right" id="nav-menu" aria-label="主要選單">
            ${items}
          </nav>
        </div>
      </div>`;
  }

  function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    function setOpen(open) {
      navMenu.classList.toggle('show', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.dispatchEvent(new CustomEvent('navmenu:toggle', { detail: { open } }));
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!navMenu.classList.contains('show'));
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('show')) return;
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('show')) setOpen(false);
    });
  }

  function setupToast() {
    let timer;
    window.showToast = function () {
      const toast = document.getElementById('toast');
      if (!toast) return;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 3000);
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-toast]');
      if (t) window.showToast();
    });
  }

  function setupFaviconSwitcher() {
    const link = document.getElementById('dynamic-favicon');
    if (!link) return;

    let lastVisibleTitle = document.title;
    let suppressObserver = false;

    const titleEl = document.querySelector('title');
    if (titleEl) {
      new MutationObserver(() => {
        if (suppressObserver) return;
        if (document.visibilityState === 'visible') {
          lastVisibleTitle = document.title;
        }
      }).observe(titleEl, { childList: true });
    }

    function setFavicon(url) {
      link.setAttribute('href', url + '#v=' + Date.now());
    }
    function setTitle(t) {
      suppressObserver = true;
      document.title = t;
      suppressObserver = false;
    }
    function onChange() {
      if (document.visibilityState === 'visible') {
        setTitle(lastVisibleTitle);
        setFavicon(FAVICON_NORMAL);
      } else {
        setTitle(TITLE_HIDDEN);
        setFavicon(FAVICON_HIDDEN);
      }
    }
    document.addEventListener('visibilitychange', onChange);
  }

  function init() {
    renderNavbar();
    setupHamburger();
    setupToast();
    setupFaviconSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
