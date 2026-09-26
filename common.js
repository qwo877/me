(function () {
  const PAGES = [
    { name: '首頁',  href: 'home.html',    path: '~',         match: ['home.html', 'index.html', ''] },
    { name: '關於我', href: 'about.html',   path: '~/about',   match: ['about.html'] },
    { name: '技能樹', href: 'Skill.html',   path: '~/skills',  match: ['skill.html'] },
    { name: '經歷',  toast: true,           path: '~/exp',     toastImg: 'images/855301079788027914.png' },
    { name: '論壇',  href: 'article.html', path: '~/forum',   match: ['article.html'] },
    { name: '友站',  href: 'friend.html',  path: '~/friends', match: ['friend.html'] },
  ];


  const EXTRA_PATHS = { 'experience.html': '~/exp' };

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

  function currentPath() {
    const cur = currentFile();
    const page = PAGES.find(p => p.match && p.match.includes(cur));
    let path = page ? page.path : (EXTRA_PATHS[cur] || '~');
    const id = new URLSearchParams(location.search).get('id');
    if (cur === 'article.html' && id) path += '/' + id;
    return path;
  }

  function renderNavbar() {
    const mount = document.getElementById('navbar-mount');
    if (!mount) return;
    const cur = currentFile();
    const items = PAGES.map(p => {
      const path = ` data-path="${escapeHtml(p.path)}"`;
      if (p.toast) {
        const img = p.toastImg ? ` data-toast-img="${escapeHtml(p.toastImg)}"` : '';
        return `<button type="button" data-toast${img}${path}>${escapeHtml(p.name)}</button>`;
      }
      const active = p.match && p.match.includes(cur) ? ' class="active" aria-current="page"' : '';
      return `<a href="${p.href}"${active}${path}>${escapeHtml(p.name)}</a>`;
    }).join('');

    mount.outerHTML = `
      <header class="navbar" id="navbar">
        <div class="nav-content">
          <a class="brand" href="home.html" aria-label="匿名用戶9487 — 回首頁">
            <img class="brand-logo" src="${FAVICON_NORMAL}" alt="" width="48" height="48" decoding="async">
            <span class="brand-prompt" aria-hidden="true"><span class="bp-host"><span class="bp-user">qwo877@me</span><span class="bp-sep">:</span></span><span class="bp-path">${escapeHtml(currentPath())}</span><span class="bp-sep bp-dollar">$</span><span class="bp-cmd" id="brand-cmd"></span><span class="bp-caret"></span></span>
          </a>
          <button class="hamburger" id="hamburger" type="button" aria-label="開啟選單" aria-expanded="false" aria-controls="nav-menu"><span></span><span></span><span></span></button>
          <nav class="nav-right" id="nav-menu" aria-label="主要選單">
            ${items}
            <span class="nav-indicator" aria-hidden="true"></span>
          </nav>
        </div>
      </header>`;
  }

  function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    function setOpen(open) {
      navMenu.classList.toggle('show', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
      document.dispatchEvent(new CustomEvent('navmenu:toggle', { detail: { open } }));
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!navMenu.classList.contains('show'));
    });

    
    navMenu.addEventListener('click', (e) => {
      if (e.target.closest('a, button') && navMenu.classList.contains('show')) setOpen(false);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('show')) return;
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('show')) {
        setOpen(false);
        hamburger.focus();
      }
    });
  }

  function setupIndicator() {
    const menu = document.getElementById('nav-menu');
    const ind = menu && menu.querySelector('.nav-indicator');
    if (!ind) return;

    const active = () => menu.querySelector('.active');

    function moveTo(el, instant) {
      if (!el) { ind.classList.remove('on'); return; }
      if (instant) ind.classList.add('no-anim');
      ind.style.width = el.offsetWidth + 'px';
      ind.style.height = el.offsetHeight + 'px';
      ind.style.transform = `translate(${el.offsetLeft}px, ${el.offsetTop}px)`;
      ind.classList.add('on');
      if (instant) {
        void ind.offsetWidth;
        ind.classList.remove('no-anim');
      }
    }

    menu.addEventListener('pointerover', (e) => {
      const t = e.target.closest('a, button');
      if (t) moveTo(t);
    });
    menu.addEventListener('pointerleave', () => moveTo(active()));
    menu.addEventListener('focusin', (e) => moveTo(e.target.closest('a, button')));
    menu.addEventListener('focusout', () => moveTo(active()));

    const place = () => moveTo(active(), true);
    place();
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  }

  function setupBrandTyping() {
    const cmd = document.getElementById('brand-cmd');
    const menu = document.getElementById('nav-menu');
    if (!cmd || !menu) return;

    let timer = null;
    let shown = '';

    function type(text) {
      if (text === shown) return;
      shown = text;
      clearInterval(timer);
      cmd.textContent = '';
      if (!text) return;
      let i = 0;
      timer = setInterval(() => {
        cmd.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(timer);
      }, 24);
    }

    const pathOf = (e) => {
      const t = e.target.closest('[data-path]');
      return t ? 'cd ' + t.dataset.path : '';
    };

    menu.addEventListener('pointerover', (e) => type(pathOf(e)));
    menu.addEventListener('pointerleave', () => type(''));
    menu.addEventListener('focusin', (e) => type(pathOf(e)));
    menu.addEventListener('focusout', () => type(''));
  }

  
  function setupNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // showToast()                 → 顯示頁面上寫好的預設文字（網頁維護中）
  // showToast('文字')            → 顯示自訂文字
  // showToast('文字', { icon: '✦', img: 'images/xx.png', duration: 4000 })
  function setupToast() {
    let timer;

    function getToast() {
      let toast = document.getElementById('toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
      }
      if (toast.dataset.default == null) toast.dataset.default = toast.textContent.trim();
      return toast;
    }

    window.showToast = function (message, opts) {
      opts = opts || {};
      const toast = getToast();
      toast.replaceChildren();

      if (opts.img) {
        const img = document.createElement('img');
        img.className = 'toast-img';
        img.src = opts.img;
        img.alt = '';
        toast.appendChild(img);
      } else if (opts.icon) {
        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = opts.icon;
        toast.appendChild(icon);
      }

      const text = document.createElement('span');
      text.textContent = message || toast.dataset.default || '';
      toast.appendChild(text);

      toast.classList.remove('show');
      void toast.offsetWidth;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), opts.duration || 3000);
    };

    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-toast]');
      if (t) window.showToast(t.dataset.toastMsg, { img: t.dataset.toastImg });
    });

    const preloaded = new Set();
    function preload(e) {
      const t = e.target.closest && e.target.closest('[data-toast-img]');
      if (!t || preloaded.has(t.dataset.toastImg)) return;
      preloaded.add(t.dataset.toastImg);
      new Image().src = t.dataset.toastImg;
    }
    document.addEventListener('pointerover', preload, { passive: true });
    document.addEventListener('focusin', preload);
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

  function quietViewTransitions() {
    const swallow = (e) => {
      const vt = e.viewTransition;
      if (!vt) return;
      ['ready', 'finished', 'updateCallbackDone'].forEach(k => vt[k] && vt[k].catch(() => {}));
    };
    window.addEventListener('pageswap', swallow);
    window.addEventListener('pagereveal', swallow);
  }
  quietViewTransitions();

  function init() {
    renderNavbar();
    setupHamburger();
    setupIndicator();
    setupBrandTyping();
    setupNavScroll();
    setupToast();
    setupFaviconSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
