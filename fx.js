/* fx.js — 全站視覺特效
 *
 *   1. 星空：會眨眼的星星 + 偶爾劃過的流星，點到流星可以許願
 *   2. 點擊漣漪
 *   3. 卡片聚光燈：class="spot" 的元素會有跟著滑鼠跑的光暈
 *   4. 回到頂端按鈕（按下去會像火箭一樣射出去）
 *   5. 戳頭像：加了 data-poke 的元素
 *   6. Konami code（↑↑↓↓←→←→BA）→ 流星雨
 *
 * 整頁關掉：<body data-fx="off">　只關星空：<body data-sky="off">
 * 在主控台呼叫 fx.shower() 也可以直接下流星雨
 */
(function () {
  'use strict';

  const RESPECT_REDUCED_MOTION = false;

  const body = document.body;
  if (!body || body.dataset.fx === 'off') return;

  const reduceMotion = RESPECT_REDUCED_MOTION &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const WISHES = [
    '願望已收到，處理時間：未知',
    '流星表示：你的願望已讀不回',
    '許願成功！（實不實現不在服務範圍內）',
    '快許一個不會被電的願望',
    '手速很快，但願望還在排隊',
    '願望 +1，目前實現進度 0%'
  ];

  const POKE_LINES = [
    '喵？', '不要戳了啦', '再戳要收費了', '嗚嗚嗚', '(´・ω・`)',
    '喵!', '戳屁戳', '槌你喔', '...', '你喵的', '(っ˘ω˘ς )'
  ];

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function toast(msg, opts) {
    if (window.showToast) window.showToast(msg, opts);
  }

  function store(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  /*  1. 星空  */
  const sky = (function setupSky() {
    if (body.dataset.sky === 'off') return null;

    const canvas = document.createElement('canvas');
    canvas.className = 'fx-sky';
    canvas.setAttribute('aria-hidden', 'true');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    body.prepend(canvas);

    const TAU = Math.PI * 2;
    const COLORS = { white: '255,255,255', cyan: '190,255,255', gold: '255,226,170' };

    let W = 0, H = 0;
    let stars = [], meteors = [], sparks = [];
    let raf = null, lastT = 0, lastDraw = 0;
    let nextMeteor = performance.now() + 2500 + Math.random() * 4000;
    let showerUntil = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
      if (reduceMotion) {
        ctx.clearRect(0, 0, W, H);
        drawStars(0);
      }
    }

    // 星星只撒在畫面上半部的天空，越接近山稜線越淡
    function makeStars() {
      const skyH = H * 0.46;
      const count = Math.round(Math.min(240, (W * skyH) / 4200));
      stars = [];
      for (let i = 0; i < count; i++) {
        const y = Math.pow(Math.random(), 1.3) * skyH;
        const roll = Math.random();
        const big = Math.random() < 0.08;
        stars.push({
          x: Math.random() * W,
          y,
          r: big ? 1.1 + Math.random() * 0.8 : 0.35 + Math.random() * 0.75,
          a: 0.3 + Math.random() * 0.5,
          amp: 0.25 + Math.random() * 0.5,
          spd: 0.5 + Math.random() * 1.6,
          ph: Math.random() * TAU,
          c: roll < 0.12 ? COLORS.gold : roll < 0.4 ? COLORS.cyan : COLORS.white,
          fade: 1 - Math.max(0, (y - skyH * 0.6) / (skyH * 0.4)),
          big
        });
      }
    }

    function drawStars(t) {
      for (const s of stars) {
        const tw = s.a + Math.sin(t * s.spd + s.ph) * s.amp * 0.5;
        const alpha = Math.max(0, Math.min(1, tw)) * s.fade;
        if (alpha < 0.02) continue;
        ctx.fillStyle = `rgba(${s.c},${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, TAU);
        ctx.fill();
        if (s.big) {
          const L = s.r * 4.5 * (0.6 + 0.4 * alpha);
          ctx.strokeStyle = `rgba(${s.c},${alpha * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - L, s.y); ctx.lineTo(s.x + L, s.y);
          ctx.moveTo(s.x, s.y - L); ctx.lineTo(s.x, s.y + L);
          ctx.stroke();
        }
      }
    }

    function spawnMeteor() {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const ang = (16 + Math.random() * 24) * Math.PI / 180;
      const spd = 700 + Math.random() * 600;
      meteors.push({
        x: dir > 0 ? Math.random() * W * 0.75 : W * 0.25 + Math.random() * W * 0.75,
        y: Math.random() * H * 0.3,
        vx: Math.cos(ang) * spd * dir,
        vy: Math.sin(ang) * spd,
        len: 90 + Math.random() * 150,
        life: 0,
        ttl: 0.6 + Math.random() * 0.8,
        tx: null,
        ty: null
      });
    }

    function drawMeteors(dt) {
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const p = m.life / m.ttl;
        if (p >= 1) { meteors.splice(i, 1); continue; }

        const alpha = p < 0.15 ? p / 0.15 : p > 0.65 ? (1 - p) / 0.35 : 1;
        const sp = Math.hypot(m.vx, m.vy);
        const L = m.len * Math.min(1, p / 0.3);
        m.tx = m.x - (m.vx / sp) * L;
        m.ty = m.y - (m.vy / sp) * L;

        const g = ctx.createLinearGradient(m.x, m.y, m.tx, m.ty);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.3, `rgba(157,255,255,${alpha * 0.5})`);
        g.addColorStop(1, 'rgba(157,255,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.tx, m.ty);
        ctx.stroke();

        const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 7);
        hg.addColorStop(0, `rgba(255,255,255,${alpha})`);
        hg.addColorStop(1, 'rgba(157,255,255,0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 7, 0, TAU);
        ctx.fill();
      }
    }

    function burst(x, y) {
      for (let i = 0; i < 24; i++) {
        const a = Math.random() * TAU;
        const s = 60 + Math.random() * 240;
        sparks.push({
          x, y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          ttl: 0.5 + Math.random() * 0.6,
          c: Math.random() < 0.5 ? COLORS.gold : COLORS.cyan
        });
      }
    }

    function drawSparks(dt) {
      const drag = Math.pow(0.05, dt);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.ttl) { sparks.splice(i, 1); continue; }
        s.vx *= drag;
        s.vy = s.vy * drag + 160 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const a = 1 - s.life / s.ttl;
        ctx.fillStyle = `rgba(${s.c},${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 0.4 + 1.6 * a, 0, TAU);
        ctx.fill();
      }
    }

    function frame(now) {
      raf = null;
      if (document.hidden) return;
      raf = requestAnimationFrame(frame);

      const busy = meteors.length || sparks.length;
      if (!busy && now - lastDraw < 33 && now < nextMeteor) return;
      lastDraw = now;

      const t = now / 1000;
      const dt = lastT ? Math.min(0.05, t - lastT) : 0.016;
      lastT = t;

      if (now >= nextMeteor) {
        spawnMeteor();
        nextMeteor = now + (now < showerUntil ? 90 + Math.random() * 160 : 5000 + Math.random() * 9000);
      }

      ctx.clearRect(0, 0, W, H);
      drawStars(t);
      if (meteors.length) drawMeteors(dt);
      if (sparks.length) drawSparks(dt);
    }

    function start() {
      if (reduceMotion || raf != null) return;
      lastT = 0;
      raf = requestAnimationFrame(frame);
    }

    function distToSegment(px, py, ax, ay, bx, by) {
      const dx = bx - ax, dy = by - ay;
      const len2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
      return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
    }

    document.addEventListener('pointerdown', (e) => {
      if (!meteors.length || e.button !== 0) return;
      if (e.target.closest && e.target.closest('a, button, input, select, textarea, label, summary, [role="button"]')) return;
      const m = meteors.find(m => m.tx != null && distToSegment(e.clientX, e.clientY, m.x, m.y, m.tx, m.ty) < 34);
      if (!m) return;
      meteors.splice(meteors.indexOf(m), 1);
      burst(e.clientX, e.clientY);
      const n = (parseInt(store(() => localStorage.getItem('fxMeteors'), '0'), 10) || 0) + 1;
      store(() => localStorage.setItem('fxMeteors', String(n)));
      toast(`抓到第 ${n} 顆流星！${pick(WISHES)}`, { icon: '✦', duration: 3800 });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) start();
    });

    resize();
    start();

    return {
      shower(ms) {
        if (reduceMotion) return false;
        showerUntil = performance.now() + ms;
        nextMeteor = 0;
        start();
        return true;
      }
    };
  })();

  function meteorShower() {
    if (sky && sky.shower(7000)) {
      toast('流星雨來了！快點流星許願', { icon: '✦', duration: 4000 });
    } else {
      toast('流星雨下在你心裡了（這頁看不到星空）', { icon: '✦' });
    }
  }

  window.fx = { shower: meteorShower };

  /*   點擊漣漪  */
  function setupRipple() {
    if (reduceMotion) return;
    document.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const r = document.createElement('span');
      r.className = 'fx-ripple';
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      body.appendChild(r);
      const kill = () => r.remove();
      r.addEventListener('animationend', kill, { once: true });
      setTimeout(kill, 1000);
    }, { passive: true });
  }

  /*   卡片聚光燈  */
  function setupSpotlight() {
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  function setupToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', '回到頂端');
    btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M6 11l6-6 6 6"/></svg>';
    body.appendChild(btn);

    let launching = false, ticking = false, fallback;

    function update() {
      ticking = false;
      if (launching && window.scrollY <= 500) land();
      btn.classList.toggle('show', !launching && window.scrollY > 500);
    }

    function land() {
      launching = false;
      clearTimeout(fallback);
      btn.classList.remove('launch');
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    btn.addEventListener('click', () => {
      launching = true;
      btn.classList.add('launch');
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      fallback = setTimeout(() => { land(); update(); }, 1500);
    });
  }

  function setupPoke() {
    document.querySelectorAll('[data-poke]').forEach(el => {
      const bubble = document.createElement('span');
      bubble.className = 'poke-bubble';
      bubble.setAttribute('aria-live', 'polite');
      el.insertAdjacentElement('afterend', bubble);

      let count = 0, last = -1, timer;

      function poke() {
        count++;
        let line;
        if (count % 15 === 0) {
          line = '好啦你贏了 (╯°□°)╯︵ ┻━┻';
        } else {
          let i;
          do { i = Math.floor(Math.random() * POKE_LINES.length); } while (i === last);
          last = i;
          line = POKE_LINES[i];
        }
        bubble.textContent = line;
        bubble.classList.remove('show');
        el.classList.remove('poked');
        void el.offsetWidth;
        bubble.classList.add('show');
        el.classList.add('poked');
        clearTimeout(timer);
        timer = setTimeout(() => bubble.classList.remove('show'), 1800);
      }

      el.addEventListener('click', poke);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); poke(); }
      });
      el.addEventListener('animationend', () => el.classList.remove('poked'));
    });
  }

  /*  Konami code  */
  function setupKonami() {
    const SEQ = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
    let idx = 0;
    document.addEventListener('keydown', (e) => {
      const k = (e.key || '').toLowerCase();
      if (k === SEQ[idx]) {
        idx++;
        if (idx === SEQ.length) { idx = 0; meteorShower(); }
      } else {
        idx = k === SEQ[0] ? 1 : 0;
      }
    });
  }

  setupRipple();
  setupSpotlight();
  setupToTop();
  setupPoke();
  setupKonami();
})();
