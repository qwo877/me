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
    "                                                                                            你在期待甚麼"
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
    const API_Always_Pray_It_Works = "5L2g5YCR6YCZ576k5YK76YC85o6D5o+P5qmf5Zmo5Lq6";
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

(function () {
  const url = "https://qwo877.github.io/me/XD";
  let redirected = false;
  const state = { open: false, orientation: null };
  const threshold = 160;

  function isMobile() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  }

  const trigger = (s) => {
    if (s && !redirected && !isMobile()) {
      redirected = true;
      window.location.href = url;
    }
  };

  setInterval(() => {
    const widthOver  = window.outerWidth  - window.innerWidth  > threshold;
    const heightOver = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthOver ? 'vertical' : 'horizontal';

    if (
      !(heightOver && widthOver) &&
      ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) ||
        widthOver || heightOver)
    ) {
      if (!state.open || state.orientation !== orientation) trigger(true);
      state.open = true;
      state.orientation = orientation;
    } else {
      state.open = false;
      state.orientation = null;
    }
  }, 500);
})();
