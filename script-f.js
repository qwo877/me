document.addEventListener('DOMContentLoaded', () => {
  const friendSites = [
    { name: '小一',         url: 'https://www.instagram.com/littleonechung/', img: 'images/vul3.png',           desc: '一個喜歡開發遊戲的人類', socials: [{ type: 'ig',  url: 'https://www.instagram.com/littleonechung/' }] },
    { name: 'su2u4',        url: 'https://github.com/su2u4-1/',                img: 'images/su.jpg',             desc: '電神好電 都不說話',     socials: [{ type: 'git', url: 'https://github.com/su2u4-1/' }] },
    { name: '橘子喵',       url: 'https://xn--gew.tw/',                        img: 'images/rm6.png',            desc: '喵',                     socials: [{ type: 'web', url: 'https://xn--gew.tw/' }] },
    { name: 'Icrack',       url: 'https://lbc0841.github.io/icrack41-blog/',   img: 'images/D.png',              desc: '別再TLE了，我裂開',      socials: [{ type: 'web', url: 'https://lbc0841.github.io/icrack41-blog/' }] },
    { name: '伊藤有栖',     url: 'https://siewilly.github.io/',                img: 'images/iw6.png',            desc: '競程邊角料',             socials: [{ type: 'web', url: 'https://siewilly.github.io/' }] },
    { name: 'PepperSauce',  url: 'https://peppersauce0712.github.io/',         img: 'images/PepperSauce_icon.jpg', desc: '好想成為資安佬...',    socials: [{ type: 'web', url: 'https://peppersauce0712.github.io/' }] },
    { name: 'small Z',      url: 'https://github.com/yuzen9622',               img: 'images/zr.webp',           desc: '這裡全是電神',           socials: [{ type: 'web', url: 'https://www.yuzen.dev' }, { type: 'ig', url: 'https://www.instagram.com/zn._.622' }] },
    { name: 'Justin',       url: 'https://justin0711.com/',                    img: 'images/ju.png',             desc: '電神好電 都不說話',     socials: [{ type: 'web', url: 'https://justin0711.com/' }] },
    { name: '南宮柳信',     url: 'https://www.nangong5421.com/',               img: 'images/s06.jpg',            desc: '電神好電 都不說話',     socials: [{ type: 'web', url: 'https://www.nangong5421.com/' }] },
    { name: '伊藤蒼太',     url: 'https://itousouta15.github.io/',             img: 'images/itou.png',           desc: '電神好電 都不說話',     socials: [{ type: 'web', url: 'https://itousouta15.github.io/' }] },
    { name: '鴨鴨',         url: 'https://ya-ya-12.github.io/',                img: 'images/u8.png',             desc: '我是一個小廢廢',         socials: [{ type: 'web', url: 'https://ya-ya-12.github.io/' }] },
    { name: '伊藤喵貓',     url: 'https://github.com/twcat0503',               img: 'images/aul.gif',            desc: '電神好電 都不說話',     socials: [{ type: 'web', url: 'https://twcat0503.org/' }, { type: 'git', url: 'https://github.com/twcat0503' }] },
    { name: 'SSD',          url: 'https://linktr.ee/ssd0',                     img: 'images/ssdcom.webp',        desc: '叫置頂的去練電子學',     socials: [{ type: 'web', url: 'https://linktr.ee/ssd0' }, { type: 'web', url: 'https://konect.gg/ssdlag' }, { type: 'ig', url: 'https://www.instagram.com/weird._.ssd/#' }] },
    { name: 'Frank',        url: 'https://frankk.uk/',                         img: 'images/frk.tw.png',         desc: '電神好電 都不說話',     socials: [{ type: 'web', url: 'https://frankk.uk/' }] },
    { name: 'LDN',          url: 'https://ldn970110.github.io/',               img: 'images/LDN.jpeg',           desc: '才不是蘿莉控',           socials: [{ type: 'web', url: 'https://ldn970110.github.io/' }] },
    { name: 'Raymond Weng', url: 'https://raymondweng.dev/',                   img: 'images/ray.png',            desc: '什麼都沾一點的怪人',     socials: [{ type: 'web', url: 'https://raymondweng.dev/' }] },
    { name: '郭10',         url: 'https://www.yilin0121.com/',                 img: 'images/avatar.webp',        desc: '觀念考不到5級的115特選生', socials: [{ type: 'web', url: 'https://yilinguo121.github.io/' }] },
    { name: 'YD',           url: 'https://www.kuang-ti.com',                   img: 'https://www.kuang-ti.com/logo.png', desc: '一名創新者、網頁工程師，想構建讓社會更好的系統', socials: [{ type: 'git', url: 'https://github.com/yd-tw' }] },
    { name: 'yimang',       url: 'https://yimang.tw',                          img: 'https://yimang.tw/images/avatar.webp', desc: '一個高中生)',     socials: [{ type: 'web', url: 'https://yimang.tw' }] },
    { name: 'Robin',        url: 'https://robin-tw.me',                        img: 'https://robin-tw.me/avatar.jpg', desc: '花束を',                socials: [{ type: 'git', url: 'https://github.com/cxk228922' }] },
    { name: '蜜蜂機器人',   url: 'https://www.facebook.com/share/1DmaG6SzYw/?mibextid=wwXIfr', img: 'images/bee_robot.jpg', desc: '電神好電 都不說話', socials: [{ type: 'ig', url: 'https://www.facebook.com/share/1DmaG6SzYw/?mibextid=wwXIfr' }] },
    { name: 's0323010',     url: 'https://devs0323010.github.io/',             img: 'https://avatars.githubusercontent.com/u/147250604?s=400', desc: '懂音樂的軟體工程師 | 個網爛爛的不想修', socials: [{ type: 'git', url: 'https://github.com/DevS0323010' }] },
    { name: 'Aaron',        url: 'https://ronkao.tw/',                         img: 'https://ronkao.tw/favicon.jpg', desc: '依舊沒有學校的我 嗚嗚嗚', socials: [{ type: 'git', url: 'https://github.com/ronkaotw' }] },
    { name: 'Brian Duan',   url: 'https://www.justaslime.dev/',                img: 'https://avatars.githubusercontent.com/u/56882049?v=4&size=400', desc: '一般路過史萊姆', socials: [{ type: 'git', url: 'https://github.com/iceice666' }, { type: 'git', url: 'https://code.justaslime.dev/explore/repos' }] },
    { name: '康康',         url: 'https://www.justaslime.dev/',                img: 'images/dd.webp',            desc: '一隻不會飛的章魚研究生', socials: [{ type: 'web', url: 'https://www.hhk.one/' }] },
    { name: 'Lyscnf23',     url: 'https://yeyue1004.github.io/',               img: 'https://raw.githubusercontent.com/YeYue1004/images/main/avatar.jpg', desc: ' 努力學習中…', socials: [{ type: 'web', url: 'https://yeyue1004.github.io/' }] },
    { name: 'Flashingtw',     url: 'https://flashing.tw/about',img: 'https://flashing.tw/_astro/avatar.W72oLvvK_Z5G83v.avif', desc: '喜歡研究演算法 熱愛程式的普通高中生', socials: [{ type: 'github', url: 'https://github.com/Flashingtw' },{ type: 'ig', url: 'https://www.instagram.com/dacsc_flash.zcx/' }] },
    { name: 'shrimp2845',   url: 'https://shrimp2845-tw.github.io/',             img: 'https://shrimp2845-tw.github.io/images/avatar2.png', desc: 'ohhi?', socials: [{ type: 'github', url: 'https://github.com/shrimp2845-tw' }] },
    { name: '匿名的貓貓',   url: 'https://qwo877.github.io/me/XD',             img: 'images/image14841987481.png', desc: '上面的都是電神 電爆我qwo', socials: [{ type: 'web', url: 'https://qwo877.github.io/me/XD' }] }
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function computeBubbleConfig() {
    const w = window.innerWidth;
    if (w <= 480) return { TOTAL_BUBBLES: 12, BIG_RATIO: 0.05 };
    if (w <= 768) return { TOTAL_BUBBLES: 20, BIG_RATIO: 0.07 };
    if (w <= 992) return { TOTAL_BUBBLES: 30, BIG_RATIO: 0.09 };
    return { TOTAL_BUBBLES: 40, BIG_RATIO: 0.1 };
  }

  let cfg = computeBubbleConfig();
  window.addEventListener('resize', () => { cfg = computeBubbleConfig(); });

  const COLORS = ['#48DEDB', '#E3AA47', 'rgba(75, 192, 192, 0.6)'];

  const ICONS = {
    github: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
    git:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="5.5" r="2.2"/><circle cx="6" cy="18.5" r="2.2"/><circle cx="18" cy="8.5" r="2.2"/><path d="M6 7.7v8.6M18 10.7c0 4-6 3.2-11 6"/></svg>',
    ig:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>',
    fb:     '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21Z"/></svg>',
    web:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/></svg>'
  };
  const LABELS = { github: 'GitHub', git: 'Git', ig: 'Instagram', fb: 'Facebook', web: '網站' };

  function iconType(s) {
    const u = String(s.url).toLowerCase();
    if (u.includes('github.com')) return 'github';
    if (u.includes('instagram.com')) return 'ig';
    if (u.includes('facebook.com')) return 'fb';
    if (s.type === 'git' || s.type === 'github') return 'git';
    if (s.type === 'ig') return 'ig';
    return 'web';
  }

  const isMe = f => /qwo877\.github\.io/.test(f.url);

  //壞掉預設放貓
  const FALLBACK_IMG = 'images/1276100847951941776.png';
  function useFallback(e) {
    const img = e.target;
    if (img.tagName !== 'IMG' || img.dataset.fallback) return;
    img.dataset.fallback = '1';
    img.src = FALLBACK_IMG;
  }

  const grid = document.querySelector('.friends-grid');
  const cards = [];
  if (grid) grid.addEventListener('error', useFallback, true);

  function renderFriendCards() {
    if (!grid) return;
    const frag = document.createDocumentFragment();

    friendSites.forEach((friend, i) => {
      const card = document.createElement('article');
      card.className = 'friend-card spot reveal';
      card.setAttribute('role', 'listitem');

      const socialLinks = friend.socials.map(s => {
        const type = iconType(s);
        return `<a class="${type}" href="${encodeURI(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(friend.name)} 的 ${LABELS[type]}" title="${LABELS[type]}">${ICONS[type]}</a>`;
      }).join('');

      const badge = isMe(friend) ? '<span class="me-badge">是我</span>' : '';

      card.innerHTML = `
        <a class="friend-main" href="${encodeURI(friend.url)}" target="_blank" rel="noopener noreferrer">
          <span class="friend-avatar"><img src="${encodeURI(friend.img)}" alt="${escapeHtml(friend.name)} 的頭像" class="Picture-control" loading="lazy" decoding="async" width="100" height="100"></span>
          <h3 class="friend-name">${escapeHtml(friend.name)}${badge}</h3>
          <p class="friend-desc">${escapeHtml(friend.desc.trim())}</p>
        </a>
        <div class="social-links">${socialLinks}</div>
      `;
      cards[i] = card;
      frag.appendChild(card);
    });

    grid.replaceChildren(frag);

    const count = document.getElementById('friend-count');
    if (count) count.textContent = `共 ${friendSites.length} 位`;
  }

  renderFriendCards();

  const randomBtn = document.getElementById('random-friend');
  if (randomBtn) {
    const label = randomBtn.querySelector('.random-label');
    let rolling = false, resetTimer;

    randomBtn.addEventListener('click', () => {
      if (rolling || !friendSites.length) return;
      rolling = true;
      clearTimeout(resetTimer);
      randomBtn.classList.add('rolling');

      const pickIndex = Math.floor(Math.random() * friendSites.length);
      const STEPS = 16;
      let step = 0;

      (function roll() {
        step++;
        const i = step < STEPS ? Math.floor(Math.random() * friendSites.length) : pickIndex;
        label.textContent = friendSites[i].name;
        if (step < STEPS) {
          setTimeout(roll, 35 + step * 10);
          return;
        }
        rolling = false;
        randomBtn.classList.remove('rolling');

        const card = cards[pickIndex];
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.remove('picked');
          void card.offsetWidth;
          card.classList.add('picked');
          card.addEventListener('animationend', () => card.classList.remove('picked'), { once: true });
        }
        if (window.showToast) {
          window.showToast(`抽到了：${friendSites[pickIndex].name}！點卡片去逛逛`, { duration: 3200 });
        }
        resetTimer = setTimeout(() => { label.textContent = '抽一位電神'; }, 3200);
      })();
    });
  }

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const avatarBtn = document.getElementById('avatarBtn');
  const bubbleLayer = document.getElementById('bubbleLayer');
  if (!avatarBtn || !bubbleLayer) return;
  bubbleLayer.addEventListener('error', useFallback, true);

  function activate() {
    avatarBtn.classList.remove('jump');
    void avatarBtn.offsetWidth;
    avatarBtn.classList.add('jump');
    removeAllBubbles(true);
    setTimeout(spawnBubbles, 160);
  }

  avatarBtn.addEventListener('click', activate);
  avatarBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
  });

  function removeAllBubbles(force = false) {
    const all = bubbleLayer.querySelectorAll('.bubble');
    if (all.length === 0) return;
    all.forEach(b => {
      if (force) {
        b.remove();
      } else {
        b.classList.add('fade-out');
        setTimeout(() => { b.remove(); maybeClearLayerPointer(); }, 240);
      }
    });
  }

  function getValidScatterX(startX, startY, isBig, existing) {
    let scatterX, finalX, tries = 0, overlap;
    do {
      scatterX = (Math.random() - 0.5) * 1200;
      finalX = startX + scatterX;
      tries++;
      overlap = existing.some(p => {
        const dx = finalX - p.x;
        const dy = startY - p.y;
        return Math.sqrt(dx * dx + dy * dy) < 100;
      });
    } while (isBig && overlap && tries < 30);
    return scatterX;
  }

  function spawnBubbles() {
    const layerRect = bubbleLayer.getBoundingClientRect();
    const btnRect = avatarBtn.getBoundingClientRect();
    const sites = shuffle(friendSites);
    const bigPositions = [];

    bubbleLayer.style.pointerEvents = 'auto';

    for (let i = 0; i < cfg.TOTAL_BUBBLES; i++) {
      const isBig = Math.random() < cfg.BIG_RATIO && sites.length > 0;
      const bubble = document.createElement('div');
      bubble.classList.add('bubble', isBig ? 'big' : 'small');

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      bubble.style.background = color;
      bubble.style.borderColor = color;

      bubbleLayer.appendChild(bubble);
      const half = bubble.offsetWidth / 2;

      const startX = btnRect.left - layerRect.left + btnRect.width / 2;
      const startY = btnRect.top - layerRect.top - (isBig ? half : -10);
      bubble.style.left = (startX - half) + 'px';
      bubble.style.top = startY + 'px';

      const scatterX = getValidScatterX(startX, startY, isBig, bigPositions);
      const duration = isBig ? (8000 + Math.random() * 9000) : (1000 + Math.random() * 9000);

      if (isBig && sites.length > 0) {
        const site = sites.shift();
        const a = document.createElement('a');
        a.href = site.url.trim();
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.tabIndex = -1;   
        a.setAttribute('aria-label', '前往 ' + site.name);
        const imgSrc = site.img && site.img.length > 0 ? site.img : 'images/1276100847951941776.png';
        a.innerHTML = `
          <img src="${encodeURI(imgSrc)}" alt="${escapeHtml(site.name)} 頭像" loading="lazy" decoding="async" style="width:86%;height:86%;border-radius:50%;object-fit:cover;">
          <div class="name" style="font-size:12px;margin-top:4px">${escapeHtml(site.name)}</div>`;
        bubble.appendChild(a);

        bubble.addEventListener('click', (e) => {
          if (!e.target.closest('a')) {
            window.open(site.url, '_blank', 'noopener,noreferrer');
          }
        });

        bigPositions.push({ x: startX + scatterX, y: startY });
      }

      animateUpAndRemoveWithWave(bubble, startX, startY, scatterX, duration, half);
    }
  }

  function animateUpAndRemoveWithWave(el, startX, startY, scatterX, duration, half) {
    const startTime = performance.now();
    const amplitude = 12 + Math.random() * 12;
    const frequency = 0.0007 + Math.random() * 0.0007;

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const y = startY - progress * (startY + 20);
      const x = startX + scatterX * progress + Math.sin(elapsed * frequency) * amplitude;

      el.style.top = y + 'px';
      el.style.left = (x - half) + 'px';
      el.style.opacity = 1 - progress;

      if (progress < 1 && el.isConnected) {
        requestAnimationFrame(animate);
      } else {
        el.remove();
        maybeClearLayerPointer();
      }
    }
    requestAnimationFrame(animate);
  }

  function maybeClearLayerPointer() {
    if (!bubbleLayer.hasChildNodes()) {
      bubbleLayer.style.pointerEvents = 'none';
    }
  }
});
