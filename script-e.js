(function () {
  'use strict';

  // 參數
  const AUTO_PLAY = false;   // true  進頁自動播放；false 點擊任意處觸發
  const ZOOM_SCALE = 20;      // 放大倍率
  const RESPECT_REDUCED_MOTION = false; //優化啟用
  const IMG_W = 3072, IMG_H = 2048;          // 原生尺寸
  const OBJ_AX = 0.5, OBJ_AY = 0.0;          // 對應 object-position:50% 0%
  // 七星像素座標
  const STARS = [
    [1123, 345], [1262, 397], [1389, 448], [1489, 501],
    [1623, 469], [1618, 565], [1523, 585]
  ];
  const CX = STARS.reduce((s, p) => s + p[0], 0) / STARS.length; // 1432
  const CY = STARS.reduce((s, p) => s + p[1], 0) / STARS.length; // 473
  // ─────────────────────────────────────────

  const scene = document.getElementById('scene');
  const bg    = document.getElementById('bg');
  const next  = document.getElementById('next');
  const lines = document.getElementById('lines');
  if (!scene || !bg || !next) return;

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const reduceMotion = RESPECT_REDUCED_MOTION &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;

  /* 縮放中心 */
  function updateOrigin() {
    const boxW = bg.clientWidth, boxH = bg.clientHeight;
    const scale = Math.max(boxW / IMG_W, boxH / IMG_H);
    const renderedW = IMG_W * scale, renderedH = IMG_H * scale;
    const offsetX = (boxW - renderedW) * OBJ_AX;
    const offsetY = (boxH - renderedH) * OBJ_AY;
    const screenX = offsetX + CX * scale;
    const screenY = offsetY + CY * scale;
    bg.style.transformOrigin = `${screenX}px ${screenY}px`;
  }

  /* 星座連線*/
  function drawLines() {
    if (!lines || reduceMotion) return;
    lines.style.strokeDasharray = 100;
    lines.style.strokeDashoffset = 100;
    lines.animate(
      [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }],
      { duration: 1600, delay: 300, easing: 'ease-in-out', fill: 'forwards' }
    );
  }

  /* 跳轉到目的層。 */
  function arrive() {
    next.style.visibility = 'visible';
    next.setAttribute('aria-hidden', 'false');
  }

  async function play() {
    if (busy) return;
    busy = true;
    scene.classList.add('go');
    document.body.classList.add('zooming');

    // 優化啟用時改柔和淡入
    if (reduceMotion) {
      arrive();
      bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' });
      await next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: 'forwards' }).finished;
      next.style.opacity = '1';
      busy = false;
      return;
    }

    updateOrigin();

    // 爆閃
    document.querySelectorAll('.star').forEach((s, i) => {
      s.animate([{ opacity: 1 }],
        { duration: 450, delay: i * 45, fill: 'forwards' });
    });
    if (lines) lines.animate([{ opacity: .35 }, { opacity: .95 }], { duration: 500, fill: 'forwards' });
    await wait(380);

    //  加速曲線
    bg.animate([{ transform: 'scale(1)' }, { transform: `scale(${ZOOM_SCALE})` }],
      { duration: 1500, easing: 'cubic-bezier(.5,0,.85,.35)', fill: 'forwards' });
    bg.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.9)' }],
      { duration: 1500, easing: 'ease-in', fill: 'forwards' });
    await wait(1050);

    // 最亮處淡出 to 淡入目的層
    bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
    arrive();
    await next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 550, fill: 'forwards' }).finished;
    next.style.opacity = '1';

    busy = false;
  }

  // 啟動
  updateOrigin();
  drawLines();
  window.addEventListener('resize', updateOrigin);

  if (AUTO_PLAY) {
    window.addEventListener('load', () => setTimeout(play, 1800));
  } else {
    scene.addEventListener('click', play);
    scene.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  }
})();
