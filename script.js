document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('typewriter');
  if (!container) return;

  const texts = [
    "一天天的你們都在電我qwp",
    "注意!!!!!!!!!!!!!        感謝你的注意。",
    "你有什麼不開心的事? 講出來讓大家開心一下嘛",
    "早安.... 午安.... 晚安",
    "..................沒事",
    "每次去回收場都差點一起被丟進回收場",
    "?你好  歡迎來到這裡",
    "每次看完這行字 就表示你的人生又被浪費10秒鐘",
    "你知道嗎?.....我不知道",
    "你以為這裡會有什麼有趣的東西嗎?.....沒有",
    "                                                                                            你在期待什麼"
  ];

  const TYPE_SPEED = 80;
  const BACKSPACE_SPEED = 50;
  const PAUSE_TIME = 1000;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let scheduled = false;

  container.textContent = '';

  function tick() {
    scheduled = false;
    if (document.hidden) {
      schedule(1000);
      return;
    }

    const currentText = texts[textIndex];
    charIndex += isDeleting ? -1 : 1;
    container.textContent = currentText.substring(0, charIndex);

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      schedule(PAUSE_TIME);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      schedule(TYPE_SPEED);
      return;
    }

    let delay = TYPE_SPEED;
    if (isDeleting) {
      const ch = currentText.charAt(charIndex);
      delay = ch === ' ' ? 0 : BACKSPACE_SPEED;
    }
    schedule(delay);
  }

  function schedule(delay) {
    if (scheduled) return;
    scheduled = true;
    setTimeout(tick, delay);
  }

  schedule(0);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) schedule(0);
  });
});

/* 首頁：依現在時間換問候語、小標圖示和碎念 */
document.addEventListener('DOMContentLoaded', () => {
  const greetEl = document.getElementById('greeting');
  const iconEl  = document.getElementById('eyebrow-icon');
  const textEl  = document.getElementById('eyebrow-text');
  if (!greetEl || !iconEl || !textEl) return;

  const ICONS = {
    sun:  '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    cup:  '<path d="M4 8.5h12.5v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M16.5 10h1.3a2.5 2.5 0 0 1 0 5h-1.3M8 2.5v3M12 2.5v3"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    star: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 16.5v4M17 18.5h4"/>'
  };

  const SLOTS = [
    { from: 5,  to: 11, greet: '早安',    icon: 'sun',  note: '根本還沒睡醒' },
    { from: 11, to: 14, greet: '午安',    icon: 'sun',  note: '午餐吃什麼是世紀難題' },
    { from: 14, to: 18, greet: '午安',    icon: 'cup',  note: '下午茶時間（但我沒有茶）' },
    { from: 18, to: 24, greet: '晚安',    icon: 'moon', note: '適合寫 code 的夜晚' },
    { from: 0,  to: 5,  greet: '還不睡？', icon: 'star', note: '夜貓子專屬時段' }
  ];

  let lastIcon = '';

  function update() {
    const now = new Date();
    const h = now.getHours();
    const slot = SLOTS.find(s => h >= s.from && h < s.to) || SLOTS[0];
    greetEl.textContent = slot.greet;
    if (slot.icon !== lastIcon) {
      iconEl.innerHTML = `<svg class="icon" viewBox="0 0 24 24">${ICONS[slot.icon]}</svg>`;
      lastIcon = slot.icon;
    }
    const hh = String(h).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    textEl.textContent = `現在 ${hh}:${mm} · ${slot.note}`;
  }

  update();
  setInterval(update, 10000);
});

document.addEventListener('DOMContentLoaded', async () => {
  const card = document.getElementById('latest-post');
  if (!card) return;
  try {
    const res = await fetch('manifest.json');
    if (!res.ok) throw new Error(res.status);
    const { articles } = await res.json();
    const latest = (articles || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    if (!latest) throw new Error('empty');

    card.href = `article.html?id=${encodeURIComponent(latest.id)}`;
    card.querySelector('#latest-title').textContent = latest.title;
    const time = card.querySelector('#latest-date');
    time.dateTime = latest.date;
    time.textContent = latest.date.replace(/-/g, '.');
    card.setAttribute('aria-label', `最新文章：${latest.title}`);
    card.classList.remove('is-loading');
  } catch (e) {
    card.remove();
  }
});

(function () {
  const url = "https://qwo877.github.io/me/XD";

  function store(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  if (navigator.webdriver) return;
  if (/[?&]noegg\b/i.test(location.search)) return;
  if (store(() => localStorage.getItem('noEgg'), null) === '1') return;
  if (store(() => sessionStorage.getItem('eggDone'), null) === '1') return;

  let fired = false;

  function fire() {
    if (fired) return;
    fired = true;
    store(() => sessionStorage.setItem('eggDone', '1'));
    setTimeout(() => { window.location.href = url; }, 0);
  }

  document.addEventListener('keydown', (e) => {
    const code = e.code;
    if (code === 'F12') { fire(); return; }
    const combo = code === 'KeyI' || code === 'KeyJ' || code === 'KeyC';
    if (!combo) return;
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) fire();   // Windows / Linux
    if (e.metaKey && e.altKey) fire();                    // macOS
  });

  const bait = document.createElement('div');
  Object.defineProperty(bait, 'id', { get() { fire(); return ''; } });

  let lastDrop = 0;
  function drop() {
    if (fired) return;
    const now = Date.now();
    if (now - lastDrop < 3000) return;
    lastDrop = now;
    console.log(bait);
  }

  drop();
  window.addEventListener('focus', drop);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) drop();
  });
})();
