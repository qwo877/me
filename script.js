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
    "                                                                                            看阿有人在這盯了五秒鐘"
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

/* 彩蛋：開了開發者工具就跳去 XD 頁。
   舊版拿 outerWidth/innerWidth 的差值猜，會被瀏覽器縮放、系統顯示縮放、
   側邊欄、書籤列、視窗變小全部誤判，所以改用兩個跟視窗尺寸無關的訊號：
     1. DevTools 的快捷鍵（所有瀏覽器通用）
     2. console 誘餌 —— DevTools 真的把物件畫出來時才會去讀它的 id
   開發時要關掉：網址加 ?noegg，或在主控台 localStorage.setItem('noEgg', '1') */
(function () {
  const url = "https://qwo877.github.io/me/XD";

  function store(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  // Puppeteer / Playwright / Selenium 都會把這個設成 true，
  // 讓 AI 爬蟲讀文章頁時不會被彩蛋導頁打斷
  if (navigator.webdriver) return;
  if (/[?&]noegg\b/i.test(location.search)) return;
  if (store(() => localStorage.getItem('noEgg'), null) === '1') return;
  // 同一個分頁只玩一次，不然開著 DevTools 就永遠回不來
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
